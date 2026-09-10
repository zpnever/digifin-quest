<?php
/**
 * DigiFin Quest — Konfigurasi Aplikasi & Database
 * 
 * Sesuaikan pengaturan di bawah ini dengan kredensial database hosting Anda (cPanel / phpMyAdmin).
 */

// Konfigurasi Database MySQL
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'digifinquest');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');

// JWT Secret Key (Ubah string ini untuk keamanan produksi)
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'dfq_super_secret_jwt_key_hosting_2026_change_me');

// Kode Pendaftaran Admin / Dosen
define('ADMIN_REGISTER_CODE', getenv('ADMIN_REGISTER_CODE') ?: 'DOSEN2025');

// CORS Origin (kosongkan atau '*' untuk mengizinkan semua domain)
define('CORS_ORIGIN', getenv('CORS_ORIGIN') ?: '*');

// Error reporting untuk production (ubah ke 0 saat sudah live di hosting jika tidak ingin menampilkan notice PHP)
ini_set('display_errors', '0');
error_reporting(E_ALL);

// Set default timezone (WIB)
date_default_timezone_set('Asia/Jakarta');
