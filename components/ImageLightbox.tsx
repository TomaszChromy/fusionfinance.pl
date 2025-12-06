"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ImageLightboxProps {
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
}

export default function ImageLightbox({ src, alt, className = "", children }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
    if (e.key === "+" || e.key === "=") setScale((s) => Math.min(s + 0.25, 3));
    if (e.key === "-") setScale((s) => Math.max(s - 0.25, 0.5));
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      setScale(1);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  return (
    <>
      {/* Clickable image */}
      <div 
        onClick={() => setIsOpen(true)} 
        className={`cursor-zoom-in relative group ${className}`}
      >
        {children || (
          <Image src={src} alt={alt} fill className="object-cover" unoptimized />
        )}
        {/* Zoom icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <div className="p-2 bg-black/50 backdrop-blur-sm rounded-full">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            {/* Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                onClick={(e) => { e.stopPropagation(); setScale((s) => Math.min(s + 0.25, 3)); }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setScale((s) => Math.max(s - 0.25, 0.5)); }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                </svg>
              </button>
              <span className="text-white text-[12px] px-2">{Math.round(scale * 100)}%</span>
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors ml-2"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-[90vw] max-h-[85vh] cursor-move"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={src}
                alt={alt}
                width={1600}
                height={900}
                className="object-contain max-h-[85vh] w-auto"
                unoptimized
              />
            </motion.div>

            {/* Caption */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
              <p className="text-white/70 text-[13px] px-4 py-2 bg-black/50 rounded-lg">
                {alt}
              </p>
              <p className="text-white/40 text-[11px] mt-2">
                ESC aby zamknąć • +/- aby powiększyć/pomniejszyć
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

