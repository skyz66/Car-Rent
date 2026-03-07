<?php

namespace App;

final class Response
{
    public static function json(
        bool $success,
        $data,
        ?string $errorCode = null,
        ?string $errorMessage = null,
        int $status = 200,
        $details = null
    ): void {
        http_response_code($status);
        header('Content-Type: application/json');

        $payload = [
            'success' => $success,
            'data' => $success ? $data : null,
        ];

        if (!$success) {
            $payload['error'] = [
                'code' => $errorCode,
                'message' => $errorMessage,
            ];
            if ($details !== null) {
                $payload['error']['details'] = $details;
            }
        }

        echo json_encode($payload);
        exit;
    }
}
