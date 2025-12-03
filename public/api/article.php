<?php
/**
 * FusionFinance.pl - Article Content Scraper API
 * Pobiera pełną treść artykułu ze źródła
 * 
 * Użycie: /api/article.php?url=https://example.com/article
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Cache-Control: public, max-age=3600'); // 1 hour cache

// Parametry
$url = isset($_GET['url']) ? $_GET['url'] : null;

if (!$url) {
    http_response_code(400);
    echo json_encode(['error' => 'URL is required']);
    exit;
}

// Walidacja URL
if (!filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid URL']);
    exit;
}

// Dozwolone domeny (polskie portale finansowe)
$allowedDomains = [
    'bankier.pl', 'money.pl', 'parkiet.com', 'pb.pl', 
    'forsal.pl', 'gpw.pl', 'stooq.pl', 'biznes.gazetaprawna.pl',
    'businessinsider.com.pl', 'wnp.pl', 'pap.pl', 'mybank.pl',
    'sii.org.pl', 'stockwatch.pl', 'gazeta.pl', 'pulshr.pl'
];

$host = parse_url($url, PHP_URL_HOST);
$isAllowed = false;
foreach ($allowedDomains as $domain) {
    if (strpos($host, $domain) !== false) {
        $isAllowed = true;
        break;
    }
}

if (!$isAllowed) {
    http_response_code(403);
    echo json_encode(['error' => 'Domain not allowed', 'host' => $host]);
    exit;
}

// Pobierz stronę
$context = stream_context_create([
    'http' => [
        'timeout' => 15,
        'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'follow_location' => true,
        'max_redirects' => 3
    ],
    'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false
    ]
]);

$html = @file_get_contents($url, false, $context);

if ($html === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch article']);
    exit;
}

// Wykryj kodowanie i przekonwertuj na UTF-8
if (preg_match('/charset=["\']?([^"\'\s>]+)/i', $html, $matches)) {
    $charset = strtoupper($matches[1]);
    if ($charset !== 'UTF-8') {
        $html = @iconv($charset, 'UTF-8//IGNORE', $html);
    }
}

// Funkcja do czyszczenia HTML
function cleanText($html) {
    // Usuń skrypty i style
    $html = preg_replace('/<script\b[^>]*>.*?<\/script>/is', '', $html);
    $html = preg_replace('/<style\b[^>]*>.*?<\/style>/is', '', $html);
    
    // Usuń komentarze
    $html = preg_replace('/<!--.*?-->/s', '', $html);
    
    // Zamień <br> i <p> na nowe linie
    $html = preg_replace('/<br\s*\/?>/i', "\n", $html);
    $html = preg_replace('/<\/p>/i', "\n\n", $html);
    
    // Usuń tagi HTML
    $text = strip_tags($html);
    
    // Dekoduj HTML entities
    $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    
    // Usuń nadmiarowe białe znaki
    $text = preg_replace('/[ \t]+/', ' ', $text);
    $text = preg_replace('/\n{3,}/', "\n\n", $text);
    
    return trim($text);
}

// Selektory dla różnych serwisów
$content = '';

// Bankier.pl
if (strpos($host, 'bankier.pl') !== false) {
    if (preg_match('/<div[^>]*class="[^"]*article-content[^"]*"[^>]*>(.*?)<\/div>/is', $html, $matches)) {
        $content = cleanText($matches[1]);
    }
}
// Money.pl
elseif (strpos($host, 'money.pl') !== false) {
    if (preg_match('/<div[^>]*class="[^"]*sc-[^"]*article-body[^"]*"[^>]*>(.*?)<\/div>/is', $html, $matches)) {
        $content = cleanText($matches[1]);
    }
}
// Parkiet
elseif (strpos($host, 'parkiet.com') !== false) {
    if (preg_match('/<div[^>]*class="[^"]*article_body[^"]*"[^>]*>(.*?)<\/div>/is', $html, $matches)) {
        $content = cleanText($matches[1]);
    }
}

// Fallback - szukaj JSON-LD
if (empty($content)) {
    if (preg_match('/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/is', $html, $matches)) {
        $jsonld = json_decode($matches[1], true);
        if (isset($jsonld['articleBody'])) {
            $content = $jsonld['articleBody'];
        }
    }
}

// Fallback - szukaj paragrafów w article
if (empty($content)) {
    if (preg_match('/<article[^>]*>(.*?)<\/article>/is', $html, $matches)) {
        preg_match_all('/<p[^>]*>(.*?)<\/p>/is', $matches[1], $paragraphs);
        if (!empty($paragraphs[1])) {
            $content = cleanText(implode("\n\n", $paragraphs[1]));
        }
    }
}

echo json_encode([
    'content' => $content,
    'url' => $url,
    'length' => mb_strlen($content),
    'timestamp' => date('c')
], JSON_UNESCAPED_UNICODE);

