"use client";

import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 13 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="flex items-center justify-center gap-[8px] mt-[34px] pt-[34px] border-t border-white/5"
    >
      {/* Previous button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-[13px] py-[8px] rounded-lg text-[13px] font-medium transition-all duration-300 ${
          currentPage === 1
            ? "bg-[#0f1115] text-[#52525b] cursor-not-allowed"
            : "bg-[#0f1115] text-[#a1a1aa] border border-white/10 hover:border-[#c9a962]/50 hover:text-[#c9a962]"
        }`}
      >
        ← Poprzednia
      </button>

      {/* First page + ellipsis */}
      {startPage > 1 && (
        <>
          <button
            type="button"
            onClick={() => onPageChange(1)}
            className="w-[34px] h-[34px] rounded-lg text-[13px] font-medium bg-[#0f1115] text-[#a1a1aa] border border-white/10 hover:border-[#c9a962]/50 hover:text-[#c9a962] transition-all duration-300"
          >
            1
          </button>
          {startPage > 2 && (
            <span className="text-[#52525b] px-[8px]">...</span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`w-[34px] h-[34px] rounded-lg text-[13px] font-medium transition-all duration-300 ${
            page === currentPage
              ? "bg-[#c9a962] text-[#08090c]"
              : "bg-[#0f1115] text-[#a1a1aa] border border-white/10 hover:border-[#c9a962]/50 hover:text-[#c9a962]"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last page + ellipsis */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="text-[#52525b] px-[8px]">...</span>
          )}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            className="w-[34px] h-[34px] rounded-lg text-[13px] font-medium bg-[#0f1115] text-[#a1a1aa] border border-white/10 hover:border-[#c9a962]/50 hover:text-[#c9a962] transition-all duration-300"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-[13px] py-[8px] rounded-lg text-[13px] font-medium transition-all duration-300 ${
          currentPage === totalPages
            ? "bg-[#0f1115] text-[#52525b] cursor-not-allowed"
            : "bg-[#0f1115] text-[#a1a1aa] border border-white/10 hover:border-[#c9a962]/50 hover:text-[#c9a962]"
        }`}
      >
        Następna →
      </button>
    </motion.div>
  );
}
