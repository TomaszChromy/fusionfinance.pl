"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ListItemProps {
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ListItem({ 
  children, 
  icon, 
  action, 
  onClick,
  className = "" 
}: ListItemProps) {
  const Component = onClick ? motion.button : motion.div;
  
  return (
    <Component
      onClick={onClick}
      whileHover={onClick ? { x: 4 } : undefined}
      className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {icon && (
        <div className="w-8 h-8 rounded-lg bg-[#c9a962]/10 flex items-center justify-center text-[#c9a962] flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0 text-left">{children}</div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </Component>
  );
}

interface ListProps {
  children: ReactNode;
  divided?: boolean;
  className?: string;
}

export default function List({ children, divided = false, className = "" }: ListProps) {
  return (
    <div className={`${divided ? "divide-y divide-white/5" : "space-y-1"} ${className}`}>
      {children}
    </div>
  );
}

// Ordered List with numbers
interface OrderedListProps {
  items: Array<{ id: string; content: ReactNode }>;
  className?: string;
}

export function OrderedList({ items, className = "" }: OrderedListProps) {
  return (
    <ol className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex gap-3"
        >
          <span className="w-6 h-6 rounded-full bg-[#c9a962]/10 text-[#c9a962] text-xs font-medium flex items-center justify-center flex-shrink-0">
            {index + 1}
          </span>
          <div className="flex-1 text-sm text-[#a1a1aa]">{item.content}</div>
        </motion.li>
      ))}
    </ol>
  );
}

// Bullet List
interface BulletListProps {
  items: string[];
  variant?: "default" | "gold" | "check";
  className?: string;
}

export function BulletList({ items, variant = "default", className = "" }: BulletListProps) {
  const bulletStyles = {
    default: "w-1.5 h-1.5 rounded-full bg-[#71717a]",
    gold: "w-1.5 h-1.5 rounded-full bg-[#c9a962]",
    check: "text-[#4ade80]",
  };

  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03 }}
          className="flex items-start gap-3"
        >
          {variant === "check" ? (
            <svg className="w-4 h-4 text-[#4ade80] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span className={`${bulletStyles[variant]} mt-2 flex-shrink-0`} />
          )}
          <span className="text-sm text-[#a1a1aa]">{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}

// Description List (key-value pairs)
interface DescriptionListProps {
  items: Array<{ term: string; description: ReactNode }>;
  className?: string;
}

export function DescriptionList({ items, className = "" }: DescriptionListProps) {
  return (
    <dl className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex flex-col sm:flex-row sm:gap-4">
          <dt className="text-xs text-[#71717a] uppercase tracking-wider sm:w-1/3 mb-1 sm:mb-0">
            {item.term}
          </dt>
          <dd className="text-sm text-[#f4f4f5] sm:w-2/3">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}

