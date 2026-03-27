<?php

namespace App;

use PDO;
use PDOException;

final class Database
{
    private static ?Database $instance = null;
    private ?PDO $pdo = null;

    private function __construct()
    {
    }

    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function connect(): PDO
    {
        if ($this->pdo) {
            return $this->pdo;
        }

        $config = Config::getInstance();
        $host = $config->get('DB_HOST', '127.0.0.1');
        $port = $config->get('DB_PORT', '3306');
        $db = $config->get('DB_DATABASE', 'car_rental_agency');
        $user = $config->get('DB_USERNAME', 'root');
        $pass = $config->get('DB_PASSWORD', '');

        $dsn = "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4";

        try {
            $this->pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } catch (PDOException $ex) {
            Response::json(false, null, 'DB_CONNECTION_FAILED', 'Database connection failed', 500, [
                'message' => $ex->getMessage(),
            ]);
        }

        return $this->pdo;
    }
}
