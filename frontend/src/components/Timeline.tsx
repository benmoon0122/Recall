import type { TimelineEvent } from "../types";
import { SourceIcon } from "./SourceIcon";

interface TimelineProps {
  events: TimelineEvent[];
}

const dotColorMap: Record<string, string> = {
  slack: "bg-source-slack",
  gmail: "bg-source-gmail",
  meeting: "bg-source-meeting",
  code: "bg-source-code",
};

export function Timeline({ events }: TimelineProps) {
  return (
    <div>
      <h3 className="uppercase text-[11px] text-text-muted tracking-wider font-medium mb-4">
        Decision Timeline
      </h3>
      <div className="relative">
        {events.map((event, index) => {
          const isLast = index === events.length - 1;
          const formattedDate = new Date(event.timestamp).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
            }
          );

          return (
            <div key={index} className="flex gap-3 relative">
              {/* Dot and vertical line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${dotColorMap[event.source_type] ?? "bg-text-muted"}`}
                />
                {!isLast && (
                  <div className="w-px flex-1 border-l border-border" />
                )}
              </div>

              {/* Content */}
              <div className={`pb-5 ${isLast ? "" : ""}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-text-muted">
                    {formattedDate}
                  </span>
                  <SourceIcon type={event.source_type} size="sm" />
                </div>
                <p className="text-[14px] font-medium text-text-primary mb-0.5">
                  {event.title}
                </p>
                <p className="text-[13px] text-text-secondary">
                  {event.snippet}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
