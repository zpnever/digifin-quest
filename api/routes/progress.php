<?php
require_once __DIR__ . '/../helpers/db.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

function handleProgressRoutes(string $method, string $subPath): void {
    $pdo = Database::getConnection();
    $subPath = trim($subPath, '/');
    $parts = $subPath ? explode('/', $subPath) : [];

    // GET /api/progress — Full progress
    if ($method === 'GET' && empty($parts)) {
        $authUser = authenticate();
        $userId = $authUser['userId'];

        // Get user profile stats
        $stmt = $pdo->prepare("SELECT points, streak, lastLoginDay, todayLessons, joinedAt FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch() ?: [
            'points' => 0, 'streak' => 1, 'lastLoginDay' => null, 'todayLessons' => 0, 'joinedAt' => date('Y-m-d H:i:s')
        ];

        // Completed lessons
        $clStmt = $pdo->prepare("SELECT moduleId FROM completed_lessons WHERE userId = ?");
        $clStmt->execute([$userId]);
        $completedLessonsMap = [];
        foreach ($clStmt->fetchAll() as $row) {
            $completedLessonsMap[$row['moduleId']] = true;
        }

        // Quiz scores
        $qsStmt = $pdo->prepare("SELECT moduleId, correct, total, pct FROM quiz_scores WHERE userId = ?");
        $qsStmt->execute([$userId]);
        $quizScoresMap = [];
        foreach ($qsStmt->fetchAll() as $row) {
            $quizScoresMap[$row['moduleId']] = [
                'correct' => (int)$row['correct'],
                'total'   => (int)$row['total'],
                'pct'     => (int)$row['pct'],
            ];
        }

        // Badges
        $bStmt = $pdo->prepare("SELECT badgeId FROM user_badges WHERE userId = ?");
        $bStmt->execute([$userId]);
        $badges = array_column($bStmt->fetchAll(), 'badgeId');

        // Claimed challenges
        $ccStmt = $pdo->prepare("SELECT challengeId FROM claimed_challenges WHERE userId = ?");
        $ccStmt->execute([$userId]);
        $claimedChallenges = array_column($ccStmt->fetchAll(), 'challengeId');

        // Scenario results
        $srStmt = $pdo->prepare("SELECT scenarioId, choiceIndex, quality FROM scenario_results WHERE userId = ?");
        $srStmt->execute([$userId]);
        $scenarioResultsMap = [];
        foreach ($srStmt->fetchAll() as $row) {
            $scenarioResultsMap[$row['scenarioId']] = [
                'choiceIndex' => (int)$row['choiceIndex'],
                'quality'     => (int)$row['quality'],
            ];
        }

        // Simulation result
        $simStmt = $pdo->prepare("SELECT balance, saving, avgQuality, pct, passed FROM simulation_results WHERE userId = ?");
        $simStmt->execute([$userId]);
        $simRow = $simStmt->fetch();
        $simResult = $simRow ? [
            'balance'    => (int)$simRow['balance'],
            'saving'     => (int)$simRow['saving'],
            'avgQuality' => (float)$simRow['avgQuality'],
            'pct'        => (int)$simRow['pct'],
            'passed'     => (bool)$simRow['passed'],
        ] : null;

        $joinedStr = date('D M d Y', strtotime($user['joinedAt']));

        jsonResponse([
            'progress' => [
                'completedLessons'  => $completedLessonsMap,
                'quizScores'        => $quizScoresMap,
                'points'            => (int)$user['points'],
                'badges'            => $badges,
                'streak'            => (int)$user['streak'],
                'lastLoginDay'      => $user['lastLoginDay'],
                'todayLessons'      => (int)$user['todayLessons'],
                'claimedChallenges' => $claimedChallenges,
                'joined'            => $joinedStr,
                'scenarioResults'   => $scenarioResultsMap,
                'simResult'         => $simResult,
            ]
        ]);
    }

    // POST /api/progress/lessons/:moduleId
    if ($method === 'POST' && count($parts) === 2 && $parts[0] === 'lessons') {
        $authUser = authenticate();
        $userId = $authUser['userId'];
        $moduleId = $parts[1];

        $checkStmt = $pdo->prepare("SELECT id FROM completed_lessons WHERE userId = ? AND moduleId = ?");
        $checkStmt->execute([$userId, $moduleId]);
        if ($checkStmt->fetch()) {
            jsonResponse(['alreadyCompleted' => true]);
        }

        $now = date('Y-m-d H:i:s');
        $insertStmt = $pdo->prepare("INSERT INTO completed_lessons (id, userId, moduleId, createdAt) VALUES (?, ?, ?, ?)");
        $insertStmt->execute([uuid_v4(), $userId, $moduleId, $now]);

        $pointsToAdd = 30;
        $uStmt = $pdo->prepare("UPDATE users SET points = points + ?, todayLessons = todayLessons + 1 WHERE id = ?");
        $uStmt->execute([$pointsToAdd, $userId]);

        // Award explorer badge (first lesson completed)
        $bStmt = $pdo->prepare("INSERT IGNORE INTO user_badges (id, userId, badgeId) VALUES (?, ?, 'explorer')");
        $bStmt->execute([uuid_v4(), $userId]);

        jsonResponse(['success' => true, 'pointsAdded' => $pointsToAdd]);
    }

    // POST /api/progress/quizzes/:moduleId
    if ($method === 'POST' && count($parts) === 2 && $parts[0] === 'quizzes') {
        $authUser = authenticate();
        $userId = $authUser['userId'];
        $moduleId = $parts[1];
        $body = getBody();

        $correct = isset($body['correct']) ? (int)$body['correct'] : null;
        $total = isset($body['total']) ? (int)$body['total'] : null;

        if ($correct === null || $total === null || $total === 0) {
            errorResponse('correct dan total wajib diisi', 400);
        }

        $pct = (int)round(($correct / $total) * 100);
        $pointsToAdd = $correct * 15;

        // Check existing score
        $checkStmt = $pdo->prepare("SELECT id, pct FROM quiz_scores WHERE userId = ? AND moduleId = ?");
        $checkStmt->execute([$userId, $moduleId]);
        $existing = $checkStmt->fetch();

        $now = date('Y-m-d H:i:s');
        if (!$existing) {
            $insStmt = $pdo->prepare("INSERT INTO quiz_scores (id, userId, moduleId, correct, total, pct, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $insStmt->execute([uuid_v4(), $userId, $moduleId, $correct, $total, $pct, $now]);
        } elseif ($pct > (int)$existing['pct']) {
            $upStmt = $pdo->prepare("UPDATE quiz_scores SET correct = ?, total = ?, pct = ? WHERE id = ?");
            $upStmt->execute([$correct, $total, $pct, $existing['id']]);
        }

        // Award points
        $uStmt = $pdo->prepare("UPDATE users SET points = points + ? WHERE id = ?");
        $uStmt->execute([$pointsToAdd, $userId]);

        // Award module-specific badges based on module slug
        $modStmt = $pdo->prepare("SELECT slug FROM modules WHERE id = ?");
        $modStmt->execute([$moduleId]);
        $mod = $modStmt->fetch();

        if ($mod) {
            $slugBadgeMap = [
                'm3' => 'saver',
                'm4' => 'borrower',
                'm5' => 'guardian',
                'm6' => 'advocate',
            ];
            $badgeId = $slugBadgeMap[$mod['slug']] ?? null;
            if ($badgeId && $pct >= 60) {
                $bStmt = $pdo->prepare("INSERT IGNORE INTO user_badges (id, userId, badgeId) VALUES (?, ?, ?)");
                $bStmt->execute([uuid_v4(), $userId, $badgeId]);
            }
        }

        // Perfect score badge
        if ($pct === 100) {
            $pBadgeStmt = $pdo->prepare("INSERT IGNORE INTO user_badges (id, userId, badgeId) VALUES (?, ?, 'perfect')");
            $pBadgeStmt->execute([uuid_v4(), $userId]);
        }

        jsonResponse([
            'success'     => true,
            'pct'         => $pct,
            'pointsAdded' => $pointsToAdd,
        ]);
    }

    // POST /api/progress/challenges/:id
    if ($method === 'POST' && count($parts) === 2 && $parts[0] === 'challenges') {
        $authUser = authenticate();
        $userId = $authUser['userId'];
        $challengeId = $parts[1];

        $checkStmt = $pdo->prepare("SELECT id FROM claimed_challenges WHERE userId = ? AND challengeId = ?");
        $checkStmt->execute([$userId, $challengeId]);
        if ($checkStmt->fetch()) {
            jsonResponse(['alreadyClaimed' => true]);
        }

        $insStmt = $pdo->prepare("INSERT INTO claimed_challenges (id, userId, challengeId) VALUES (?, ?, ?)");
        $insStmt->execute([uuid_v4(), $userId, $challengeId]);

        $pointsToAdd = 40;
        $uStmt = $pdo->prepare("UPDATE users SET points = points + ? WHERE id = ?");
        $uStmt->execute([$pointsToAdd, $userId]);

        jsonResponse(['success' => true, 'pointsAdded' => $pointsToAdd]);
    }

    // POST /api/progress/scenarios/:scenarioId
    if ($method === 'POST' && count($parts) === 2 && $parts[0] === 'scenarios') {
        $authUser = authenticate();
        $userId = $authUser['userId'];
        $scenarioId = $parts[1];
        $body = getBody();

        $choiceIndex = isset($body['choiceIndex']) ? (int)$body['choiceIndex'] : null;
        $quality = isset($body['quality']) ? (int)$body['quality'] : null;

        if ($choiceIndex === null || $quality === null) {
            errorResponse('choiceIndex dan quality wajib diisi', 400);
        }

        $checkStmt = $pdo->prepare("SELECT id FROM scenario_results WHERE userId = ? AND scenarioId = ?");
        $checkStmt->execute([$userId, $scenarioId]);
        if ($checkStmt->fetch()) {
            jsonResponse(['alreadyRecorded' => true]);
        }

        $insStmt = $pdo->prepare("INSERT INTO scenario_results (id, userId, scenarioId, choiceIndex, quality) VALUES (?, ?, ?, ?, ?)");
        $insStmt->execute([uuid_v4(), $userId, $scenarioId, $choiceIndex, $quality]);

        // Points: safe=25, medium=10, risky=0
        $reward = ($quality === 2) ? 25 : (($quality === 1) ? 10 : 0);
        if ($reward > 0) {
            $uStmt = $pdo->prepare("UPDATE users SET points = points + ? WHERE id = ?");
            $uStmt->execute([$reward, $userId]);
        }

        jsonResponse(['success' => true, 'pointsAdded' => $reward]);
    }

    // POST /api/progress/simulation
    if ($method === 'POST' && count($parts) === 1 && $parts[0] === 'simulation') {
        $authUser = authenticate();
        $userId = $authUser['userId'];
        $body = getBody();

        $balance = (int)($body['balance'] ?? 0);
        $saving = (int)($body['saving'] ?? 0);
        $avgQuality = (float)($body['avgQuality'] ?? 0);
        $pct = (int)($body['pct'] ?? 0);
        $passed = !empty($body['passed']) ? 1 : 0;
        $choicesLog = isset($body['choicesLog']) ? json_encode($body['choicesLog'], JSON_UNESCAPED_UNICODE) : null;

        $checkStmt = $pdo->prepare("SELECT id, pct, passed FROM simulation_results WHERE userId = ?");
        $checkStmt->execute([$userId]);
        $existing = $checkStmt->fetch();

        if (!$existing) {
            $insStmt = $pdo->prepare("INSERT INTO simulation_results (id, userId, balance, saving, avgQuality, pct, passed, choicesLog) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $insStmt->execute([uuid_v4(), $userId, $balance, $saving, $avgQuality, $pct, $passed, $choicesLog]);
        } elseif ($pct > (int)$existing['pct']) {
            $upStmt = $pdo->prepare("UPDATE simulation_results SET balance = ?, saving = ?, avgQuality = ?, pct = ?, passed = ?, choicesLog = ? WHERE userId = ?");
            $upStmt->execute([$balance, $saving, $avgQuality, $pct, $passed, $choicesLog, $userId]);
        }

        // Bonus 100 points on first pass
        if ($passed && (!$existing || !(bool)$existing['passed'])) {
            $uStmt = $pdo->prepare("UPDATE users SET points = points + 100 WHERE id = ?");
            $uStmt->execute([$userId]);
        }

        jsonResponse(['success' => true]);
    }

    errorResponse('Endpoint progress tidak ditemukan', 404);
}
