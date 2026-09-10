<?php
require_once __DIR__ . '/../helpers/db.php';
require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

function handleAuthRoutes(string $method, string $subPath): void {
    $pdo = Database::getConnection();

    // POST /api/auth/register
    if ($method === 'POST' && ($subPath === '/register' || $subPath === 'register')) {
        $body = getBody();
        $name = trim($body['name'] ?? '');
        $email = strtolower(trim($body['email'] ?? ''));
        $password = $body['password'] ?? '';

        if (!$name || !$email || !$password) {
            errorResponse('Nama, email, dan kata sandi wajib diisi', 400);
        }

        if (strlen($password) < 6) {
            errorResponse('Kata sandi minimal 6 karakter', 400);
        }

        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            errorResponse('Email sudah terdaftar', 409);
        }

        $hashed = password_hash($password, PASSWORD_BCRYPT);
        $userId = uuid_v4();
        $now = date('Y-m-d H:i:s');

        $stmt = $pdo->prepare("INSERT INTO users (id, email, name, password, role, points, streak, todayLessons, joinedAt, updatedAt) VALUES (?, ?, ?, ?, 'STUDENT', 0, 1, 0, ?, ?)");
        $stmt->execute([$userId, $email, $name, $hashed, $now, $now]);

        $token = JWT::encode([
            'userId' => $userId,
            'role'   => 'STUDENT'
        ], JWT_SECRET, 7 * 86400);

        jsonResponse([
            'token' => $token,
            'user'  => [
                'id'    => $userId,
                'name'  => $name,
                'email' => $email,
                'role'  => 'STUDENT'
            ]
        ], 201);
    }

    // POST /api/auth/register/admin
    if ($method === 'POST' && ($subPath === '/register/admin' || $subPath === 'register/admin')) {
        $body = getBody();
        $name = trim($body['name'] ?? '');
        $email = strtolower(trim($body['email'] ?? ''));
        $password = $body['password'] ?? '';
        $adminCode = trim($body['adminCode'] ?? '');

        if (!$name || !$email || !$password || !$adminCode) {
            errorResponse('Semua field wajib diisi termasuk kode admin', 400);
        }

        if (strlen($password) < 6) {
            errorResponse('Kata sandi minimal 6 karakter', 400);
        }

        if ($adminCode !== ADMIN_REGISTER_CODE) {
            errorResponse('Kode admin tidak valid', 403);
        }

        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            errorResponse('Email sudah terdaftar', 409);
        }

        $hashed = password_hash($password, PASSWORD_BCRYPT);
        $userId = uuid_v4();
        $now = date('Y-m-d H:i:s');

        $stmt = $pdo->prepare("INSERT INTO users (id, email, name, password, role, points, streak, todayLessons, joinedAt, updatedAt) VALUES (?, ?, ?, ?, 'ADMIN', 0, 1, 0, ?, ?)");
        $stmt->execute([$userId, $email, $name, $hashed, $now, $now]);

        $token = JWT::encode([
            'userId' => $userId,
            'role'   => 'ADMIN'
        ], JWT_SECRET, 7 * 86400);

        jsonResponse([
            'token' => $token,
            'user'  => [
                'id'    => $userId,
                'name'  => $name,
                'email' => $email,
                'role'  => 'ADMIN'
            ]
        ], 201);
    }

    // POST /api/auth/login
    if ($method === 'POST' && ($subPath === '/login' || $subPath === 'login')) {
        $body = getBody();
        $email = strtolower(trim($body['email'] ?? ''));
        $password = $body['password'] ?? '';

        if (!$email || !$password) {
            errorResponse('Email dan kata sandi wajib diisi', 400);
        }

        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password'])) {
            errorResponse('Email atau kata sandi salah', 401);
        }

        // Streak check matching JS Date.toDateString() format: "Wed Sep 09 2026"
        $today = date('D M d Y');
        $yesterday = date('D M d Y', time() - 86400);
        $newStreak = (int)$user['streak'];
        $pointsBonus = 0;
        $currentPoints = (int)$user['points'];

        if ($user['lastLoginDay'] !== $today) {
            $newStreak = ($user['lastLoginDay'] === $yesterday) ? ((int)$user['streak'] + 1) : 1;
            $pointsBonus = 20; // POINTS.dailyLogin
            $currentPoints += $pointsBonus;

            $updateStmt = $pdo->prepare("UPDATE users SET streak = ?, lastLoginDay = ?, points = ?, todayLessons = 0, updatedAt = ? WHERE id = ?");
            $updateStmt->execute([$newStreak, $today, $currentPoints, date('Y-m-d H:i:s'), $user['id']]);

            // Award streak5 badge
            if ($newStreak >= 5) {
                $badgeStmt = $pdo->prepare("INSERT IGNORE INTO user_badges (id, userId, badgeId) VALUES (?, ?, ?)");
                $badgeStmt->execute([uuid_v4(), $user['id'], 'streak5']);
            }
        }

        $token = JWT::encode([
            'userId' => $user['id'],
            'role'   => $user['role']
        ], JWT_SECRET, 7 * 86400);

        jsonResponse([
            'token' => $token,
            'user'  => [
                'id'     => $user['id'],
                'name'   => $user['name'],
                'email'  => $user['email'],
                'role'   => $user['role'],
                'points' => $currentPoints,
                'streak' => $newStreak,
            ]
        ]);
    }

    // GET /api/auth/me
    if ($method === 'GET' && ($subPath === '/me' || $subPath === 'me')) {
        $authUser = authenticate();
        $stmt = $pdo->prepare("SELECT id, name, email, role, points, streak, lastLoginDay, todayLessons, joinedAt FROM users WHERE id = ?");
        $stmt->execute([$authUser['userId']]);
        $user = $stmt->fetch();

        if (!$user) {
            errorResponse('User tidak ditemukan', 404);
        }

        // Format integer fields
        $user['points'] = (int)$user['points'];
        $user['streak'] = (int)$user['streak'];
        $user['todayLessons'] = (int)$user['todayLessons'];

        jsonResponse(['user' => $user]);
    }

    errorResponse('Endpoint auth tidak ditemukan', 404);
}
