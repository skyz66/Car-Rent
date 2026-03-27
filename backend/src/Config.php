<?php

namespace App;

final class Config
{
    private static ?Config $instance = null;
    private array $settings = [];

    private function __construct(array $settings)
    {
        $this->settings = $settings;
    }

    public static function getInstance(array $settings = []): Config
    {
        if (self::$instance === null) {
            self::$instance = new self($settings);
        }

        return self::$instance;
    }

    public static function load(string $path): Config
    {
        $settings = [];
        if (file_exists($path)) {
            $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if ($line === '' || str_starts_with($line, '#')) {
                    continue;
                }
                [$key, $value] = array_pad(explode('=', $line, 2), 2, '');
                $key = trim($key);
                $value = trim($value);
                if ($key !== '') {
                    $settings[$key] = $value;
                    $_ENV[$key] = $value;
                }
            }
        }

        return self::getInstance($settings);
    }

    public function get(string $key, ?string $default = null): ?string
    {
        if (array_key_exists($key, $this->settings)) {
            return $this->settings[$key];
        }

        return $_ENV[$key] ?? $default;
    }
}
