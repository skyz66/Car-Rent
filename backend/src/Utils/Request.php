<?php

namespace App\Utils;

final class Request
{
    public static function json(): array
    {
        $raw = file_get_contents('php://input');
        if (!$raw) {
            return [];
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    public static function query(string $key, ?string $default = null): ?string
    {
        return $_GET[$key] ?? $default;
    }

    public static function header(string $key): ?string
    {
        $headers = getallheaders();
        $normalized = [];
        foreach ($headers as $name => $value) {
            $normalized[strtolower($name)] = $value;
        }
        return $normalized[strtolower($key)] ?? null;
    }
}
