export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        <div className="w-10 h-10 border-2 border-artemis-blue/20 rounded-full" />
        <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-t-artemis-blue rounded-full animate-spin" />
        <div className="absolute inset-1 w-8 h-8 border border-transparent border-t-artemis-gold/50 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
      </div>
    </div>
  );
}
