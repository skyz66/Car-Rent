<?php

namespace App\Utils;

final class Validator
{
    public static function required(array $data, array $fields): array
    {
        $missing = [];
        foreach ($fields as $field) {
            if (!array_key_exists($field, $data) || $data[$field] === '' || $data[$field] === null) {
                $missing[] = $field;
            }
        }
        return $missing;
    }

    public static function isEmail(string $value): bool
    {
        return (bool) preg_match('/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i', $value);
    }

    public static function isPhone(string $value): bool
    {
        return (bool) preg_match('/^\d{8}$/', $value);
    }

    public static function isPlateNumber(string $value): bool
    {
        return (bool) preg_match('/^\d{1,3}\s?TU\s?\d{1,4}$/i', trim($value));
    }

    public static function isPassword(string $value): bool
    {
        return (bool) preg_match('/^(?=.*[A-Za-z])(?=.*\d).{6,}$/', $value);
    }

    public static function isYear(string $value): bool
    {
        return (bool) preg_match('/^(19\d{2}|20\d{2}|21\d{2})$/', $value);
    }

    public static function isPositiveInteger(string $value): bool
    {
        return (bool) preg_match('/^[1-9]\d*$/', $value);
    }

    public static function isDecimal(string $value): bool
    {
        return (bool) preg_match('/^\d+(\.\d{1,2})?$/', $value);
    }

    public static function isUrl(string $value): bool
    {
        if ($value === '') {
            return false;
        }
        return filter_var($value, FILTER_VALIDATE_URL) !== false;
    }

    public static function inList(string $value, array $allowed): bool
    {
        return in_array($value, $allowed, true);
    }
}
