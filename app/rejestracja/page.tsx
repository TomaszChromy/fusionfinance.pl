"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Hasła nie są identyczne");
      return;
    }

    if (password.length < 8) {
      setError("Hasło musi mieć minimum 8 znaków");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Wystąpił błąd");
        return;
      }

      // Auto login after registration
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
    } catch {
      setError("Wystąpił błąd podczas rejestracji");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <div className="mx-auto max-w-md px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0c0d10] border border-white/5 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-medium text-[#f4f4f5] mb-2">
              Utwórz konto
            </h1>
            <p className="text-sm text-[#71717a]">
              Dołącz do FusionFinance za darmo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#71717a] mb-1.5">Imię</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5] placeholder-[#52525b] focus:outline-none focus:border-[#c9a962]/50 transition-colors"
                placeholder="Jan"
              />
            </div>

            <div>
              <label className="block text-xs text-[#71717a] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5] placeholder-[#52525b] focus:outline-none focus:border-[#c9a962]/50 transition-colors"
                placeholder="twoj@email.pl"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-[#71717a] mb-1.5">Hasło</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5] placeholder-[#52525b] focus:outline-none focus:border-[#c9a962]/50 transition-colors"
                placeholder="Minimum 8 znaków"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-[#71717a] mb-1.5">Powtórz hasło</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#f4f4f5] placeholder-[#52525b] focus:outline-none focus:border-[#c9a962]/50 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-[#f87171] text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#c9a962] to-[#b8943d] text-[#08090c] font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Rejestracja..." : "Zarejestruj się"}
            </button>
          </form>

          <p className="text-center text-sm text-[#71717a] mt-6">
            Masz już konto?{" "}
            <Link href="/logowanie" className="text-[#c9a962] hover:underline">
              Zaloguj się
            </Link>
          </p>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}

