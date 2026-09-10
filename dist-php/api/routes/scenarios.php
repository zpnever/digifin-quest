<?php
require_once __DIR__ . '/../helpers/db.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

function handleScenarioRoutes(string $method, string $subPath): void {
    $pdo = Database::getConnection();
    $subPath = trim($subPath, '/');
    $parts = $subPath ? explode('/', $subPath) : [];

    // ================= SIM EVENTS =================
    // Sub-path starting with sim-events: /api/scenarios/sim-events...
    if (!empty($parts) && $parts[0] === 'sim-events') {
        // GET /api/scenarios/sim-events
        if ($method === 'GET' && count($parts) === 1) {
            authenticate();

            $stmt = $pdo->query("SELECT * FROM sim_events ORDER BY order_num ASC");
            $rows = $stmt->fetchAll();

            $events = array_map(function ($ev) {
                $choices = json_decode($ev['choices'], true);
                return [
                    'id'      => $ev['id'],
                    'slug'    => $ev['slug'],
                    'theme'   => $ev['theme'],
                    'icon'    => $ev['icon'],
                    'text'    => $ev['text'],
                    'choices' => is_array($choices) ? $choices : [],
                    'order'   => (int)$ev['order_num'],
                ];
            }, $rows);

            jsonResponse(['events' => $events]);
        }

        // POST /api/scenarios/sim-events (Admin only)
        if ($method === 'POST' && count($parts) === 1) {
            requireRole('ADMIN');
            $body = getBody();
            $slug = trim($body['slug'] ?? '');
            $theme = trim($body['theme'] ?? '');
            $icon = trim($body['icon'] ?? '');
            $text = trim($body['text'] ?? '');
            $choices = $body['choices'] ?? null;
            $order = isset($body['order']) ? (int)$body['order'] : 0;

            if (!$slug || !$theme || !$icon || !$text || !$choices) {
                errorResponse('slug, theme, icon, text, dan choices wajib diisi', 400);
            }

            $checkStmt = $pdo->prepare("SELECT id FROM sim_events WHERE slug = ?");
            $checkStmt->execute([$slug]);
            if ($checkStmt->fetch()) {
                errorResponse('Slug sudah digunakan', 409);
            }

            $id = uuid_v4();
            $choicesJson = json_encode($choices, JSON_UNESCAPED_UNICODE);

            $stmt = $pdo->prepare("INSERT INTO sim_events (id, slug, theme, icon, text, choices, order_num) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$id, $slug, $theme, $icon, $text, $choicesJson, $order]);

            jsonResponse([
                'event' => [
                    'id'      => $id,
                    'slug'    => $slug,
                    'theme'   => $theme,
                    'icon'    => $icon,
                    'text'    => $text,
                    'choices' => $choices,
                    'order'   => $order,
                ]
            ], 201);
        }

        // PUT /api/scenarios/sim-events/:id (Admin only)
        if ($method === 'PUT' && count($parts) === 2) {
            requireRole('ADMIN');
            $id = $parts[1];
            $body = getBody();

            $fields = [];
            $params = [];

            if (isset($body['theme'])) {
                $fields[] = "theme = ?";
                $params[] = trim($body['theme']);
            }
            if (isset($body['icon'])) {
                $fields[] = "icon = ?";
                $params[] = trim($body['icon']);
            }
            if (isset($body['text'])) {
                $fields[] = "text = ?";
                $params[] = trim($body['text']);
            }
            if (isset($body['choices'])) {
                $fields[] = "choices = ?";
                $params[] = json_encode($body['choices'], JSON_UNESCAPED_UNICODE);
            }
            if (isset($body['order'])) {
                $fields[] = "order_num = ?";
                $params[] = (int)$body['order'];
            }

            if (!empty($fields)) {
                $params[] = $id;
                $sql = "UPDATE sim_events SET " . implode(', ', $fields) . " WHERE id = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
            }

            $stmt = $pdo->prepare("SELECT * FROM sim_events WHERE id = ?");
            $stmt->execute([$id]);
            $ev = $stmt->fetch();
            if (!$ev) {
                errorResponse('Sim event tidak ditemukan', 404);
            }

            $ev['choices'] = json_decode($ev['choices'], true);
            $ev['order'] = (int)$ev['order_num'];
            unset($ev['order_num']);

            jsonResponse(['event' => $ev]);
        }

        // DELETE /api/scenarios/sim-events/:id (Admin only)
        if ($method === 'DELETE' && count($parts) === 2) {
            requireRole('ADMIN');
            $id = $parts[1];
            $stmt = $pdo->prepare("DELETE FROM sim_events WHERE id = ?");
            $stmt->execute([$id]);
            jsonResponse(['success' => true]);
        }
    }

    // ================= SCENARIOS =================
    // GET /api/scenarios
    if ($method === 'GET' && empty($parts)) {
        authenticate();

        $stmt = $pdo->query("SELECT * FROM scenarios ORDER BY order_num ASC");
        $rows = $stmt->fetchAll();

        $scenarios = array_map(function ($sc) {
            $choices = json_decode($sc['choices'], true);
            return [
                'id'        => $sc['id'],
                'slug'      => $sc['slug'],
                'theme'     => $sc['theme'],
                'situation' => $sc['situation'],
                'choices'   => is_array($choices) ? $choices : [],
                'order'     => (int)$sc['order_num'],
            ];
        }, $rows);

        jsonResponse(['scenarios' => $scenarios]);
    }

    // POST /api/scenarios (Admin only)
    if ($method === 'POST' && empty($parts)) {
        requireRole('ADMIN');
        $body = getBody();
        $slug = trim($body['slug'] ?? '');
        $theme = trim($body['theme'] ?? '');
        $situation = trim($body['situation'] ?? '');
        $choices = $body['choices'] ?? null;
        $order = isset($body['order']) ? (int)$body['order'] : 0;

        if (!$slug || !$theme || !$situation || !$choices) {
            errorResponse('slug, theme, situation, dan choices wajib diisi', 400);
        }

        $checkStmt = $pdo->prepare("SELECT id FROM scenarios WHERE slug = ?");
        $checkStmt->execute([$slug]);
        if ($checkStmt->fetch()) {
            errorResponse('Slug sudah digunakan', 409);
        }

        $id = uuid_v4();
        $choicesJson = json_encode($choices, JSON_UNESCAPED_UNICODE);

        $stmt = $pdo->prepare("INSERT INTO scenarios (id, slug, theme, situation, choices, order_num) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $slug, $theme, $situation, $choicesJson, $order]);

        jsonResponse([
            'scenario' => [
                'id'        => $id,
                'slug'      => $slug,
                'theme'     => $theme,
                'situation' => $situation,
                'choices'   => $choices,
                'order'     => $order,
            ]
        ], 201);
    }

    // PUT /api/scenarios/:id (Admin only)
    if ($method === 'PUT' && count($parts) === 1) {
        requireRole('ADMIN');
        $id = $parts[0];
        $body = getBody();

        $fields = [];
        $params = [];

        if (isset($body['theme'])) {
            $fields[] = "theme = ?";
            $params[] = trim($body['theme']);
        }
        if (isset($body['situation'])) {
            $fields[] = "situation = ?";
            $params[] = trim($body['situation']);
        }
        if (isset($body['choices'])) {
            $fields[] = "choices = ?";
            $params[] = json_encode($body['choices'], JSON_UNESCAPED_UNICODE);
        }
        if (isset($body['order'])) {
            $fields[] = "order_num = ?";
            $params[] = (int)$body['order'];
        }

        if (!empty($fields)) {
            $params[] = $id;
            $sql = "UPDATE scenarios SET " . implode(', ', $fields) . " WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }

        $stmt = $pdo->prepare("SELECT * FROM scenarios WHERE id = ?");
        $stmt->execute([$id]);
        $sc = $stmt->fetch();
        if (!$sc) {
            errorResponse('Skenario tidak ditemukan', 404);
        }

        $sc['choices'] = json_decode($sc['choices'], true);
        $sc['order'] = (int)$sc['order_num'];
        unset($sc['order_num']);

        jsonResponse(['scenario' => $sc]);
    }

    // DELETE /api/scenarios/:id (Admin only)
    if ($method === 'DELETE' && count($parts) === 1) {
        requireRole('ADMIN');
        $id = $parts[0];
        $stmt = $pdo->prepare("DELETE FROM scenarios WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
    }

    errorResponse('Endpoint scenarios tidak ditemukan', 404);
}
