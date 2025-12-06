"use client";

import { useState, ReactNode } from "react";
import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: "default" | "pills" | "underline";
  onChange?: (tabId: string) => void;
  className?: string;
}

export default function Tabs({
  tabs,
  defaultTab,
  variant = "default",
  onChange,
  className = "",
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const variants = {
    default: {
      nav: "flex gap-1 p-1 bg-white/[0.02] border border-white/10 rounded-xl",
      tab: (isActive: boolean) =>
        `relative px-4 py-2 text-[13px] font-medium rounded-lg transition-all ${
          isActive
            ? "text-[#08090c]"
            : "text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-white/5"
        }`,
      indicator: "absolute inset-0 bg-[#c9a962] rounded-lg",
    },
    pills: {
      nav: "flex gap-2",
      tab: (isActive: boolean) =>
        `px-4 py-2 text-[13px] font-medium rounded-full border transition-all ${
          isActive
            ? "bg-[#c9a962]/20 border-[#c9a962]/30 text-[#c9a962]"
            : "bg-white/[0.02] border-white/10 text-[#a1a1aa] hover:text-[#f4f4f5] hover:border-white/20"
        }`,
      indicator: "",
    },
    underline: {
      nav: "flex gap-6 border-b border-white/10",
      tab: (isActive: boolean) =>
        `relative pb-3 text-[13px] font-medium transition-all ${
          isActive ? "text-[#c9a962]" : "text-[#a1a1aa] hover:text-[#f4f4f5]"
        }`,
      indicator: "absolute bottom-0 left-0 right-0 h-[2px] bg-[#c9a962]",
    },
  };

  const style = variants[variant];

  return (
    <div className={className}>
      {/* Tab navigation */}
      <nav className={style.nav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={style.tab(activeTab === tab.id)}
          >
            {variant === "default" && activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className={style.indicator}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && (
                <span className="px-1.5 py-0.5 text-[10px] bg-[#c9a962]/20 text-[#c9a962] rounded-full">
                  {tab.badge}
                </span>
              )}
            </span>
            {variant === "underline" && activeTab === tab.id && (
              <motion.div
                layoutId="underline"
                className={style.indicator}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <motion.div
            key={tab.id}
            initial={false}
            animate={{
              opacity: activeTab === tab.id ? 1 : 0,
              display: activeTab === tab.id ? "block" : "none",
            }}
            transition={{ duration: 0.15 }}
          >
            {tab.content}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

