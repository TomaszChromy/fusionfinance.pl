import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import TopBanner from "@/components/TopBanner";
import CurrencyTicker from "@/components/CurrencyTicker";
import CookieConsent from "@/components/CookieConsent";
import ScrollToTop from "@/components/ScrollToTop";
import OfflineIndicator from "@/components/OfflineIndicator";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import { ToastProvider } from "@/components/Toast";
import Providers from "@/components/Providers";
import FinancialChatbot from "@/components/FinancialChatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#08090c",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://fusionfinance.pl"),
  title: {
    default: "FusionFinance.pl - Portal Finansowy | Giełda, Waluty, Kryptowaluty, Analizy Rynkowe",
    template: "%s | FusionFinance.pl",
  },
  description: "FusionFinance.pl - Twój luksusowy portal finansowy. Aktualne kursy walut NBP, notowania giełdowe GPW i światowych indeksów, kryptowaluty Bitcoin i Ethereum, profesjonalne analizy rynkowe. Śledź WIG20, DAX, S&P 500, NASDAQ i więcej w czasie rzeczywistym.",
  keywords: [
    // Główne
    "portal finansowy", "finanse", "rynki finansowe", "wiadomości finansowe",
    // Giełda
    "giełda", "GPW", "WIG20", "WIG", "mWIG40", "sWIG80", "akcje", "obligacje", "notowania giełdowe",
    "DAX", "S&P 500", "NASDAQ", "Dow Jones", "FTSE", "CAC 40", "Nikkei",
    // Waluty
    "waluty", "kursy walut", "FOREX", "EUR/PLN", "USD/PLN", "GBP/PLN", "CHF/PLN",
    "przelicznik walut", "kalkulator walut", "NBP", "kantor online",
    // Kryptowaluty
    "kryptowaluty", "bitcoin", "BTC", "ethereum", "ETH", "crypto", "blockchain",
    "altcoiny", "stablecoiny", "USDT", "DeFi", "NFT", "Web3",
    // Analizy
    "analizy rynkowe", "analiza techniczna", "analiza fundamentalna", "prognozy",
    "inwestycje", "trading", "strategie inwestycyjne",
    // Ekonomia
    "ekonomia", "gospodarka", "PKB", "inflacja", "stopy procentowe", "NBP", "FED", "EBC",
    "biznes", "rynek finansowy", "rynek kapitałowy"
  ],
  authors: [
    { name: "FusionFinance.pl", url: "https://fusionfinance.pl" },
    { name: "Tomasz Chromy", url: "https://tomaszchromy.com" },
  ],
  creator: "Tomasz Chromy",
  publisher: "FusionFinance.pl",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://fusionfinance.pl",
    languages: {
      "pl-PL": "https://fusionfinance.pl",
    },
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://fusionfinance.pl",
    siteName: "FusionFinance.pl",
    title: "FusionFinance.pl - Luksusowy Portal Finansowy",
    description: "Twój elegancki portal finansowy. Aktualne kursy walut, notowania giełdowe GPW i świata, kryptowaluty, profesjonalne analizy rynkowe i wiadomości ze świata finansów.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "FusionFinance.pl - Portal Finansowy | Giełda, Waluty, Kryptowaluty",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@fusionfinance",
    creator: "@fusionfinance",
    title: "FusionFinance.pl - Luksusowy Portal Finansowy",
    description: "Aktualne kursy walut, notowania giełdowe GPW, kryptowaluty i profesjonalne analizy rynkowe.",
    images: {
      url: "/og-image.svg",
      alt: "FusionFinance.pl - Portal Finansowy",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-touch-icon-120x120.png", sizes: "120x120", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#c9a962" },
    ],
  },
  manifest: "/manifest.json",
  category: "finance",
  classification: "Business/Finance/Investment",
  referrer: "origin-when-cross-origin",
  other: {
    "google-site-verification": "YOUR_GOOGLE_VERIFICATION_CODE",
    "msvalidate.01": "YOUR_BING_VERIFICATION_CODE",
    "yandex-verification": "YOUR_YANDEX_VERIFICATION_CODE",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "FusionFinance",
    "application-name": "FusionFinance.pl",
    "msapplication-TileColor": "#08090c",
    "msapplication-config": "/browserconfig.xml",
  },
};

// Schema.org structured data
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FusionFinance.pl",
  "alternateName": "FusionFinance",
  "url": "https://fusionfinance.pl",
  "logo": "https://fusionfinance.pl/logo.png",
  "description": "Luksusowy portal finansowy z aktualnymi kursami walut, notowaniami giełdowymi GPW i światowych indeksów, kryptowalutami oraz profesjonalnymi analizami rynkowymi",
  "foundingDate": "2024",
  "sameAs": [
    "https://twitter.com/fusionfinance",
    "https://facebook.com/fusionfinance",
    "https://linkedin.com/company/fusionfinance"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["Polish", "English"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "PL",
    "addressLocality": "Polska"
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "FusionFinance.pl",
  "alternateName": "FusionFinance",
  "url": "https://fusionfinance.pl",
  "description": "Portal finansowy z aktualnymi kursami walut, notowaniami giełdowymi i analizami rynkowymi",
  "inLanguage": "pl-PL",
  "publisher": {
    "@type": "Organization",
    "name": "FusionFinance.pl"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://fusionfinance.pl/szukaj?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Strona główna",
      "item": "https://fusionfinance.pl"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Rynki",
      "item": "https://fusionfinance.pl/rynki"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Giełda",
      "item": "https://fusionfinance.pl/gielda"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Crypto",
      "item": "https://fusionfinance.pl/crypto"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Waluty",
      "item": "https://fusionfinance.pl/waluty"
    },
    {
      "@type": "ListItem",
      "position": 6,
      "name": "Analizy",
      "item": "https://fusionfinance.pl/analizy"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://galeria.bankier.pl" />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ToastProvider>
            <ServiceWorkerRegistration />
            <OfflineIndicator />
            <KeyboardShortcuts />
            <TopBanner />
            <CurrencyTicker />
            {children}
            <CookieConsent />
            <ScrollToTop />
            <FinancialChatbot />
            <SpeedInsights />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
