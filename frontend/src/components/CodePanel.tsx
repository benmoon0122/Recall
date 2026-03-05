interface CodePanelProps {
  filename: string;
  language: string;
  code: string;
  highlightLines?: number[];
}

export function CodePanel({
  filename,
  language,
  code,
  highlightLines = [],
}: CodePanelProps) {
  const lines = code.split("\n");
  const highlightSet = new Set(highlightLines);

  return (
    <div className="rounded-lg overflow-hidden border border-border">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-border">
        <div className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-muted"
          >
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          <span className="font-mono text-sm text-text-secondary">
            {filename}
          </span>
        </div>
        <span className="font-mono text-xs text-text-muted bg-surface-raised rounded px-2 py-0.5">
          {language}
        </span>
      </div>

      {/* Code block */}
      <div className="bg-panel p-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, index) => {
              const lineNum = index + 1;
              const isHighlighted = highlightSet.has(lineNum);

              return (
                <tr key={lineNum}>
                  <td
                    className={`text-right pr-4 select-none font-mono text-[13px] text-text-muted w-8 align-top ${
                      isHighlighted ? "border-l-2 border-primary bg-primary-muted/10" : ""
                    }`}
                  >
                    {lineNum}
                  </td>
                  <td
                    className={`font-mono text-[13px] text-text-primary whitespace-pre ${
                      isHighlighted ? "bg-primary-muted/10" : ""
                    }`}
                  >
                    {line}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
