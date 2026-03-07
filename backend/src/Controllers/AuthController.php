<?php

namespace App\Controllers;

use App\Auth;
use App\Database;
use App\Response;
use App\Utils\Request;
use App\Utils\Validator;
use PDO;

final class AuthController
{
    public static function register(): void
    {
        $data = Request::json();
        $missing = Validator::required($data, ['first_name', 'last_name', 'email', 'password']);
        if ($missing) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Missing required fields', 422, ['fields' => $missing]);
        }

        if (!Validator::isEmail((string) $data['email'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid email format', 422);
        }

        $pdo = Database::connect();
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) {
            Response::json(false, null, 'EMAIL_EXISTS', 'Email already registered', 409);
        }

        $passwordHash = password_hash((string) $data['password'], PASSWORD_BCRYPT);
        $stmt = $pdo->prepare(
            'INSERT INTO users (role, first_name, last_name, email, phone, password_hash, licence_number, licence_issue_date, licence_expiry_date)
             VALUES (\'customer\', ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['first_name'],
            $data['last_name'],
            $data['email'],
            $data['phone'] ?? null,
            $passwordHash,
            $data['licence_number'] ?? null,
            $data['licence_issue_date'] ?? null,
            $data['licence_expiry_date'] ?? null,
        ]);

        $userId = (int) $pdo->lastInsertId();
        $user = [
            'id' => $userId,
            'role' => 'customer',
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
        ];

        $token = Auth::generateToken($user);

        Response::json(true, [
            'user' => $user,
            'token' => $token,
        ]);
    }

    public static function login(): void
    {
        $data = Request::json();
        $missing = Validator::required($data, ['email', 'password']);
        if ($missing) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Missing required fields', 422, ['fields' => $missing]);
        }

        $pdo = Database::connect();
        $stmt = $pdo->prepare('SELECT id, role, first_name, last_name, email, password_hash FROM users WHERE email = ?');
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$user || !password_verify((string) $data['password'], $user['password_hash'])) {
            Response::json(false, null, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
        }

        $payloadUser = [
            'id' => (int) $user['id'],
            'role' => $user['role'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'email' => $user['email'],
        ];
        $token = Auth::generateToken($payloadUser);

        Response::json(true, [
            'user' => $payloadUser,
            'token' => $token,
        ]);
    }
}
