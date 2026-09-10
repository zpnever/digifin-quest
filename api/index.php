<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers/response.php';

// Tangani CORS preflight
handleCorsPreflight();
setCorsHeaders();

// Ambil HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// Ekstraksi path URL
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

// Jika dioper via query param 'path' (misal dari mod_rewrite):
if (isset($_GET['__route'])) {
    $path = trim($_GET['__route'], '/');
} else {
    // Normalisasi: ambil bagian setelah '/api/' atau '/api'
    $apiPos = strpos($uri, '/api');
    if ($apiPos !== false) {
        $path = substr($uri, $apiPos + 4);
    } else {
        $path = $uri;
    }
    $path = trim($path, '/');
}

// Pisahkan segmen pertama (service) dan sisanya (subPath)
$segments = $path ? explode('/', $path) : [];
$service = $segments[0] ?? '';
$subPath = count($segments) > 1 ? implode('/', array_slice($segments, 1)) : '';

// Health check endpoint
if ($service === 'health' || $service === '') {
    jsonResponse([
        'status'    => 'ok',
        'server'    => 'PHP/' . PHP_VERSION,
        'timestamp' => date('c'),
    ]);
}

// Router dispatch
switch ($service) {
    case 'auth':
        require_once __DIR__ . '/routes/auth.php';
        handleAuthRoutes($method, $subPath);
        break;

    case 'modules':
        require_once __DIR__ . '/routes/modules.php';
        handleModuleRoutes($method, $subPath);
        break;

    case 'progress':
        require_once __DIR__ . '/routes/progress.php';
        handleProgressRoutes($method, $subPath);
        break;

    case 'scenarios':
        require_once __DIR__ . '/routes/scenarios.php';
        handleScenarioRoutes($method, $subPath);
        break;

    case 'admin':
        require_once __DIR__ . '/routes/admin.php';
        handleAdminRoutes($method, $subPath);
        break;

    default:
        errorResponse("Endpoint '/api/{$path}' tidak ditemukan", 404);
}
