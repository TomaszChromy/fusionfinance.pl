"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface Notification {
  id: string;
  type: "alert" | "news" | "price" | "system";
  title: string;
  message: string;
  time: Date;
  read: boolean;
  link?: string;
}

const TYPE_CONFIG = {
  alert: { icon: "🔔", color: "text-[#f87171]", bg: "bg-[#f87171]/10" },
  news: { icon: "📰", color: "text-[#60a5fa]", bg: "bg-[#60a5fa]/10" },
  price: { icon: "💰", color: "text-[#4ade80]", bg: "bg-[#4ade80]/10" },
  system: { icon: "⚙️", color: "text-[#a1a1aa]", bg: "bg-white/5" },
};

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", type: "price", title: "Alert cenowy", message: "EUR/PLN przekroczył 4.30 PLN", time: new Date(Date.now() - 5 * 60000), read: false },
  { id: "2", type: "news", title: "Nowa analiza", message: "Perspektywy rynku w Q1 2025", time: new Date(Date.now() - 30 * 60000), read: false },
  { id: "3", type: "alert", title: "Zmiana stóp", message: "RPP utrzymała stopy procentowe", time: new Date(Date.now() - 2 * 3600000), read: true },
  { id: "4", type: "system", title: "Aktualizacja", message: "Nowe funkcje dostępne w aplikacji", time: new Date(Date.now() - 24 * 3600000), read: true },
];

interface NotificationCenterProps {
  className?: string;
}

export default function NotificationCenter({ className = "" }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(MOCK_NOTIFICATIONS);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return "Teraz";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min temu`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} godz. temu`;
    return date.toLocaleDateString("pl-PL");
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#f87171] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 bg-[#0c0d10] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#f4f4f5]">Powiadomienia</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-[#c9a962] hover:text-[#e4d4a5] transition-colors"
                  >
                    Oznacz wszystkie
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-[#52525b] text-sm">
                    Brak powiadomień
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const config = TYPE_CONFIG[notification.type];
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-3 border-b border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors ${
                          !notification.read ? "bg-white/[0.02]" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <span className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center text-sm`}>
                            {config.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium ${!notification.read ? "text-[#f4f4f5]" : "text-[#a1a1aa]"}`}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="w-2 h-2 rounded-full bg-[#c9a962]" />
                              )}
                            </div>
                            <p className="text-xs text-[#71717a] mt-0.5 truncate">{notification.message}</p>
                            <p className="text-[10px] text-[#52525b] mt-1">{formatTime(notification.time)}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-white/5">
                <a href="/powiadomienia" className="block text-center text-xs text-[#c9a962] hover:text-[#e4d4a5] transition-colors">
                  Zobacz wszystkie
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

