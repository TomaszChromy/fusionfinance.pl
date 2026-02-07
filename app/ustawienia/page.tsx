"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type SettingsState = {
  emailNotifications: boolean;
  priceAlerts: boolean;
  weeklyDigest: boolean;
  marketOpen: boolean;
};

type SettingRowProps = {
  label: string;
  description: string;
  settingKey: keyof SettingsState;
  value: boolean;
  onToggle: (key: keyof SettingsState) => void;
};

const SettingRow = ({ label, description, settingKey, value, onToggle }: SettingRowProps) => (
  <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
    <div>
      <p className="text-[#f4f4f5] font-medium">{label}</p>
      <p className="text-sm text-[#71717a]">{description}</p>
    </div>
    <button
      onClick={() => onToggle(settingKey)}
      className={`w-12 h-6 rounded-full transition-colors relative ${value ? "bg-[#c9a962]" : "bg-white/10"}`}
    >
      <motion.div
        animate={{ x: value ? 24 : 2 }}
        className="w-5 h-5 bg-white rounded-full absolute top-0.5"
      />
    </button>
  </div>
);

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    priceAlerts: true,
    weeklyDigest: true,
    marketOpen: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/logowanie");
  }, [status, router]);

  const handleToggle = useCallback((key: keyof SettingsState) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  }, []);

  const handleSave = () => {
    // In production, save to API
    localStorage.setItem("userSettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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

  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />
      <div className="mx-auto max-w-2xl px-5 py-20">
        <h1 className="text-2xl font-serif font-medium text-[#f4f4f5] mb-8">⚙️ Ustawienia</h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0c0d10] border border-white/5 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-medium text-[#f4f4f5] mb-4">Powiadomienia</h2>
          <SettingRow label="Powiadomienia email" description="Otrzymuj powiadomienia na email" settingKey="emailNotifications" value={settings.emailNotifications} onToggle={handleToggle} />
          <SettingRow label="Alerty cenowe" description="Powiadomienia o osiągnięciu ceny docelowej" settingKey="priceAlerts" value={settings.priceAlerts} onToggle={handleToggle} />
          <SettingRow label="Tygodniowy digest" description="Podsumowanie rynku co tydzień" settingKey="weeklyDigest" value={settings.weeklyDigest} onToggle={handleToggle} />
          <SettingRow label="Otwarcie rynku" description="Powiadomienie o otwarciu GPW" settingKey="marketOpen" value={settings.marketOpen} onToggle={handleToggle} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0c0d10] border border-white/5 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-medium text-[#f4f4f5] mb-4">Konto</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-[#f4f4f5]">Email</p>
                <p className="text-sm text-[#71717a]">{session?.user?.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-[#f4f4f5]">Nazwa</p>
                <p className="text-sm text-[#71717a]">{session?.user?.name || "Nie ustawiono"}</p>
              </div>
              <button className="text-sm text-[#c9a962] hover:underline">Edytuj</button>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          <button onClick={handleSave} className="px-6 py-3 bg-gradient-to-r from-[#c9a962] to-[#b8943d] text-[#08090c] font-medium rounded-xl hover:opacity-90 transition-opacity">
            Zapisz zmiany
          </button>
          {saved && (
            <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[#22c55e] text-sm">
              ✓ Zapisano
            </motion.span>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
