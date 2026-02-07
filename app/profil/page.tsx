"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ favorites: 0, alerts: 0, watchlist: 0 });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/logowanie");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      // Fetch user stats
      Promise.all([
        fetch("/api/favorites").then(r => r.json()),
        fetch("/api/alerts").then(r => r.json()),
        fetch("/api/watchlist").then(r => r.json()),
      ]).then(([favorites, alerts, watchlist]) => {
        setStats({
          favorites: Array.isArray(favorites) ? favorites.length : 0,
          alerts: Array.isArray(alerts) ? alerts.length : 0,
          watchlist: Array.isArray(watchlist) ? watchlist.length : 0,
        });
      }).catch(console.error);
    }
  }, [session]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#08090c]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!session?.user) return null;

  const initials = session.user.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : session.user.email?.[0].toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <div className="mx-auto max-w-4xl px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0c0d10] border border-white/5 rounded-2xl p-8"
        >
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/5">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={80}
                height={80}
                className="rounded-full object-cover border-2 border-[#c9a962]/30"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c9a962] to-[#8b6914] flex items-center justify-center text-2xl font-medium text-[#08090c]">
                {initials}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-serif font-medium text-[#f4f4f5]">
                {session.user.name || "Użytkownik"}
              </h1>
              <p className="text-[#71717a]">{session.user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Ulubione", value: stats.favorites, icon: "❤️", href: "/ulubione" },
              { label: "Alerty", value: stats.alerts, icon: "🔔", href: "/alerty" },
              { label: "Watchlist", value: stats.watchlist, icon: "👁️", href: "/watchlist" },
            ].map((stat) => (
              <a
                key={stat.label}
                href={stat.href}
                className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center hover:border-[#c9a962]/30 transition-colors"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-medium text-[#f4f4f5]">{stat.value}</div>
                <div className="text-xs text-[#71717a]">{stat.label}</div>
              </a>
            ))}
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-[#a1a1aa] mb-3">Szybkie akcje</h2>
            {[
              { label: "Moje ulubione artykuły", href: "/ulubione", icon: "📰" },
              { label: "Alerty cenowe", href: "/alerty", icon: "📊" },
              { label: "Lista obserwowanych", href: "/watchlist", icon: "📋" },
              { label: "Ustawienia powiadomień", href: "/ustawienia", icon: "⚙️" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl transition-colors"
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-[#f4f4f5]">{link.label}</span>
                <svg className="w-4 h-4 text-[#52525b] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
