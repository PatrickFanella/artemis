import { Link } from "react-router";

export interface BreadcrumbItem {
  name: string;
  path?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm mb-4 text-muted">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-faint">/</span>}
            {item.path && !isLast ? (
              <Link to={item.path} className="hover:text-lunar-white transition-colors">
                {item.name}
              </Link>
            ) : (
              <span className={isLast ? "text-lunar-white/80" : ""}>{item.name}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}