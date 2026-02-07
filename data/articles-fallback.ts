export interface ArticleDTO {
  slug: string;
  title: string;
  summary: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  source?: string;
  publishedAt: string;
}

export const FALLBACK_ARTICLES: ArticleDTO[] = [
  {
    slug: "strategia-dywidendowa-2025",
    title: "Strategia dywidendowa 2025: które spółki z GPW wyróżniają się stabilnością",
    summary:
      "Przegląd spółek z GPW o przewidywalnych wypłatach i rosnących stopach dywidendy. Analizujemy sektory, payout ratio i ryzyko.",
    content:
      "W 2025 roku inwestorzy dywidendowi skupiają się na spółkach o stabilnych przepływach pieniężnych i konserwatywnym zadłużeniu. Wśród kandydatów znajdują się banki z wysokimi współczynnikami kapitałowymi, spółki energetyczne z rosnącym udziałem OZE oraz wybrane firmy z sektora paliwowego i surowcowego. Kluczowe wskaźniki: payout ratio poniżej 70%, dług netto/EBITDA poniżej 2x, stabilny FCF. Warto również monitorować politykę dywidendową spółek – szczególnie tam, gdzie zarząd deklaruje kontynuację wypłat lub wzrost dywidendy w najbliższych latach.",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=90",
    category: "gielda",
    tags: ["dywidendy", "gpw", "strategie"],
    source: "FusionFinance.pl",
    publishedAt: new Date().toISOString(),
  },
  {
    slug: "budzet-domowy-2025",
    title: "Jak ułożyć budżet domowy w 2025? 5 kroków Money.pl",
    summary: "Proste zasady 50/30/20, poduszka bezpieczeństwa i automatyzacja oszczędzania.",
    content:
      "Model 50/30/20 to dobry start: 50% na potrzeby, 30% na przyjemności, 20% na oszczędności/inwestycje. Ustaw przelewy stałe na konto oszczędnościowe, monitoruj subskrypcje, negocjuj rachunki. Poduszka 3–6 miesięcy wydatków daje spokój przy zmianie pracy.",
    coverImage: "https://images.unsplash.com/photo-1454165205744-3b78555e5572?w=1200&q=90",
    category: "finanse",
    tags: ["budżet", "oszczędzanie", "finanse osobiste", "polska"],
    source: "Money.pl / oprac. FusionFinance",
    publishedAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
  },
  {
    slug: "kredyt-vs-gotowka",
    title: "Kupić na kredyt czy za gotówkę? Bankier.pl porównuje koszty",
    summary: "RRSO, prowizje i ubezpieczenia potrafią podbić cenę finansowania – kiedy kredyt ma sens?",
    content:
      "Przy wyborze kredytu liczy się pełne RRSO, prowizja i cross-sell. Jeśli masz poduszkę i brak alternatywnych inwestycji, kredyt może być droższy niż wypłata gotówki. Zawsze porównaj oferty w porównywarce, negocjuj marżę i unikaj zbędnych ubezpieczeń.",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=90",
    category: "finanse",
    tags: ["kredyt", "rrso", "porownywarka", "polska"],
    source: "Bankier.pl / oprac. FusionFinance",
    publishedAt: new Date(Date.now() - 27 * 3600_000).toISOString(),
  },
  {
    slug: "biznes-pln-umacnia",
    title: "Biznes: PLN mocny, eksporterzy zmieniają strategię cenową",
    summary: "Umocnienie złotego do EUR i USD wymusza renegocjacje cenników i zabezpieczenia kursowe.",
    content:
      "Silny PLN obniża przychody w złotych. Eksporterzy: aktualizacja cenników co kwartał, hedging forward na 3–6 miesięcy, dywersyfikacja walutowa faktur. Ważne: koszty surowców i transportu w USD mogą neutralizować część ryzyka.",
    coverImage: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&q=90",
    category: "biznes",
    tags: ["eksport", "pln", "hedging", "polska"],
    source: "FusionFinance.pl",
    publishedAt: new Date(Date.now() - 28 * 3600_000).toISOString(),
  },
  {
    slug: "pit-2025-ulgi",
    title: "PIT 2025: ulgi i odliczenia, o których łatwo zapomnieć",
    summary: "Ulga na internet, IKZE, darowizny, termomodernizacja – przypomnienie przed rozliczeniem.",
    content:
      "Przed złożeniem PIT-37/PIT-36 sprawdź: darowizny na OPP, ulgę na internet (do 760 zł), IKZE (odliczenie wpłat), termomodernizację (do 53 tys. zł), ulgę rehabilitacyjną, ulgę na dzieci. Korzystaj z e-PIT i miej dowody wpłat.",
    coverImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=90",
    category: "finanse",
    tags: ["pit", "podatki", "ulgi", "polska"],
    source: "Money.pl / oprac. FusionFinance",
    publishedAt: new Date(Date.now() - 29 * 3600_000).toISOString(),
  },
  {
    slug: "notowania-gpw-otwarcie",
    title: "Notowania: WIG20 otwiera się wyżej, energia i banki prowadzą",
    summary: "Poranny przegląd sesji: które sektory ciągną indeksy i gdzie widać największe obroty.",
    content:
      "Na otwarciu WIG20 zyskuje dzięki energetyce i bankom, z lekkim obciążeniem ze strony górnictwa. Obroty skoncentrowane na PKO i PKN. W tle oczekiwania na dane CPI i decyzję EBC. Uwaga na wsparcia Fibo i poziomy L2.",
    coverImage: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=1200&q=90",
    category: "gielda",
    tags: ["wig20", "sesja", "obroty", "polska"],
    source: "Parkiet / oprac. FusionFinance",
    publishedAt: new Date(Date.now() - 30 * 3600_000).toISOString(),
  },
  {
    slug: "porownywarki-konta",
    title: "Porównywarka: konto osobiste 2025 – gdzie najniższe opłaty?",
    summary: "Ranking rachunków osobistych: opłaty za kartę, bankomaty, przelewy natychmiastowe.",
    content:
      "Przy wyborze ROR sprawdź: opłata za kartę i warunki zwolnienia (obrót, wpływ), darmowe wypłaty z bankomatów w PL/UE, przelewy natychmiastowe i BLIK, kantory online wbudowane. Dla oszczędności: konta z promocyjnym oprocentowaniem, ale z limitem kwoty.",
    coverImage: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1200&q=90",
    category: "finanse",
    tags: ["konto", "bank", "porownywarka", "polska"],
    source: "FusionFinance.pl",
    publishedAt: new Date(Date.now() - 31 * 3600_000).toISOString(),
  },
  {
    slug: "global-makro-energia",
    title: "Świat: ceny energii i geopolityka – co napędza rynki surowców?",
    summary: "Rosną napięcia na Bliskim Wschodzie, a magazyny gazu w UE pełne. Jak to wpływa na Brent i TTF?",
    content:
      "Ceny Brent reagują na ryzyko geopolityczne, ale wysoki poziom zapasów w UE chłodzi panikę. TTF spada dzięki ciepłej zimie i LNG z USA, ale ryzykiem są przerwy w dostawach z Norwegii. Inwestorzy obserwują indeks dolara i popyt z Chin.",
    coverImage: "https://images.unsplash.com/photo-1508387024700-9fe5c0b25c95?w=1200&q=90",
    category: "rynki",
    tags: ["energia", "ropa", "gaz", "swiat"],
    source: "Forsal / oprac. FusionFinance",
    publishedAt: new Date(Date.now() - 32 * 3600_000).toISOString(),
  },
  {
    slug: "global-indeksy-usa-azja",
    title: "Świat: USA rekordy, Azja mieszanina – przegląd indeksów",
    summary: "S&P 500 blisko ATH, Nikkei zmienny przez BoJ, Europa w trendzie bocznym.",
    content:
      "USA korzystają z siły big tech i stabilnych wyników. Azja pod presją umacniającego się jena i danych z Chin. Europa w konsolidacji, czeka na ruch EBC. Uwaga na rotację sektorową i korelację z rentownościami 10Y UST.",
    coverImage: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=1200&q=90",
    category: "rynki",
    tags: ["usa", "azja", "indeksy", "swiat"],
    source: "Reuters / oprac. FusionFinance",
    publishedAt: new Date(Date.now() - 33 * 3600_000).toISOString(),
  },
  {
    slug: "fx-hedging-eksporterow",
    title: "Jak eksporterzy mogą tanio zabezpieczyć ryzyko walutowe w 2025?",
    summary:
      "Praktyczny przewodnik po strategiach hedgingowych dla eksporterów: forward, opcje zero-cost collar, natural hedging.",
    content:
      "Zmienność złotego w relacji do EUR i USD ponownie rośnie wraz z cyklem stóp procentowych. Eksporterzy mogą ograniczyć ryzyko kursowe, wykorzystując kontrakty forward (krótkie terminy, precyzyjne dopasowanie wartości), strategie collar (opcje kupna/sprzedaży ograniczające koszt premii) oraz natural hedging (bilansowanie wpływów/wywodów w tej samej walucie). Warto ocenić wpływ zabezpieczeń na marżę operacyjną, rotację kapitału obrotowego oraz wymogi księgowe (hedge accounting).",
    coverImage: "https://images.unsplash.com/photo-1454165205744-3b78555e5572?w=1200&q=90",
    category: "waluty",
    tags: ["forex", "hedging", "eksport"],
    source: "FusionFinance.pl",
    publishedAt: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    slug: "bitcoin-etf-spot-implikacje",
    title: "ETF-y spot na Bitcoina: implikacje dla płynności i zmienności rynku",
    summary:
      "Analizujemy, jak ETF-y spot mogą zmienić profile inwestorów na rynku kryptowalut i jakie ryzyka pozostają.",
    content:
      "Debiut ETF-ów spot na Bitcoina zwiększa dostępność aktywa dla inwestorów instytucjonalnych i detalicznych. Struktura funduszy opartych na fizycznym BTC wpływa na popyt i podaż, a także na mechanizmy arbitrażu pomiędzy ceną ETF a ceną spot. Zmienność może krótkoterminowo rosnąć, ale w dłuższym horyzoncie większa płynność i przejrzystość regulacyjna mogą stabilizować rynek. Ryzyka: koncentracja u depozytariuszy, kwestie bezpieczeństwa custody oraz wpływ na dominance BTC vs altcoiny.",
    coverImage: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&q=90",
    category: "crypto",
    tags: ["bitcoin", "etf", "kryptowaluty"],
    source: "FusionFinance.pl",
    publishedAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    slug: "inflacja-2025-scenariusze",
    title: "Inflacja 2025: scenariusze bazowe i ryzyka dla stóp procentowych",
    summary: "Przegląd scenariuszy inflacyjnych dla Polski i strefy euro oraz ich wpływ na politykę banków centralnych.",
    content:
      "Bazowy scenariusz zakłada stopniowy spadek inflacji bazowej dzięki wygaszaniu efektów podażowych i słabszej dynamice płac realnych. Ryzyka w górę: ceny energii i żywności, napięcia geopolityczne. Ryzyka w dół: słabszy popyt zewnętrzny, mocniejszy złoty. Dla RPP oznacza to przestrzeń do ostrożnych obniżek dopiero po potwierdzeniu trendu dezinflacyjnego; dla EBC – utrzymanie restrykcji do czasu wyraźnego zejścia inflacji bazowej poniżej 3%.",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=90",
    category: "gospodarka",
    tags: ["inflacja", "stopy procentowe", "makro"],
    source: "FusionFinance.pl",
    publishedAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
  },
  {
    slug: "portfel-60-40-w-ery-wysokich-stop",
    title: "Czy portfel 60/40 ma sens przy wyższych stopach procentowych?",
    summary:
      "Oceniamy rolę obligacji skarbowych w klasycznym portfelu 60/40 oraz alternatywy: TIPS, złoto, strategie absolutnej stopy zwrotu.",
    content:
      "Wyższe stopy procentowe zwiększają atrakcyjność obligacji skarbowych jako amortyzatora zmienności akcji. Jednak korelacje akcji/obligacji pozostają zmienne w krótkim terminie, zwłaszcza przy szokach inflacyjnych. Portfel 60/40 można wzbogacić o obligacje indeksowane inflacją (TIPS), krótkoterminowe papiery skarbowe, a także niewielką ekspozycję na złoto lub strategie absolute return. Kluczowe pozostaje rebalancing i kontrola ryzyka duration.",
    coverImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&q=90",
    category: "strategie",
    tags: ["portfel", "obligacje", "dywersyfikacja"],
    source: "FusionFinance.pl",
    publishedAt: new Date(Date.now() - 4 * 3600_000).toISOString(),
  },
  {
    slug: "rynki-usa-sezon-wynikow",
    title: "Wall Street wchodzi w sezon wyników: na co patrzeć w I kwartale?",
    summary:
      "S&P 500 blisko historycznych szczytów, ale spready kredytowe rosną. Sprawdzamy, które sektory mogą pozytywnie zaskoczyć.",
    content:
      "Analitycy prognozują jednocyfrowy wzrost EPS dla spółek z indeksu S&P 500. Największy potencjał niespodzianek widzimy w sektorach technologii chmurowej, półprzewodników oraz finansów, gdzie wyższe stopy procentowe wspierają marże odsetkowe. Ryzykiem pozostają marże w handlu detalicznym i presja płacowa w usługach. W krótkim terminie liczy się guidance zarządów oraz tempo buybacków.",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=90",
    category: "rynki",
    tags: ["usa", "wyniki", "akcje"],
    source: "Reuters / oprac. FusionFinance",
    publishedAt: new Date(Date.now() - 5 * 3600_000).toISOString(),
  },
  {
    slug: "rynki-azja-boj",
    title: "BoJ sygnalizuje koniec ujemnych stóp – co to znaczy dla Nikkei i jena?",
    summary:
      "Bank Japonii przygotowuje rynek na odejście od polityki YCC. Analizujemy wpływ na eksport, jena i kapitał zagraniczny.",
    content:
      "Potencjalne zakończenie kontroli krzywej dochodowości może umocnić jena i ochłodzić entuzjazm wokół rekordowych poziomów Nikkei 225. Spółki eksportowe mogą odczuć presję marż, a inwestorzy zagraniczni – wzrost kosztu zabezpieczenia walutowego. Jednocześnie wyższe rentowności JGB mogą przyciągnąć kapitał z rynku obligacji USA i Europy.",
    coverImage: "https://images.unsplash.com/photo-1445633742902-5e4e1f0b3c89?w=1200&q=90",
    category: "rynki",
    tags: ["azja", "boj", "obligacje"],
    source: "Bloomberg / oprac. FusionFinance",
    publishedAt: new Date(Date.now() - 6 * 3600_000).toISOString(),
  },
  {
    slug: "rynki-europa-stoxx600",
    title: "Europa: defensywa czy wzrost? SToxx 600 balansuje między value a growth",
    summary:
      "Sektor finansowy korzysta ze stóp, ale przemysł cierpi na słabszym popycie. Gdzie szukać alfa na europejskich parkietach?",
    content:
      "W otoczeniu słabszego przemysłu niemieckiego atrakcyjnie wyglądają spółki z sektora obronnego, cyberbezpieczeństwa oraz wybrane utility z ekspozycją na OZE. Rotacja value/growth w Europie pozostaje wrażliwa na ruchy EUR/USD i poziom realnych stóp. Dywidendy i buybacki stają się kluczowym elementem całkowitej stopy zwrotu.",
    coverImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=90",
    category: "rynki",
    tags: ["europa", "akcje", "strategie"],
    source: "FusionFinance.pl",
    publishedAt: new Date(Date.now() - 7 * 3600_000).toISOString(),
  },
  {
    slug: "gielda-top-exchanges",
    title: "20 największych giełd świata: wolumen, godziny handlu i liderzy sektorów",
    summary:
      "Przegląd parkietów od NYSE i NASDAQ po LSE, TSE, HKEX i B3. Dane o wolumenach oraz dominujących sektorach.",
    content:
      "Globalne rynki akcji różnią się strukturą sektorową i płynnością. NYSE/NASDAQ dominują w technologiach i finansach, LSE w surowcach i finansach, TSE w przemyśle i motoryzacji, HKEX w finansach i nieruchomościach, a B3 w surowcach i bankach. Inwestorzy globalni powinni uwzględniać strefy czasowe, koszty transakcyjne, podatki u źródła oraz dostęp do danych rynkowych w czasie rzeczywistym.",
    coverImage: "https://images.unsplash.com/photo-1430163393927-3dab9af7ea38?w=1200&q=90",
    category: "gielda",
    tags: ["giełdy", "dane", "global"],
    source: "FusionFinance.pl",
    publishedAt: new Date(Date.now() - 8 * 3600_000).toISOString(),
  },
];
