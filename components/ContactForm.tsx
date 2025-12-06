"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ContactFormProps {
  variant?: "default" | "compact" | "inline";
  onSubmit?: (data: FormData) => void;
  className?: string;
}

export default function ContactForm({
  variant = "default",
  onSubmit,
  className = "",
}: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Imię jest wymagane";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email jest wymagany";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Nieprawidłowy format email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Temat jest wymagany";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Wiadomość jest wymagana";
    } else if (formData.message.length < 10) {
      newErrors.message = "Wiadomość musi mieć min. 10 znaków";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
    onSubmit?.(formData);

    // Reset form after success
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSuccess(false);
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-[#0c0d10] border border-[#4ade80]/20 rounded-xl p-8 text-center ${className}`}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#4ade80]/10 flex items-center justify-center">
          <span className="text-3xl">✓</span>
        </div>
        <h3 className="text-lg font-medium text-[#f4f4f5] mb-2">Wiadomość wysłana!</h3>
        <p className="text-sm text-[#71717a]">Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.</p>
      </motion.div>
    );
  }

  const inputClass = (field: keyof FormErrors) =>
    `w-full px-4 py-3 bg-white/5 border rounded-lg text-sm text-[#f4f4f5] placeholder-[#52525b] focus:outline-none transition-colors ${
      errors[field] ? "border-[#f87171]" : "border-white/10 focus:border-[#c9a962]/50"
    }`;

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Imię i nazwisko" className={inputClass("name")} />
          {errors.name && <p className="text-[10px] text-[#f87171] mt-1">{errors.name}</p>}
        </div>
        <div>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={inputClass("email")} />
          {errors.email && <p className="text-[10px] text-[#f87171] mt-1">{errors.email}</p>}
        </div>
      </div>

      <div>
        <select name="subject" value={formData.subject} onChange={handleChange} className={inputClass("subject")}>
          <option value="">Wybierz temat</option>
          <option value="general">Pytanie ogólne</option>
          <option value="bug">Zgłoszenie błędu</option>
          <option value="feature">Propozycja funkcji</option>
          <option value="partnership">Współpraca</option>
          <option value="other">Inne</option>
        </select>
        {errors.subject && <p className="text-[10px] text-[#f87171] mt-1">{errors.subject}</p>}
      </div>

      <div>
        <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Twoja wiadomość..." rows={5} className={inputClass("message")} />
        {errors.message && <p className="text-[10px] text-[#f87171] mt-1">{errors.message}</p>}
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-gradient-to-r from-[#c9a962] to-[#9a7b3c] text-[#08090c] font-medium rounded-lg hover:from-[#d4b872] hover:to-[#a88b4c] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>⟳</motion.span>
            Wysyłanie...
          </span>
        ) : (
          "Wyślij wiadomość"
        )}
      </motion.button>
    </form>
  );
}

