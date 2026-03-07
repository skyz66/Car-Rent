<?php

namespace App;

final class AuthContext
{
    private static ?array $user = null;

    public static function set(?array $user): void
    {
        self::$user = $user;
    }

    public static function user(): ?array
    {
        return self::$user;
    }
}
