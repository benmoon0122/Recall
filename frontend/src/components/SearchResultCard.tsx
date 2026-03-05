import type { Source } from "../types";
import { SourceIcon } from "./SourceIcon";

interface SearchResultCardProps {
  source: Source;
  onClick?: () => void;
}

export function SearchResultCard({ source, onClick }: SearchResultCardProps) {
  const formattedDate = new Date(source.timestamp).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div
      className="p-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <SourceIcon type={source.source_type} />
        <span className="text-[15px] font-semibold text-text-primary truncate">
          {source.title}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
        {source.author && <span>{source.author}</span>}
        {source.author && source.channel_or_subject && (
          <span className="text-text-muted">&middot;</span>
        )}
        {source.channel_or_subject && (
          <span>{source.channel_or_subject}</span>
        )}
        {(source.author || source.channel_or_subject) && (
          <span className="text-text-muted">&middot;</span>
        )}
        <span>{formattedDate}</span>
      </div>
      <p className="text-[13px] text-text-secondary line-clamp-2">
        {source.snippet}
      </p>
    </div>
  );
}
