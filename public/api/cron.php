<?php
/**
 * CRON Job - Aktualizacja artykułów RSS co 15 minut
 * 
 * Konfiguracja na nazwa.pl:
 * 1. Panel DirectAdmin -> Zaplanowane zadania (Cron Jobs)
 * 2. Dodaj nowe zadanie: */15 * * * * /usr/bin/php /home/USER/domains/fusionfinance.pl/public_html/api/cron.php
 * 3. Lub przez wget: */15 * * * * wget -q -O /dev/null https://fusionfinance.pl/api/cron.php?key=YOUR_SECRET_KEY
 */

header('Content-Type: application/json; charset=utf-8');

// Security key - zmień na własny!
$CRON_SECRET_KEY = 'ff_cron_2024_secret';

// Sprawdź klucz bezpieczeństwa (opcjonalne dla wywołań wget)
if (isset($_GET['key']) && $_GET['key'] !== $CRON_SECRET_KEY) {
    http_response_code(403);
    die(json_encode(['error' => 'Invalid key']));
}

// Plik cache
$cacheFile = __DIR__ . '/articles_cache.json';
$logFile = __DIR__ . '/cron_log.txt';

// RSS Feeds
$RSS_FEEDS = [
    ['url' => 'https://www.bankier.pl/rss/wiadomosci.xml', 'source' => 'Bankier.pl', 'category' => 'Finanse'],
    ['url' => 'https://www.money.pl/rss/rss.xml', 'source' => 'Money.pl', 'category' => 'Gospodarka'],
    ['url' => 'https://www.parkiet.com/rss.xml', 'source' => 'Parkiet', 'category' => 'Giełda'],
    ['url' => 'https://stooq.pl/rss/', 'source' => 'Stooq', 'category' => 'Rynki'],
    ['url' => 'https://www.pb.pl/rss/wszystkie_artykuly.xml', 'source' => 'Puls Biznesu', 'category' => 'Biznes'],
    ['url' => 'https://businessinsider.com.pl/rss', 'source' => 'Business Insider', 'category' => 'Biznes'],
    ['url' => 'https://forsal.pl/rss.xml', 'source' => 'Forsal', 'category' => 'Gospodarka'],
    ['url' => 'https://next.gazeta.pl/pub/rss/next_news.xml', 'source' => 'Next Gazeta', 'category' => 'Technologia'],
];

function logMessage($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND | LOCK_EX);
}

function fetchRSSFeed($url, $source, $category) {
    $context = stream_context_create([
        'http' => [
            'timeout' => 10,
            'user_agent' => 'FusionFinance RSS Aggregator/1.0'
        ]
    ]);
    
    $content = @file_get_contents($url, false, $context);
    if (!$content) {
        logMessage("ERROR: Failed to fetch $source ($url)");
        return [];
    }
    
    libxml_use_internal_errors(true);
    $xml = simplexml_load_string($content);
    if (!$xml) {
        logMessage("ERROR: Failed to parse XML from $source");
        return [];
    }
    
    $articles = [];
    $items = $xml->channel->item ?? $xml->item ?? [];
    
    foreach ($items as $item) {
        $title = trim((string)($item->title ?? ''));
        $link = trim((string)($item->link ?? ''));
        $description = strip_tags(trim((string)($item->description ?? '')));
        $pubDate = (string)($item->pubDate ?? date('r'));
        
        if (empty($title) || empty($link)) continue;
        
        // Ogranicz opis
        if (strlen($description) > 300) {
            $description = substr($description, 0, 297) . '...';
        }
        
        // Wyciągnij obrazek
        $image = '';
        if (isset($item->enclosure['url'])) {
            $image = (string)$item->enclosure['url'];
        } elseif (preg_match('/<img[^>]+src=["\']([^"\']+)["\']/', (string)$item->description, $matches)) {
            $image = $matches[1];
        }
        
        $articles[] = [
            'id' => md5($link),
            'title' => $title,
            'description' => $description,
            'link' => $link,
            'source' => $source,
            'category' => $category,
            'pubDate' => $pubDate,
            'timestamp' => strtotime($pubDate),
            'image' => $image,
        ];
    }
    
    logMessage("OK: Fetched " . count($articles) . " articles from $source");
    return $articles;
}

// Główna logika
$startTime = microtime(true);
logMessage("=== CRON START ===");

$allArticles = [];

foreach ($RSS_FEEDS as $feed) {
    $articles = fetchRSSFeed($feed['url'], $feed['source'], $feed['category']);
    $allArticles = array_merge($allArticles, $articles);
}

// Sortuj po dacie (najnowsze pierwsze)
usort($allArticles, function($a, $b) {
    return $b['timestamp'] - $a['timestamp'];
});

// Usuń duplikaty po tytule
$seen = [];
$uniqueArticles = [];
foreach ($allArticles as $article) {
    $titleHash = md5(strtolower($article['title']));
    if (!isset($seen[$titleHash])) {
        $seen[$titleHash] = true;
        $uniqueArticles[] = $article;
    }
}

// Ogranicz do 200 artykułów
$uniqueArticles = array_slice($uniqueArticles, 0, 200);

// Zapisz cache
$cacheData = [
    'lastUpdate' => date('c'),
    'articlesCount' => count($uniqueArticles),
    'articles' => $uniqueArticles,
];

$result = file_put_contents($cacheFile, json_encode($cacheData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);

$duration = round((microtime(true) - $startTime) * 1000);
logMessage("=== CRON END === Duration: {$duration}ms, Articles: " . count($uniqueArticles));

// Response
echo json_encode([
    'success' => $result !== false,
    'lastUpdate' => date('c'),
    'articlesCount' => count($uniqueArticles),
    'duration' => $duration . 'ms',
    'sources' => count($RSS_FEEDS),
]);

