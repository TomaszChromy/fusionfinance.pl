"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function FinancialChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Cześć! Jestem FinBot 🤖 Jak mogę Ci pomóc w sprawach finansowych?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: messages }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || data.error || "Błąd" }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Przepraszam, wystąpił błąd. Spróbuj ponownie." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? "✕" : "💬"}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-[#1a1a2e] border border-[#c9a962]/30 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-3 border-b border-[#c9a962]/20">
              <h3 className="text-[#c9a962] font-semibold flex items-center gap-2">
                <span>🤖</span> FinBot
                <span className="text-xs text-[#a1a1aa] font-normal">• Asystent finansowy</span>
              </h3>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                      msg.role === "user"
                        ? "bg-[#c9a962] text-black"
                        : "bg-[#2a2a3e] text-white border border-[#c9a962]/20"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#2a2a3e] px-4 py-2 rounded-lg text-[#a1a1aa] text-sm animate-pulse">
                    FinBot pisze...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[#c9a962]/20 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Zadaj pytanie..."
                className="flex-1 bg-[#2a2a3e] border border-[#c9a962]/20 rounded-lg px-3 py-2 text-sm text-white placeholder-[#71717a] focus:outline-none focus:border-[#c9a962]"
                maxLength={500}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-[#c9a962] text-black px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50 hover:bg-[#d4b86a] transition-colors"
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

