const styles: Record<string, string> = {
  active: "bg-status-active/20 text-status-active border-status-active/30",
  upcoming: "bg-status-upcoming/20 text-status-upcoming border-status-upcoming/30",
  completed: "bg-status-completed/20 text-status-completed border-status-completed/30",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] ?? styles.upcoming}`}
    >
      {status === "active" && (
        <span className="w-1.5 h-1.5 rounded-full bg-status-active mr-1.5 animate-pulse" />
      )}
      {status}
    </span>
  );
}
