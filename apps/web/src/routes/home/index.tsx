import { Link } from "react-router";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useQuery } from "@/hooks/useQuery";
import { getActiveMission } from "@/api/missions";
import { getLatestUpdates } from "@/api/updates";

const quickLinks = [
  {
    to: "/missions",
    title: "Campaign",
    desc: "All Artemis missions",
    icon: "\u{1F680}",
  },
  {
    to: "/schedule",
    title: "Schedule",
    desc: "Mission timeline",
    icon: "\u{1F4C5}",
  },
  {
    to: "/media",
    title: "Media",
    desc: "Images & videos",
    icon: "\u{1F4F7}",
  },
  {
    to: "/updates",
    title: "Updates",
    desc: "Latest news",
    icon: "\u{1F4F0}",
  },
];

export function HomePage() {
  const { data: mission, loading: mLoading } = useQuery(getActiveMission);
  const { data: updates } = useQuery(getLatestUpdates);

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-16 mb-12 relative">
        {/* Ambient hero glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-artemis-gold/[0.06] rounded-full blur-[80px] pointer-events-none" />
        <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tight mb-4 relative">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-artemis-gold via-amber-400 to-artemis-gold">Artemis</span>{" "}
          <span className="text-lunar-white/90">Hub</span>
        </h1>
        <p className="text-xl text-lunar-white/50 max-w-2xl mx-auto relative">
          Tracking humanity's return to the Moon. Real-time updates, mission
          data, and media from NASA's Artemis program.
        </p>
      </div>

      {/* Active Mission Spotlight */}
      {mLoading ? (
        <LoadingSpinner />
      ) : mission ? (
        <Link
          to="/active"
          className="block glass-card p-6 mb-12 group relative overflow-hidden border-status-active/20 hover:border-status-active/40 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.08)]"
        >
          {/* Subtle gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-status-active/30 to-transparent" />

          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-status-active animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-status-active font-medium">
              Active Mission
            </span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold tracking-tight mb-1 group-hover:text-artemis-blue transition-colors">
                {mission.name}
              </h2>
              <p className="text-lunar-white/50 mb-3">{mission.tagline}</p>
              <div className="flex items-center gap-4 text-sm text-lunar-white/40">
                <StatusBadge status={mission.status} />
                <span>Duration: {mission.duration}</span>
                <span>Crew: {mission.crew.length}</span>
              </div>
            </div>
            <span className="text-artemis-blue text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              View Dashboard →
            </span>
          </div>
        </Link>
      ) : null}

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="glass-card glass-card-hover p-5 group text-center"
          >
            <span className="text-3xl mb-3 block">{link.icon}</span>
            <h3 className="font-display font-medium group-hover:text-artemis-blue transition-colors">
              {link.title}
            </h3>
            <p className="text-xs text-lunar-white/40 mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>

      {/* Latest Update */}
      {updates && updates.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold tracking-tight">Latest Update</h2>
            <Link
              to="/updates"
              className="text-sm text-artemis-blue hover:text-artemis-blue/80 transition-colors"
            >
              View all →
            </Link>
          </div>
          <a
            href={updates[0]!.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block glass-card glass-card-hover p-5"
          >
            <h3 className="font-medium mb-1">{updates[0]!.title}</h3>
            {updates[0]!.summary && (
              <p className="text-lunar-white/40 text-sm line-clamp-2">
                {updates[0]!.summary}
              </p>
            )}
          </a>
        </div>
      )}
    </div>
  );
}
