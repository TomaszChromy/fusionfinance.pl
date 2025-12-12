<?php
/**
 * CRON Job - Aktualizacja kursów walut i danych rynkowych co 15 minut
 * 
 * Konfiguracja na nazwa.pl:
 * */15 * * * * /usr/bin/php /home/USER/domains/fusionfinance.pl/public_html/api/cron_rates.php
 */

header('Content-Type: application/json; charset=utf-8');

$CRON_SECRET_KEY = 'ff_cron_rates_2024';

if (isset($_GET['key']) && $_GET['key'] !== $CRON_SECRET_KEY) {
    http_response_code(403);
    die(json_encode(['error' => 'Invalid key']));
}

$cacheFile = __DIR__ . '/rates_cache.json';
$logFile = __DIR__ . '/cron_rates_log.txt';

function logMsg($msg) {
    global $logFile;
    file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] $msg\n", FILE_APPEND | LOCK_EX);
}

function fetchJson($url) {
    $context = stream_context_create([
        'http' => ['timeout' => 15, 'user_agent' => 'FusionFinance/1.0']
    ]);
    $content = @file_get_contents($url, false, $context);
    return $content ? json_decode($content, true) : null;
}

$startTime = microtime(true);
logMsg("=== CRON RATES START ===");

$data = [
    'lastUpdate' => date('c'),
    'currencies' => [],
    'crypto' => [],
];

// 1. Kursy walut z NBP (Tabela A)
$nbpUrl = 'https://api.nbp.pl/api/exchangerates/tables/A?format=json';
$nbpData = fetchJson($nbpUrl);

if ($nbpData && isset($nbpData[0]['rates'])) {
    $rates = [];
    foreach ($nbpData[0]['rates'] as $rate) {
        $rates[$rate['code']] = [
            'code' => $rate['code'],
            'currency' => $rate['currency'],
            'mid' => $rate['mid'],
        ];
    }
    $data['currencies'] = [
        'date' => $nbpData[0]['effectiveDate'],
        'table' => $nbpData[0]['no'],
        'rates' => $rates,
    ];
    logMsg("OK: NBP - " . count($rates) . " currencies");
} else {
    logMsg("ERROR: NBP fetch failed");
}

// 2. Kryptowaluty z CoinGecko
$cryptoUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple,cardano,dogecoin,polkadot,avalanche-2,chainlink,litecoin&vs_currencies=usd,pln&include_24hr_change=true&include_market_cap=true';
$cryptoData = fetchJson($cryptoUrl);

if ($cryptoData) {
    $cryptoList = [
        'bitcoin' => 'BTC', 'ethereum' => 'ETH', 'solana' => 'SOL', 
        'ripple' => 'XRP', 'cardano' => 'ADA', 'dogecoin' => 'DOGE',
        'polkadot' => 'DOT', 'avalanche-2' => 'AVAX', 'chainlink' => 'LINK', 'litecoin' => 'LTC'
    ];
    foreach ($cryptoData as $id => $info) {
        $symbol = $cryptoList[$id] ?? strtoupper($id);
        $data['crypto'][$symbol] = [
            'id' => $id,
            'symbol' => $symbol,
            'usd' => $info['usd'] ?? 0,
            'pln' => $info['pln'] ?? 0,
            'change24h' => $info['usd_24h_change'] ?? 0,
            'marketCap' => $info['usd_market_cap'] ?? 0,
        ];
    }
    logMsg("OK: CoinGecko - " . count($data['crypto']) . " cryptos");
} else {
    logMsg("ERROR: CoinGecko fetch failed");
}

// Zapisz cache
$result = file_put_contents($cacheFile, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);

$duration = round((microtime(true) - $startTime) * 1000);
logMsg("=== CRON RATES END === Duration: {$duration}ms");

echo json_encode([
    'success' => $result !== false,
    'lastUpdate' => date('c'),
    'currencies' => count($data['currencies']['rates'] ?? []),
    'crypto' => count($data['crypto']),
    'duration' => $duration . 'ms',
]);

