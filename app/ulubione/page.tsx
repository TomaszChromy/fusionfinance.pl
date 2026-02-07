"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FavoriteButton from "@/components/FavoriteButton";
import { useFavorites } from "@/hooks/useFavorites";
import { NoFavorites } from "@/components/EmptyState";
import { ListSkeleton } from "@/components/Skeleton";
import { ConfirmDialog } from "@/components/Modal";
import { SourceAvatar } from "@/components/Avatar";
import PortfolioWidget from "@/components/PortfolioWidget";
import AlertsPanel from "@/components/AlertsPanel";
import PerformanceChart from "@/components/PerformanceChart";
import PriceAlertForm from "@/components/PriceAlertForm";
import { useState } from "react";
import PageHero from "@/components/PageHero";

export default function UlubionePage() {
  const { favorites, isLoaded, clearFavorites } = useFavorites();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#08090c]">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-[1000px] px-4 lg:px-6">
          <PageHero
            title="Ulubione artykuły"
            subtitle={isLoaded ? `${favorites.length} zapisanych artykułów` : "Ładowanie..."}
            eyebrow="Narzędzia"
            badge="Twoje zapisy"
            rightSlot={
              favorites.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="text-xs text-[#71717a] hover:text-[#f87171] transition-colors"
                >
                  Wyczyść wszystkie
                </button>
              )
            }
          />

          {/* Confirm Dialog */}
          <ConfirmDialog
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={clearFavorites}
            title="Usuń wszystkie ulubione?"
            message="Ta akcja usunie wszystkie zapisane artykuły. Nie można tego cofnąć."
            confirmText="Usuń wszystkie"
            variant="danger"
          />

          {/* Content */}
          {!isLoaded ? (
            <ListSkeleton items={5} showAvatar />
          ) : favorites.length === 0 ? (
            <NoFavorites onExplore={() => router.push("/")} />
          ) : (
            <div className="space-y-4">
              {favorites.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#0c0d10] border border-white/5 rounded-xl p-5 hover:border-[#c9a962]/20 transition-all group"
                >
                  <div className="flex gap-4">
                    {article.image && (
                      <div className="w-24 h-18 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 relative">
                        <Image src={article.image} alt="" fill className="object-cover" unoptimized />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/artykul?title=${encodeURIComponent(article.title)}&desc=${encodeURIComponent(article.description || "")}&source=${encodeURIComponent(article.source || "")}&date=${encodeURIComponent(article.date || "")}&image=${encodeURIComponent(article.image || "")}`}
                        className="block"
                      >
                        <h3 className="text-sm font-medium text-[#f4f4f5] group-hover:text-[#c9a962] transition-colors line-clamp-2 mb-1">
                          {article.title}
                        </h3>
                        {article.description && (
                          <p className="text-xs text-[#71717a] line-clamp-2 mb-2">{article.description}</p>
                        )}
                        <div className="flex items-center gap-3 text-[10px] text-[#71717a]">
                          {article.source && (
                            <span className="flex items-center gap-1.5">
                              <SourceAvatar source={article.source} size="xs" />
                              {article.source}
                            </span>
                          )}
                          {article.date && <span>• {article.date}</span>}
                          <span>• Zapisano {new Date(article.savedAt).toLocaleDateString("pl-PL")}</span>
                        </div>
                      </Link>
                    </div>
                    <FavoriteButton article={article} size="sm" />
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Portfolio Performance */}
          <div className="mt-12">
            <PerformanceChart title="Wydajność ulubionych aktywów" />
          </div>

          {/* Sidebar widgets */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <PortfolioWidget />
            <AlertsPanel />
          </div>

          {/* Price Alert Form */}
          <div className="mt-8 max-w-md">
            <PriceAlertForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
