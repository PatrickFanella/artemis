const styles: Record<string, string> = {
  active: "bg-status-active/15 text-status-active border-status-active/25 shadow-[0_0_12px_rgba(34,197,94,0.1)]",
  upcoming: "bg-status-upcoming/15 text-status-upcoming border-status-upcoming/25",
  completed: "bg-status-completed/15 text-status-completed border-status-completed/25",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm ${styles[status] ?? styles.upcoming}`}
    >
      {status === "active" && (
        <span className="w-1.5 h-1.5 rounded-full bg-status-active mr-1.5 animate-pulse" />
      )}
      {status}
    </span>
  );
}
