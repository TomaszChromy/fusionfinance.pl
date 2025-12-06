"use client";

import { ReactNode } from "react";

interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: "pulse" | "shimmer" | "none";
}

export default function Skeleton({
  variant = "text",
  width,
  height,
  className = "",
  animation = "shimmer",
}: SkeletonProps) {
  const variants = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-xl",
  };

  const animations = {
    pulse: "animate-pulse",
    shimmer: "shimmer",
    none: "",
  };

  const defaultHeight = variant === "text" ? "h-4" : "";
  const defaultWidth = variant === "circular" ? "w-10 h-10" : "w-full";

  return (
    <div
      className={`bg-white/10 ${variants[variant]} ${animations[animation]} ${defaultHeight} ${defaultWidth} ${className}`}
      style={{
        width: width,
        height: height,
      }}
    />
  );
}

// Text skeleton with multiple lines
interface TextSkeletonProps {
  lines?: number;
  lastLineWidth?: string;
  className?: string;
}

export function TextSkeleton({ lines = 3, lastLineWidth = "60%", className = "" }: TextSkeletonProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? lastLineWidth : "100%"}
        />
      ))}
    </div>
  );
}

// Card skeleton
export function CardSkeleton({ 
  showImage = true, 
  showAvatar = false,
  className = "" 
}: { 
  showImage?: boolean; 
  showAvatar?: boolean;
  className?: string;
}) {
  return (
    <div className={`bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden ${className}`}>
      {showImage && <Skeleton variant="rectangular" height={200} className="w-full" />}
      <div className="p-5">
        {showAvatar && (
          <div className="flex items-center gap-3 mb-4">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1">
              <Skeleton variant="text" width="40%" className="mb-1" />
              <Skeleton variant="text" width="25%" height={12} />
            </div>
          </div>
        )}
        <Skeleton variant="text" className="mb-2" height={20} />
        <Skeleton variant="text" width="80%" className="mb-3" />
        <TextSkeleton lines={2} />
        <div className="flex gap-2 mt-4">
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
        </div>
      </div>
    </div>
  );
}

// Table skeleton
export function TableSkeleton({ 
  rows = 5, 
  columns = 4,
  className = "" 
}: { 
  rows?: number; 
  columns?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b border-white/10">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" width={`${100 / columns}%`} height={16} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" width={`${100 / columns}%`} />
          ))}
        </div>
      ))}
    </div>
  );
}

// List skeleton
export function ListSkeleton({ 
  items = 5,
  showAvatar = true,
  className = "" 
}: { 
  items?: number;
  showAvatar?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          {showAvatar && <Skeleton variant="circular" width={48} height={48} />}
          <div className="flex-1">
            <Skeleton variant="text" width="60%" className="mb-1" />
            <Skeleton variant="text" width="40%" height={12} />
          </div>
          <Skeleton variant="rounded" width={60} height={28} />
        </div>
      ))}
    </div>
  );
}

// Skeleton wrapper for conditional rendering
interface SkeletonWrapperProps {
  isLoading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
}

export function SkeletonWrapper({ isLoading, skeleton, children }: SkeletonWrapperProps) {
  return isLoading ? <>{skeleton}</> : <>{children}</>;
}

