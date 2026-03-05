import type { Citation } from "../types";

interface CitationBadgeProps {
  number: number;
  source?: Citation;
}

export function CitationBadge({ number }: CitationBadgeProps) {
  return (
    <span className="inline-flex items-center justify-center bg-primary-muted rounded-full px-1.5 py-0.5 text-[11px] font-mono text-primary cursor-pointer hover:bg-primary hover:text-white transition-colors align-super">
      {number}
    </span>
  );
}
