# Konfiguracja Cron Jobs - FusionFinance.pl

## Automatyczna aktualizacja co 15 minut

### 1. Zaloguj się do panelu DirectAdmin na nazwa.pl

### 2. Przejdź do: Zaplanowane zadania (Cron Jobs)

### 3. Dodaj dwa zadania:

#### Zadanie 1: Aktualizacja artykułów RSS
```
Minuta: */15
Godzina: *
Dzień miesiąca: *
Miesiąc: *
Dzień tygodnia: *
Polecenie: /usr/bin/php /home/TWOJ_USER/domains/fusionfinance.pl/public_html/api/cron.php
```

#### Zadanie 2: Aktualizacja kursów walut i krypto
```
Minuta: */15
Godzina: *
Dzień miesiąca: *
Miesiąc: *
Dzień tygodnia: *
Polecenie: /usr/bin/php /home/TWOJ_USER/domains/fusionfinance.pl/public_html/api/cron_rates.php
```

### Alternatywa - wywołanie przez wget:
```
*/15 * * * * wget -q -O /dev/null "https://fusionfinance.pl/api/cron.php?key=ff_cron_2024_secret"
*/15 * * * * wget -q -O /dev/null "https://fusionfinance.pl/api/cron_rates.php?key=ff_cron_rates_2024"
```

## Pliki cache (tworzone automatycznie):

| Plik | Opis |
|------|------|
| `articles_cache.json` | Cache artykułów RSS |
| `rates_cache.json` | Cache kursów walut i krypto |
| `cron_log.txt` | Logi aktualizacji artykułów |
| `cron_rates_log.txt` | Logi aktualizacji kursów |

## Testowanie:

Otwórz w przeglądarce:
- https://fusionfinance.pl/api/cron.php?key=ff_cron_2024_secret
- https://fusionfinance.pl/api/cron_rates.php?key=ff_cron_rates_2024

## Bezpieczeństwo:

**WAŻNE:** Zmień klucze bezpieczeństwa w plikach:
- `cron.php` - zmienna `$CRON_SECRET_KEY`
- `cron_rates.php` - zmienna `$CRON_SECRET_KEY`

## Weryfikacja działania:

1. Sprawdź pliki `cron_log.txt` i `cron_rates_log.txt`
2. Sprawdź datę modyfikacji plików cache
3. Wywołaj API i sprawdź pole `lastUpdate`

