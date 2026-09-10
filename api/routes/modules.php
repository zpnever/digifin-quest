<?php
require_once __DIR__ . '/../helpers/db.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

function handleModuleRoutes(string $method, string $subPath): void {
    $pdo = Database::getConnection();
    $subPath = trim($subPath, '/');
    $parts = $subPath ? explode('/', $subPath) : [];

    // GET /api/modules — List all modules
    if ($method === 'GET' && empty($parts)) {
        authenticate();

        $stmt = $pdo->query("
            SELECT m.id, m.slug, m.title, m.topics, m.order_num,
                   COUNT(q.id) AS quizCount
            FROM modules m
            LEFT JOIN quizzes q ON q.moduleId = m.id
            GROUP BY m.id, m.slug, m.title, m.topics, m.order_num
            ORDER BY m.order_num ASC
        ");
        $rows = $stmt->fetchAll();

        $modules = array_map(function ($row) {
            $topics = json_decode($row['topics'], true);
            return [
                'id'        => $row['id'],
                'slug'      => $row['slug'],
                'title'     => $row['title'],
                'topics'    => is_array($topics) ? $topics : [],
                'order'     => (int)$row['order_num'],
                'quizCount' => (int)$row['quizCount'],
            ];
        }, $rows);

        jsonResponse(['modules' => $modules]);
    }

    // POST /api/modules — Create module (Admin only)
    if ($method === 'POST' && empty($parts)) {
        requireRole('ADMIN');
        $body = getBody();
        $slug = trim($body['slug'] ?? '');
        $title = trim($body['title'] ?? '');
        $topics = $body['topics'] ?? null;
        $order = isset($body['order']) ? (int)$body['order'] : 0;
        $lesson = $body['lesson'] ?? null;

        if (!$slug || !$title || !$topics || !$lesson) {
            errorResponse('Slug, title, topics, dan lesson wajib diisi', 400);
        }

        $checkStmt = $pdo->prepare("SELECT id FROM modules WHERE slug = ?");
        $checkStmt->execute([$slug]);
        if ($checkStmt->fetch()) {
            errorResponse('Slug modul sudah digunakan', 409);
        }

        $id = uuid_v4();
        $topicsJson = json_encode($topics, JSON_UNESCAPED_UNICODE);
        $lessonJson = json_encode($lesson, JSON_UNESCAPED_UNICODE);

        $stmt = $pdo->prepare("INSERT INTO modules (id, slug, title, topics, order_num, lesson) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $slug, $title, $topicsJson, $order, $lessonJson]);

        jsonResponse([
            'module' => [
                'id'     => $id,
                'slug'   => $slug,
                'title'  => $title,
                'topics' => $topics,
                'order'  => $order,
                'lesson' => $lesson,
            ]
        ], 201);
    }

    // Routes with at least module ID: /api/modules/:id...
    if (!empty($parts)) {
        $moduleId = $parts[0];

        // Sub-routes for quizzes: /api/modules/:id/quizzes...
        if (isset($parts[1]) && $parts[1] === 'quizzes') {
            // POST /api/modules/:id/quizzes (Admin only)
            if ($method === 'POST' && count($parts) === 2) {
                requireRole('ADMIN');
                $body = getBody();
                $question = trim($body['question'] ?? '');
                $options = $body['options'] ?? null;
                $answer = isset($body['answer']) ? (int)$body['answer'] : null;
                $explanation = trim($body['explanation'] ?? '');
                $difficulty = trim($body['difficulty'] ?? 'sedang');
                $order = isset($body['order']) ? (int)$body['order'] : 0;

                if (!$question || !is_array($options) || $answer === null || !$explanation) {
                    errorResponse('Semua field quiz wajib diisi', 400);
                }

                $quizId = uuid_v4();
                $optionsJson = json_encode($options, JSON_UNESCAPED_UNICODE);

                $stmt = $pdo->prepare("INSERT INTO quizzes (id, moduleId, question, options, answer, explanation, difficulty, order_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$quizId, $moduleId, $question, $optionsJson, $answer, $explanation, $difficulty, $order]);

                jsonResponse([
                    'quiz' => [
                        'id'          => $quizId,
                        'moduleId'    => $moduleId,
                        'question'    => $question,
                        'options'     => $options,
                        'answer'      => $answer,
                        'explanation' => $explanation,
                        'difficulty'  => $difficulty,
                        'order'       => $order,
                    ]
                ], 201);
            }

            // PUT /api/modules/:id/quizzes/:qid (Admin only)
            if ($method === 'PUT' && count($parts) === 3) {
                requireRole('ADMIN');
                $qid = $parts[2];
                $body = getBody();

                $fields = [];
                $params = [];

                if (isset($body['question'])) {
                    $fields[] = "question = ?";
                    $params[] = trim($body['question']);
                }
                if (isset($body['options']) && is_array($body['options'])) {
                    $fields[] = "options = ?";
                    $params[] = json_encode($body['options'], JSON_UNESCAPED_UNICODE);
                }
                if (isset($body['answer'])) {
                    $fields[] = "answer = ?";
                    $params[] = (int)$body['answer'];
                }
                if (isset($body['explanation'])) {
                    $fields[] = "explanation = ?";
                    $params[] = trim($body['explanation']);
                }
                if (isset($body['difficulty'])) {
                    $fields[] = "difficulty = ?";
                    $params[] = trim($body['difficulty']);
                }
                if (isset($body['order'])) {
                    $fields[] = "order_num = ?";
                    $params[] = (int)$body['order'];
                }

                if (!empty($fields)) {
                    $params[] = $qid;
                    $sql = "UPDATE quizzes SET " . implode(', ', $fields) . " WHERE id = ?";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute($params);
                }

                $stmt = $pdo->prepare("SELECT * FROM quizzes WHERE id = ?");
                $stmt->execute([$qid]);
                $quiz = $stmt->fetch();
                if (!$quiz) {
                    errorResponse('Quiz tidak ditemukan', 404);
                }

                $quiz['options'] = json_decode($quiz['options'], true);
                $quiz['answer'] = (int)$quiz['answer'];
                $quiz['order'] = (int)$quiz['order_num'];
                unset($quiz['order_num']);

                jsonResponse(['quiz' => $quiz]);
            }

            // DELETE /api/modules/:id/quizzes/:qid (Admin only)
            if ($method === 'DELETE' && count($parts) === 3) {
                requireRole('ADMIN');
                $qid = $parts[2];
                $stmt = $pdo->prepare("DELETE FROM quizzes WHERE id = ?");
                $stmt->execute([$qid]);
                jsonResponse(['success' => true]);
            }
        }

        // Single module detail: GET /api/modules/:id
        if ($method === 'GET' && count($parts) === 1) {
            authenticate();

            $stmt = $pdo->prepare("SELECT * FROM modules WHERE id = ? OR slug = ?");
            $stmt->execute([$moduleId, $moduleId]);
            $mod = $stmt->fetch();

            if (!$mod) {
                errorResponse('Modul tidak ditemukan', 404);
            }

            $mod['topics'] = json_decode($mod['topics'], true) ?: [];
            $mod['lesson'] = json_decode($mod['lesson'], true) ?: [];
            $mod['order'] = (int)$mod['order_num'];
            unset($mod['order_num']);

            // Fetch quizzes
            $qStmt = $pdo->prepare("SELECT * FROM quizzes WHERE moduleId = ? ORDER BY order_num ASC");
            $qStmt->execute([$mod['id']]);
            $quizzesRaw = $qStmt->fetchAll();

            $mod['quizzes'] = array_map(function ($q) {
                $opts = json_decode($q['options'], true);
                return [
                    'id'          => $q['id'],
                    'moduleId'    => $q['moduleId'],
                    'question'    => $q['question'],
                    'options'     => is_array($opts) ? $opts : [],
                    'answer'      => (int)$q['answer'],
                    'explanation' => $q['explanation'],
                    'difficulty'  => $q['difficulty'],
                    'order'       => (int)$q['order_num'],
                ];
            }, $quizzesRaw);

            jsonResponse(['module' => $mod]);
        }

        // PUT /api/modules/:id (Admin only)
        if ($method === 'PUT' && count($parts) === 1) {
            requireRole('ADMIN');
            $body = getBody();

            $fields = [];
            $params = [];

            if (isset($body['title'])) {
                $fields[] = "title = ?";
                $params[] = trim($body['title']);
            }
            if (isset($body['topics'])) {
                $fields[] = "topics = ?";
                $params[] = json_encode($body['topics'], JSON_UNESCAPED_UNICODE);
            }
            if (isset($body['order'])) {
                $fields[] = "order_num = ?";
                $params[] = (int)$body['order'];
            }
            if (isset($body['lesson'])) {
                $fields[] = "lesson = ?";
                $params[] = json_encode($body['lesson'], JSON_UNESCAPED_UNICODE);
            }

            if (!empty($fields)) {
                $params[] = $moduleId;
                $sql = "UPDATE modules SET " . implode(', ', $fields) . " WHERE id = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
            }

            $stmt = $pdo->prepare("SELECT * FROM modules WHERE id = ?");
            $stmt->execute([$moduleId]);
            $mod = $stmt->fetch();
            if (!$mod) {
                errorResponse('Modul tidak ditemukan', 404);
            }

            $mod['topics'] = json_decode($mod['topics'], true);
            $mod['lesson'] = json_decode($mod['lesson'], true);
            $mod['order'] = (int)$mod['order_num'];
            unset($mod['order_num']);

            jsonResponse(['module' => $mod]);
        }

        // DELETE /api/modules/:id (Admin only)
        if ($method === 'DELETE' && count($parts) === 1) {
            requireRole('ADMIN');
            $stmt = $pdo->prepare("DELETE FROM modules WHERE id = ?");
            $stmt->execute([$moduleId]);
            jsonResponse(['success' => true]);
        }
    }

    errorResponse('Endpoint modules tidak ditemukan', 404);
}
