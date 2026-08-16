import { Link } from "react-router";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { SeoHead } from "@/components/SeoHead";
import { useQuery } from "@/hooks/useQuery";
import { SSR_KEYS } from "@/lib/ssrKeys";
import { getMissions } from "@/api/missions";
import { getLatestUpdates } from "@/api/updates";
import { searchMedia } from "@/api/media";
import type { Mission } from "@/lib/types";

function latestCompleted(missions: Mission[] | null): Mission | undefined {
  if (!missions) return undefined;
  return missions
    .filter((m) => m.status !== "upcoming" && m.launch_date)
    .sort((a, b) => new Date(b.launch_date!).getTime() - new Date(a.launch_date!).getTime())[0];
}

function nextUpcoming(missions: Mission[] | null): Mission | undefined {
  if (!missions) return undefined;
  return missions
    .filter((m) => m.status === "upcoming" && m.launch_date)
    .sort((a, b) => new Date(a.launch_date!).getTime() - new Date(b.launch_date!).getTime())[0];
}

export function HomePage() {
  const { data: missions, loading: mLoading } = useQuery(getMissions, [], SSR_KEYS.missions);
  const { data: updates } = useQuery(getLatestUpdates, [], SSR_KEYS.latestUpdates);
  const { data: media } = useQuery(() => searchMedia("artemis ii", "image"), [], SSR_KEYS.homeMedia);

  const completed = latestCompleted(missions);
  const next = nextUpcoming(missions);

  return (
    <div className="space-y-12">
      <SeoHead
        title="NASA Artemis Mission Updates, Media & Timeline"
        description="Follow NASA's Artemis lunar program. Mission updates, media gallery, crew profiles, event timeline, and campaign schedule for Artemis I through V."
        canonicalPath="/"
      />

      {/* --- Page header --- */}
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight text-balance">
          Artemis Program
        </h1>
        <p className="mt-2 text-secondary max-w-2xl text-balance">
          Following humanity&rsquo;s return to the Moon — mission updates, flight data,
          and media from NASA&rsquo;s Artemis campaign.
        </p>
      </div>

      {/* --- Mission status --- */}
      {mLoading ? (
        <LoadingSpinner />
      ) : (
        <section className="panel p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="label text-muted">Status</span>
                {completed && <StatusBadge status={completed.status} />}
              </div>
              <h2 className="text-xl font-display font-semibold tracking-tight">
                {completed ? `${completed.name} complete` : "Between missions"}
              </h2>
              <p className="mt-1 text-muted max-w-xl text-balance">
                {completed
                  ? `${completed.tagline}. Revisit flight updates and media while we await the next launch.`
                  : "No mission is currently in flight."}
              </p>
            </div>
            {next && (
              <div className="sm:text-right shrink-0">
                <span className="label text-faint">Next mission</span>
                <p className="text-lg font-display font-semibold text-artemis-gold">
                  {next.name}
                </p>
                <p className="text-muted text-sm">{next.tagline}</p>
              </div>
            )}
          </div>
          <div className="mt-5 pt-4 border-t border-subtle flex flex-wrap gap-3">
            <Link to="/updates" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-artemis-blue text-white hover:bg-artemis-blue/85 transition-colors">
              Mission updates <span className="text-artemis-blue/50">→</span>
            </Link>
            <Link to="/media" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium panel panel-hover text-secondary hover:text-lunar-white transition-colors">
              Mission media <span className="text-faint">→</span>
            </Link>
            {completed && (
              <Link to={`/missions/${completed.id}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium panel panel-hover text-secondary hover:text-lunar-white transition-colors">
                Mission recap <span className="text-faint">→</span>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* --- Updates + Media (two-column on desktop) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest updates */}
        {updates && updates.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold tracking-tight">Latest Updates</h2>
              <Link to="/updates" className="text-sm text-artemis-blue hover:text-artemis-blue/80 transition-colors">
                View all →
              </Link>
            </div>
            <div className="space-y-2">
              {updates.slice(0, 4).map((update) => (
                <a
                  key={update.id}
                  href={update.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block panel panel-hover p-4"
                >
                  <h3 className="font-medium text-sm leading-snug">{update.title}</h3>
                  {update.summary && (
                    <p className="text-muted text-sm mt-1 line-clamp-2">{update.summary}</p>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Latest media */}
        {media && media.items.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold tracking-tight">Mission Media</h2>
              <Link to="/media" className="text-sm text-artemis-blue hover:text-artemis-blue/80 transition-colors">
                Gallery →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {media.items.slice(0, 6).map((asset) => (
                <Link
                  key={asset.nasa_id}
                  to="/media"
                  className="aspect-video rounded-md overflow-hidden bg-space-slate/30 border border-subtle group"
                >
                  {asset.preview_url && (
                    <img
                      src={asset.large_url || asset.preview_url}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                      loading="lazy"
                    />
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}