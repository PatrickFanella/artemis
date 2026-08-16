export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-display font-bold tracking-tight text-balance">{title}</h1>
      {subtitle && <p className="mt-2 text-secondary text-lg text-balance">{subtitle}</p>}
    </div>
  );
}