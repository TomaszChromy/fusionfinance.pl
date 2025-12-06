"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ExportDataProps {
  data: Record<string, unknown>[];
  filename?: string;
  className?: string;
}

export default function ExportData({
  data,
  filename = "export",
  className = "",
}: ExportDataProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  const exportToCSV = () => {
    setExporting("csv");
    try {
      if (data.length === 0) return;

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers.map((h) => {
            const val = row[h];
            const str = val === null || val === undefined ? "" : String(val);
            return `"${str.replace(/"/g, '""')}"`;
          }).join(",")
        ),
      ].join("\n");

      downloadFile(csvContent, `${filename}.csv`, "text/csv;charset=utf-8;");
    } finally {
      setTimeout(() => setExporting(null), 500);
    }
  };

  const exportToJSON = () => {
    setExporting("json");
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      downloadFile(jsonContent, `${filename}.json`, "application/json");
    } finally {
      setTimeout(() => setExporting(null), 500);
    }
  };

  const copyToClipboard = async () => {
    setExporting("copy");
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(jsonContent);
    } finally {
      setTimeout(() => setExporting(null), 1000);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-[#a1a1aa] transition-colors"
      >
        <span>📥</span>
        Eksportuj
        <span className="text-[10px]">▼</span>
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-48 bg-[#0c0d10] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
            >
              <button
                onClick={() => { exportToCSV(); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-[#a1a1aa] hover:bg-white/5 hover:text-[#f4f4f5] transition-colors"
              >
                <span>📄</span>
                {exporting === "csv" ? "Eksportowanie..." : "Eksportuj CSV"}
              </button>
              <button
                onClick={() => { exportToJSON(); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-[#a1a1aa] hover:bg-white/5 hover:text-[#f4f4f5] transition-colors"
              >
                <span>📋</span>
                {exporting === "json" ? "Eksportowanie..." : "Eksportuj JSON"}
              </button>
              <div className="h-px bg-white/5" />
              <button
                onClick={() => { copyToClipboard(); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-[#a1a1aa] hover:bg-white/5 hover:text-[#f4f4f5] transition-colors"
              >
                <span>📎</span>
                {exporting === "copy" ? "Skopiowano!" : "Kopiuj do schowka"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Quick export button (simpler variant)
export function QuickExportButton({
  data,
  filename = "export",
  format = "csv",
  className = "",
}: {
  data: Record<string, unknown>[];
  filename?: string;
  format?: "csv" | "json";
  className?: string;
}) {
  const handleExport = () => {
    if (data.length === 0) return;

    if (format === "json") {
      const content = JSON.stringify(data, null, 2);
      downloadFile(content, `${filename}.json`, "application/json");
    } else {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");
      downloadFile(csvContent, `${filename}.csv`, "text/csv;charset=utf-8;");
    }
  };

  return (
    <button
      onClick={handleExport}
      className={`flex items-center gap-1.5 px-2 py-1 text-xs text-[#71717a] hover:text-[#c9a962] transition-colors ${className}`}
    >
      📥 {format.toUpperCase()}
    </button>
  );
}

