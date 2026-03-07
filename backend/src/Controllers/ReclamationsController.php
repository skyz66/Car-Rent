<?php

namespace App\Controllers;

use App\AuthContext;
use App\Database;
use App\Response;
use App\Utils\Request;
use App\Utils\Validator;
use PDO;

final class ReclamationsController
{
    public static function create(): void
    {
        $data = Request::json();
        $missing = Validator::required($data, ['subject', 'description']);
        if ($missing) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Missing required fields', 422, ['fields' => $missing]);
        }

        $user = AuthContext::user();
        if (!$user) {
            Response::json(false, null, 'UNAUTHORIZED', 'Authentication required', 401);
        }

        $pdo = Database::connect();

        if (!empty($data['rental_id'])) {
            $stmt = $pdo->prepare('SELECT id FROM rentals WHERE id = ? AND user_id = ?');
            $stmt->execute([$data['rental_id'], $user['id']]);
            if (!$stmt->fetch()) {
                Response::json(false, null, 'INVALID_RENTAL', 'Rental not found for this user', 404);
            }
        }

        if (!empty($data['car_id'])) {
            $stmt = $pdo->prepare('SELECT id FROM cars WHERE id = ?');
            $stmt->execute([$data['car_id']]);
            if (!$stmt->fetch()) {
                Response::json(false, null, 'INVALID_CAR', 'Car not found', 404);
            }
        }

        $stmt = $pdo->prepare(
            'INSERT INTO reclamations (user_id, rental_id, car_id, subject, description, status)
             VALUES (?, ?, ?, ?, ?, \'open\')'
        );
        $stmt->execute([
            $user['id'],
            $data['rental_id'] ?? null,
            $data['car_id'] ?? null,
            $data['subject'],
            $data['description'],
        ]);

        Response::json(true, ['id' => (int) $pdo->lastInsertId()]);
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
             FROM reclamations r
             LEFT JOIN cars c ON c.id = r.car_id
             WHERE r.user_id = ?
             ORDER BY r.created_at DESC"
        );
        $stmt->execute([$user['id']]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        Response::json(true, $rows);
    }

    public static function all(): void
    {
        $pdo = Database::connect();
        $stmt = $pdo->query(
            "SELECT r.*, u.first_name, u.last_name, u.email, c.brand, c.model
             FROM reclamations r
             JOIN users u ON u.id = r.user_id
             LEFT JOIN cars c ON c.id = r.car_id
             ORDER BY r.created_at DESC"
        );
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        Response::json(true, $rows);
    }

    public static function updateStatus(string $id): void
    {
        $data = Request::json();
        $status = $data['status'] ?? null;
        $allowed = ['open', 'in_progress', 'resolved', 'rejected'];
        if (!$status || !in_array($status, $allowed, true)) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid status', 422);
        }

        $resolvedAt = in_array($status, ['resolved', 'rejected'], true) ? date('Y-m-d H:i:s') : null;

        $pdo = Database::connect();
        $stmt = $pdo->prepare('UPDATE reclamations SET status = ?, resolved_at = ? WHERE id = ?');
        $stmt->execute([$status, $resolvedAt, $id]);
        Response::json(true, ['updated' => true]);
    }
}
