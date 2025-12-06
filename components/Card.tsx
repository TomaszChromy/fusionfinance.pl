"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "elevated" | "outlined" | "glass";
  hover?: boolean;
  onClick?: () => void;
  className?: string;
}

const variants = {
  default: "bg-white/[0.02] border border-white/10",
  elevated: "bg-[#1a1b1f] border border-white/10 shadow-xl",
  outlined: "bg-transparent border border-white/20",
  glass: "bg-white/5 backdrop-blur-xl border border-white/10",
};

export default function Card({
  children,
  variant = "default",
  hover = false,
  onClick,
  className = "",
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)" } : {}}
      onClick={onClick}
      className={`rounded-2xl overflow-hidden ${variants[variant]} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Card header
export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-5 py-4 border-b border-white/10 ${className}`}>{children}</div>;
}

// Card body
export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}

// Card footer
export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-5 py-3 border-t border-white/10 bg-white/[0.02] ${className}`}>{children}</div>;
}

// Article card
interface ArticleCardProps {
  title: string;
  description?: string;
  image?: string;
  date?: string;
  category?: string;
  readingTime?: number;
  href?: string;
  featured?: boolean;
  className?: string;
}

export function ArticleCard({
  title,
  description,
  image,
  date,
  category,
  readingTime,
  href,
  featured = false,
  className = "",
}: ArticleCardProps) {
  const Wrapper = href ? "a" : "div";

  return (
    <Card hover variant="default" className={className}>
      <Wrapper href={href} className="block">
        {/* Image */}
        {image && (
          <div className={`relative ${featured ? "aspect-[16/9]" : "aspect-[2/1]"} overflow-hidden`}>
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {category && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#c9a962]/90 text-[#08090c] text-[10px] font-bold uppercase rounded-full">
                {category}
              </span>
            )}
          </div>
        )}

        {/* Content */}
        <CardBody>
          <h3 className={`font-semibold text-[#f4f4f5] line-clamp-2 mb-2 ${
            featured ? "text-[18px]" : "text-[15px]"
          }`}>
            {title}
          </h3>
          {description && (
            <p className="text-[13px] text-[#a1a1aa] line-clamp-2 mb-3">
              {description}
            </p>
          )}
          <div className="flex items-center gap-3 text-[11px] text-[#71717a]">
            {date && <time>{date}</time>}
            {readingTime && (
              <>
                <span>•</span>
                <span>{readingTime} min czytania</span>
              </>
            )}
          </div>
        </CardBody>
      </Wrapper>
    </Card>
  );
}

// Stats card
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  className?: string;
}

export function StatsCard({ title, value, change, icon, className = "" }: StatsCardProps) {
  return (
    <Card variant="default" className={className}>
      <CardBody className="flex items-start justify-between">
        <div>
          <p className="text-[12px] text-[#71717a] mb-1">{title}</p>
          <p className="text-[24px] font-bold text-[#f4f4f5]">{value}</p>
          {change !== undefined && (
            <p className={`text-[12px] mt-1 ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
              {change >= 0 ? "+" : ""}{change}%
            </p>
          )}
        </div>
        {icon && <div className="p-3 bg-[#c9a962]/10 rounded-xl text-[#c9a962]">{icon}</div>}
      </CardBody>
    </Card>
  );
}

