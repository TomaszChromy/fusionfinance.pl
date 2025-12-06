"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  type?: "single" | "multiple";
}

interface FilterPanelProps {
  groups: FilterGroup[];
  selected: Record<string, string[]>;
  onChange: (groupId: string, values: string[]) => void;
  onClear?: () => void;
  variant?: "default" | "compact" | "inline";
  className?: string;
}

export default function FilterPanel({
  groups,
  selected,
  onChange,
  onClear,
  variant = "default",
  className = "",
}: FilterPanelProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(groups.map(g => g.id));

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const handleOptionClick = (groupId: string, optionId: string, type: "single" | "multiple" = "multiple") => {
    const currentValues = selected[groupId] || [];
    let newValues: string[];

    if (type === "single") {
      newValues = currentValues.includes(optionId) ? [] : [optionId];
    } else {
      newValues = currentValues.includes(optionId)
        ? currentValues.filter(v => v !== optionId)
        : [...currentValues, optionId];
    }

    onChange(groupId, newValues);
  };

  const totalSelected = Object.values(selected).flat().length;

  if (variant === "inline") {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {groups.map(group => (
          <div key={group.id} className="flex items-center gap-1">
            <span className="text-xs text-[#71717a] mr-1">{group.label}:</span>
            {group.options.map(option => {
              const isSelected = (selected[group.id] || []).includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(group.id, option.id, group.type)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                    isSelected
                      ? "bg-[#c9a962] text-[#08090c] font-medium"
                      : "bg-white/5 text-[#a1a1aa] hover:bg-white/10"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {groups.flatMap(group =>
          group.options.map(option => {
            const isSelected = (selected[group.id] || []).includes(option.id);
            return (
              <button
                key={`${group.id}-${option.id}`}
                onClick={() => handleOptionClick(group.id, option.id, group.type)}
                className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                  isSelected
                    ? "bg-[#c9a962] text-[#08090c] font-medium"
                    : "bg-white/5 text-[#a1a1aa] hover:bg-white/10 border border-white/10"
                }`}
              >
                {option.label}
                {option.count !== undefined && (
                  <span className={`ml-1.5 ${isSelected ? "text-[#08090c]/70" : "text-[#52525b]"}`}>
                    ({option.count})
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    );
  }

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-medium text-[#f4f4f5]">Filtry</span>
          {totalSelected > 0 && (
            <span className="px-1.5 py-0.5 bg-[#c9a962] text-[#08090c] text-[10px] font-bold rounded-full">
              {totalSelected}
            </span>
          )}
        </div>
        {totalSelected > 0 && onClear && (
          <button onClick={onClear} className="text-xs text-[#c9a962] hover:text-[#f4f4f5] transition-colors">
            Wyczyść
          </button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="space-y-4">
        {groups.map(group => (
          <div key={group.id}>
            <button onClick={() => toggleGroup(group.id)} className="flex items-center justify-between w-full text-left mb-2">
              <span className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">{group.label}</span>
              <motion.svg animate={{ rotate: expandedGroups.includes(group.id) ? 180 : 0 }} className="w-4 h-4 text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>
            <AnimatePresence>
              {expandedGroups.includes(group.id) && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-1 overflow-hidden">
                  {group.options.map(option => {
                    const isSelected = (selected[group.id] || []).includes(option.id);
                    return (
                      <button key={option.id} onClick={() => handleOptionClick(group.id, option.id, group.type)} className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors ${isSelected ? "bg-[#c9a962]/10 text-[#c9a962]" : "text-[#a1a1aa] hover:bg-white/5"}`}>
                        <span>{option.label}</span>
                        <div className="flex items-center gap-2">
                          {option.count !== undefined && <span className="text-xs text-[#52525b]">{option.count}</span>}
                          {isSelected && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

