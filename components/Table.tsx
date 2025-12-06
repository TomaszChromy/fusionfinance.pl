"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
}

export default function Table<T extends { id?: string | number }>({ 
  data, 
  columns, 
  onRowClick,
  className = "",
  striped = false,
  hoverable = true,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[sortKey];
        const bVal = (b as Record<string, unknown>)[sortKey];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortDir === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      })
    : data;

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                onClick={col.sortable ? () => handleSort(String(col.key)) : undefined}
                className={`px-4 py-3 text-xs font-medium text-[#71717a] uppercase tracking-wider ${
                  alignClass[col.align || "left"]
                } ${col.sortable ? "cursor-pointer hover:text-[#c9a962] transition-colors" : ""}`}
                style={{ width: col.width }}
              >
                <span className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === String(col.key) && (
                    <span className="text-[#c9a962]">
                      {sortDir === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <motion.tr
              key={item.id ?? index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.02 }}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              className={`border-b border-white/5 ${
                striped && index % 2 === 1 ? "bg-white/[0.02]" : ""
              } ${hoverable ? "hover:bg-white/5" : ""} ${
                onRowClick ? "cursor-pointer" : ""
              } transition-colors`}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-4 py-3 text-sm text-[#f4f4f5] ${alignClass[col.align || "left"]}`}
                >
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[String(col.key)] ?? "")}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Simple Data Table
interface SimpleTableProps {
  headers: string[];
  rows: (string | number | ReactNode)[][];
  className?: string;
}

export function SimpleTable({ headers, rows, className = "" }: SimpleTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#c9a962]/20">
            {headers.map((header, i) => (
              <th key={i} className="px-4 py-3 text-xs font-medium text-[#c9a962] uppercase tracking-wider text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-sm text-[#f4f4f5]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

