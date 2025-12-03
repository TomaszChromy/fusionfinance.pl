<?php
/**
 * FusionFinance.pl - RSS Proxy API
 * Konwertuje RSS feeds na JSON dla frontendu
 *
 * Użycie: /api/rss.php?feed=rynki&limit=10
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Cache-Control: public, max-age=300'); // 5 min cache

// Definicja feedów RSS - pasujące do kategorii frontendu
// Źródła: Bankier.pl, Money.pl, Parkiet.com, Puls Biznesu, Cashless, WP Finanse,
//         Kryptomaniak, BiznesAlert, WNP.pl, Forsal.pl
$feeds = [
    // Rynki finansowe ogólnie - szeroki przekrój
    'rynki' => [
        'https://www.bankier.pl/rss/wiadomosci.xml',
        'https://www.money.pl/rss/rss.xml',
        'https://www.pb.pl/rss/wszystko',
        'https://biznesalert.pl/feed/',
        'https://www.wnp.pl/rss/serwis.xml',
        'https://forsal.pl/rss.xml',
    ],
    // Giełda - GPW, akcje, spółki, notowania
    'gielda' => [
        'https://www.bankier.pl/rss/gielda.xml',
        'https://www.parkiet.com/rss/parkiet.xml',
        'https://www.money.pl/rss/gielda.xml',
        'https://www.pb.pl/rss/gielda',
        'https://forsal.pl/rss/gielda.xml',
    ],
    // Kryptowaluty - Bitcoin, Ethereum, blockchain
    'crypto' => [
        'https://kryptomaniak.pl/feed/',
        'https://www.bankier.pl/rss/wiadomosci.xml',
        'https://www.money.pl/rss/rss.xml',
    ],
    // Waluty - Forex, kursy walut, NBP
    'waluty' => [
        'https://www.bankier.pl/rss/waluty.xml',
        'https://www.money.pl/rss/waluty.xml',
        'https://forsal.pl/rss/waluty.xml',
    ],
    // Analizy - prognozy, rekomendacje, raporty
    'analizy' => [
        'https://www.parkiet.com/rss/parkiet.xml',
        'https://www.pb.pl/rss/wszystko',
        'https://biznesalert.pl/feed/',
        'https://forsal.pl/rss.xml',
    ],
    // Fintech - banki, innowacje finansowe
    'fintech' => [
        'https://www.cashless.pl/rss',
        'https://finanse.wp.pl/rss.xml',
        'https://www.bankier.pl/rss/finanse.xml',
    ],
    // All - wszystkie główne źródła
    'all' => [
        'https://www.bankier.pl/rss/wiadomosci.xml',
        'https://www.money.pl/rss/rss.xml',
        'https://www.parkiet.com/rss/parkiet.xml',
        'https://www.pb.pl/rss/wszystko',
        'https://biznesalert.pl/feed/',
        'https://forsal.pl/rss.xml',
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

function fetchRSS($url) {
    // Najpierw spróbuj cURL (bardziej niezawodne)
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_USERAGENT => 'Mozilla/5.0 (compatible; FusionFinance/1.0)',
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_HTTPHEADER => ['Accept: application/rss+xml, application/xml, text/xml']
        ]);
        $content = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($content === false || $httpCode !== 200) {
            return null;
        }
    } else {
        // Fallback do file_get_contents
        $context = stream_context_create([
            'http' => [
                'timeout' => 10,
                'user_agent' => 'FusionFinance/1.0 RSS Reader'
            ]
        ]);

        $content = @file_get_contents($url, false, $context);
        if ($content === false) {
            return null;
        }
    }

    // Parsuj XML
    libxml_use_internal_errors(true);
    $xml = simplexml_load_string($content);
    if ($xml === false) {
        return null;
    }

    return $xml;
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
        
        $items[] = [
            'title' => (string)$item->title,
            'link' => (string)$item->link,
            'description' => strip_tags((string)$item->description),
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

// Pobierz z wszystkich URL-i dla danego feedType
$feedUrls = $feeds[$feedType];
foreach ($feedUrls as $url) {
    $xml = fetchRSS($url);
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

