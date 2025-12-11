<?php
/**
 * FusionFinance.pl - Visit Counter API
 * Prosty licznik odwiedzin zapisujący dane w pliku JSON
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Cache-Control: no-cache, no-store, must-revalidate');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Plik z danymi licznika
$counterFile = __DIR__ . '/counter_data.json';

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
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
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

if ($action === 'count') {
    // Zlicz nową wizytę
    $visitorHash = getVisitorIP();
    
    // Sprawdź czy to unikalna wizyta dzisiaj
    if (!in_array($visitorHash, $data['unique_today'])) {
        $data['total']++;
        $data['today']++;
        $data['unique_today'][] = $visitorHash;
        
        // Ogranicz tablicę unikalnych do 10000 wpisów
        if (count($data['unique_today']) > 10000) {
            $data['unique_today'] = array_slice($data['unique_today'], -5000);
        }
        
        saveCounterData($counterFile, $data);
    }
}

// Zwróć dane (bez wrażliwych informacji)
echo json_encode([
    'success' => true,
    'total' => $data['total'],
    'today' => $data['today'],
    'date' => $data['date']
]);

