export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <p className="text-red-400 mb-2">Something went wrong</p>
        <p className="text-lunar-white/50 text-sm">{message}</p>
      </div>
    </div>
  );
}
