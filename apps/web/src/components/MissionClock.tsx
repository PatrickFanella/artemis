import { useState, useEffect } from "react";
import type { MissionClock } from "@/lib/types";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function computeLiveMET(launchTime: string): {
  days: number; hours: number; minutes: number; seconds: number; totalSeconds: number;
} {
  const launch = new Date(launchTime).getTime();
  const now = Date.now();
  const diff = Math.max(0, Math.floor((now - launch) / 1000));
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  return { days, hours, minutes, seconds, totalSeconds: diff };
}

export function MissionClockDisplay({ clock }: { clock: MissionClock }) {
  const [met, setMet] = useState(() => computeLiveMET(clock.launch_time));

  useEffect(() => {
    const id = setInterval(() => setMet(computeLiveMET(clock.launch_time)), 1000);
    return () => clearInterval(id);
  }, [clock.launch_time]);

  const flightDay = Math.floor(met.totalSeconds / 86400) + 1;
  const fdSeconds = met.totalSeconds % 86400;
  const fdHours = Math.floor(fdSeconds / 3600);
  const fdMins = Math.floor((fdSeconds % 3600) / 60);

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-active opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-active" />
          </span>
          <span className="label text-status-active">Live Mission</span>
        </div>
        <span className="text-faint text-xs">
          {new Date(clock.launch_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>

      {/* MET Display */}
      <div className="text-center mb-5">
        <p className="label text-faint mb-2">Mission Elapsed Time</p>
        <div className="met-display text-4xl md:text-5xl font-bold text-artemis-gold">
          <span>T+</span>
          <span>{pad(met.days)}</span>
          <span className="text-artemis-gold/30">:</span>
          <span>{pad(met.hours)}</span>
          <span className="text-artemis-gold/30">:</span>
          <span>{pad(met.minutes)}</span>
          <span className="text-artemis-gold/30">:</span>
          <span>{pad(met.seconds)}</span>
        </div>
        <div className="flex items-center justify-center gap-1 mt-1 text-faint text-xs">
          <span>DD</span><span>:</span><span>HH</span><span>:</span><span>MM</span><span>:</span><span>SS</span>
        </div>
      </div>

      {/* Flight day + progress */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-space-black/50 rounded-md p-3 text-center border border-subtle">
          <p className="text-xl font-display font-bold text-artemis-blue">{`FD${pad(flightDay)}`}</p>
          <p className="text-faint text-xs mt-0.5">Flight Day</p>
          <p className="text-faint text-xs">+{pad(fdHours)}:{pad(fdMins)}</p>
        </div>
        <div className="bg-space-black/50 rounded-md p-3 text-center border border-subtle">
          <p className="text-xl font-display font-bold text-artemis-cyan">
            {Math.min(Math.round((met.totalSeconds / 783900) * 100), 100)}%
          </p>
          <p className="text-faint text-xs mt-0.5">Mission Progress</p>
          <div className="mt-2 h-1.5 bg-space-slate/50 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min((met.totalSeconds / 783900) * 100, 100)}%`,
                background: "linear-gradient(90deg, var(--color-artemis-blue), var(--color-artemis-cyan))",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}