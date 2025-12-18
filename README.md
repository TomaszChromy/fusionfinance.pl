# FusionFinance.pl - Luksusowy Portal Finansowy

> **Profesjonalny portal finansowy z agregatorem wiadomości** - Nowoczesna aplikacja webowa z eleganckim designem i funkcjami premium

Zaawansowany, pełnofunkcjonalny portal finansowy zbudowany w Next.js 16 z React 19, TypeScript i Tailwind CSS. Aplikacja agreguje wiadomości z wiodących źródeł RSS, prezentując je w luksusowym, ciemnym interfejsie ze złotymi akcentami.

## 👨‍💻 Autor i Twórca

**Tomasz Chromy** - jedyny twórca i pomysłodawca
- 🌐 Strona: [tomaszchromy.com](https://tomaszchromy.com)
- 📧 Email: tomasz.chromy@outlook.com

**Copyright © 2024-2025 Tomasz Chromy. Wszelkie prawa zastrzeżone.**

## 🌟 Główne Funkcje

### 🎨 Luksusowy Design
- **Ciemny motyw premium** ze złotymi akcentami (#c9a962)
- **Golden Ratio layout** - proporcja 1.618 dla idealnej kompozycji
- **Fibonacci spacing** - odstępy: 5, 8, 13, 21, 34, 55, 89, 144px
- **Typografia** - Playfair Display (nagłówki) + Geist (treść)

### 📰 Agregator Wiadomości
- **Multi-source RSS** - Bankier.pl, Money.pl, Parkiet.com, PAP
- **Kategorie** - Rynki, Giełda, Crypto, Waluty, Analizy
- **Real-time updates** - automatyczne odświeżanie feedów
- **Smart filtering** - filtrowanie po słowach kluczowych

### 📊 Dane Rynkowe
- **Live ticker** - kursy walut z animacją
- **Sparkline charts** - mini wykresy w sidebarze
- **Tabele NBP** - kursy walut z NBP API
- **Notowania GPW** - WIG20, mWIG40

### 🔐 System Użytkowników
- **NextAuth.js v5** z JWT
- **Credentials + Google OAuth**
- **Profile użytkowników** z preferencjami
- **Ulubione artykuły** i historia przeglądania

### 📱 Progressive Web App (PWA)
- **Instalacja** na urządzeniach mobilnych i desktop
- **Offline functionality** - podstawowe funkcje bez internetu
- **Service Worker** dla cache'owania zasobów
- **Responsive design** - pełna funkcjonalność na wszystkich urządzeniach

### 🔔 Interaktywność
- **Alerty cenowe** - powiadomienia o zmianach kursów
- **Watchlist** - lista obserwowanych aktywów
- **Newsletter** - subskrypcja z personalizacją
- **Dark/Light mode** - przełącznik motywu

## 🛠️ Technologie

### Frontend
- **Next.js 16** - React framework z App Router i Turbopack
- **React 19** - najnowsza wersja z Concurrent Features
- **TypeScript** - statyczne typowanie dla lepszej jakości kodu
- **Tailwind CSS 3** - utility-first CSS framework
- **Framer Motion** - animacje i przejścia

### Backend
- **Next.js API Routes** - serverless functions
- **PHP fallback** - dla hostingu współdzielonego (nazwa.pl)
- **Prisma ORM** - type-safe database access
- **PostgreSQL** - relacyjna baza danych

### SEO & Performance
- **Server-side rendering** - optymalizacja SEO
- **Image optimization** - automatyczna optymalizacja
- **Schema.org** - structured data
- **Open Graph** - social media meta
- **Sitemap & Robots.txt** - indeksowanie

## 📋 Wymagania Systemowe

### Minimalne
- **Node.js**: 18.17+
- **RAM**: 2GB
- **Dysk**: 500MB wolnego miejsca
- **Przeglądarka**: Chrome 90+, Firefox 88+, Safari 14+

### Zalecane
- **Node.js**: 20.0+
- **RAM**: 4GB+
- **Dysk**: 2GB+ (z cache)

## 🚀 Instalacja

### 1. Sklonuj repozytorium
```bash
git clone https://github.com/TomaszChromy/fusionfinance.pl.git
cd fusionfinance.pl
```

### 2. Zainstaluj zależności
```bash
npm install
```

### 3. Skonfiguruj zmienne środowiskowe
```bash
cp .env.example .env.local
```

### 4. Uruchom aplikację
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: **http://localhost:3000**

### Build dla hostingu współdzielonego (nazwa.pl)
```bash
npm run build:static
# Pliki w folderze 'out' - wgraj przez FTP
```

## 📁 Struktura Projektu

```
fusionfinance.pl/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── artykul/           # Strony artykułów
│   ├── rynki/             # Sekcja Rynki
│   ├── gielda/            # Sekcja Giełda
│   ├── crypto/            # Sekcja Crypto
│   ├── waluty/            # Sekcja Waluty
│   └── analizy/           # Sekcja Analizy
├── components/            # Komponenty React
├── lib/                   # Utilities i konfiguracja
├── public/                # Pliki statyczne
│   └── api/              # PHP fallback API
├── prisma/               # Schema bazy danych
└── scripts/              # Skrypty build
```

## 🔧 Dostępne Skrypty

```bash
npm run dev           # Serwer deweloperski
npm run build         # Build produkcyjny
npm run build:static  # Build dla hostingu statycznego
npm run start         # Uruchom produkcyjnie
npm run lint          # Sprawdź kod z ESLint
```

## 📱 Responsywność

| Breakpoint | Szerokość | Układ |
|------------|-----------|-------|
| Mobile | < 640px | 1 kolumna |
| Tablet | 640px - 1024px | 2 kolumny |
| Desktop | > 1024px | Golden Ratio (61.8% / 38.2%) |

## 🎨 Design System

```css
/* Kolory */
--gold-primary: #c9a962
--gold-light: #e4d4a5
--gold-dark: #9a7b3c
--bg-primary: #08090c
--bg-secondary: #0c0d10

/* Typography */
font-serif: Playfair Display (nagłówki)
font-sans: Geist (treść)
```

## 📚 Dokumentacja

- 📖 **[Roadmap](./ROADMAP.md)** - Plan rozwoju projektu
- ⚖️ **[Licencja](./LICENSE)** - Prawa autorskie

## 📞 Kontakt i Wsparcie

**Tomasz Chromy** - Autor i Twórca
- 🌐 Strona: [tomaszchromy.com](https://tomaszchromy.com)
- 📧 Email: tomasz.chromy@outlook.com

W przypadku problemów lub pytań:
- Utwórz [Issue na GitHub](https://github.com/TomaszChromy/fusionfinance.pl/issues)
- Wyślij email z opisem problemu

## ⚖️ Licencja i Prawa Autorskie

**Copyright © 2024-2025 Tomasz Chromy. Wszelkie prawa zastrzeżone.**

Ten projekt jest własnością intelektualną Tomasza Chromy. Szczegółowe informacje o prawach autorskich i licencji znajdują się w pliku [LICENSE](./LICENSE).

### Dozwolone:
- ✅ Przeglądanie kodu źródłowego
- ✅ Uczenie się z kodu
- ✅ Tworzenie forków do celów edukacyjnych

### Zabronione bez pisemnej zgody:
- ❌ Komercyjne wykorzystanie
- ❌ Redystrybucja kodu
- ❌ Używanie nazwy "FusionFinance"

## ⚠️ Disclaimer

> **Ten projekt został stworzony w celach edukacyjnych i demonstracyjnych.**
> Nie stanowi oferty handlowej ani porady inwestycyjnej.
> Wszystkie dane finansowe pochodzą z publicznych źródeł RSS.

---

<p align="center">
  <strong><a href="https://tomaszchromy.com">POWERED BY TOMASZ CHROMY</a></strong>
</p>

<p align="center">
  <em>FusionFinance.pl - Luksusowy Portal Finansowy</em>
</p>
<!-- Deploy fix test -->
