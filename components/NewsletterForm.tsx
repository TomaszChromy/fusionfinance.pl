"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SubmitState = "idle" | "loading" | "success" | "error";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setState("error");
      setErrorMessage("Podaj poprawny adres email");
      return;
    }

    setState("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, frequency: "weekly" }),
      });

      const data = await res.json();

      if (res.ok) {
        setState("success");
        setEmail("");
      } else {
        setState("error");
        setErrorMessage(data.error || "Wystąpił błąd");
      }
    } catch {
      setState("error");
      setErrorMessage("Wystąpił błąd. Spróbuj ponownie.");
    }

    // Reset after 5 seconds
    setTimeout(() => setState("idle"), 5000);
  };

  return (
    <div className="bg-gradient-to-br from-[#0f1115] to-[#0c0d10] border border-white/5 rounded-xl p-6 hover:border-[#c9a962]/20 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#c9a962]/10 flex items-center justify-center">
          <span className="text-xl">📧</span>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#f4f4f5]">Newsletter</h3>
          <p className="text-[10px] text-[#71717a]">Bądź na bieżąco z rynkami</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {state === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 py-3 px-4 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-lg"
          >
            <svg className="w-5 h-5 text-[#22c55e] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-[#22c55e]">Dziękujemy za zapisanie się!</span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <div className="relative">
              <input
                type="email"
                placeholder="Twój adres email..."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-sm text-[#f4f4f5] 
                           placeholder-[#71717a] focus:outline-none transition-colors
                           ${state === "error" 
                             ? "border-[#f87171] focus:border-[#f87171]" 
                             : "border-white/10 focus:border-[#c9a962]/50"
                           }`}
                disabled={state === "loading"}
              />
              {state === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-[#f87171] mt-1"
                >
                  {errorMessage}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={state === "loading"}
              className="w-full py-3 bg-gradient-to-r from-[#c9a962] to-[#9a7b3c] hover:from-[#e4d4a5] hover:to-[#c9a962]
                       text-[#08090c] text-sm font-semibold rounded-lg transition-all duration-300
                       hover:shadow-lg hover:shadow-[#c9a962]/20 disabled:opacity-70 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {state === "loading" ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Zapisywanie...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Zapisz się
                </>
              )}
            </button>

            <p className="text-[9px] text-[#71717a] text-center">
              Zapisując się, zgadzasz się na otrzymywanie wiadomości marketingowych.
              <br />Możesz zrezygnować w każdej chwili.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

