import type { TopicData } from "../types";
import { SourceIcon } from "./SourceIcon";

interface TopicCardProps {
  topic: TopicData;
  onClick?: () => void;
}

export function TopicCard({ topic, onClick }: TopicCardProps) {
  return (
    <div
      className="bg-panel border border-border rounded-lg p-5 cursor-pointer hover:border-border-hover transition-colors"
      onClick={onClick}
    >
      <h3 className="text-[16px] font-semibold text-text-primary mb-2">
        {topic.name}
      </h3>
      <p className="text-[13px] text-text-secondary mb-3">
        {topic.sourceCount} sources
      </p>
      <div className="flex items-center gap-1.5 mb-3">
        {topic.types.map((type) => (
          <SourceIcon key={type} type={type} size="sm" />
        ))}
      </div>
      <span className="text-xs text-text-muted">Updated {topic.updated}</span>
    </div>
  );
}
