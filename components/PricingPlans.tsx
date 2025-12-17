"use client";

import { motion } from "framer-motion";
import Card from "./Card";
import Button from "./Button";
import { useState } from "react";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: string[];
  highlight?: boolean;
  limits?: {
    apiCalls?: number;
    articles?: number;
    alerts?: number;
    customReports?: boolean;
  };
}

const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Darmowy",
    price: 0,
    currency: "zł",
    period: "na zawsze",
    description: "Dla zapoznania się z portalem",
    features: [
      "Dostęp do artykułów",
      "Ulubione (max 10)",
      "Podstawowe kursy walut",
      "Historia przeglądania",
      "Newsletter cotygodniowy",
    ],
    limits: {
      apiCalls: 100,
      articles: -1,
      alerts: 3,
      customReports: false,
    },
  },
  {
    id: "basic",
    name: "Basic",
    price: 29,
    currency: "zł",
    period: "/ miesiąc",
    description: "Dla początkujących inwestorów",
    features: [
      "Wszystko z planu darmowego",
      "Ulubione (max 100)",
      "Zaawansowane wykresy",
      "Do 10 alertów cenowych",
      "Newsletter codzienny",
      "Streszczenia artykułów AI",
      "Rekomendacje personalizowane",
    ],
    limits: {
      apiCalls: 1000,
      articles: -1,
      alerts: 10,
      customReports: false,
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    currency: "zł",
    period: "/ miesiąc",
    description: "Dla profesjonalnych traderów",
    highlight: true,
    features: [
      "Wszystko z planu Basic",
      "Ulubione (bez limitu)",
      "Zaawansowana analiza techniczna",
      "Bez limitu alertów",
      "Dostęp do prywatnych analiz",
      "API dostęp (5000 req/dzień)",
      "Priorytetowe wsparcie",
      "Eksport danych",
    ],
    limits: {
      apiCalls: 5000,
      articles: -1,
      alerts: -1,
      customReports: true,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 0, // Custom pricing
    currency: "zł",
    period: "/ miesiąc",
    description: "Dla instytucji i firm",
    features: [
      "Wszystko z planu Pro",
      "Bez limitów API",
      "Dedykowany manager",
      "Integracje custom",
      "White-label opcje",
      "Wsparcie 24/7",
      "Szkolenia zespołu",
      "Custom features",
    ],
    limits: {
      apiCalls: -1,
      articles: -1,
      alerts: -1,
      customReports: true,
    },
  },
];

export default function PricingPlans() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") return;

    setLoading(true);
    try {
      const response = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      }
    } catch (error) {
      console.error("Failed to create checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <h2 className="text-3xl lg:text-4xl font-serif font-medium text-[#f4f4f5]">
          Plany subskrypcji
        </h2>
        <p className="text-lg text-[#a1a1aa] max-w-2xl mx-auto">
          Wybierz plan, który najlepiej odpowiada Twoim potrzebom. Zawsze możesz
          zmienić plan w dowolnym momencie.
        </p>
      </motion.div>

      {/* Pricing Cards Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={plan.id}
            variants={itemVariants}
            className={plan.highlight ? "lg:scale-105" : ""}
          >
            <Card
              className={`p-8 flex flex-col h-full transition-all duration-300 ${
                plan.highlight
                  ? "ring-2 ring-[#c9a962] shadow-2xl shadow-[#c9a962]/20"
                  : ""
              }`}
            >
              {/* Plan Badge */}
              {plan.highlight && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-[#08090c] bg-gradient-to-r from-[#c9a962] to-[#e4d4a5] rounded-full">
                    🌟 POLECANE
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-serif font-medium text-[#f4f4f5] mb-2">
                {plan.name}
              </h3>
              <p className="text-sm text-[#71717a] mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                {plan.price === 0 && plan.id === "enterprise" ? (
                  <div>
                    <p className="text-4xl font-serif font-medium text-[#c9a962]">
                      Custom
                    </p>
                    <p className="text-sm text-[#71717a]">
                      Wycena indywidualna
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl font-serif font-medium text-[#f4f4f5]">
                      {plan.price}
                    </span>
                    <span className="text-sm text-[#71717a] ml-1">
                      {plan.currency} {plan.period}
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg
                      className="w-4 h-4 text-[#c9a962] flex-shrink-0 mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-[#a1a1aa]">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              {plan.id === "free" ? (
                <button
                  disabled
                  className="w-full py-3 rounded-lg border border-[#c9a962]/30 text-[#c9a962] font-medium hover:bg-white/[0.02] transition-colors"
                >
                  Plan darmowy
                </button>
              ) : plan.id === "enterprise" ? (
                <button
                  onClick={() =>
                    window.location.href =
                      "mailto:tomasz.chromy@outlook.com?subject=Enterprise Plan"
                  }
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#c9a962] to-[#e4d4a5] text-black font-medium hover:shadow-lg hover:shadow-[#c9a962]/30 transition-all"
                >
                  Skontaktuj się
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#c9a962] to-[#e4d4a5] text-black font-medium hover:shadow-lg hover:shadow-[#c9a962]/30 transition-all disabled:opacity-50"
                >
                  {loading ? "Ładowanie..." : "Wybieram ten plan"}
                </button>
              )}
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* FAQ Section */}
      <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
        <Card className="p-8">
          <h3 className="text-xl font-serif font-medium text-[#f4f4f5] mb-6">
            Często zadawane pytania
          </h3>
          <div className="space-y-6">
            {[
              {
                q: "Czy mogę zmienić plan w dowolnym momencie?",
                a: "Tak! Możesz zmienić plan w ustawieniach konta. Zmiana obowiązuje od następnego okresu rozliczeniowego.",
              },
              {
                q: "Co się stanie, jeśli anuluję subskrypcję?",
                a: "Twoje konto zmieni się na plan darmowy. Nie stracisz danych - możesz je pobrać w dowolnym momencie.",
              },
              {
                q: "Jakie są gwarancje zwrotu pieniędzy?",
                a: "Oferujemy 14-dniową gwarancję zwrotu pieniędzy. Jeśli nie jesteś zadowolony, skontaktuj się z supportem.",
              },
            ].map((faq, i) => (
              <div key={i} className="pb-6 border-b border-white/10 last:border-0">
                <p className="font-semibold text-[#f4f4f5] mb-2">{faq.q}</p>
                <p className="text-sm text-[#a1a1aa]">{faq.a}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
