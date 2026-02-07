import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BreakingNews from "@/components/BreakingNews";
import NBPCurrencyTable from "@/components/NBPCurrencyTable";
import Breadcrumbs from "@/components/Breadcrumbs";
import CurrencyConverter from "@/components/CurrencyConverter";
import CurrencyStrength from "@/components/CurrencyStrength";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Kursy walut NBP - Aktualne notowania | FusionFinance.pl",
  description: "Aktualne kursy walut NBP. Sprawdź kursy średnie EUR, USD, GBP, CHF i innych walut. Tabela A i B Narodowego Banku Polskiego.",
};

export default function KursyWalutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#08090c]">
      <Navbar />
      <BreakingNews />
      
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-[1200px] px-4 lg:px-6">
          <Breadcrumbs />
          <PageHero
            title="Kursy walut"
            subtitle="Aktualne kursy NBP, tabela A/B oraz szybki kalkulator wymiany. PLN vs EUR, USD, GBP, CHF."
            eyebrow="Forex & PLN"
            badge="NBP feed"
          />
          
          {/* Currency Converter */}
          <div className="mb-8">
            <CurrencyConverter />
          </div>

          {/* Currency Table */}
          <NBPCurrencyTable />

          {/* Currency Strength */}
          <div className="mt-8">
            <CurrencyStrength variant="bars" title="Siła głównych walut" />
          </div>

          {/* Info Section */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="bg-[#0c0d10] border border-white/5 rounded-xl p-5 hover:border-[#c9a962]/20 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#c9a962]/10 flex items-center justify-center mb-3">
                <span className="text-xl">📊</span>
              </div>
              <h3 className="text-sm font-semibold text-[#f4f4f5] mb-2">Tabela A</h3>
              <p className="text-xs text-[#71717a]">
                Średnie kursy walut obcych. Publikowane codziennie w dni robocze około godziny 12:00.
              </p>
            </div>
            
            <div className="bg-[#0c0d10] border border-white/5 rounded-xl p-5 hover:border-[#c9a962]/20 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#c9a962]/10 flex items-center justify-center mb-3">
                <span className="text-xl">🏦</span>
              </div>
              <h3 className="text-sm font-semibold text-[#f4f4f5] mb-2">NBP</h3>
              <p className="text-xs text-[#71717a]">
                Narodowy Bank Polski jest źródłem oficjalnych kursów walut w Polsce.
              </p>
            </div>
            
            <div className="bg-[#0c0d10] border border-white/5 rounded-xl p-5 hover:border-[#c9a962]/20 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#c9a962]/10 flex items-center justify-center mb-3">
                <span className="text-xl">⏰</span>
              </div>
              <h3 className="text-sm font-semibold text-[#f4f4f5] mb-2">Aktualizacja</h3>
              <p className="text-xs text-[#71717a]">
                Kursy są aktualizowane automatycznie po publikacji przez NBP.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
