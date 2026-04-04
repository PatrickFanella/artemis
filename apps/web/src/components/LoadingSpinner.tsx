export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-artemis-blue/30 border-t-artemis-blue rounded-full animate-spin" />
    </div>
  );
}
