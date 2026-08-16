export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="panel p-6 text-center max-w-sm">
        <p className="text-artemis-red font-display font-medium mb-1">Error</p>
        <p className="text-muted text-sm">{message}</p>
      </div>
    </div>
  );
}