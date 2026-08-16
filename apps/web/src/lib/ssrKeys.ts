/**
 * Canonical SSR data keys shared between page components and the prerender
 * script.  Keeping these in one place prevents key mismatches.
 */
export const SSR_KEYS = {
  missions: "missions",
  latestUpdates: "updates:latest",
  updatesPage: "updates:page",
  homeMedia: "media:home",
  mediaPage: "media:page",
  mission: (id: string) => `mission:${id}`,
  sections: (id: string) => `sections:${id}`,
  milestones: (id: string) => `milestones:${id}`,
  events: (id: string, fd?: number) => `events:${id}:${fd ?? 0}`,
} as const;