import type { SourceType } from "../types";
import { SourceIcon } from "./SourceIcon";

interface FilterChipProps {
  label: string;
  sourceType?: SourceType;
  active: boolean;
  onClick: () => void;
  count?: number;
}

export function FilterChip({
  label,
  sourceType,
  active,
  onClick,
  count,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm cursor-pointer transition-colors
        ${
          active
            ? "bg-surface-raised text-text-primary"
            : "text-text-secondary hover:text-text-primary"
        }
      `}
    >
      {sourceType && <SourceIcon type={sourceType} size="sm" />}
      <span>{label}</span>
      {count !== undefined && (
        <span className="text-text-muted">{count}</span>
      )}
    </button>
  );
}
