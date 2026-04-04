export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-lunar-white/60 text-lg">{subtitle}</p>
      )}
    </div>
  );
}
