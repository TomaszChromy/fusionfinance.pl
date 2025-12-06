"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useHistory } from "@/hooks/useHistory";
import { NoHistory } from "@/components/EmptyState";
import { ListSkeleton } from "@/components/Skeleton";
import { ConfirmDialog } from "@/components/Modal";
import { SourceAvatar } from "@/components/Avatar";
import { SectionDivider } from "@/components/Divider";
import ReadingStats from "@/components/ReadingStats";

export default function HistoriaPage() {
  const { history, isLoaded, clearHistory, removeFromHistory } = useHistory();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  // Group history by date
  const groupedHistory = history.reduce((acc, item) => {
    const date = new Date(item.viewedAt).toLocaleDateString("pl-PL", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {} as Record<string, typeof history>);

  return (
    <div className="min-h-screen flex flex-col bg-[#08090c]">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-[1000px] px-4 lg:px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-serif font-medium text-[#f4f4f5] mb-2">
                Historia <span className="bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#2563eb] bg-clip-text text-transparent">przeglądania</span>
              </h1>
              <p className="text-[#71717a] text-sm">
                {isLoaded ? `${history.length} ostatnio przeglądanych artykułów` : "Ładowanie..."}
              </p>
            </div>

            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="text-xs text-[#71717a] hover:text-[#f87171] transition-colors"
              >
                Wyczyść historię
              </button>
            )}
          </div>

          {/* Confirm Dialog */}
          <ConfirmDialog
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={clearHistory}
            title="Wyczyść historię?"
            message="Ta akcja usunie całą historię przeglądania. Nie można tego cofnąć."
            confirmText="Wyczyść"
            variant="danger"
          />

          {/* Reading Stats */}
          <ReadingStats className="mb-8" />

          {/* Content */}
          {!isLoaded ? (
            <ListSkeleton items={5} showAvatar />
          ) : history.length === 0 ? (
            <NoHistory onExplore={() => router.push("/")} />
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedHistory).map(([date, items]) => (
                <div key={date}>
                  <SectionDivider title={date} />
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <motion.article
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="bg-[#0c0d10] border border-white/5 rounded-xl p-4 hover:border-[#c9a962]/20 transition-all group relative"
                      >
                        <button
                          type="button"
                          onClick={() => removeFromHistory(item.id)}
                          className="absolute top-3 right-3 p-1.5 text-[#71717a] hover:text-[#f87171] transition-colors opacity-0 group-hover:opacity-100"
                          title="Usuń z historii"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="flex gap-4">
                          {item.image && (
                            <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                              <img src={item.image} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 pr-8">
                            <Link
                              href={`/artykul?title=${encodeURIComponent(item.title)}&desc=${encodeURIComponent(item.description || "")}&source=${encodeURIComponent(item.source || "")}&date=${encodeURIComponent(item.date || "")}&image=${encodeURIComponent(item.image || "")}`}
                              className="block"
                            >
                              <h3 className="text-sm font-medium text-[#f4f4f5] group-hover:text-[#c9a962] transition-colors line-clamp-1 mb-1">
                                {item.title}
                              </h3>
                              <div className="flex items-center gap-2 text-[10px] text-[#71717a]">
                                {item.source && (
                                  <span className="flex items-center gap-1.5">
                                    <SourceAvatar source={item.source} size="xs" />
                                    {item.source}
                                  </span>
                                )}
                                <span>• {new Date(item.viewedAt).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

