<?php
/**
 * FusionFinance.pl - RSS Proxy API
 * Konwertuje RSS feeds na JSON dla frontendu
 *
 * Użycie: /api/rss.php?feed=rynki&limit=10
 *
 * Cache: Artykuły są aktualizowane przez cron.php co 15 minut
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Cache-Control: public, max-age=300'); // 5 min cache

// Sprawdź czy jest dostępny cache z crona
$cacheFile = __DIR__ . '/articles_cache.json';
$useCache = file_exists($cacheFile) && (time() - filemtime($cacheFile)) < 900; // Cache ważny 15 min

if ($useCache && isset($_GET['feed']) && $_GET['feed'] === 'all') {
    // Serwuj z cache dla feedu 'all'
    $cacheData = json_decode(file_get_contents($cacheFile), true);
    if ($cacheData && isset($cacheData['articles'])) {
        $limit = isset($_GET['limit']) ? min(intval($_GET['limit']), 100) : 10;
        $articles = array_slice($cacheData['articles'], 0, $limit);
        echo json_encode([
            'success' => true,
            'source' => 'cache',
            'lastUpdate' => $cacheData['lastUpdate'] ?? date('c'),
            'count' => count($articles),
            'articles' => $articles,
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

// Definicja feedów RSS - rozszerzone źródła polskie
// Źródła: GPW oficjalne, Bankier.pl, Money.pl, Parkiet.com, Puls Biznesu,
//         Business Insider PL, Stooq, WNP.pl, Forsal.pl, Rzeczpospolita, Interia Biznes
$feeds = [
    // Rynki finansowe ogólnie - szeroki przekrój
    'rynki' => [
        'https://www.bankier.pl/rss/wiadomosci.xml',
        'https://www.money.pl/rss/rss.xml',
        'https://businessinsider.com.pl/feed',
        'https://www.pb.pl/rss/wszystko',
        'https://biznesalert.pl/feed/',
        'https://www.wnp.pl/rss/serwis.xml',
        'https://forsal.pl/rss.xml',
        'https://www.rp.pl/rss/ekonomia',
        'https://biznes.interia.pl/feed',
    ],
    // Giełda - GPW, akcje, spółki, notowania
    'gielda' => [
        'https://www.gpw.pl/rss_aktualnosci',
        'https://www.gpw.pl/rss_komunikaty',
        'https://www.bankier.pl/rss/gielda.xml',
        'https://www.parkiet.com/rss/parkiet.xml',
        'https://stooq.pl/rss/',
        'https://www.money.pl/rss/gielda.xml',
        'https://www.pb.pl/rss/gielda',
        'https://businessinsider.com.pl/gielda/feed',
        'https://mybank.pl/news/wiadomosci-gielda-rss.xml',
    ],
    // Kryptowaluty - Bitcoin, Ethereum, blockchain
    'crypto' => [
        'https://mybank.pl/news/wiadomosci-kryptowaluty-rss.xml',
        'https://www.bankier.pl/rss/wiadomosci.xml',
        'https://businessinsider.com.pl/feed',
        'https://www.money.pl/rss/rss.xml',
        'https://forsal.pl/feed',
        'https://biznes.interia.pl/feed',
    ],
    // Waluty - Forex, kursy walut, NBP
    'waluty' => [
        'https://www.bankier.pl/rss/waluty.xml',
        'https://www.money.pl/rss/waluty.xml',
        'https://forsal.pl/rss/waluty.xml',
        'https://mybank.pl/news/wiadomosci-rss.xml',
    ],
    // Analizy - prognozy, rekomendacje, raporty
    'analizy' => [
        'https://www.parkiet.com/rss/parkiet.xml',
        'https://www.pb.pl/rss/wszystko',
        'https://biznesalert.pl/feed/',
        'https://forsal.pl/rss.xml',
        'https://www.rp.pl/rss/ekonomia',
        'https://businessinsider.com.pl/feed',
    ],
    // Fintech - banki, innowacje finansowe
    'fintech' => [
        'https://www.cashless.pl/rss',
        'https://finanse.wp.pl/rss.xml',
        'https://www.bankier.pl/rss/finanse.xml',
        'https://biznes.interia.pl/feed',
    ],
    // All - wszystkie główne źródła (zoptymalizowane dla szybkości)
    'all' => [
        'https://www.gpw.pl/rss_aktualnosci',
        'https://www.bankier.pl/rss/wiadomosci.xml',
        'https://www.bankier.pl/rss/gielda.xml',
        'https://www.money.pl/rss/rss.xml',
        'https://www.parkiet.com/rss/parkiet.xml',
        'https://businessinsider.com.pl/feed',
        'https://stooq.pl/rss/',
        'https://forsal.pl/rss.xml',
        'https://mybank.pl/news/wiadomosci-rss.xml',
    ],
];

// Filtry słów kluczowych dla każdej kategorii
$categoryFilters = [
    'rynki' => [
        'include' => ['rynek', 'giełd', 'indeks', 'wig', 'nasdaq', 'dow jones', 's&p', 'dax', 'ftse',
                      'obligacj', 'bond', 'stopy procentowe', 'nbp', 'fed', 'ecb', 'inflacj', 'pkb',
                      'gospodark', 'ekonom', 'finans', 'inwestycj', 'kapitał', 'notowani'],
        'exclude' => []
    ],
    'gielda' => [
        'include' => ['gpw', 'wig', 'wig20', 'mwig', 'swig', 'akcj', 'spółk', 'notowani', 'giełd',
                      'indeks', 'dywidend', 'ipo', 'emisj', 'walne', 'raport', 'kurs akcji',
                      'wzrost', 'spadek', 'sesj', 'parkiet', 'newconnect', 'debiut', 'inwestor',
                      'portfel', 'zleceni', 'obrót', 'kapitalizacj'],
        'exclude' => ['bitcoin', 'ethereum', 'kryptowalut', 'btc', 'eth']
    ],
    'crypto' => [
        'include' => ['bitcoin', 'btc', 'ethereum', 'eth', 'kryptowalut', 'crypto', 'blockchain',
                      'token', 'nft', 'defi', 'altcoin', 'binance', 'mining', 'halving',
                      'stablecoin', 'solana', 'cardano', 'xrp', 'ripple', 'dogecoin', 'doge',
                      'coinbase', 'ledger', 'wallet', 'krypto', 'cyfrowa waluta', 'web3'],
        'exclude' => []
    ],
    'waluty' => [
        'include' => ['eur/pln', 'usd/pln', 'gbp/pln', 'chf/pln', 'walut', 'forex', 'kurs walut',
                      'złot', 'dolar', 'euro', 'frank', 'jen', 'funt', 'nbp', 'kantor', 'pln',
                      'wymian', 'dewiz', 'spread', 'fx', 'para walut'],
        'exclude' => ['bitcoin', 'ethereum', 'kryptowalut', 'btc', 'eth', 'krypto']
    ],
    'analizy' => [
        'include' => ['analiz', 'prognoz', 'rekomendacj', 'raport', 'perspektyw', 'outlook',
                      'wycen', 'wskaźnik', 'trend', 'komentarz', 'strategia', 'ekspert',
                      'przewidywani', 'scenariusz', 'ocena', 'rating', 'research'],
        'exclude' => []
    ],
    'fintech' => [
        'include' => ['fintech', 'bank', 'płatnoś', 'przelew', 'konto', 'aplikacj', 'mobiln',
                      'cyfrowy', 'startup', 'innowacj', 'blik', 'revolut', 'neobank', 'paypal',
                      'visa', 'mastercard', 'kredyt', 'pożyczk', 'leasing'],
        'exclude' => []
    ],
];

// Parametry
$feedType = isset($_GET['feed']) ? $_GET['feed'] : 'rynki';
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
$limit = min($limit, 100); // Max 100 artykułów

// Sprawdź czy feed istnieje
if (!isset($feeds[$feedType])) {
    http_response_code(400);
    echo json_encode(['error' => 'Unknown feed type', 'available' => array_keys($feeds)]);
    exit;
}

// Funkcja równoległego pobierania wielu RSS (curl_multi) - znacznie szybsze!
function fetchMultipleRSS($urls) {
    if (!function_exists('curl_multi_init')) {
        // Fallback do sekwencyjnego pobierania
        $results = [];
        foreach ($urls as $url) {
            $results[$url] = fetchSingleRSS($url);
        }
        return $results;
    }

    $multiHandle = curl_multi_init();
    $handles = [];

    // Przygotuj wszystkie połączenia
    foreach ($urls as $url) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 8, // Skrócony timeout dla szybszego ładowania
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_USERAGENT => 'Mozilla/5.0 (compatible; FusionFinance/1.0)',
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_HTTPHEADER => ['Accept: application/rss+xml, application/xml, text/xml']
        ]);
        curl_multi_add_handle($multiHandle, $ch);
        $handles[$url] = $ch;
    }

    // Wykonaj wszystkie zapytania równolegle
    $running = null;
    do {
        curl_multi_exec($multiHandle, $running);
        curl_multi_select($multiHandle);
    } while ($running > 0);

    // Zbierz wyniki
    $results = [];
    libxml_use_internal_errors(true);

    foreach ($handles as $url => $ch) {
        $content = curl_multi_getcontent($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_multi_remove_handle($multiHandle, $ch);

        if ($content !== false && $httpCode === 200) {
            $xml = simplexml_load_string($content);
            $results[$url] = ($xml !== false) ? $xml : null;
        } else {
            $results[$url] = null;
        }
    }

    curl_multi_close($multiHandle);
    return $results;
}

// Funkcja pobierania pojedynczego RSS (fallback)
function fetchSingleRSS($url) {
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_USERAGENT => 'Mozilla/5.0 (compatible; FusionFinance/1.0)',
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_HTTPHEADER => ['Accept: application/rss+xml, application/xml, text/xml']
        ]);
        $content = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($content === false || $httpCode !== 200) {
            return null;
        }
    } else {
        $context = stream_context_create([
            'http' => [
                'timeout' => 8,
                'user_agent' => 'FusionFinance/1.0 RSS Reader'
            ]
        ]);

        $content = @file_get_contents($url, false, $context);
        if ($content === false) {
            return null;
        }
    }

    libxml_use_internal_errors(true);
    $xml = simplexml_load_string($content);
    return ($xml !== false) ? $xml : null;
}

// Funkcja czyszcząca tekst boilerplate z różnych źródeł
function cleanBoilerplate($text) {
    // Wzorce do usunięcia (money.pl, bankier.pl, inne portale)
    $patterns = [
        // money.pl - info o redakcji, social share, kurs walut
        '/Redakcja money\.pl\d{1,2} [a-ząćęłńóśźż]+ \d{4}, \d{1,2}:\d{2}/iu',
        '/ZAPISZ\s*ZAPISANO\s*UDOSTĘPNIJ[^.]*Udostępnij na X[^.]*Udostępnij na Facebook(u)?/iu',
        '/SKOMENTUJ/iu',
        '/Dźwięk został wygenerowany automatycznie i może zawierać błędy/iu',
        '/Kurs [a-ząćęłńóśźż\s]+ \d{1,2}\.\d{1,2}\.\d{4} - godz\. \d{1,2}:\d{2}[^.]+\./iu',
        '/wobec złotego:\s*[\d,\.]+\s*wobec dolara amerykańskiego:\s*[\d,\.]+/iu',
        // Ogólne wzorce social share
        '/Udostępnij na (Twitter|Facebook|X|LinkedIn)/iu',
        '/Podziel się:\s*(Twitter|Facebook|X)/iu',
        // Bankier.pl
        '/Zapisz artykuł/iu',
        '/Dodaj do ulubionych/iu',
        // Forsal.pl, inne
        '/Czytaj więcej na [a-zA-Z0-9\.\-]+/iu',
        '/Źródło:\s*PAP|Reuters|ISBnews/iu',
        // Puste nawiasy, nadmiarowe spacje
        '/\(\s*\)/u',
        '/\s{2,}/u',
    ];

    foreach ($patterns as $pattern) {
        $text = preg_replace($pattern, ' ', $text);
    }

    // Usuń nadmiarowe spacje i trim
    $text = preg_replace('/\s+/', ' ', $text);
    $text = trim($text);

    return $text;
}

function parseItems($xml, $source) {
    $items = [];

    if (!isset($xml->channel->item)) {
        return $items;
    }

    foreach ($xml->channel->item as $item) {
        // Pobierz obraz z enclosure lub media:content
        $image = null;
        if (isset($item->enclosure['url'])) {
            $image = (string)$item->enclosure['url'];
        }

        // Sprawdź media:content
        $namespaces = $item->getNameSpaces(true);
        if (isset($namespaces['media'])) {
            $media = $item->children($namespaces['media']);
            if (isset($media->content['url'])) {
                $image = (string)$media->content['url'];
            } elseif (isset($media->thumbnail['url'])) {
                $image = (string)$media->thumbnail['url'];
            }
        }

        // Szukaj obrazu w treści
        if (!$image) {
            $content = isset($item->children('content', true)->encoded)
                ? (string)$item->children('content', true)->encoded
                : (string)$item->description;

            if (preg_match('/<img[^>]+src=["\']([^"\']+)["\']/', $content, $matches)) {
                $image = $matches[1];
            }
        }

        // Wyczyść opis z boilerplate
        $description = strip_tags((string)$item->description);
        $description = cleanBoilerplate($description);

        $items[] = [
            'title' => (string)$item->title,
            'link' => (string)$item->link,
            'description' => $description,
            'date' => date('c', strtotime((string)$item->pubDate)),
            'source' => $source,
            'image' => $image
        ];
    }

    return $items;
}

// Funkcja filtrowania po słowach kluczowych
function filterByCategory($items, $feedType, $categoryFilters) {
    if (!isset($categoryFilters[$feedType]) || $feedType === 'all') {
        return $items;
    }

    $filter = $categoryFilters[$feedType];
    $includeWords = $filter['include'];
    $excludeWords = $filter['exclude'];

    return array_filter($items, function($item) use ($includeWords, $excludeWords) {
        $text = mb_strtolower($item['title'] . ' ' . $item['description'], 'UTF-8');

        // Sprawdź wykluczenia
        foreach ($excludeWords as $word) {
            if (mb_strpos($text, mb_strtolower($word, 'UTF-8')) !== false) {
                return false;
            }
        }

        // Sprawdź słowa kluczowe (musi zawierać przynajmniej jedno)
        if (empty($includeWords)) {
            return true;
        }

        foreach ($includeWords as $word) {
            if (mb_strpos($text, mb_strtolower($word, 'UTF-8')) !== false) {
                return true;
            }
        }

        return false;
    });
}

// Funkcja usuwania duplikatów
function removeDuplicates($items) {
    $seen = [];
    $unique = [];

    foreach ($items as $item) {
        // Normalizuj tytuł do porównania
        $normalizedTitle = mb_strtolower(trim($item['title']), 'UTF-8');
        $normalizedTitle = preg_replace('/[^a-ząćęłńóśźż0-9\s]/u', '', $normalizedTitle);

        if (!isset($seen[$normalizedTitle])) {
            $seen[$normalizedTitle] = true;
            $unique[] = $item;
        }
    }

    return $unique;
}

$allItems = [];

// Pobierz z wszystkich URL-i dla danego feedType - RÓWNOLEGLE (szybsze!)
$feedUrls = $feeds[$feedType];
$xmlResults = fetchMultipleRSS($feedUrls);

foreach ($xmlResults as $url => $xml) {
    if ($xml) {
        $items = parseItems($xml, $feedType);
        $allItems = array_merge($allItems, $items);
    }
}

// Filtruj artykuły według kategorii
$allItems = filterByCategory($allItems, $feedType, $categoryFilters);

// Usuń duplikaty
$allItems = removeDuplicates($allItems);

// Sortuj po dacie
usort($allItems, function($a, $b) {
    return strtotime($b['date']) - strtotime($a['date']);
});

// Ogranicz liczbę wyników
$allItems = array_slice($allItems, 0, $limit);

// Zwróć JSON
echo json_encode([
    'items' => $allItems,
    'count' => count($allItems),
    'feed' => $feedType,
    'timestamp' => date('c')
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

