interface FollowUpPillProps {
  label: string;
  onClick: () => void;
}

export function FollowUpPill({ label, onClick }: FollowUpPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-border rounded-full px-3 py-1.5 text-[13px] text-text-secondary cursor-pointer hover:border-border-hover hover:text-primary transition-colors"
    >
      {label}
    </button>
  );
}
