<?php
require_once __DIR__ . '/../config.php';

function setCorsHeaders(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    if (CORS_ORIGIN === '*' || CORS_ORIGIN === $origin) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        $allowed = explode(',', CORS_ORIGIN);
        if (in_array($origin, $allowed, true)) {
            header("Access-Control-Allow-Origin: $origin");
        } else {
            header("Access-Control-Allow-Origin: " . $allowed[0]);
        }
    }

    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
}

function handleCorsPreflight(): void {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        setCorsHeaders();
        http_response_code(200);
        exit;
    }
}

function jsonResponse($data, int $status = 200): void {
    setCorsHeaders();
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function errorResponse(string $message, int $status = 400): void {
    jsonResponse(['error' => $message], $status);
}

function getBody(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}
