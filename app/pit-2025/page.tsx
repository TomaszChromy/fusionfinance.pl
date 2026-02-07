"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticlesPaginated from "@/components/ArticlesPaginated";

export default function Pit2025Page() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />
      <div className="mx-auto max-w-[1200px] px-4 lg:px-6 py-10">
        <Breadcrumbs />
        <PageHero
          title="PIT 2025"
          subtitle="Podatki, rozliczenia, ulgi – przewodnik w stylu money.pl."
          eyebrow="Twoje finanse"
          badge="Sezon podatkowy"
        />
        <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-6 lg:p-8">
          <ArticlesPaginated category="finanse" articlesPerPage={12} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
