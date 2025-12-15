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

// RSS Feeds - rozszerzone źródła polskie
$RSS_FEEDS = [
    // Główne portale finansowe
    ['url' => 'https://www.bankier.pl/rss/wiadomosci.xml', 'source' => 'Bankier.pl', 'category' => 'Finanse'],
    ['url' => 'https://www.bankier.pl/rss/gielda.xml', 'source' => 'Bankier.pl', 'category' => 'Giełda'],
    ['url' => 'https://www.money.pl/rss/rss.xml', 'source' => 'Money.pl', 'category' => 'Gospodarka'],
    ['url' => 'https://www.parkiet.com/rss/parkiet.xml', 'source' => 'Parkiet', 'category' => 'Giełda'],
    ['url' => 'https://stooq.pl/rss/', 'source' => 'Stooq', 'category' => 'Rynki'],
    ['url' => 'https://www.pb.pl/rss/wszystko', 'source' => 'Puls Biznesu', 'category' => 'Biznes'],
    ['url' => 'https://businessinsider.com.pl/feed', 'source' => 'Business Insider', 'category' => 'Biznes'],
    ['url' => 'https://forsal.pl/rss.xml', 'source' => 'Forsal', 'category' => 'Gospodarka'],
    // GPW oficjalne
    ['url' => 'https://www.gpw.pl/rss_aktualnosci', 'source' => 'GPW', 'category' => 'Giełda'],
    ['url' => 'https://www.gpw.pl/rss_komunikaty', 'source' => 'GPW', 'category' => 'Giełda'],
    // Dodatkowe źródła
    ['url' => 'https://biznesalert.pl/feed/', 'source' => 'BiznesAlert', 'category' => 'Energia'],
    ['url' => 'https://www.wnp.pl/rss/serwis.xml', 'source' => 'WNP.pl', 'category' => 'Przemysł'],
    ['url' => 'https://biznes.interia.pl/feed', 'source' => 'Interia Biznes', 'category' => 'Biznes'],
    ['url' => 'https://www.rp.pl/rss/ekonomia', 'source' => 'Rzeczpospolita', 'category' => 'Ekonomia'],
    ['url' => 'https://mybank.pl/news/wiadomosci-rss.xml', 'source' => 'MyBank', 'category' => 'Finanse'],
];

function logMessage($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND | LOCK_EX);
}

// Równoległe pobieranie RSS z curl_multi (znacznie szybsze!)
function fetchAllRSSParallel($feeds) {
    if (!function_exists('curl_multi_init')) {
        // Fallback do sekwencyjnego
        $results = [];
        foreach ($feeds as $feed) {
            $results[] = ['feed' => $feed, 'content' => fetchSingleRSS($feed['url'])];
        }
        return $results;
    }

    $multiHandle = curl_multi_init();
    $handles = [];

    foreach ($feeds as $index => $feed) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $feed['url'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_USERAGENT => 'FusionFinance RSS Aggregator/1.0',
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_HTTPHEADER => ['Accept: application/rss+xml, application/xml, text/xml']
        ]);
        curl_multi_add_handle($multiHandle, $ch);
        $handles[$index] = $ch;
    }

    // Wykonaj równolegle
    $running = null;
    do {
        curl_multi_exec($multiHandle, $running);
        curl_multi_select($multiHandle);
    } while ($running > 0);

    // Zbierz wyniki
    $results = [];
    foreach ($handles as $index => $ch) {
        $content = curl_multi_getcontent($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_multi_remove_handle($multiHandle, $ch);

        $results[] = [
            'feed' => $feeds[$index],
            'content' => ($content !== false && $httpCode === 200) ? $content : null
        ];
    }

    curl_multi_close($multiHandle);
    return $results;
}

function fetchSingleRSS($url) {
    $context = stream_context_create([
        'http' => [
            'timeout' => 8,
            'user_agent' => 'FusionFinance RSS Aggregator/1.0'
        ]
    ]);
    return @file_get_contents($url, false, $context);
}

function parseRSSContent($content, $source, $category) {
    if (!$content) {
        logMessage("ERROR: Failed to fetch $source");
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

        if (strlen($description) > 300) {
            $description = substr($description, 0, 297) . '...';
        }

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
logMessage("=== CRON START (parallel fetch) ===");

$allArticles = [];

// Pobierz wszystkie feedy równolegle
$results = fetchAllRSSParallel($RSS_FEEDS);

foreach ($results as $result) {
    $articles = parseRSSContent(
        $result['content'],
        $result['feed']['source'],
        $result['feed']['category']
    );
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

