export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-[#1A1A1A] border border-border flex items-center justify-center">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
          <path d="M9 21h6" />
          <path d="M10 17v4" />
          <path d="M14 17v4" />
          <path d="M12 2v7" />
          <path d="M8 6l4 3 4-3" />
        </svg>
      </div>
      <span className="text-[15px] font-semibold tracking-tight text-text-primary">
        Recall
      </span>
    </div>
  );
}
