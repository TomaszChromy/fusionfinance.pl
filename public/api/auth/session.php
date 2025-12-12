<?php
/**
 * Fallback session endpoint for static export
 * Returns empty session (not authenticated) for NextAuth compatibility
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Return empty session (user not logged in)
// This prevents JavaScript errors on static hosting
echo json_encode([]);

