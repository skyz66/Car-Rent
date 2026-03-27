<?php

namespace App\Middleware;

use App\Auth;
use App\AuthContext;
use App\Database;
use App\Response;
use App\Utils\Request;
use PDO;

final class AuthMiddleware
{
    public static function requireAuth(): void
    {
        $header = Request::header('Authorization');
        if (!$header || !str_starts_with($header, 'Bearer ')) {
            Response::json(false, null, 'UNAUTHORIZED', 'Missing authorization token', 401);
        }

        $token = trim(substr($header, 7));
        $payload = Auth::decodeToken($token);
        if (!$payload || empty($payload['sub'])) {
            Response::json(false, null, 'UNAUTHORIZED', 'Invalid or expired token', 401);
        }

        $pdo = Database::getInstance()->connect();
        $stmt = $pdo->prepare('SELECT id, role, first_name, last_name, email FROM users WHERE id = ?');
        $stmt->execute([$payload['sub']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$user) {
            Response::json(false, null, 'UNAUTHORIZED', 'User not found', 401);
        }

        AuthContext::set($user);
    }

    public static function requireAdmin(): void
    {
        self::requireAuth();
        $user = AuthContext::user();
        if (!$user || $user['role'] !== 'admin') {
            Response::json(false, null, 'FORBIDDEN', 'Admin access required', 403);
        }
    }
}
