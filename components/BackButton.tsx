"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface BackButtonProps {
  fallbackPath?: string;
  label?: string;
  showLabel?: boolean;
  variant?: "default" | "minimal" | "pill";
  className?: string;
}

export default function BackButton({
  fallbackPath = "/",
  label = "Wróć",
  showLabel = true,
  variant = "default",
  className = ""
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(fallbackPath);
    }
  };

  const variants = {
    default: "px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c9a962]/30 rounded-xl text-[#a1a1aa] hover:text-[#f4f4f5]",
    minimal: "p-2 hover:bg-white/5 rounded-lg text-[#71717a] hover:text-[#f4f4f5]",
    pill: "px-4 py-1.5 bg-[#c9a962]/10 hover:bg-[#c9a962]/20 border border-[#c9a962]/30 rounded-full text-[#c9a962]",
  };

  return (
    <motion.button
      onClick={handleBack}
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center gap-2 transition-all duration-200 ${variants[variant]} ${className}`}
    >
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
      </svg>
      {showLabel && (
        <span className="text-[13px] font-medium">{label}</span>
      )}
    </motion.button>
  );
}

// Breadcrumb-style back navigation with path
export function BackNavigation({ 
  items 
}: { 
  items: { label: string; href?: string }[] 
}) {
  const router = useRouter();

  return (
    <nav className="flex items-center gap-2 text-[12px]">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && (
            <svg className="w-3 h-3 text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {item.href ? (
            <button
              onClick={() => router.push(item.href!)}
              className="text-[#71717a] hover:text-[#c9a962] transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-[#a1a1aa]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

