"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface ReadingProgressBarProps {
  color?: string;
  height?: number;
  showPercentage?: boolean;
}

export default function ReadingProgressBar({
  color = "#c9a962",
  height = 3,
  showPercentage = false
}: ReadingProgressBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Show after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setPercentage(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  if (!isVisible) return null;

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] origin-left"
        style={{
          scaleX,
          height,
          background: `linear-gradient(90deg, ${color}cc, ${color})`,
          boxShadow: `0 0 10px ${color}40`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Percentage indicator */}
      {showPercentage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-[61] px-3 py-1.5 bg-[#0c0d10]/90 backdrop-blur-sm border border-white/10 rounded-full"
        >
          <span className="text-[11px] font-medium" style={{ color }}>
            {percentage}%
          </span>
        </motion.div>
      )}
    </>
  );
}

