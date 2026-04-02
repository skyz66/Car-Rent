<?php

namespace App\Controllers;

use App\Database;
use App\Response;
use DateTimeImmutable;
use PDO;

final class AdminController
{
    public static function topRented(): void
    {
        $pdo = Database::getInstance()->connect();
        $stmt = $pdo->query(
            "SELECT c.id, c.brand, c.model, COUNT(*) AS rentals_count
             FROM rentals r
             JOIN cars c ON c.id = r.car_id
             WHERE r.status = 'completed'
             GROUP BY c.id, c.brand, c.model
             ORDER BY rentals_count DESC
             LIMIT 10"
        );
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        Response::json(true, $rows);
    }

    public static function summary(): void
    {
        $pdo = Database::getInstance()->connect();
        $total = (int) $pdo->query("SELECT COUNT(*) AS total FROM rentals WHERE status = 'completed'")->fetch(PDO::FETCH_ASSOC)['total'];
        $ongoing = (int) $pdo->query("SELECT COUNT(*) AS total FROM rentals WHERE status = 'ongoing'")->fetch(PDO::FETCH_ASSOC)['total'];
        $revenue = (float) $pdo->query("SELECT COALESCE(SUM(total_price), 0) AS revenue FROM rentals WHERE status IN ('confirmed','ongoing','completed')")->fetch(PDO::FETCH_ASSOC)['revenue'];

        Response::json(true, [
            'total_rentals' => $total,
            'ongoing_rentals' => $ongoing,
            'revenue' => $revenue,
        ]);
    }

    public static function rentalsByDay(): void
    {
        $pdo = Database::getInstance()->connect();
        $stmt = $pdo->prepare(
            "SELECT DATE(start_date) AS day, COUNT(*) AS count
             FROM rentals
             WHERE start_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
             GROUP BY DATE(start_date)
             ORDER BY day"
        );
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $countsByDay = [];
        foreach ($rows as $row) {
            $countsByDay[$row['day']] = (int) $row['count'];
        }

        $today = new DateTimeImmutable('today');
        $series = [];
        for ($i = 6; $i >= 0; $i--) {
            $day = $today->modify("-{$i} days")->format('Y-m-d');
            $series[] = [
                'day' => $day,
                'count' => $countsByDay[$day] ?? 0,
            ];
        }

        Response::json(true, $series);
    }

    public static function users(): void
    {
        $pdo = Database::getInstance()->connect();
        $stmt = $pdo->query('SELECT id, role, first_name, last_name, email, phone FROM users ORDER BY id DESC');
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        Response::json(true, $rows);
    }

    public static function createUser(): void
    {
        $data = \App\Utils\Request::json();
        $missing = \App\Utils\Validator::required($data, ['first_name', 'last_name', 'email', 'password', 'role']);
        if ($missing) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Missing required fields', 422, ['fields' => $missing]);
        }

        $phone = null;
        if (isset($data['phone']) && trim((string) $data['phone']) !== '') {
            $phone = (string) preg_replace('/\s+/', '', trim((string) $data['phone']));
        }

        if (!\App\Utils\Validator::isEmail((string) $data['email'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid email format', 422);
        }
        if ($phone !== null && !\App\Utils\Validator::isPhone($phone)) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid phone format', 422);
        }
        if (!\App\Utils\Validator::isPassword((string) $data['password'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Password must be at least 6 characters and contain at least one letter and one number', 422);
        }

        $pdo = Database::getInstance()->connect();
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) {
            Response::json(false, null, 'EMAIL_EXISTS', 'Email already registered', 409);
        }

        if ($phone !== null) {
            $stmt = $pdo->prepare('SELECT id FROM users WHERE REPLACE(phone, \' \', \'\') = ?');
            $stmt->execute([$phone]);
            if ($stmt->fetch()) {
                Response::json(false, null, 'PHONE_EXISTS', 'Phone already registered', 409);
            }
        }

        $passwordHash = password_hash((string) $data['password'], PASSWORD_BCRYPT);
        $stmt = $pdo->prepare(
            'INSERT INTO users (role, first_name, last_name, email, phone, password_hash)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['role'],
            $data['first_name'],
            $data['last_name'],
            $data['email'],
            $phone,
            $passwordHash,
        ]);

        Response::json(true, ['id' => (int) $pdo->lastInsertId()]);
    }

    public static function updateUser(string $id): void
    {
        $data = \App\Utils\Request::json();
        $missing = \App\Utils\Validator::required($data, ['first_name', 'last_name', 'email', 'role']);
        if ($missing) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Missing required fields', 422, ['fields' => $missing]);
        }

        $phone = null;
        if (isset($data['phone']) && trim((string) $data['phone']) !== '') {
            $phone = (string) preg_replace('/\s+/', '', trim((string) $data['phone']));
        }

        if (!\App\Utils\Validator::isEmail((string) $data['email'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid email format', 422);
        }
        if ($phone !== null && !\App\Utils\Validator::isPhone($phone)) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid phone format', 422);
        }

        $pdo = Database::getInstance()->connect();
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id <> ?');
        $stmt->execute([$data['email'], $id]);
        if ($stmt->fetch()) {
            Response::json(false, null, 'EMAIL_EXISTS', 'Email already registered', 409);
        }

        if ($phone !== null) {
            $stmt = $pdo->prepare('SELECT id FROM users WHERE REPLACE(phone, \' \', \'\') = ? AND id <> ?');
            $stmt->execute([$phone, $id]);
            if ($stmt->fetch()) {
                Response::json(false, null, 'PHONE_EXISTS', 'Phone already registered', 409);
            }
        }

        $stmt = $pdo->prepare('UPDATE users SET role=?, first_name=?, last_name=?, email=?, phone=? WHERE id=?');
        $stmt->execute([
            $data['role'],
            $data['first_name'],
            $data['last_name'],
            $data['email'],
            $phone,
            $id,
        ]);

        if (!empty($data['password'])) {
            if (!\App\Utils\Validator::isPassword((string) $data['password'])) {
                Response::json(false, null, 'VALIDATION_ERROR', 'Password must be at least 6 characters and contain at least one letter and one number', 422);
            }
            $hash = password_hash((string) $data['password'], PASSWORD_BCRYPT);
            $stmt = $pdo->prepare('UPDATE users SET password_hash=? WHERE id=?');
            $stmt->execute([$hash, $id]);
        }

        Response::json(true, ['updated' => true]);
    }

    public static function deleteUser(string $id): void
    {
        $pdo = Database::getInstance()->connect();
        $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
        $stmt->execute([$id]);
        Response::json(true, ['deleted' => true]);
    }
}
