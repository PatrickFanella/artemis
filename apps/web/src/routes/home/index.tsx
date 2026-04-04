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
    icon: "🚀",
  },
  {
    to: "/schedule",
    title: "Schedule",
    desc: "Mission timeline",
    icon: "📅",
  },
  {
    to: "/media",
    title: "Media",
    desc: "Images & videos",
    icon: "📷",
  },
  {
    to: "/updates",
    title: "Updates",
    desc: "Latest news",
    icon: "📰",
  },
];

export function HomePage() {
  const { data: mission, loading: mLoading } = useQuery(getActiveMission);
  const { data: updates } = useQuery(getLatestUpdates);

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-16 mb-12">
        <h1 className="text-6xl font-bold mb-4">
          <span className="text-artemis-gold">Artemis</span> Hub
        </h1>
        <p className="text-xl text-lunar-white/60 max-w-2xl mx-auto">
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
          className="block bg-gradient-to-r from-space-dark to-space-gray/30 border border-status-active/30 rounded-xl p-6 mb-12 hover:border-status-active/50 transition-colors group"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-status-active animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-status-active font-medium">
              Active Mission
            </span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1 group-hover:text-artemis-blue transition-colors">
                {mission.name}
              </h2>
              <p className="text-lunar-white/60 mb-3">{mission.tagline}</p>
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
            className="bg-space-dark border border-space-gray/50 rounded-xl p-5 hover:border-artemis-blue/50 transition-colors group text-center"
          >
            <span className="text-3xl mb-3 block">{link.icon}</span>
            <h3 className="font-medium group-hover:text-artemis-blue transition-colors">
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
            <h2 className="text-lg font-semibold">Latest Update</h2>
            <Link
              to="/updates"
              className="text-sm text-artemis-blue hover:text-artemis-blue/80"
            >
              View all →
            </Link>
          </div>
          <a
            href={updates[0]!.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-space-dark border border-space-gray/50 rounded-xl p-5 hover:border-artemis-blue/50 transition-colors"
          >
            <h3 className="font-medium mb-1">{updates[0]!.title}</h3>
            {updates[0]!.summary && (
              <p className="text-lunar-white/50 text-sm line-clamp-2">
                {updates[0]!.summary}
              </p>
            )}
          </a>
        </div>
      )}
    </div>
  );
}
