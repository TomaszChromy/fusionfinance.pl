<p align="center">
  <img src="public/logo.png" alt="FusionFinance Logo" width="200"/>
</p>

<h1 align="center">FusionFinance.pl</h1>

<p align="center">
  <strong>🏦 Luksusowy Polski Portal Finansowy</strong>
</p>

<p align="center">
  <a href="https://fusionfinance.pl">Live Demo</a> •
  <a href="#funkcjonalności">Funkcjonalności</a> •
  <a href="#instalacja">Instalacja</a> •
  <a href="#technologie">Technologie</a> •
  <a href="ROADMAP.md">Roadmap</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.0.5-black?style=flat-square&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License"/>
</p>

---

## 📋 O Projekcie

**FusionFinance.pl** to elegancki, luksusowy portal finansowy stworzony w Polsce. Agreguje najnowsze wiadomości finansowe z wiodących źródeł RSS, prezentując je w nowoczesnym, ciemnym interfejsie z akcentami złota.

### ✨ Główne cechy

- 🎨 **Luksusowy design** - Ciemny motyw ze złotymi akcentami (#c9a962)
- 📐 **Złoty podział** - Layout oparty na proporcji 1.618 (Golden Ratio)
- 📏 **Fibonacci Spacing** - Odstępy: 5, 8, 13, 21, 34, 55, 89, 144px
- 📰 **RSS Aggregator** - Automatyczne pobieranie artykułów z Bankier.pl i Investing.com
- 📱 **Responsive** - Pełna responsywność na wszystkie urządzenia
- ⚡ **Optymalizacja** - Server-side rendering i lazy loading
- 🔍 **SEO Ready** - Kompletne metadane, Schema.org, Open Graph

---

## 🎯 Funkcjonalności

### 📊 Sekcje tematyczne

| Sekcja | Opis | Źródło RSS |
|--------|------|------------|
| **Rynki** | Ogólne wiadomości rynkowe | Bankier.pl, Money.pl, Parkiet.com |
| **Giełda** | GPW, WIG20, akcje, obligacje | Bankier.pl Giełda, Parkiet.com |
| **Crypto** | Bitcoin, Ethereum, altcoiny | Bankier.pl, Money.pl |
| **Waluty** | Forex, kursy walut, NBP | Bankier.pl Waluty, Money.pl |
| **Analizy** | Analizy techniczne i fundamentalne | Bankier.pl, Parkiet.com |

### 📄 System artykułów

- **Paginacja** - 64 artykuły / 8 na stronę
- **Dynamiczne obrazy** - Oryginalne z RSS lub tematyczne z Unsplash
- **Generowane treści** - 500+ słów na artykuł
- **Powiązane artykuły** - Sugestie podobnych tematycznie

### 🎨 Design System

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

---

## 🚀 Instalacja

### Wymagania

- Node.js 18.17+
- npm / yarn / pnpm

### Kroki instalacji

```bash
# Klonowanie repozytorium
git clone https://github.com/your-username/fusionfinance.git
cd fusionfinance

# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev

# Build produkcyjny
npm run build
npm run start

# Build dla hostingu współdzielonego (nazwa.pl)
npm run build:static
# Pliki w folderze 'out' - wgraj przez FTP
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

### Hosting współdzielony (nazwa.pl)

Projekt zawiera PHP proxy (`public/api/rss.php`) dla hostingów bez Node.js:
1. `npm run build:static` - generuje pliki statyczne
2. Wgraj zawartość folderu `out/` przez FTP
3. PHP automatycznie obsłuży pobieranie RSS

---

## 🛠️ Technologie

### Frontend
- **Next.js 16** - React Framework z App Router
- **React 19** - Biblioteka UI
- **TypeScript** - Typowanie statyczne
- **Tailwind CSS 4** - Utility-first CSS

### Animacje
- **Framer Motion** - Animacje i przejścia
- **AnimatePresence** - Animacje wejścia/wyjścia

### Dane
- **rss-parser** - Parsowanie feedów RSS
- **API Routes** - Serverless endpoints

### SEO & Performance
- **Next.js Image** - Optymalizacja obrazów
- **Schema.org** - Structured data
- **Open Graph** - Social media meta
- **Sitemap** - Automatyczny sitemap

---

## 📁 Struktura projektu

```
fusionfinance/
├── app/
│   ├── api/
│   │   └── rss/           # API endpoint dla RSS
│   ├── artykul/
│   │   └── [slug]/        # Dynamiczne strony artykułów
│   ├── rynki/             # Sekcja Rynki
│   ├── gielda/            # Sekcja Giełda
│   ├── crypto/            # Sekcja Crypto
│   ├── waluty/            # Sekcja Waluty
│   ├── analizy/           # Sekcja Analizy
│   ├── polityka-prywatnosci/
│   ├── regulamin/
│   ├── cookies/
│   ├── layout.tsx         # Root layout + SEO
│   ├── page.tsx           # Strona główna
│   └── globals.css        # Style globalne
├── components/
│   ├── Header.tsx         # Nawigacja
│   ├── Footer.tsx         # Stopka
│   ├── RSSFeatured.tsx    # Wyróżnione artykuły
│   ├── RSSArticles.tsx    # Lista artykułów
│   ├── RSSArticlesPaginated.tsx  # Lista z paginacją
│   └── Pagination.tsx     # Komponent paginacji
├── public/
│   ├── favicon.ico
│   ├── og-image.jpg
│   └── ...
└── next.config.ts
```

---

## 🔧 Konfiguracja

### Zmienne środowiskowe

Utwórz plik `.env.local`:

```env
# Opcjonalne - do weryfikacji wyszukiwarek
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Dostosowanie RSS

Edytuj `app/api/rss/route.ts` aby dodać własne źródła RSS:

```typescript
const RSS_FEEDS = {
  myFeed: "https://example.com/feed.xml",
  // ...
};
```

---

## 📱 Responsywność

| Breakpoint | Szerokość | Układ |
|------------|-----------|-------|
| Mobile | < 640px | 1 kolumna |
| Tablet | 640px - 1024px | 2 kolumny |
| Desktop | > 1024px | Golden Ratio (61.8% / 38.2%) |

---

## 🤝 Autor

**Tomasz Chromy**
- Website: [tomaszchromy.com](https://tomaszchromy.com)
- Company: [TomSoft-Website](https://tomsoft-website.com)

---

## 📄 Licencja

Ten projekt jest udostępniony na licencji MIT. Zobacz plik [LICENSE](LICENSE) po więcej szczegółów.

---

## ⚠️ Disclaimer

> **Ten projekt został stworzony w celach edukacyjnych i demonstracyjnych.**
> Nie stanowi oferty handlowej ani porady inwestycyjnej.
> Wszystkie dane finansowe pochodzą z publicznych źródeł RSS.

---

<p align="center">
  <sub>Built with ❤️ and ☕ by TomSoft-Website</sub>
</p>
