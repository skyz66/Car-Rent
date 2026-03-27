<?php

namespace App\Controllers;

use App\Database;
use App\Response;
use App\Utils\Request;
use App\Utils\Validator;
use PDO;

final class CarsController
{
    public static function index(): void
    {
        $pdo = Database::getInstance()->connect();
        $filters = [
            'search' => Request::query('search'),
            'brand' => Request::query('brand'),
            'model' => Request::query('model'),
            'minPrice' => Request::query('minPrice'),
            'maxPrice' => Request::query('maxPrice'),
            'gearbox' => Request::query('gearbox'),
            'fuel' => Request::query('fuel'),
            'seats' => Request::query('seats'),
            'status' => Request::query('status'),
            'availableFrom' => Request::query('availableFrom'),
            'availableTo' => Request::query('availableTo'),
        ];

        $sql = "SELECT c.*, ci.image_url AS main_image
                FROM cars c
                LEFT JOIN car_images ci ON ci.car_id = c.id AND ci.is_main = 1
                WHERE 1=1";
        $params = [];

        if ($filters['search']) {
            $sql .= " AND (c.brand LIKE ? OR c.model LIKE ? OR c.plate_number LIKE ? OR c.category LIKE ?)";
            $like = '%' . $filters['search'] . '%';
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
        }
        if ($filters['brand']) {
            $sql .= " AND c.brand = ?";
            $params[] = $filters['brand'];
        }
        if ($filters['model']) {
            $sql .= " AND c.model = ?";
            $params[] = $filters['model'];
        }
        if ($filters['minPrice']) {
            $sql .= " AND c.daily_price >= ?";
            $params[] = (float) $filters['minPrice'];
        }
        if ($filters['maxPrice']) {
            $sql .= " AND c.daily_price <= ?";
            $params[] = (float) $filters['maxPrice'];
        }
        if ($filters['gearbox']) {
            $sql .= " AND c.gearbox = ?";
            $params[] = $filters['gearbox'];
        }
        if ($filters['fuel']) {
            $sql .= " AND c.fuel = ?";
            $params[] = $filters['fuel'];
        }
        if ($filters['seats']) {
            $sql .= " AND c.seats = ?";
            $params[] = (int) $filters['seats'];
        }
        if ($filters['status']) {
            $sql .= " AND c.status = ?";
            $params[] = $filters['status'];
        }
        if ($filters['availableFrom'] && $filters['availableTo']) {
            $sql .= " AND c.id NOT IN (
                SELECT r.car_id FROM rentals r
                WHERE r.status IN ('pending','confirmed','ongoing')
                AND r.start_date < ? AND r.end_date > ?
            )";
            $params[] = $filters['availableTo'];
            $params[] = $filters['availableFrom'];
        }

        $sql .= " ORDER BY c.created_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);
        Response::json(true, $cars);
    }

    public static function show(string $id): void
    {
        $pdo = Database::getInstance()->connect();
        $stmt = $pdo->prepare(
            "SELECT c.*, ci.image_url AS main_image
             FROM cars c
             LEFT JOIN car_images ci ON ci.car_id = c.id AND ci.is_main = 1
             WHERE c.id = ?"
        );
        $stmt->execute([$id]);
        $car = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$car) {
            Response::json(false, null, 'NOT_FOUND', 'Car not found', 404);
        }
        Response::json(true, $car);
    }

    public static function create(): void
    {
        $data = Request::json();
        $missing = Validator::required($data, ['plate_number', 'brand', 'model', 'year', 'gearbox', 'fuel', 'seats', 'daily_price', 'status']);
        if ($missing) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Missing required fields', 422, ['fields' => $missing]);
        }
        if (!Validator::isPlateNumber((string) $data['plate_number'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid plate number format', 422);
        }
        if (!Validator::isYear((string) $data['year'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid year format', 422);
        }
        if (!Validator::isPositiveInteger((string) $data['seats'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Seats must be a positive integer', 422);
        }
        if (!Validator::isDecimal((string) $data['daily_price'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Daily price must be a valid number with up to 2 decimals', 422);
        }
        if (!Validator::inList((string) $data['gearbox'], ['manual', 'automatic'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid gearbox value', 422);
        }
        if (!Validator::inList((string) $data['fuel'], ['petrol', 'diesel', 'hybrid', 'electric'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid fuel value', 422);
        }
        if (!Validator::inList((string) $data['status'], ['available', 'maintenance', 'unavailable'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid status value', 422);
        }

        $pdo = Database::getInstance()->connect();
        $stmt = $pdo->prepare('INSERT INTO cars (plate_number, brand, model, year, category, gearbox, fuel, seats, daily_price, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['plate_number'],
            $data['brand'],
            $data['model'],
            (int) $data['year'],
            $data['category'] ?? null,
            $data['gearbox'],
            $data['fuel'],
            (int) $data['seats'],
            (float) $data['daily_price'],
            $data['status'],
        ]);

        Response::json(true, ['id' => (int) $pdo->lastInsertId()]);
    }

    public static function update(string $id): void
    {
        $data = Request::json();
        $missing = Validator::required($data, ['plate_number', 'brand', 'model', 'year', 'gearbox', 'fuel', 'seats', 'daily_price', 'status']);
        if ($missing) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Missing required fields', 422, ['fields' => $missing]);
        }
        if (!Validator::isPlateNumber((string) $data['plate_number'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid plate number format', 422);
        }
        if (!Validator::isYear((string) $data['year'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid year format', 422);
        }
        if (!Validator::isPositiveInteger((string) $data['seats'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Seats must be a positive integer', 422);
        }
        if (!Validator::isDecimal((string) $data['daily_price'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Daily price must be a valid number with up to 2 decimals', 422);
        }
        if (!Validator::inList((string) $data['gearbox'], ['manual', 'automatic'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid gearbox value', 422);
        }
        if (!Validator::inList((string) $data['fuel'], ['petrol', 'diesel', 'hybrid', 'electric'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid fuel value', 422);
        }
        if (!Validator::inList((string) $data['status'], ['available', 'maintenance', 'unavailable'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid status value', 422);
        }
        $pdo = Database::getInstance()->connect();
        $stmt = $pdo->prepare('UPDATE cars SET plate_number=?, brand=?, model=?, year=?, category=?, gearbox=?, fuel=?, seats=?, daily_price=?, status=? WHERE id=?');
        $stmt->execute([
            $data['plate_number'],
            $data['brand'],
            $data['model'],
            (int) $data['year'],
            $data['category'] ?? null,
            $data['gearbox'],
            $data['fuel'],
            (int) $data['seats'],
            (float) $data['daily_price'],
            $data['status'],
            $id,
        ]);

        Response::json(true, ['updated' => true]);
    }

    public static function delete(string $id): void
    {
        $pdo = Database::getInstance()->connect();
        $stmt = $pdo->prepare('DELETE FROM cars WHERE id = ?');
        $stmt->execute([$id]);
        Response::json(true, ['deleted' => true]);
    }

    public static function availability(string $id): void
    {
        $start = Request::query('start');
        $end = Request::query('end');
        if (!$start || !$end) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Start and end are required', 422);
        }

        $pdo = Database::getInstance()->connect();
        $stmt = $pdo->prepare(
            "SELECT COUNT(*) as count
             FROM rentals
             WHERE car_id = ?
             AND status IN ('pending','confirmed','ongoing')
             AND start_date < ? AND end_date > ?"
        );
        $stmt->execute([$id, $end, $start]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $available = ((int) $row['count']) === 0;

        Response::json(true, ['available' => $available]);
    }
}
