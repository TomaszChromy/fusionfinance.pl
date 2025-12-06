"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export default function TableOfContents({ content, className = "" }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  // Extract headings from content
  const headings = useMemo(() => {
    const result: Heading[] = [];
    
    // Split content into paragraphs and look for heading-like patterns
    const paragraphs = content.split(/\n+/);
    
    paragraphs.forEach((p, index) => {
      const trimmed = p.trim();
      // Look for short, likely heading paragraphs (all caps, ends with colon, or numbered)
      if (
        trimmed.length > 5 && 
        trimmed.length < 100 && 
        (trimmed === trimmed.toUpperCase() || 
         trimmed.endsWith(":") || 
         /^\d+\.\s/.test(trimmed) ||
         /^[A-ZĄĆĘŁŃÓŚŹŻ]/.test(trimmed) && !trimmed.includes("."))
      ) {
        const id = `heading-${index}`;
        result.push({
          id,
          text: trimmed.replace(/[:\d.]+$/, "").trim(),
          level: trimmed === trimmed.toUpperCase() ? 1 : 2,
        });
      }
    });

    return result.slice(0, 10); // Limit to 10 headings
  }, [content]);

  // Track active heading on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -80% 0%" }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden flex items-center gap-2 text-[13px] text-[#c9a962] mb-3"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        Spis treści
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="ml-auto"
        >
          ▼
        </motion.span>
      </button>

      {/* Desktop always visible, mobile collapsible */}
      <AnimatePresence>
        {(isOpen || typeof window !== "undefined" && window.innerWidth >= 1024) && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
              <h4 className="hidden lg:block text-[12px] uppercase tracking-[0.1em] text-[#c9a962] font-medium mb-3">
                Spis treści
              </h4>
              <ul className="space-y-1.5">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
                        setIsOpen(false);
                      }}
                      className={`block text-[13px] py-1.5 px-3 rounded-lg transition-all ${
                        heading.level === 2 ? "pl-6" : ""
                      } ${
                        activeId === heading.id
                          ? "bg-[#c9a962]/10 text-[#c9a962] border-l-2 border-[#c9a962]"
                          : "text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-white/5"
                      }`}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

