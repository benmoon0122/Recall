import { useState, type FormEvent, type KeyboardEvent } from "react";

interface FollowUpInputProps {
  onSubmit: (value: string) => void;
}

export function FollowUpInput({ onSubmit }: FollowUpInputProps) {
  const [value, setValue] = useState("");

  const hasText = value.trim().length > 0;

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    if (!hasText) return;
    onSubmit(value.trim());
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-border rounded-lg px-4 py-3 flex items-center gap-3"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-text-muted shrink-0"
      >
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a follow-up..."
        className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-sm"
      />
      <button
        type="submit"
        className={`
          rounded-lg p-1 transition-colors shrink-0
          ${hasText ? "bg-primary" : "bg-surface-raised"}
        `}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={hasText ? "white" : "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={hasText ? "" : "text-text-muted"}
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </form>
  );
}
