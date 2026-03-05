interface SkeletonLoaderProps {
  type: "card" | "text" | "search-progress";
  count?: number;
}

const textWidths = ["w-full", "w-4/5", "w-3/5"];

export function SkeletonLoader({ type, count }: SkeletonLoaderProps) {
  switch (type) {
    case "card": {
      const n = count ?? 3;
      return (
        <div className="flex flex-col gap-3">
          {Array.from({ length: n }, (_, i) => (
            <div
              key={i}
              className="bg-surface-raised rounded-lg h-24 animate-pulse"
            />
          ))}
        </div>
      );
    }

    case "text": {
      const n = count ?? 3;
      return (
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: n }, (_, i) => (
            <div
              key={i}
              className={`bg-surface-raised rounded h-4 animate-pulse ${textWidths[i % textWidths.length]}`}
            />
          ))}
        </div>
      );
    }

    case "search-progress":
      return (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <p key={i} className="text-text-muted text-sm animate-pulse">
              Searching...
            </p>
          ))}
        </div>
      );
  }
}
