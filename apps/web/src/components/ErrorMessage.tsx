export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center glass-card p-8">
        <p className="text-artemis-red mb-2 font-display font-medium">Something went wrong</p>
        <p className="text-lunar-white/45 text-sm">{message}</p>
      </div>
    </div>
  );
}
