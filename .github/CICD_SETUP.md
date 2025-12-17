# GitHub Actions Secrets Configuration

## Wymagane sekrety do skonfigurowania w GitHub

Aby CI/CD pipeline działał prawidłowo, dodaj następujące sekrety w repozytorium GitHub:

### 1. FTP Deployment (dla deploy.yml)

```
FTP_HOST = pgsql17.server142159.nazwa.pl
FTP_PORT = 21
FTP_USER = [username z panelu nazwa.pl]
FTP_PASSWORD = [hasło FTP]
```

**Jak dodać:**
1. Przejdź do Settings → Secrets and variables → Actions
2. Kliknij "New repository secret"
3. Dodaj każdą wartość z nazwą jak wyżej

### 2. Slack Notifications (opcjonalnie)

```
SLACK_WEBHOOK = https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

**Jak uzyskać:**
1. Przejdź do https://api.slack.com/apps
2. Utwórz nową aplikację
3. Włącz "Incoming Webhooks"
4. Skopiuj webhook URL

### 3. OpenAI API (dla summarization)

```
OPENAI_API_KEY = sk-...
```

**Jak uzyskać:**
1. Przejdź do https://platform.openai.com/api-keys
2. Utwórz nowy klucz API
3. Skopiuj wartość

## Konfiguracja GitHub Branch Protection

1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Wymagaj pomyślnego uruchomienia workflow:
   - ✅ Lint & Test
   - ✅ Performance & SEO Check

## Monitorowanie deploymentów

Po każdym push na `main`:
1. GitHub Actions uruchomi `lint-test.yml`
2. Jeśli wszystko OK, uruchomi `deploy.yml`
3. Wgraje pliki via FTP na nazwa.pl
4. Wyśle notyfikację na Slack

## Lokalne testowanie

```bash
# Uruchom linter
npm run lint

# Sprawdź TypeScript
npx tsc --noEmit

# Zbuduj projekt
npm run build

# Zbuduj statycznie (dla nazwa.pl)
npm run build:nazwa
```

## Troubleshooting

### Deployment nie działa
- Sprawdź czy FTP credentials są poprawne
- Upewnij się że secret names są dokładnie takie jak w YAML

### Build fails
- Sprawdź czy masz `.env.local` z wymaganymi zmiennymi
- Upewnij się że OpenAI API key jest prawidłowy

### Slack notifications nie przychodzą
- Sprawdź webhook URL w Slack API
- Upewnij się że secret jest ustawiony prawidłowo
