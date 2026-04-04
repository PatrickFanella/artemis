import type { MissionLinks } from "@/lib/types";

export function MissionLinksBar({ links }: { links: MissionLinks }) {
  const items = [
    {
      href: links.arow,
      label: "3D Tracker",
      sublabel: "NASA AROW",
      icon: "\u{1F6F0}\uFE0F",
    },
    {
      href: links.dsn,
      label: "Deep Space Network",
      sublabel: "DSN Now",
      icon: "\u{1F4E1}",
    },
    {
      href: links.nasa_tv,
      label: "Live Coverage",
      sublabel: "NASA TV",
      icon: "\u{1F4FA}",
    },
    {
      href: links.mission_page,
      label: "Mission Page",
      sublabel: "NASA.gov",
      icon: "\u{1F680}",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 glass-card glass-card-hover p-3 group"
        >
          <span className="text-xl">{item.icon}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate group-hover:text-artemis-blue transition-colors">
              {item.label}
            </p>
            <p className="text-xs text-lunar-white/40 truncate">
              {item.sublabel}
            </p>
          </div>
          <svg
            className="w-3 h-3 ml-auto text-lunar-white/20 group-hover:text-artemis-blue/60 flex-shrink-0 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      ))}
    </div>
  );
}
