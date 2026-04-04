Yes — you can build a pretty solid **Artemis hub**, but the cleanest path is to treat it as a **multi-source hub**, not a single-API app. NASA has a general API portal and an Image/Video API, while Artemis-specific schedule, mission pages, multimedia, and real-time tracking live across separate official pages. ([NASA Open APIs][1])

## What you can power today

As of **April 4, 2026**, NASA shows **Artemis II** as an **active mission**; its mission page lists it as a **crewed lunar flyby**, launched **April 1, 2026**, with a **10-day** duration. NASA’s current Artemis pages show **Artemis III** in **2027** as a **low Earth orbit rendezvous and docking** mission, **Artemis IV** targeting **early 2028** as a **crewed surface landing**, and the broader Artemis program page says **Artemis V** is expected by **late 2028**. ([NASA][2])

### Best official source for each feature

* **Mission schedule / campaign timeline**
  Use NASA’s Artemis mission pages for the high-level roadmap, then use the **Artemis II Daily Agenda** and the **Artemis blog** for the active mission’s day-by-day schedule and updates. NASA also publishes RSS feeds you can ingest for fresh site content. ([NASA][2])

* **“What this schedule section means” explainer text**
  This is best built from NASA’s own mission descriptions. The Daily Agenda explains phases like proximity ops, TLI, outbound corrections, lunar flyby, return corrections, reentry, and splashdown in plain language. ([NASA][3])

* **Pictures and video**
  Use the **Artemis II Multimedia** page for curated galleries, videos, live video, podcasts, and blog links, and use the **NASA Image and Video Library API** for searchable media ingestion. NASA’s own media guidance also points developers to NASA+, YouTube, and the image/video library as canonical public media homes. ([NASA][4])

* **Current mission stats**
  NASA’s **AROW** real-time tracker is the official source for **mission duration, velocity, distance from Earth, distance from the Moon**, and related real-time mission data; NASA also says **state vectors** will be provided during the mission. I found that documented as a **web/mobile tracking experience**, but I did **not** find public API docs for AROW in NASA’s public API portal. ([NASA][5])

## The schedule sections I’d put in your hub

For Artemis II, I’d normalize the schedule into these sections:

1. **Launch / early orbit** — liftoff, ascent, and initial Earth-orbit operations. NASA’s schedule then transitions into a high-Earth-orbit phase before the Moon transfer. ([NASA][3])
2. **Proximity operations demo** — Orion separates from the upper stage and the crew practices flying toward and around it to validate future docking-type operations. ([NASA][3])
3. **Translunar Injection (TLI)** — the main burn that sends Orion onto its Moon-bound path; NASA says it also sets up the free-return path back to Earth. ([NASA][3])
4. **Outbound trajectory corrections** — smaller burns on the outbound leg to keep Orion on target for the lunar flyby. ([NASA][3])
5. **Lunar sphere of influence / flyby** — the point where lunar gravity dominates, followed by closest approach, lunar photography/video, and observations. ([NASA][3])
6. **Return trajectory corrections** — burns after the flyby that refine the path back to Earth. ([NASA][3])
7. **Reentry / splashdown / recovery** — final correction burn, service module separation, heat-shielded reentry, parachute deployment, splashdown, recovery. ([NASA][3])

That gives you a nice UI model: **section name → what it means → scheduled day/time → status → related media → related stats**. ✨

## The build approach I’d recommend

### 1. Treat your own backend as the “real API”

Have your app ingest official NASA sources into your own normalized model:

* `missions`
* `milestones`
* `mission_sections`
* `media_assets`
* `blog_updates`
* `telemetry_snapshots`

That way your frontend reads from **one stable schema**, even though NASA’s data comes from several places.

### 2. Split the hub into four source adapters

* **Mission adapter**
  Pull campaign-level info from Artemis mission pages. ([NASA][2])

* **Schedule adapter**
  For active missions, ingest the Daily Agenda and mission blog/RSS. For future missions, store official launch windows and mission types from NASA mission pages until more detailed schedules appear. ([NASA][3])

* **Media adapter**
  Pull searchable image/video assets from NASA’s Image and Video Library API, and supplement with links from the Artemis multimedia page and NASA+ live video. ([NASA Open APIs][6])

* **Telemetry adapter**
  For Artemis II, show AROW-linked stats. Since I could not verify a documented public API for AROW, I would either **link out / embed if supported** or run a clearly labeled “best-effort” ingestion layer only after you inspect the live tracker’s network calls yourself. ([NASA][5])

## What I would ship first

### MVP

* **Mission overview page**
* **Campaign schedule page**
* **Active mission page**
* **Media gallery**
* **Section explainer glossary**
* **Latest updates feed**

### For the active mission page

Show:

* mission elapsed time
* distance from Earth
* distance to Moon
* velocity
* current phase
* next milestone
* latest NASA blog update
* latest image/video cards

NASA explicitly says AROW provides the first four of those stats during Artemis II. ([NASA][5])

## The main caveat

The one weak spot is **“current mission stats as an API.”** NASA clearly offers the stats in AROW, but I did not verify a supported public developer endpoint for that tracker. So the safe version of your hub is:

* **official pages for schedule + mission info**
* **Image and Video Library API for media**
* **AROW as official tracker source for live stats, with link/embed first**
* **your own backend cache to unify everything** ([NASA][5])

If you want, I can turn this into a **concrete technical plan** next — schema, endpoints, ingestion jobs, and a page-by-page UI spec for a React/Next app.

[1]: https://api.nasa.gov/ "NASA Open APIs"
[2]: https://www.nasa.gov/mission/artemis-ii/ "Artemis II: NASA’s First Crewed Lunar Flyby in 50 Years - NASA"
[3]: https://www.nasa.gov/missions/artemis/nasas-artemis-ii-moon-mission-daily-agenda/ "NASA’s Artemis II Moon Mission Daily Agenda - NASA"
[4]: https://www.nasa.gov/artemis-ii-multimedia/ "Artemis II Multimedia: Crew Photos, Videos and Mission Highlights"
[5]: https://www.nasa.gov/missions/artemis/artemis-2/track-nasas-artemis-ii-mission-in-real-time/ "Track NASA’s Artemis II Mission in Real Time - NASA"
[6]: https://api.nasa.gov/?utm_source=chatgpt.com "NASA Open APIs"

