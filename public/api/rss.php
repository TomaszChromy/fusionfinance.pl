<?php
/**
 * FusionFinance.pl - RSS Proxy API
 * Konwertuje RSS feeds na JSON dla frontendu
 * 
 * Użycie: /api/rss.php?feed=bankier&limit=10
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Cache-Control: public, max-age=300'); // 5 min cache

// Definicja feedów RSS
$feeds = [
    'bankier' => 'https://www.bankier.pl/rss/wiadomosci.xml',
    'bankierGielda' => 'https://www.bankier.pl/rss/gielda.xml',
    'bankierWaluty' => 'https://www.bankier.pl/rss/waluty.xml',
    'investingForex' => 'https://pl.investing.com/rss/news_288.rss',
    'investingCrypto' => 'https://pl.investing.com/rss/news_301.rss',
    'crypto' => 'https://pl.investing.com/rss/news_301.rss',
];

// Parametry
$feedType = isset($_GET['feed']) ? $_GET['feed'] : 'bankier';
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
$limit = min($limit, 100); // Max 100 artykułów

// Sprawdź czy feed istnieje
if (!isset($feeds[$feedType]) && $feedType !== 'all') {
    http_response_code(400);
    echo json_encode(['error' => 'Unknown feed type', 'available' => array_keys($feeds)]);
    exit;
}

function fetchRSS($url) {
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

$allItems = [];

if ($feedType === 'all') {
    // Pobierz ze wszystkich feedów
    foreach ($feeds as $name => $url) {
        $xml = fetchRSS($url);
        if ($xml) {
            $items = parseItems($xml, $name);
            $allItems = array_merge($allItems, $items);
        }
    }
    
    // Sortuj po dacie
    usort($allItems, function($a, $b) {
        return strtotime($b['date']) - strtotime($a['date']);
    });
} else {
    $xml = fetchRSS($feeds[$feedType]);
    if ($xml) {
        $allItems = parseItems($xml, $feedType);
    }
}

// Ogranicz liczbę wyników
$allItems = array_slice($allItems, 0, $limit);

// Zwróć JSON
echo json_encode([
    'items' => $allItems,
    'count' => count($allItems),
    'feed' => $feedType,
    'timestamp' => date('c')
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

