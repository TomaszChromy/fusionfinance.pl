# 🚀 Instrukcja wdrożenia FusionFinance.pl na nazwa.pl

## 📦 Przygotowanie

Build produkcyjny został wygenerowany w folderze `out/`.

## 📁 Struktura plików do wgrania

```
fusionfinance.pl/
├── index.html              # Strona główna
├── .htaccess               # Konfiguracja Apache
├── robots.txt              # Instrukcje dla crawlerów
├── sitemap.xml             # Mapa strony
├── site.webmanifest        # Manifest PWA
├── favicon.ico             # Ikona
├── api/
│   └── rss.php             # PHP API do pobierania RSS
├── _next/                  # Zasoby Next.js (JS, CSS)
├── rynki/                  # Podstrona Rynki
├── gielda/                 # Podstrona Giełda
├── crypto/                 # Podstrona Crypto
├── waluty/                 # Podstrona Waluty
├── analizy/                # Podstrona Analizy
├── artykul/                # Strona artykułu
├── polityka-prywatnosci/   # Polityka prywatności
├── regulamin/              # Regulamin
├── cookies/                # Polityka cookies
└── 404/                    # Strona błędu 404
```

## 🔧 Kroki wdrożenia na nazwa.pl

### 1. Zaloguj się do panelu DirectAdmin
- Adres: https://panel.nazwa.pl lub podobny
- Użyj danych dostępowych od nazwa.pl

### 2. Wejdź do Menedżera plików
- Znajdź folder `public_html` lub `www`
- To jest główny katalog domeny fusionfinance.pl

### 3. Wyczyść folder (jeśli to nowa instalacja)
- Usuń domyślne pliki (np. `index.html` z nazwa.pl)
- **UWAGA**: Nie usuwaj `.htaccess` jeśli zawiera ważne ustawienia

### 4. Wgraj zawartość folderu `out/`
- Możesz użyć:
  - **Menedżera plików** - wgraj plik ZIP i rozpakuj
  - **FTP** - połącz się przez FileZilla lub podobny klient
  - **SSH** - jeśli masz dostęp

### 5. Skopiuj .htaccess
- Plik `.htaccess` z folderu `out/` musi być w głównym katalogu
- Jeśli nie ma, skopiuj z `public/.htaccess`

### 6. Sprawdź uprawnienia PHP
- Upewnij się, że PHP jest włączone (min. PHP 7.4)
- Plik `api/rss.php` musi mieć uprawnienia do wykonywania

### 7. Ustaw SSL
- W panelu nazwa.pl włącz certyfikat SSL (Let's Encrypt)
- Przekierowanie HTTP → HTTPS jest w .htaccess

## 🧪 Testowanie

Po wgraniu sprawdź:
1. ✅ Strona główna: https://fusionfinance.pl
2. ✅ Podstrony: /rynki, /gielda, /crypto, /waluty, /analizy
3. ✅ API RSS: https://fusionfinance.pl/api/rss.php?feed=bankier&limit=5
4. ✅ Strona artykułu: kliknij w dowolny artykuł
5. ✅ HTTPS: sprawdź czy jest kłódka w przeglądarce

## 🔧 Rozwiązywanie problemów

### Błąd 500 Internal Server Error
- Sprawdź uprawnienia .htaccess (644)
- Sprawdź czy mod_rewrite jest włączony

### Artykuły się nie ładują
- Sprawdź czy PHP działa: https://fusionfinance.pl/api/rss.php
- Sprawdź uprawnienia pliku rss.php (644 lub 755)

### Błąd CORS
- Dodaj do .htaccess:
```apache
Header set Access-Control-Allow-Origin "*"
```

### Strony nie działają (404)
- Sprawdź czy .htaccess jest wgrany
- Sprawdź czy mod_rewrite jest włączony w panelu

## 📊 Konfiguracja DNS (jeśli nowa domena)

W panelu nazwa.pl ustaw rekordy DNS:
```
A     fusionfinance.pl      → IP_serwera_nazwa.pl
AAAA  fusionfinance.pl      → IPv6_serwera (jeśli jest)
CNAME www.fusionfinance.pl  → fusionfinance.pl
```

## 📧 Kontakt

W razie problemów:
- Dokumentacja nazwa.pl: https://www.nazwa.pl/pomoc/
- Wsparcie techniczne nazwa.pl

---

✅ **Build gotowy do wdrożenia!**

Folder `out/` zawiera wszystkie pliki potrzebne do uruchomienia strony.

