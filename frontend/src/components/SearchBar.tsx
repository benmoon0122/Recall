import { type FormEvent, type KeyboardEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (val: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search across all sources...",
}: SearchBarProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(value);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(value);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-border rounded-lg focus-within:border-primary transition-colors flex items-center gap-3 px-4 py-3"
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
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-sm"
      />
      <span className="font-mono text-xs text-text-muted bg-surface-raised rounded px-1.5 py-0.5 shrink-0">
        {"\u2318"}K
      </span>
    </form>
  );
}
