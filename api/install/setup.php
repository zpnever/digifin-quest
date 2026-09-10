<?php
require_once __DIR__ . '/../config.php';

$message = null;
$error = null;
$installed = false;

// Cek status koneksi DB
$dbConnected = false;
$dbError = '';
try {
    $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_PORT, DB_NAME);
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $dbConnected = true;
} catch (PDOException $e) {
    $dbError = $e->getMessage();
}

// Tangani aksi install jika form disubmit
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'install') {
    if (!$dbConnected) {
        $error = "Tidak dapat melanjutkan instalasi karena koneksi database gagal: " . $dbError;
    } else {
        try {
            $schemaFile = __DIR__ . '/schema.sql';
            $seedFile = __DIR__ . '/seed.sql';

            if (!file_exists($schemaFile) || !file_exists($seedFile)) {
                throw new Exception("File schema.sql atau seed.sql tidak ditemukan di folder api/install/");
            }

            $schemaSql = file_get_contents($schemaFile);
            $seedSql = file_get_contents($seedFile);

            // Eksekusi skema
            $pdo->exec($schemaSql);

            // Eksekusi seed
            $pdo->exec($seedSql);

            $installed = true;
            $message = "Instalasi dan migrasi database DigiFin Quest berhasil dilakukan!";
        } catch (Exception $e) {
            $error = "Terjadi kesalahan saat instalasi: " . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DigiFin Quest — Setup & Installer Database</title>
    <style>
        :root {
            --primary: #4f46e5;
            --primary-hover: #4338ca;
            --bg: #0f172a;
            --card-bg: #1e293b;
            --text: #f8fafc;
            --text-muted: #94a3b8;
            --border: #334155;
            --success: #10b981;
            --danger: #ef4444;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
        body {
            background-color: var(--bg);
            color: var(--text);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .card {
            background-color: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            width: 100%;
            max-width: 600px;
            padding: 32px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        }
        .header {
            text-align: center;
            margin-bottom: 24px;
        }
        .badge {
            display: inline-block;
            background: rgba(79, 70, 229, 0.2);
            color: #818cf8;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 12px;
            border: 1px solid rgba(79, 70, 229, 0.4);
        }
        h1 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
        p.subtitle { color: var(--text-muted); font-size: 14px; }
        .status-box {
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 16px;
            margin: 20px 0;
            font-size: 14px;
        }
        .status-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .status-item:last-child { border-bottom: none; }
        .tag-success { color: var(--success); font-weight: 600; }
        .tag-danger { color: var(--danger); font-weight: 600; }
        .alert {
            padding: 16px;
            border-radius: 12px;
            font-size: 14px;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        .alert-success {
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid var(--success);
            color: #34d399;
        }
        .alert-danger {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid var(--danger);
            color: #f87171;
        }
        .btn {
            display: block;
            width: 100%;
            padding: 14px;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            border: none;
            transition: 0.2s;
            text-decoration: none;
        }
        .btn-primary {
            background-color: var(--primary);
            color: #fff;
        }
        .btn-primary:hover { background-color: var(--primary-hover); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-success {
            background-color: var(--success);
            color: #fff;
            margin-top: 12px;
        }
        .account-box {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 12px;
            margin-top: 12px;
            font-size: 13px;
        }
        .account-box code {
            background: rgba(0,0,0,0.4);
            padding: 2px 6px;
            border-radius: 4px;
            color: #cbd5e1;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <span class="badge">PHP & MySQL Installer</span>
            <h1>DigiFin Quest Database Setup</h1>
            <p class="subtitle">Inisialisasi tabel dan data pembelajaran untuk hosting PHP</p>
        </div>

        <?php if ($message): ?>
            <div class="alert alert-success">
                <strong>✓ Berhasil!</strong> <?php echo htmlspecialchars($message); ?>
                <div class="account-box">
                    <strong>Kredensial Default:</strong><br>
                    • <strong>Admin/Dosen:</strong> <code>admin@digifinquest.ac.id</code> / <code>admin123</code><br>
                    • <strong>Mahasiswa Demo:</strong> <code>ayu@student.ac.id</code> / <code>student123</code><br>
                    • <strong>Kode Registrasi Admin:</strong> <code><?php echo htmlspecialchars(ADMIN_REGISTER_CODE); ?></code>
                </div>
            </div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="alert alert-danger">
                <strong>✗ Gagal:</strong> <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <div class="status-box">
            <div class="status-item">
                <span>Versi PHP Server</span>
                <span><strong><?php echo phpversion(); ?></strong></span>
            </div>
            <div class="status-item">
                <span>Ekstensi PDO MySQL</span>
                <span>
                    <?php if (extension_loaded('pdo_mysql')): ?>
                        <span class="tag-success">✓ Aktif</span>
                    <?php else: ?>
                        <span class="tag-danger">✗ Tidak Aktif</span>
                    <?php endif; ?>
                </span>
            </div>
            <div class="status-item">
                <span>Database Host</span>
                <span><code><?php echo htmlspecialchars(DB_HOST . ':' . DB_PORT); ?></code></span>
            </div>
            <div class="status-item">
                <span>Database Name</span>
                <span><code><?php echo htmlspecialchars(DB_NAME); ?></code></span>
            </div>
            <div class="status-item">
                <span>Koneksi Database</span>
                <span>
                    <?php if ($dbConnected): ?>
                        <span class="tag-success">✓ Terhubung</span>
                    <?php else: ?>
                        <span class="tag-danger">✗ Gagal Terhubung</span>
                    <?php endif; ?>
                </span>
            </div>
        </div>

        <?php if (!$dbConnected): ?>
            <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 16px;">
                💡 <strong>Tips:</strong> Buka file <code>api/config.php</code> di hosting Anda dan perbarui <code>DB_NAME</code>, <code>DB_USER</code>, dan <code>DB_PASS</code> sesuai kredensial MySQL cPanel Anda.
            </p>
        <?php endif; ?>

        <?php if (!$installed): ?>
            <form method="POST">
                <input type="hidden" name="action" value="install">
                <button type="submit" class="btn btn-primary" <?php echo !$dbConnected ? 'disabled' : ''; ?>>
                    🚀 Mulai Inisialisasi Database (Schema & Seed)
                </button>
            </form>
        <?php else: ?>
            <a href="../../" class="btn btn-success">
                🏠 Buka Aplikasi DigiFin Quest
            </a>
            <p style="color: #eab308; font-size: 12px; margin-top: 12px; text-align: center;">
                ⚠️ <em>Demi keamanan, hapus atau ubah nama file <code>api/install/setup.php</code> setelah proses ini selesai.</em>
            </p>
        <?php endif; ?>
    </div>
</body>
</html>
