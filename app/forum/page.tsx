"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticlesPaginated from "@/components/ArticlesPaginated";

export default function ForumPage() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />
      <div className="mx-auto max-w-[1200px] px-4 lg:px-6 py-10">
        <Breadcrumbs />
        <PageHero
          title="Forum"
          subtitle="Dyskusje inwestorów, komentarze, przegląd tematów z rynku – feed artykułów jako inspiracja."
          eyebrow="Społeczność"
          badge="Read-only"
        />
        <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-6 lg:p-8">
          <ArticlesPaginated category="gielda" articlesPerPage={12} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
