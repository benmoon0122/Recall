import type { SourceType } from "../types";
import { SourceIcon } from "./SourceIcon";

interface SourceCardProps {
  type: SourceType;
  title: string;
  snippet: string;
  timestamp: string;
  badge?: number;
  onClick?: () => void;
}

export function SourceCard({
  type,
  title,
  snippet,
  timestamp,
  badge,
  onClick,
}: SourceCardProps) {
  return (
    <div
      className="bg-panel border border-border rounded-lg p-4 cursor-pointer hover:border-border-hover transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <SourceIcon type={type} />
        <span className="text-[14px] font-medium text-text-primary flex-1 truncate">
          {title}
        </span>
        {badge !== undefined && (
          <span className="bg-primary-muted text-primary rounded-full px-1.5 text-xs font-mono">
            {badge}
          </span>
        )}
      </div>
      <p className="text-text-secondary text-sm line-clamp-2 mb-2">
        {snippet}
      </p>
      <span className="text-text-muted text-xs">{timestamp}</span>
    </div>
  );
}
