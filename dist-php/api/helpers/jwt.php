<?php

class JWT {
    /**
     * Encode payload to JWT token (HS256)
     */
    public static function encode(array $payload, string $secret, int $expirySeconds = 604800): string {
        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];

        // Add standard exp and iat claims if not set
        if (!isset($payload['iat'])) {
            $payload['iat'] = time();
        }
        if (!isset($payload['exp'])) {
            $payload['exp'] = time() + $expirySeconds;
        }

        $base64UrlHeader = self::base64UrlEncode(json_encode($header));
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));

        $signature = hash_hmac('sha256', $base64UrlHeader . '.' . $base64UrlPayload, $secret, true);
        $base64UrlSignature = self::base64UrlEncode($signature);

        return $base64UrlHeader . '.' . $base64UrlPayload . '.' . $base64UrlSignature;
    }

    /**
     * Decode and verify JWT token. Returns payload array or null if invalid/expired.
     */
    public static function decode(string $token, string $secret): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$base64UrlHeader, $base64UrlPayload, $base64UrlSignature] = $parts;

        $headerJson = self::base64UrlDecode($base64UrlHeader);
        $header = json_decode($headerJson, true);
        if (!$header || ($header['alg'] ?? '') !== 'HS256') {
            return null;
        }

        // Verify signature
        $expectedSignature = hash_hmac('sha256', $base64UrlHeader . '.' . $base64UrlPayload, $secret, true);
        $actualSignature = self::base64UrlDecode($base64UrlSignature);

        if (!hash_equals($expectedSignature, $actualSignature)) {
            return null;
        }

        $payloadJson = self::base64UrlDecode($base64UrlPayload);
        $payload = json_decode($payloadJson, true);
        if (!$payload) {
            return null;
        }

        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }

    private static function base64UrlEncode(string $data): string {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    private static function base64UrlDecode(string $data): string {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
    }
}
