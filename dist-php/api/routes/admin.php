<?php
require_once __DIR__ . '/../helpers/db.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

function handleAdminRoutes(string $method, string $subPath): void {
    $pdo = Database::getConnection();
    $subPath = trim($subPath, '/');
    $parts = $subPath ? explode('/', $subPath) : [];

    // GET /api/admin/leaderboard — Top 20 (bisa diakses oleh Student & Admin)
    if ($method === 'GET' && count($parts) === 1 && $parts[0] === 'leaderboard') {
        authenticate();

        $stmt = $pdo->query("
            SELECT id, name, points
            FROM users
            WHERE role = 'STUDENT'
            ORDER BY points DESC
            LIMIT 20
        ");
        $users = $stmt->fetchAll();

        foreach ($users as &$u) {
            $u['points'] = (int)$u['points'];
        }

        jsonResponse(['leaderboard' => $users]);
    }

    // GET /api/admin/users — List all students with counts
    if ($method === 'GET' && count($parts) === 1 && $parts[0] === 'users') {
        requireRole('ADMIN');

        $stmt = $pdo->query("
            SELECT u.id, u.name, u.email, u.points, u.streak, u.joinedAt,
                   (SELECT COUNT(*) FROM completed_lessons cl WHERE cl.userId = u.id) AS count_completed_lessons,
                   (SELECT COUNT(*) FROM quiz_scores qs WHERE qs.userId = u.id) AS count_quiz_scores,
                   (SELECT COUNT(*) FROM user_badges ub WHERE ub.userId = u.id) AS count_badges,
                   (SELECT COUNT(*) FROM scenario_results sr WHERE sr.userId = u.id) AS count_scenario_results
            FROM users u
            WHERE u.role = 'STUDENT'
            ORDER BY u.points DESC
        ");
        $rows = $stmt->fetchAll();

        $users = array_map(function ($r) {
            return [
                'id'       => $r['id'],
                'name'     => $r['name'],
                'email'    => $r['email'],
                'points'   => (int)$r['points'],
                'streak'   => (int)$r['streak'],
                'joinedAt' => $r['joinedAt'],
                '_count'   => [
                    'completedLessons' => (int)$r['count_completed_lessons'],
                    'quizScores'       => (int)$r['count_quiz_scores'],
                    'badges'           => (int)$r['count_badges'],
                    'scenarioResults'  => (int)$r['count_scenario_results'],
                ]
            ];
        }, $rows);

        jsonResponse(['users' => $users]);
    }

    // GET /api/admin/analytics — Analytics dashboard
    if ($method === 'GET' && count($parts) === 1 && $parts[0] === 'analytics') {
        requireRole('ADMIN');

        $totalStudents = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role = 'STUDENT'")->fetchColumn();
        $totalModules = (int)$pdo->query("SELECT COUNT(*) FROM modules")->fetchColumn();
        $avgPoints = (int)round((float)$pdo->query("SELECT AVG(points) FROM users WHERE role = 'STUDENT'")->fetchColumn());

        // Completions per module
        $clStmt = $pdo->query("SELECT moduleId, COUNT(*) AS completions FROM completed_lessons GROUP BY moduleId");
        $completionsMap = [];
        foreach ($clStmt->fetchAll() as $row) {
            $completionsMap[$row['moduleId']] = (int)$row['completions'];
        }

        // Quiz averages per module
        $qaStmt = $pdo->query("SELECT moduleId, AVG(pct) AS avgPct, COUNT(*) AS attempts FROM quiz_scores GROUP BY moduleId");
        $quizMap = [];
        foreach ($qaStmt->fetchAll() as $row) {
            $quizMap[$row['moduleId']] = [
                'avgPct'   => (int)round((float)$row['avgPct']),
                'attempts' => (int)$row['attempts'],
            ];
        }

        // Module details
        $mStmt = $pdo->query("SELECT id, slug, title FROM modules ORDER BY order_num ASC");
        $modules = $mStmt->fetchAll();

        $moduleStats = array_map(function ($m) use ($completionsMap, $quizMap) {
            $mid = $m['id'];
            return [
                'id'           => $mid,
                'slug'         => $m['slug'],
                'title'        => $m['title'],
                'completions'  => $completionsMap[$mid] ?? 0,
                'avgQuizPct'   => $quizMap[$mid]['avgPct'] ?? 0,
                'quizAttempts' => $quizMap[$mid]['attempts'] ?? 0,
            ];
        }, $modules);

        $completionRate = ($totalStudents > 0 && $totalModules > 0)
            ? (int)round((count($completionsMap) / $totalModules) * 100)
            : 0;

        jsonResponse([
            'analytics' => [
                'totalStudents'  => $totalStudents,
                'totalModules'   => $totalModules,
                'avgPoints'      => $avgPoints,
                'completionRate' => $completionRate,
                'moduleStats'    => $moduleStats,
            ]
        ]);
    }

    // GET /api/admin/export/csv — Download CSV report
    if ($method === 'GET' && count($parts) === 2 && $parts[0] === 'export' && $parts[1] === 'csv') {
        requireRole('ADMIN');

        // Fetch modules
        $mStmt = $pdo->query("SELECT id, slug, title FROM modules ORDER BY order_num ASC");
        $modules = $mStmt->fetchAll();

        // Fetch students
        $uStmt = $pdo->query("SELECT id, name, email, points, streak FROM users WHERE role = 'STUDENT' ORDER BY points DESC");
        $users = $uStmt->fetchAll();

        $header = [
            'name', 'email', 'points', 'streak',
            'modules_completed', 'avg_quiz_pct',
            'scenarios_played', 'sim_completed', 'sim_pct', 'sim_passed',
        ];
        foreach ($modules as $m) {
            $header[] = 'quiz_' . $m['slug'];
        }

        $csvRows = [implode(',', $header)];

        foreach ($users as $u) {
            $uid = $u['id'];

            // Completed count
            $cStmt = $pdo->prepare("SELECT COUNT(*) FROM completed_lessons WHERE userId = ?");
            $cStmt->execute([$uid]);
            $completedCount = (int)$cStmt->fetchColumn();

            // Quiz scores
            $qsStmt = $pdo->prepare("SELECT moduleId, pct FROM quiz_scores WHERE userId = ?");
            $qsStmt->execute([$uid]);
            $userQuizRows = $qsStmt->fetchAll();

            $quizScores = [];
            $totalPct = 0;
            foreach ($userQuizRows as $qr) {
                $quizScores[$qr['moduleId']] = (int)$qr['pct'];
                $totalPct += (int)$qr['pct'];
            }
            $avgQuiz = count($userQuizRows) > 0 ? (int)round($totalPct / count($userQuizRows)) : 0;

            // Scenario results count
            $srStmt = $pdo->prepare("SELECT COUNT(*) FROM scenario_results WHERE userId = ?");
            $srStmt->execute([$uid]);
            $scenarioCount = (int)$srStmt->fetchColumn();

            // Simulation result
            $simStmt = $pdo->prepare("SELECT pct, passed FROM simulation_results WHERE userId = ?");
            $simStmt->execute([$uid]);
            $simRow = $simStmt->fetch();

            $row = [
                '"' . str_replace('"', '""', $u['name']) . '"',
                '"' . str_replace('"', '""', $u['email']) . '"',
                (int)$u['points'],
                (int)$u['streak'],
                $completedCount,
                $avgQuiz,
                $scenarioCount,
                $simRow ? 1 : 0,
                $simRow ? (int)$simRow['pct'] : '',
                $simRow ? ((bool)$simRow['passed'] ? 1 : 0) : '',
            ];

            foreach ($modules as $m) {
                $row[] = isset($quizScores[$m['id']]) ? $quizScores[$m['id']] : '';
            }

            $csvRows[] = implode(',', $row);
        }

        $csvData = implode("\n", $csvRows);

        setCorsHeaders();
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=digifinquest_report.csv');
        echo $csvData;
        exit;
    }

    errorResponse('Endpoint admin tidak ditemukan', 404);
}
