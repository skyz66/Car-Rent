<?php

namespace App;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

final class Auth
{
    public static function generateToken(array $user): string
    {
        $secret = Config::get('JWT_SECRET', 'change_this_secret');
        $ttl = (int) (Config::get('JWT_TTL', '86400'));
        $now = time();

        $payload = [
            'iss' => Config::get('APP_URL', 'http://localhost:8000'),
            'iat' => $now,
            'exp' => $now + $ttl,
            'sub' => $user['id'],
            'role' => $user['role'],
            'email' => $user['email'],
        ];

        return JWT::encode($payload, $secret, 'HS256');
    }

    public static function decodeToken(string $token): ?array
    {
        $secret = Config::get('JWT_SECRET', 'change_this_secret');
        try {
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            return (array) $decoded;
        } catch (\Throwable $ex) {
            return null;
        }
    }
}
