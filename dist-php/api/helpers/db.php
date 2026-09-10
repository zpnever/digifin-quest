<?php
require_once __DIR__ . '/../config.php';

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $dsn = sprintf(
                'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
                DB_HOST,
                DB_PORT,
                DB_NAME
            );
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode([
                    'error' => 'Koneksi database gagal: ' . $e->getMessage(),
                    'tip'   => 'Pastikan kredensial di api/config.php sudah sesuai dengan database cPanel Anda.'
                ]);
                exit;
            }
        }
        return self::$instance;
    }
}

/**
 * Generate standard UUID v4
 */
function uuid_v4(): string {
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40); // set version to 0100
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80); // set bits 6-7 to 10
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}
