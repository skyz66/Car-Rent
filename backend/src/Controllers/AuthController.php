<?php

namespace App\Controllers;

use App\Auth;
use App\Config;
use App\AuthContext;
use App\Database;
use App\Response;
use App\Utils\Request;
use App\Utils\Validator;
use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
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
        if (!Validator::isPassword((string) $data['password'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Password must be at least 6 characters and contain at least one letter and one number', 422);
        }
        if (!empty($data['phone']) && !Validator::isPhone((string) $data['phone'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid phone format', 422);
        }

        $pdo = Database::getInstance()->connect();
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) {
            Response::json(false, null, 'EMAIL_EXISTS', 'Email already registered', 409);
        }

        $passwordHash = password_hash((string) $data['password'], PASSWORD_BCRYPT);
        $stmt = $pdo->prepare(
            'INSERT INTO users (role, first_name, last_name, email, phone, password_hash)
             VALUES (\'customer\', ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['first_name'],
            $data['last_name'],
            $data['email'],
            $data['phone'] ?? null,
            $passwordHash,
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
        if (!Validator::isEmail((string) $data['email'])) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Invalid email format', 422);
        }

        $pdo = Database::getInstance()->connect();
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

    public static function changePassword(): void
    {
        $data = Request::json();
        $missing = Validator::required($data, ['new_password']);
        if ($missing) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Missing required fields', 422, ['fields' => $missing]);
        }

        $user = AuthContext::user();
        if (!$user) {
            Response::json(false, null, 'UNAUTHORIZED', 'Unauthorized', 401);
        }

        $pdo = Database::getInstance()->connect();
        $stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ?');
        $stmt->execute([$user['id']]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $currentHash = $row['password_hash'] ?? '';
        $currentProvided = isset($data['current_password']) && $data['current_password'] !== '';
        if ($currentHash && !$currentProvided) {
            Response::json(false, null, 'INVALID_CREDENTIALS', 'Current password is required', 401);
        }
        if ($currentHash && $currentProvided && !password_verify((string) $data['current_password'], $currentHash)) {
            Response::json(false, null, 'INVALID_CREDENTIALS', 'Current password is incorrect', 401);
        }

        $newPassword = (string) $data['new_password'];
        if (!Validator::isPassword($newPassword)) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Password must be at least 6 characters and contain at least one letter and one number', 422);
        }

        $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
        $update = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
        $update->execute([$newHash, $user['id']]);

        Response::json(true, ['updated' => true]);
    }

    public static function googleLogin(): void
    {
        $data = Request::json();
        $missing = Validator::required($data, ['id_token']);
        if ($missing) {
            Response::json(false, null, 'VALIDATION_ERROR', 'Missing required fields', 422, ['fields' => $missing]);
        }

        $clientId = Config::getInstance()->get('GOOGLE_CLIENT_ID');
        if (!$clientId) {
            Response::json(false, null, 'CONFIG_ERROR', 'Google client ID not configured', 500);
        }

        $jwksJson = @file_get_contents('https://www.googleapis.com/oauth2/v3/certs');
        if (!$jwksJson) {
            Response::json(false, null, 'GOOGLE_KEYS', 'Failed to fetch Google public keys', 500);
        }
        $jwks = json_decode($jwksJson, true);
        if (!is_array($jwks)) {
            Response::json(false, null, 'GOOGLE_KEYS', 'Invalid Google public keys', 500);
        }

        try {
            $keys = JWK::parseKeySet($jwks);
            $payload = JWT::decode((string) $data['id_token'], $keys);
        } catch (\Throwable $ex) {
            Response::json(false, null, 'INVALID_TOKEN', 'Invalid Google ID token', 401);
        }

        $iss = $payload->iss ?? '';
        if (!in_array($iss, ['accounts.google.com', 'https://accounts.google.com'], true)) {
            Response::json(false, null, 'INVALID_TOKEN', 'Invalid token issuer', 401);
        }
        if (($payload->aud ?? '') !== $clientId) {
            Response::json(false, null, 'INVALID_TOKEN', 'Invalid token audience', 401);
        }
        if (!($payload->email ?? '') || !($payload->email_verified ?? false)) {
            Response::json(false, null, 'INVALID_TOKEN', 'Email not verified', 401);
        }

        $email = (string) $payload->email;
        $firstName = (string) ($payload->given_name ?? '');
        $lastName = (string) ($payload->family_name ?? '');
        if ($firstName === '' && $lastName === '' && isset($payload->name)) {
            $parts = explode(' ', (string) $payload->name, 2);
            $firstName = $parts[0] ?? 'User';
            $lastName = $parts[1] ?? '';
        }

        $pdo = Database::getInstance()->connect();
        $stmt = $pdo->prepare('SELECT id, role, first_name, last_name, email FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            $stmt = $pdo->prepare(
                'INSERT INTO users (role, first_name, last_name, email, phone, password_hash)
                 VALUES (\'customer\', ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $firstName ?: 'User',
                $lastName ?: 'Google',
                $email,
                null,
                ''
            ]);
            $user = [
                'id' => (int) $pdo->lastInsertId(),
                'role' => 'customer',
                'first_name' => $firstName ?: 'User',
                'last_name' => $lastName ?: 'Google',
                'email' => $email,
            ];
        }

        $token = Auth::generateToken([
            'id' => (int) $user['id'],
            'role' => $user['role'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'email' => $user['email'],
        ]);

        Response::json(true, [
            'user' => $user,
            'token' => $token,
        ]);
    }
}
