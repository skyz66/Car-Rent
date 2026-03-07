<?php

namespace App\Controllers;

use App\AuthContext;
use App\Database;
use App\Response;
use App\Utils\Request;
use App\Utils\Validator;
use PDO;

final class RentalsController
{
    public static function create(): void
    {
        $data = Request::json();
        $missing = Validator::required($data, ['car_id', 'start_date', 'end_date']);
        if ($missing) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Missing required fields', 422, ['fields' => $missing]);
        }

        $start = $data['start_date'];
        $end = $data['end_date'];
        if (strtotime($start) >= strtotime($end)) {
            Response::json(false, null, 'VALIDATION_ERROR', 'End date must be after start date', 422);
        }

        $user = AuthContext::user();
        if (!$user) {
            Response::json(false, null, 'UNAUTHORIZED', 'Authentication required', 401);
        }

        $pdo = Database::connect();

        $stmt = $pdo->prepare('SELECT licence_issue_date FROM users WHERE id = ?');
        $stmt->execute([$user['id']]);
        $licence = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$licence || !$licence['licence_issue_date']) {
            Response::json(false, null, 'LICENCE_REQUIRED', 'Licence issue date is required to book', 422);
        }

        $stmt = $pdo->prepare("SELECT CASE WHEN licence_issue_date <= (CURDATE() - INTERVAL 2 YEAR) THEN 1 ELSE 0 END AS ok FROM users WHERE id = ?");
        $stmt->execute([$user['id']]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row || (int) $row['ok'] !== 1) {
            Response::json(false, null, 'LICENCE_TOO_RECENT', 'Driving licence must be at least 2 years old', 422);
        }

        $stmt = $pdo->prepare(
            "SELECT COUNT(*) as count FROM rentals
             WHERE car_id = ?
             AND status IN ('pending','confirmed','ongoing')
             AND start_date < ? AND end_date > ?"
        );
        $stmt->execute([$data['car_id'], $end, $start]);
        $conflict = $stmt->fetch(PDO::FETCH_ASSOC);
        if ((int) $conflict['count'] > 0) {
            Response::json(false, null, 'CAR_UNAVAILABLE', 'Car is not available for the selected dates', 409);
        }

        $stmt = $pdo->prepare('SELECT daily_price FROM cars WHERE id = ?');
        $stmt->execute([$data['car_id']]);
        $car = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$car) {
            Response::json(false, null, 'NOT_FOUND', 'Car not found', 404);
        }

        $seconds = strtotime($end) - strtotime($start);
        $days = (int) ceil($seconds / 86400);
        if ($days <= 0) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid rental duration', 422);
        }

        $daily = (float) $car['daily_price'];
        $total = $daily * $days;

        $stmt = $pdo->prepare(
            'INSERT INTO rentals (user_id, car_id, start_date, end_date, status, daily_price, total_price)
             VALUES (?, ?, ?, ?, \'pending\', ?, ?)'
        );
        $stmt->execute([
            $user['id'],
            $data['car_id'],
            $start,
            $end,
            $daily,
            $total,
        ]);

        Response::json(true, [
            'id' => (int) $pdo->lastInsertId(),
            'status' => 'pending',
            'daily_price' => $daily,
            'total_price' => $total,
        ]);
    }

    public static function my(): void
    {
        $user = AuthContext::user();
        if (!$user) {
            Response::json(false, null, 'UNAUTHORIZED', 'Authentication required', 401);
        }

        $pdo = Database::connect();
        $stmt = $pdo->prepare(
            "SELECT r.*, c.brand, c.model
             FROM rentals r
             JOIN cars c ON c.id = r.car_id
             WHERE r.user_id = ?
             ORDER BY r.created_at DESC"
        );
        $stmt->execute([$user['id']]);
        $rentals = $stmt->fetchAll(PDO::FETCH_ASSOC);
        Response::json(true, $rentals);
    }

    public static function all(): void
    {
        $pdo = Database::connect();
        $stmt = $pdo->query(
            "SELECT r.*, c.brand, c.model, u.first_name, u.last_name, u.email
             FROM rentals r
             JOIN cars c ON c.id = r.car_id
             JOIN users u ON u.id = r.user_id
             ORDER BY r.created_at DESC"
        );
        $rentals = $stmt->fetchAll(PDO::FETCH_ASSOC);
        Response::json(true, $rentals);
    }

    public static function updateStatus(string $id): void
    {
        $data = Request::json();
        $status = $data['status'] ?? null;
        $allowed = ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'];
        if (!$status || !in_array($status, $allowed, true)) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid status', 422);
        }

        $pdo = Database::connect();
        $stmt = $pdo->prepare('UPDATE rentals SET status = ? WHERE id = ?');
        $stmt->execute([$status, $id]);
        Response::json(true, ['updated' => true]);
    }

    public static function cancel(string $id): void
    {
        $user = AuthContext::user();
        if (!$user) {
            Response::json(false, null, 'UNAUTHORIZED', 'Authentication required', 401);
        }

        $pdo = Database::connect();
        $stmt = $pdo->prepare('SELECT id, status FROM rentals WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $user['id']]);
        $rental = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$rental) {
            Response::json(false, null, 'NOT_FOUND', 'Rental not found', 404);
        }

        if (!in_array($rental['status'], ['pending', 'confirmed'], true)) {
            Response::json(false, null, 'INVALID_STATE', 'Only pending or confirmed rentals can be cancelled', 409);
        }

        $stmt = $pdo->prepare('UPDATE rentals SET status = \'cancelled\' WHERE id = ?');
        $stmt->execute([$id]);
        Response::json(true, ['cancelled' => true]);
    }
}
