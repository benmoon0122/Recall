import type { SourceType } from "../types";

interface SourceIconProps {
  type: SourceType;
  size?: "sm" | "md";
}

const sizeMap = {
  sm: 16,
  md: 20,
} as const;

export function SourceIcon({ type, size = "md" }: SourceIconProps) {
  const px = sizeMap[size];

  switch (type) {
    case "slack":
      return (
        <svg
          width={px}
          height={px}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-source-slack"
        >
          <path d="M21 15a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-4 0v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2z" />
          <path d="M3 9a2 2 0 0 0 2-2h2V5a2 2 0 0 0 4 0v6a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2z" />
        </svg>
      );
    case "gmail":
      return (
        <svg
          width={px}
          height={px}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-source-gmail"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 7l-10 6L2 7" />
        </svg>
      );
    case "meeting":
      return (
        <svg
          width={px}
          height={px}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-source-meeting"
        >
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      );
    case "code":
      return (
        <svg
          width={px}
          height={px}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-source-code"
        >
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
  }
}
