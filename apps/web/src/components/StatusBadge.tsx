export function StatusBadge({ status }: { status: string }) {
  const base =
    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border";

  const variants: Record<string, string> = {
    active: "bg-status-active/15 text-status-active border-status-active/25",
    upcoming: "bg-status-upcoming/15 text-status-upcoming border-status-upcoming/25",
    completed: "bg-status-completed/15 text-status-completed border-status-completed/25",
  };

  return (
    <span className={`${base} ${variants[status] ?? variants.upcoming}`}>
      {status === "active" && (
        <span className="w-1.5 h-1.5 rounded-full bg-status-active" />
      )}
      {status}
    </span>
  );
}