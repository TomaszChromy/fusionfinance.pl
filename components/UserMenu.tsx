"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/logowanie"
        className="px-4 py-2 text-sm font-medium text-[#08090c] bg-gradient-to-r from-[#c9a962] to-[#b8943d] rounded-lg hover:opacity-90 transition-opacity"
      >
        Zaloguj się
      </Link>
    );
  }

  const initials = session.user.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : session.user.email?.[0].toUpperCase() || "U";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-white/[0.05] transition-colors"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full object-cover border border-[#c9a962]/30"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a962] to-[#8b6914] flex items-center justify-center text-xs font-medium text-[#08090c]">
            {initials}
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-[#0c0d10] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-white/5">
              <p className="text-sm font-medium text-[#f4f4f5] truncate">
                {session.user.name || "Użytkownik"}
              </p>
              <p className="text-xs text-[#71717a] truncate">{session.user.email}</p>
            </div>

            <div className="p-2">
              <Link
                href="/profil"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-white/[0.05] rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mój profil
              </Link>
              <Link
                href="/ulubione"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-white/[0.05] rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Ulubione
              </Link>
              <Link
                href="/alerty"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-white/[0.05] rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Alerty cenowe
              </Link>
            </div>

            <div className="p-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-[#f87171] hover:bg-[#f87171]/10 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Wyloguj się
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

