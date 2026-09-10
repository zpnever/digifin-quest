<?php
require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/response.php';
require_once __DIR__ . '/../config.php';

function getBearerToken(): ?string {
    $header = null;
    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        $header = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            $header = $headers['Authorization'];
        } elseif (isset($headers['authorization'])) {
            $header = $headers['authorization'];
        }
    }

    if (!$header || !preg_match('/Bearer\s(\S+)/i', $header, $matches)) {
        return null;
    }

    return $matches[1];
}

function authenticate(): array {
    $token = getBearerToken();
    if (!$token) {
        errorResponse('Token diperlukan', 401);
    }

    $payload = JWT::decode($token, JWT_SECRET);
    if (!$payload || empty($payload['userId'])) {
        errorResponse('Token tidak valid atau sudah kadaluarsa', 401);
    }

    return $payload;
}

function requireRole(string ...$roles): array {
    $user = authenticate();
    if (!in_array($user['role'] ?? '', $roles, true)) {
        errorResponse('Akses ditolak', 403);
    }
    return $user;
}
