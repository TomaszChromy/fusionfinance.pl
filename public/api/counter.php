<?php
/**
 * FusionFinance.pl - Visit Counter API
 * Prosty licznik odwiedzin zapisujący dane w pliku JSON
 */

// Error reporting dla debugowania
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Plik z danymi licznika - upewnij się że folder istnieje i jest zapisywalny
$counterFile = __DIR__ . '/counter_data.json';

// Debug mode
$debug = isset($_GET['debug']) && $_GET['debug'] === '1';

// Inicjalizacja danych
function initCounterData() {
    return [
        'total' => 0,
        'today' => 0,
        'date' => date('Y-m-d'),
        'unique_today' => [],
        'last_updated' => time()
    ];
}

// Wczytaj dane
function loadCounterData($file) {
    if (!file_exists($file)) {
        return initCounterData();
    }
    
    $data = json_decode(file_get_contents($file), true);
    if (!$data) {
        return initCounterData();
    }
    
    // Reset dziennego licznika jeśli nowy dzień
    if ($data['date'] !== date('Y-m-d')) {
        $data['today'] = 0;
        $data['date'] = date('Y-m-d');
        $data['unique_today'] = [];
    }
    
    return $data;
}

// Zapisz dane
function saveCounterData($file, $data) {
    $data['last_updated'] = time();
    $result = @file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT), LOCK_EX);
    return $result !== false;
}

// Pobierz IP odwiedzającego
function getVisitorIP() {
    $ip = '';
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }
    return md5($ip . date('Y-m-d')); // Hash dla prywatności
}

// Główna logika
$data = loadCounterData($counterFile);
$action = $_GET['action'] ?? $_POST['action'] ?? 'get';

$saved = false;
$isNewVisit = false;

if ($action === 'count') {
    // Zlicz nową wizytę
    $visitorHash = getVisitorIP();

    // Sprawdź czy to unikalna wizyta dzisiaj
    if (!in_array($visitorHash, $data['unique_today'])) {
        $data['total']++;
        $data['today']++;
        $data['unique_today'][] = $visitorHash;
        $isNewVisit = true;

        // Ogranicz tablicę unikalnych do 10000 wpisów
        if (count($data['unique_today']) > 10000) {
            $data['unique_today'] = array_slice($data['unique_today'], -5000);
        }

        $saved = saveCounterData($counterFile, $data);
    }
}

// Odpowiedź
$response = [
    'success' => true,
    'total' => $data['total'],
    'today' => $data['today'],
    'date' => $data['date']
];

// Debug info
if ($debug) {
    $response['debug'] = [
        'action' => $action,
        'isNewVisit' => $isNewVisit,
        'saved' => $saved,
        'file' => $counterFile,
        'fileExists' => file_exists($counterFile),
        'fileWritable' => is_writable(dirname($counterFile)),
        'visitorHash' => isset($visitorHash) ? substr($visitorHash, 0, 8) . '...' : null,
    ];
}

echo json_encode($response);

