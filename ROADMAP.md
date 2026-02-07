# FusionFinance.pl - Roadmap (2025-2026)

Status legend: 🟢 ukończone · 🟡 w toku · 🔵 planowane

## Autor
- Tomasz Chromy — założyciel, produkt i technologia  
  tomasz.chromy@outlook.com | tomaszchromy.com

## Cel nadrzędny
- Do końca 2026: stabilny agregator finansowy z pełnym trybem PWA (offline, push, sync w tle, low-data mode) i gwarantowaną jakością danych (monitoring, alerty, sanity checks).

## Kamienie milowe

### 2025 H1 – Stabilność i dane (🟡)
- 🟡 Ujednolicone feedy RSS z kuracją źródeł, de-duplikacją i tagowaniem.
- 🟡 Sanity checks i alerty dla API (NBP, GPW, crypto) + logowanie anomalii.
- 🟡 Twarde SEO/Performance (CWV, schema, dostępność AA).
- 🔵 Monitoring uptime + alerty (downtime, błędy 5xx).

### 2025 H2 – Dojrzałość produktu (🔵)
- 🔵 Analityka produktu (page views, top articles, CTR sekcji).
- 🔵 Profile użytkowników: preferencje treści, zapisywanie widoków.
- 🔵 Automatyczne streszczenia i deduplikacja z użyciem AI (bez rekomendacji inwestycyjnych).
- 🔵 Export statyczny 2.0: pełne testy na nazwa.pl + checklisty QA.

### 2026 H1 – PWA Foundations (🔵)
- 🔵 Service Worker v2: cache priorytetowy, tryb oszczędzania danych.
- 🔵 Instalowalność (manifest, ikony, metadane) + UX „Add to Home Screen”.
- 🔵 Offline-first dla kluczowych widoków (home, artykuł, listy) + fallback danych.

### 2026 H2 – PWA Production (🔵)
- 🔵 Push notifications (subskrypcje źródeł, alerty danych) z panelem preferencji.
- 🔵 Background sync (odświeżanie feedów, kursów i watchlisty w tle).
- 🔵 Audyt Lighthouse PWA/Performance/Accessibility na poziomie 90+.

## Techniczny backlog
- CI/CD (GitHub Actions) z lint/typecheck/test i podglądem podglądowych buildów.
- Testy E2E (Playwright) kluczowych ścieżek: home, artykuł, szukaj, ulubione, build:static.
- Edge cache tam, gdzie to możliwe (bez łamania wymogów hostingu współdzielonego).
- Telemetria błędów (np. Sentry) z redaction PII.

## Metryki sukcesu
- Dostępność: uptime ≥ 99.5% (monitoring HTTP + źródła danych).
- Jakość danych: brak błędów parsowania feedów > 0.5% / dobę; alert w ciągu 5 min.
- Wydajność: CWV all green na mobile (LCP < 2.5s, CLS < 0.1).
- Użyteczność: CTR głównej sekcji artykułów +10% r/r, bounce rate < 40%.

## Zgłoszenia i wkład
- Problemy/feature requests: GitHub Issues.
- Kontakt: tomasz.chromy@outlook.com (24–48h w dni robocze).
