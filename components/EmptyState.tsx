"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

// Default icons for common states
const icons = {
  empty: (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  ),
  search: (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  favorites: (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  history: (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  offline: (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
    </svg>
  ),
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = "",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      {/* Icon */}
      <div className="mb-6 text-[#52525b]">
        {icon || icons.empty}
      </div>

      {/* Title */}
      <h3 className="text-[18px] font-medium text-[#f4f4f5] mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-[14px] text-[#71717a] max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap gap-3 justify-center">
          {action && (
            <button
              onClick={action.onClick}
              className="px-5 py-2.5 bg-[#c9a962] hover:bg-[#e4d4a5] text-[#08090c] text-[13px] font-medium rounded-xl transition-colors"
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-[#a1a1aa] text-[13px] font-medium rounded-xl transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Preset empty states
export function NoSearchResults({ query, onClear }: { query?: string; onClear?: () => void }) {
  return (
    <EmptyState
      icon={icons.search}
      title={query ? `Brak wyników dla "${query}"` : "Brak wyników"}
      description="Spróbuj zmienić kryteria wyszukiwania lub sprawdź pisownię."
      action={onClear ? { label: "Wyczyść wyszukiwanie", onClick: onClear } : undefined}
    />
  );
}

export function NoFavorites({ onExplore }: { onExplore?: () => void }) {
  return (
    <EmptyState
      icon={icons.favorites}
      title="Brak ulubionych artykułów"
      description="Dodaj artykuły do ulubionych, aby mieć do nich szybki dostęp."
      action={onExplore ? { label: "Przeglądaj artykuły", onClick: onExplore } : undefined}
    />
  );
}

export function NoHistory({ onExplore }: { onExplore?: () => void }) {
  return (
    <EmptyState
      icon={icons.history}
      title="Brak historii przeglądania"
      description="Artykuły, które odwiedzisz, pojawią się tutaj."
      action={onExplore ? { label: "Przeglądaj artykuły", onClick: onExplore } : undefined}
    />
  );
}

export function ErrorState({
  onRetry,
  title = "Wystąpił błąd",
  description = "Nie udało się załadować danych. Spróbuj ponownie później.",
}: {
  onRetry?: () => void;
  title?: string;
  description?: string;
}) {
  return (
    <EmptyState
      icon={icons.error}
      title={title}
      description={description}
      action={onRetry ? { label: "Spróbuj ponownie", onClick: onRetry } : undefined}
    />
  );
}

export function OfflineState() {
  return (
    <EmptyState
      icon={icons.offline}
      title="Brak połączenia"
      description="Sprawdź połączenie z internetem i spróbuj ponownie."
      action={{ label: "Odśwież stronę", onClick: () => window.location.reload() }}
    />
  );
}
