"use client";

export default function TagList({ tags }: { tags?: string[] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 text-[11px] text-[#c9a962]">
      {tags.map(tag => (
        <span key={tag} className="px-2 py-1 rounded-full bg-white/5 border border-white/5">
          #{tag}
        </span>
      ))}
    </div>
  );
}
