import { useState, useEffect } from "react";
import type { MissionClock } from "@/lib/types";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function computeLiveMET(launchTime: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
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
    const id = setInterval(() => {
      setMet(computeLiveMET(clock.launch_time));
    }, 1000);
    return () => clearInterval(id);
  }, [clock.launch_time]);

  const flightDay = Math.floor(met.totalSeconds / 86400) + 1;
  const fdSeconds = met.totalSeconds % 86400;
  const fdHours = Math.floor(fdSeconds / 3600);
  const fdMins = Math.floor((fdSeconds % 3600) / 60);

  return (
    <div className="glass-card p-4 md:p-6 relative overflow-hidden">
      {/* Subtle gold ambient glow behind MET */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] bg-artemis-gold/[0.04] rounded-full blur-[60px]" />
      </div>

      {/* Live indicator */}
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-active opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-active" />
          </span>
          <span className="text-xs font-medium text-status-active uppercase tracking-wider">
            Live Mission
          </span>
        </div>
        <div className="text-xs text-lunar-white/40">
          Launched {new Date(clock.launch_time).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>

      {/* MET Display */}
      <div className="text-center mb-4 relative">
        <p className="text-xs text-lunar-white/40 uppercase tracking-widest mb-2">
          Mission Elapsed Time
        </p>
        <div className="met-display text-4xl md:text-5xl font-bold text-artemis-gold drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <span>T+</span>
          <span>{pad(met.days)}</span>
          <span className="text-artemis-gold/30">:</span>
          <span>{pad(met.hours)}</span>
          <span className="text-artemis-gold/30">:</span>
          <span>{pad(met.minutes)}</span>
          <span className="text-artemis-gold/30">:</span>
          <span>{pad(met.seconds)}</span>
        </div>
        <div className="flex items-center justify-center gap-1 mt-1 text-xs text-lunar-white/25">
          <span>DD</span>
          <span>:</span>
          <span>HH</span>
          <span>:</span>
          <span>MM</span>
          <span>:</span>
          <span>SS</span>
        </div>
      </div>

      {/* Flight day & progress */}
      <div className="grid grid-cols-2 gap-4 relative">
        <div className="bg-space-black/40 backdrop-blur-sm rounded-lg p-3 text-center border border-white/[0.04]">
          <p className="text-2xl font-display font-bold text-artemis-blue">
            {`FD${pad(flightDay)}`}
          </p>
          <p className="text-xs text-lunar-white/40 mt-1">Flight Day</p>
          <p className="text-xs text-lunar-white/25 mt-0.5">
            +{pad(fdHours)}:{pad(fdMins)} into FD
          </p>
        </div>
        <div className="bg-space-black/40 backdrop-blur-sm rounded-lg p-3 text-center border border-white/[0.04]">
          <p className="text-2xl font-display font-bold text-artemis-cyan">
            {Math.min(Math.round((met.totalSeconds / 783900) * 100), 100)}%
          </p>
          <p className="text-xs text-lunar-white/40 mt-1">Mission Progress</p>
          <div className="mt-2 h-1.5 bg-space-gray/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-artemis-blue via-artemis-cyan to-artemis-gold rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min((met.totalSeconds / 783900) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
