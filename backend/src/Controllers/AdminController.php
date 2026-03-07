<?php

namespace App\Controllers;

use App\Database;
use App\Response;
use PDO;

final class AdminController
{
    public static function topRented(): void
    {
        $pdo = Database::connect();
        $stmt = $pdo->query(
            "SELECT c.id, c.brand, c.model, COUNT(*) AS rentals_count
             FROM rentals r
             JOIN cars c ON c.id = r.car_id
             WHERE r.status <> 'cancelled'
             GROUP BY c.id, c.brand, c.model
             ORDER BY rentals_count DESC
             LIMIT 10"
        );
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        Response::json(true, $rows);
    }

    public static function summary(): void
    {
        $pdo = Database::connect();
        $total = (int) $pdo->query('SELECT COUNT(*) AS total FROM rentals')->fetch(PDO::FETCH_ASSOC)['total'];
        $ongoing = (int) $pdo->query("SELECT COUNT(*) AS total FROM rentals WHERE status = 'ongoing'")->fetch(PDO::FETCH_ASSOC)['total'];
        $revenue = (float) $pdo->query("SELECT COALESCE(SUM(total_price), 0) AS revenue FROM rentals WHERE status IN ('confirmed','ongoing','completed')")->fetch(PDO::FETCH_ASSOC)['revenue'];

        Response::json(true, [
            'total_rentals' => $total,
            'ongoing_rentals' => $ongoing,
            'revenue' => $revenue,
        ]);
    }
}
