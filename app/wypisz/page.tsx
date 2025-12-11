"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">("idle");
  const [message, setMessage] = useState("");

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    if (email && token) {
      handleUnsubscribe();
    }
  }, [email, token]);

  const handleUnsubscribe = async () => {
    setStatus("loading");
    try {
      const res = await fetch(`/api/newsletter?email=${email}&token=${token}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Zostałeś wypisany z newslettera.");
      } else {
        setStatus("error");
        setMessage(data.error || "Wystąpił błąd.");
      }
    } catch {
      setStatus("error");
      setMessage("Wystąpił błąd połączenia.");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0c0d10] border border-white/5 rounded-2xl p-8 text-center"
      >
        {status === "loading" && (
          <>
            <div className="w-12 h-12 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#a1a1aa]">Przetwarzanie...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-5xl mb-4">👋</div>
            <h1 className="text-2xl font-serif font-medium text-[#f4f4f5] mb-2">Do zobaczenia!</h1>
            <p className="text-[#a1a1aa] mb-6">{message}</p>
            <p className="text-sm text-[#71717a] mb-6">
              Jeśli zmienisz zdanie, zawsze możesz zapisać się ponownie.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#c9a962] text-[#08090c] font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Powrót na stronę główną
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-serif font-medium text-[#f4f4f5] mb-2">Błąd</h1>
            <p className="text-[#f87171] mb-6">{message}</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-white/10 text-[#f4f4f5] font-medium rounded-lg hover:bg-white/20 transition-colors"
            >
              Powrót na stronę główną
            </Link>
          </>
        )}

        {status === "idle" && (
          <>
            <div className="text-5xl mb-4">📧</div>
            <h1 className="text-2xl font-serif font-medium text-[#f4f4f5] mb-2">Wypisz się z newslettera</h1>
            <p className="text-[#a1a1aa] mb-6">
              {email ? `Czy na pewno chcesz wypisać ${email}?` : "Brak adresu email w linku."}
            </p>
            {email && token && (
              <button
                type="button"
                onClick={handleUnsubscribe}
                className="px-6 py-3 bg-[#f87171] text-white font-medium rounded-lg hover:bg-[#ef4444] transition-colors"
              >
                Tak, wypisz mnie
              </button>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function WypiszPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#08090c]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <Suspense fallback={<div className="text-[#71717a]">Ładowanie...</div>}>
          <UnsubscribeContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

