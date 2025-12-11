"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#08090c] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-6xl mb-6">📡</div>
        
        <h1 className="text-2xl font-serif font-medium text-[#f4f4f5] mb-3">
          Brak połączenia
        </h1>
        
        <p className="text-[#71717a] mb-6">
          Wygląda na to, że jesteś offline. Sprawdź połączenie z internetem i spróbuj ponownie.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-[#c9a962] text-[#08090c] font-medium rounded-xl hover:bg-[#e4d4a5] transition-colors"
          >
            Odśwież stronę
          </button>
          
          <Link
            href="/"
            className="block w-full px-6 py-3 border border-white/10 text-[#f4f4f5] rounded-xl hover:bg-white/5 transition-colors"
          >
            Strona główna
          </Link>
        </div>

        <p className="text-xs text-[#52525b] mt-8">
          Niektóre dane mogą być dostępne z pamięci podręcznej
        </p>
      </motion.div>
    </div>
  );
}

