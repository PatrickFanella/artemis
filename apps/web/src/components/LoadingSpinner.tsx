export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-artemis-blue animate-[pulse-subtle_1.5s_ease-in-out_infinite]" />
        <div className="w-2.5 h-2.5 rounded-full bg-artemis-blue animate-[pulse-subtle_1.5s_ease-in-out_0.2s_infinite]" />
        <div className="w-2.5 h-2.5 rounded-full bg-artemis-blue animate-[pulse-subtle_1.5s_ease-in-out_0.4s_infinite]" />
      </div>
    </div>
  );
}