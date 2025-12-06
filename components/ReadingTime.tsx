"use client";

import { useMemo } from "react";

interface ReadingTimeProps {
  content: string;
  wordsPerMinute?: number;
  showIcon?: boolean;
  className?: string;
}

export default function ReadingTime({
  content,
  wordsPerMinute = 200,
  showIcon = true,
  className = ""
}: ReadingTimeProps) {
  const readingTime = useMemo(() => {
    // Strip HTML tags and count words
    const text = content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    const wordCount = text.split(" ").filter(word => word.length > 0).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    
    return {
      minutes,
      wordCount,
      text: minutes === 1 ? "1 min czytania" : `${minutes} min czytania`
    };
  }, [content, wordsPerMinute]);

  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] text-[#71717a] ${className}`}>
      {showIcon && (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <span>{readingTime.text}</span>
    </span>
  );
}

// Hook version for custom usage
export function useReadingTime(content: string, wordsPerMinute = 200) {
  return useMemo(() => {
    const text = content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    const wordCount = text.split(" ").filter(word => word.length > 0).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    
    return {
      minutes,
      wordCount,
      text: minutes === 1 ? "1 min czytania" : `${minutes} min czytania`
    };
  }, [content, wordsPerMinute]);
}

