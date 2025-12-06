"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TextSelectionPopoverProps {
  containerRef: React.RefObject<HTMLElement | null>;
  onShare?: (text: string, platform: string) => void;
  onHighlight?: (text: string) => void;
}

export default function TextSelectionPopover({
  containerRef,
  onShare,
  onHighlight,
}: TextSelectionPopoverProps) {
  const [selection, setSelection] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const handleMouseUp = useCallback(() => {
    const selectedText = window.getSelection()?.toString().trim();
    
    if (!selectedText || selectedText.length < 5) {
      setSelection(null);
      return;
    }

    // Check if selection is within the container
    const sel = window.getSelection();
    if (!sel || !containerRef.current) return;

    const range = sel.getRangeAt(0);
    const container = containerRef.current;
    
    if (!container.contains(range.commonAncestorContainer)) {
      setSelection(null);
      return;
    }

    const rect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setSelection({
      text: selectedText,
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top - 10,
    });
  }, [containerRef]);

  const handleMouseDown = useCallback(() => {
    setSelection(null);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousedown", handleMouseDown);

    return () => {
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousedown", handleMouseDown);
    };
  }, [containerRef, handleMouseUp, handleMouseDown]);

  const handleCopy = async () => {
    if (!selection) return;
    await navigator.clipboard.writeText(selection.text);
    setSelection(null);
  };

  const handleShareTwitter = () => {
    if (!selection) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`"${selection.text}"`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank", "width=600,height=400");
    onShare?.(selection.text, "twitter");
    setSelection(null);
  };

  const handleHighlight = () => {
    if (!selection) return;
    onHighlight?.(selection.text);
    setSelection(null);
  };

  return (
    <AnimatePresence>
      {selection && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          style={{
            position: "absolute",
            left: selection.x,
            top: selection.y,
            transform: "translateX(-50%) translateY(-100%)",
          }}
          className="z-50 flex items-center gap-1 px-2 py-1.5 bg-[#1a1b1f] border border-white/20 rounded-xl shadow-xl"
        >
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
            title="Kopiuj"
          >
            <svg className="w-4 h-4 text-[#a1a1aa] group-hover:text-[#f4f4f5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>

          {/* Share on Twitter */}
          <button
            onClick={handleShareTwitter}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
            title="Udostępnij na X"
          >
            <svg className="w-4 h-4 text-[#a1a1aa] group-hover:text-[#f4f4f5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>

          {/* Highlight (if handler provided) */}
          {onHighlight && (
            <button
              onClick={handleHighlight}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
              title="Zaznacz"
            >
              <svg className="w-4 h-4 text-[#a1a1aa] group-hover:text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </button>
          )}

          {/* Arrow */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white/20" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

