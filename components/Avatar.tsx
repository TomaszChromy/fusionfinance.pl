"use client";

import Image from "next/image";
import { ReactNode } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: "online" | "offline" | "away" | "busy";
  badge?: ReactNode;
  className?: string;
}

const sizes: Record<AvatarSize, { container: string; text: string; status: string }> = {
  xs: { container: "w-6 h-6", text: "text-[10px]", status: "w-2 h-2 border" },
  sm: { container: "w-8 h-8", text: "text-[11px]", status: "w-2.5 h-2.5 border" },
  md: { container: "w-10 h-10", text: "text-[13px]", status: "w-3 h-3 border-2" },
  lg: { container: "w-12 h-12", text: "text-[14px]", status: "w-3.5 h-3.5 border-2" },
  xl: { container: "w-16 h-16", text: "text-[16px]", status: "w-4 h-4 border-2" },
};

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-amber-500",
  busy: "bg-red-500",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getColorFromName(name: string): string {
  const colors = [
    "bg-[#c9a962]",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-indigo-500",
  ];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export default function Avatar({
  src,
  alt,
  name,
  size = "md",
  status,
  badge,
  className = "",
}: AvatarProps) {
  const s = sizes[size];

  return (
    <div className={`relative inline-flex ${className}`}>
      {/* Avatar */}
      <div
        className={`${s.container} rounded-full overflow-hidden flex items-center justify-center ${
          src ? "" : name ? getColorFromName(name) : "bg-white/10"
        }`}
      >
        {src ? (
          <Image
            src={src}
            alt={alt || name || "Avatar"}
            fill
            className="object-cover"
          />
        ) : name ? (
          <span className={`${s.text} font-medium text-white`}>{getInitials(name)}</span>
        ) : (
          <svg className="w-1/2 h-1/2 text-[#71717a]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        )}
      </div>

      {/* Status indicator */}
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${s.status} rounded-full border-[#0f1014] ${statusColors[status]}`}
        />
      )}

      {/* Badge */}
      {badge && (
        <span className="absolute -top-1 -right-1">{badge}</span>
      )}
    </div>
  );
}

// Avatar group
interface AvatarGroupProps {
  avatars: Array<{ src?: string; name?: string }>;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({ avatars, max = 4, size = "md", className = "" }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visible.map((avatar, index) => (
        <div
          key={index}
          className="ring-2 ring-[#0f1014] rounded-full"
          style={{ zIndex: visible.length - index }}
        >
          <Avatar src={avatar.src} name={avatar.name} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={`${sizes[size].container} rounded-full bg-white/10 flex items-center justify-center ring-2 ring-[#0f1014]`}
          style={{ zIndex: 0 }}
        >
          <span className={`${sizes[size].text} text-[#a1a1aa]`}>+{remaining}</span>
        </div>
      )}
    </div>
  );
}

// Source avatar (for article sources)
export function SourceAvatar({ 
  source, 
  size = "sm",
  className = "" 
}: { 
  source: string; 
  size?: AvatarSize;
  className?: string;
}) {
  const sourceIcons: Record<string, string> = {
    "bankier.pl": "https://www.google.com/s2/favicons?domain=bankier.pl&sz=64",
    "money.pl": "https://www.google.com/s2/favicons?domain=money.pl&sz=64",
    "biznes.interia.pl": "https://www.google.com/s2/favicons?domain=interia.pl&sz=64",
    "pb.pl": "https://www.google.com/s2/favicons?domain=pb.pl&sz=64",
    "rp.pl": "https://www.google.com/s2/favicons?domain=rp.pl&sz=64",
  };

  const domain = source.toLowerCase();
  const iconUrl = Object.entries(sourceIcons).find(([key]) => domain.includes(key))?.[1];

  return (
    <Avatar
      src={iconUrl}
      name={source}
      size={size}
      className={className}
    />
  );
}

