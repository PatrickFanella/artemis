-- Rebuild Artemis II timeline from NASA's official overview timeline
-- Source: NASA Artemis II Overview Timeline (via sunnywingsvirtual.com/artemis2)
-- Mission zero: 2026-04-01T22:35:00Z (6:35 PM ET)

-- Fix launch time (was 16:35Z, should be 22:35Z)
UPDATE missions SET launch_date = '2026-04-01T22:35:00Z' WHERE id = 'artemis-2';

-- Delete in FK-safe order: milestones → events → sections
DELETE FROM milestones WHERE mission_id = 'artemis-2';
DELETE FROM mission_events WHERE mission_id = 'artemis-2';
DELETE FROM mission_sections WHERE mission_id = 'artemis-2';
INSERT INTO mission_sections (id, mission_id, name, slug, description, "order", day_range, status) VALUES
('a2-s1', 'artemis-2', 'Launch & Proximity Ops', 'launch', 'Liftoff aboard SLS, ascent to orbit, abort region burn, Orion separation from upper stage, and proximity operations demo near the ICPS.', 1, 'Day 1', 'completed'),
('a2-s2', 'artemis-2', 'Trans-Lunar Injection', 'tli', 'TLI burn sends Orion toward the Moon. Post-burn vehicle checkout and first full sleep period in deep space.', 2, 'Day 2', 'completed'),
('a2-s3', 'artemis-2', 'Outbound Coast', 'outbound', 'Trajectory correction burns, crew science activities, system tests, and daily routines during the three-day coast toward the Moon.', 3, 'Days 3-5', 'active'),
('a2-s4', 'artemis-2', 'Lunar Flyby', 'flyby', 'Free-return flyby passing approximately 8,900 km above the lunar surface. Nearly five hours of lunar observation, photography, and far-side passage.', 4, 'Day 6', 'upcoming'),
('a2-s5', 'artemis-2', 'Return Coast', 'return', 'Post-flyby debrief, return trajectory corrections, off-duty time, exercise, reentry preparation, and final systems testing.', 5, 'Days 7-9', 'upcoming'),
('a2-s6', 'artemis-2', 'Reentry & Splashdown', 'reentry', 'Final trajectory correction, cabin configuration, entry checklist, service module separation, atmospheric reentry at ~40,000 km/h, parachute deploy, and Pacific Ocean splashdown.', 6, 'Day 10', 'upcoming');

-- Milestones
INSERT INTO milestones (id, mission_id, section_id, title, description, planned_at, completed_at, "order") VALUES
('a2-m1', 'artemis-2', 'a2-s1', 'Liftoff', 'SLS launches from Kennedy Space Center LC-39B', '2026-04-01T22:35:00Z', '2026-04-01T22:35:00Z', 1),
('a2-m2', 'artemis-2', 'a2-s1', 'Abort Region Burn', 'Perigee-raise maneuver to safe orbit', '2026-04-02T00:05:00Z', '2026-04-02T00:05:00Z', 2),
('a2-m3', 'artemis-2', 'a2-s1', 'Proximity Ops Demo', 'Manual piloting exercises near ICPS upper stage', '2026-04-02T01:50:00Z', '2026-04-02T01:50:00Z', 3),
('a2-m4', 'artemis-2', 'a2-s2', 'Trans-Lunar Injection Burn', 'Main engine burn to depart Earth orbit for the Moon', '2026-04-02T22:35:00Z', '2026-04-02T22:35:00Z', 4),
('a2-m5', 'artemis-2', 'a2-s3', 'Outbound Correction 1', 'First trajectory correction maneuver', '2026-04-04T21:35:00Z', NULL, 5),
('a2-m6', 'artemis-2', 'a2-s3', 'Outbound Correction 2', 'Second trajectory correction maneuver', '2026-04-05T02:50:00Z', NULL, 6),
('a2-m7', 'artemis-2', 'a2-s3', 'Outbound Correction 3', 'Third trajectory correction maneuver', '2026-04-05T22:20:00Z', NULL, 7),
('a2-m8', 'artemis-2', 'a2-s4', 'Closest Lunar Approach', 'Orion passes approximately 8,900 km above the lunar surface', '2026-04-06T18:35:00Z', NULL, 8),
('a2-m9', 'artemis-2', 'a2-s5', 'Return Correction 1', 'First return trajectory correction', '2026-04-08T23:20:00Z', NULL, 9),
('a2-m10', 'artemis-2', 'a2-s5', 'Return Correction 2', 'Second return trajectory correction', '2026-04-10T02:20:00Z', NULL, 10),
('a2-m11', 'artemis-2', 'a2-s6', 'Return Correction 3', 'Final trajectory correction for entry', '2026-04-10T18:20:00Z', NULL, 11),
('a2-m12', 'artemis-2', 'a2-s6', 'Splashdown', 'Orion lands in the Pacific Ocean', '2026-04-11T02:35:00Z', NULL, 12);

-- ── FD01: Launch & Proximity Ops ──────────────────────────────────────
INSERT INTO mission_events (id, mission_id, met_seconds, flight_day, category, title, description) VALUES
('e001', 'artemis-2', 0,     1, 'propulsion', 'Liftoff', 'SLS clears the tower at LC-39B. Four RS-25 engines and two solid rocket boosters produce 8.8 million pounds of thrust.'),
('e002', 'artemis-2', 70,    1, 'propulsion', 'Max-Q', 'Maximum dynamic pressure on the vehicle as it accelerates through the lower atmosphere.'),
('e003', 'artemis-2', 130,   1, 'propulsion', 'SRB Separation', 'Twin solid rocket boosters separate after burning through their propellant.'),
('e004', 'artemis-2', 480,   1, 'system',     'Payload Fairing Jettison', 'Launch abort system and fairing panels are jettisoned, exposing Orion to space.'),
('e005', 'artemis-2', 485,   1, 'propulsion', 'Core Stage MECO', 'Main engine cutoff — core stage has completed its job.'),
('e006', 'artemis-2', 2700,  1, 'system',     'Pre-ARB Checkouts', 'Crew and ground verify all spacecraft systems before the abort region burn.'),
('e007', 'artemis-2', 5400,  1, 'propulsion', 'Abort Region Burn', 'Perigee-raise maneuver using the ICPS to reach a safe parking orbit.'),
('e008', 'artemis-2', 7200,  1, 'system',     'DCAM Deploy / Off OCSS', 'External cameras deployed; crew transitions out of launch-and-entry suits.'),
('e009', 'artemis-2', 10800, 1, 'communication', 'First PAO Event', 'First public affairs broadcast — crew reports to Houston from orbit.'),
('e010', 'artemis-2', 11700, 1, 'navigation', 'Proximity Ops Demo', 'Crew takes manual control of Orion and flies formation near the ICPS upper stage.'),
('e011', 'artemis-2', 17100, 1, 'propulsion', 'Upper Stage Separation 2', 'Orion separates from the ICPS to create safe distance before TLI.'),
('e012', 'artemis-2', 18000, 1, 'system',     'Cabin Configuration', 'Crew configures cabin for extended habitation — stowing suits, setting up galley.'),
('e013', 'artemis-2', 21600, 1, 'communication', 'PAO Broadcast', 'Second public affairs event of the day — crew discusses launch experience.'),
('e014', 'artemis-2', 24300, 1, 'system',     'Flight Director Conference', 'Daily planning conference and flight director status review.'),
('e015', 'artemis-2', 32400, 1, 'crew',       'Crew Sleep Period (4 hrs)', 'First sleep opportunity — abbreviated rest period between FD01 activities.'),
('e016', 'artemis-2', 46800, 1, 'propulsion', 'Perigee Raise Burn', 'Second orbital adjustment burn to set up for TLI.'),
('e017', 'artemis-2', 54000, 1, 'crew',       'Crew Sleep Period (4.5 hrs)', 'Second sleep opportunity before TLI day begins.'),

-- ── FD02: Trans-Lunar Injection ───────────────────────────────────────
('e018', 'artemis-2', 61200, 2, 'crew',       'Crew Wakeup', 'Crew wakes from second sleep period. Personal hygiene, breakfast, and pre-activity prep.'),
('e019', 'artemis-2', 80100, 2, 'crew',       'Exercise Test', 'First crew exercise session — validating exercise protocols in Orion.'),
('e020', 'artemis-2', 82800, 2, 'science',    'NatGeo Documentary Setup', 'National Geographic crew configures cameras for documentary filming.'),
('e021', 'artemis-2', 86400, 2, 'propulsion', 'Trans-Lunar Injection Burn', 'The critical burn that sends Orion and crew toward the Moon — they leave Earth orbit behind.'),
('e022', 'artemis-2', 90000, 2, 'crew',       'Post-TLI Meal', 'First meal after TLI. Crew celebrates entering the translunar trajectory.'),
('e023', 'artemis-2', 99900, 2, 'communication', 'PAO Broadcast', 'Public affairs event — crew discusses the TLI experience and first views of a shrinking Earth.'),
('e024', 'artemis-2', 104400, 2, 'system',    'Window Inspection', 'Crew inspects all windows for debris damage from ascent and TLI.'),
('e025', 'artemis-2', 110700, 2, 'system',    'Flight Director Conference', 'End-of-day planning conference and status review.'),
('e026', 'artemis-2', 118800, 2, 'crew',      'Crew Sleep Period (8.5 hrs)', 'First full sleep period — crew rests as Orion coasts toward the Moon.'),

-- ── FD03: Outbound Coast Day 1 ────────────────────────────────────────
('e027', 'artemis-2', 147600, 3, 'crew',      'Crew Wakeup', 'Crew wakes after first full sleep. Personal time, hygiene, and breakfast before scheduled activities.'),
('e028', 'artemis-2', 162900, 3, 'science',   'NatGeo Documentary Work', 'Continued National Geographic filming and interviews.'),
('e029', 'artemis-2', 169200, 3, 'propulsion', 'Outbound Trajectory Correction 1', 'First mid-course correction burn to fine-tune the path to the Moon.'),
('e030', 'artemis-2', 174600, 3, 'crew',      'Meal Period', 'Crew lunch — rehydratable food pouches in microgravity.'),
('e031', 'artemis-2', 178200, 3, 'system',    'CPR Demo', 'Crew demonstrates CPR procedures in microgravity — validating emergency medical protocols.'),
('e032', 'artemis-2', 180000, 3, 'communication', 'PAO Broadcast', 'Public affairs event from deep space.'),
('e033', 'artemis-2', 181800, 3, 'navigation', 'SAT Mode Test', 'Satellite communication mode test with attitude maneuver.'),
('e034', 'artemis-2', 188100, 3, 'system',    'DSN Emergency Comms Test', 'Deep Space Network emergency communication procedures test.'),
('e035', 'artemis-2', 195300, 3, 'system',    'Flight Director Conference', 'End-of-day planning and review.'),
('e036', 'artemis-2', 205200, 3, 'crew',      'Crew Sleep Period (8.5 hrs)', 'Rest period as Orion passes 150,000 km from Earth.'),

-- ── FD04: Outbound Coast Day 2 ────────────────────────────────────────
('e037', 'artemis-2', 234000, 4, 'crew',      'Crew Wakeup', 'Crew wakes. Personal time, hygiene, and breakfast.'),
('e038', 'artemis-2', 248400, 4, 'science',   'NatGeo Documentary Work', 'National Geographic filming with growing Moon in background.'),
('e039', 'artemis-2', 252000, 4, 'communication', 'PAO Broadcast', 'Public affairs event — crew discusses halfway point to the Moon.'),
('e040', 'artemis-2', 260100, 4, 'propulsion', 'Outbound Trajectory Correction 2', 'Second mid-course correction burn. Fine-tuning approach to lunar flyby.'),
('e041', 'artemis-2', 263700, 4, 'crew',      'Meal Period', 'Crew meal as Moon becomes visibly larger through the windows.'),
('e042', 'artemis-2', 268200, 4, 'navigation', 'Manual Piloting Exercise', 'Crew practices manual control of Orion using hand controllers.'),
('e043', 'artemis-2', 271800, 4, 'science',   'Lunar Image Review', 'Crew reviews lunar approach imagery and plans FD06 observation targets.'),
('e044', 'artemis-2', 279000, 4, 'communication', 'CSA & NatGeo VIP Event', 'Canadian Space Agency and National Geographic joint broadcast.'),
('e045', 'artemis-2', 280800, 4, 'science',   'Science Imaging Session', 'Targeted lunar photography as the Moon grows in Orion''s windows.'),
('e046', 'artemis-2', 282600, 4, 'system',    'Flight Director Conference', 'End-of-day planning and flyby prep review.'),
('e047', 'artemis-2', 290700, 4, 'crew',      'Crew Sleep Period (8.5 hrs)', 'Sleep shifted 45 minutes earlier to prepare for flyby day schedule.'),

-- ── FD05: Flyby Prep ──────────────────────────────────────────────────
('e048', 'artemis-2', 320400, 5, 'crew',      'Crew Wakeup', 'Crew wakes from shifted sleep schedule. Moon now dominates the view.'),
('e049', 'artemis-2', 330300, 5, 'system',    'OCSS Deep Flight Test Ops', 'Orion Crew Survival System deep-space flight test objectives — suit and life support validation.'),
('e050', 'artemis-2', 345600, 5, 'system',    'Cabin Depress Operations', 'Controlled cabin depressurization test — validating Orion''s pressure systems.'),
('e051', 'artemis-2', 350100, 5, 'science',   'Science Imaging', 'Lunar approach photography — surface details becoming clearly visible.'),
('e052', 'artemis-2', 351000, 5, 'crew',      'Meal Period', 'Crew meal — last full meal before the lunar flyby.'),
('e053', 'artemis-2', 356400, 5, 'system',    'ECLSS Maintenance', 'Environmental control and life support system wall maintenance check.'),
('e054', 'artemis-2', 359100, 5, 'propulsion', 'Outbound Trajectory Correction 3', 'Final approach correction burn — refining the free-return flyby trajectory.'),
('e055', 'artemis-2', 365400, 5, 'system',    'Flight Director Conference', 'Pre-flyby review. GO/NO-GO for lunar closest approach.'),
('e056', 'artemis-2', 373500, 5, 'crew',      'Crew Sleep Period (8.5 hrs)', 'Sleep shifted 1 hour earlier. Crew rests before the most anticipated day of the mission.'),

-- ── FD06: Lunar Flyby ─────────────────────────────────────────────────
('e057', 'artemis-2', 404100, 6, 'crew',      'Crew Wakeup — Flyby Day', 'Crew wakes for the most anticipated day of the mission. Moon fills the windows.'),
('e058', 'artemis-2', 413100, 6, 'communication', 'Pre-Flyby Lunar Conference', 'Crew and Houston review flyby timeline, camera assignments, and observation targets.'),
('e059', 'artemis-2', 414900, 6, 'communication', 'PAO Broadcast', 'Live public broadcast as Orion approaches closest approach.'),
('e060', 'artemis-2', 415800, 6, 'science',   'Final Flyby Briefing', 'Last coordination for lunar observation window.'),
('e061', 'artemis-2', 417600, 6, 'science',   'Lunar Observation Window Opens', 'Nearly 5 hours of continuous lunar observation begins — the crew photographs craters, mare, highlands, and potential future landing sites.'),
('e062', 'artemis-2', 421200, 6, 'navigation', 'Closest Lunar Approach', 'Orion reaches its closest point to the Moon at approximately 8,900 km above the lunar surface. The crew is closer to the Moon than any humans in over 50 years.'),
('e063', 'artemis-2', 423000, 6, 'communication', 'Loss of Signal — Far Side', 'Orion passes behind the Moon. Radio contact with Earth is lost for approximately 40 minutes.'),
('e064', 'artemis-2', 425400, 6, 'communication', 'Acquisition of Signal', 'Orion emerges from behind the Moon. Houston hears the crew''s voice again.'),
('e065', 'artemis-2', 428400, 6, 'science',   'Earthrise Photography', 'Crew captures Earthrise over the lunar horizon — humanity''s home world from deep space.'),
('e066', 'artemis-2', 434700, 6, 'science',   'Lunar Observation Window Closes', 'End of the observation period. Crew begins documenting and transferring data.'),
('e067', 'artemis-2', 435600, 6, 'crew',      'Post-Flyby Meal', 'Crew meal and time to process the experience.'),
('e068', 'artemis-2', 439200, 6, 'science',   'Post-Flyby Lunar Observation', 'Additional lunar observation as the Moon recedes behind Orion.'),
('e069', 'artemis-2', 441900, 6, 'system',    'Lunar Data Documentation & Transfer', 'Crew organizes photos, videos, and observation notes for downlink.'),
('e070', 'artemis-2', 447300, 6, 'communication', 'Post-Flyby PAO Event', 'Crew shares their experience with the world. First reactions to seeing the far side of the Moon.'),
('e071', 'artemis-2', 450900, 6, 'system',    'Flight Director Conference', 'Post-flyby review and return trajectory planning.'),
('e072', 'artemis-2', 459000, 6, 'crew',      'Crew Sleep Period (9.5 hrs)', 'Extended rest after the most intense day of the mission. Sleep shifted 1 hour later.'),

-- ── FD07: Return Coast Day 1 ──────────────────────────────────────────
('e073', 'artemis-2', 493200, 7, 'crew',      'Crew Wakeup', 'First morning on the homeward journey. Earth grows larger each hour.'),
('e074', 'artemis-2', 504000, 7, 'communication', 'Crew-to-Crew Call', 'Private call with families — sharing the lunar experience.'),
('e075', 'artemis-2', 505800, 7, 'science',   'Post-Lunar Debrief', 'Detailed crew debrief on flyby observations, photography, and systems performance.'),
('e076', 'artemis-2', 507600, 7, 'crew',      'Off-Duty Period', 'Crew rest and personal time after the intense flyby day.'),
('e077', 'artemis-2', 517500, 7, 'crew',      'Meal Period', 'Crew dinner on the return leg.'),
('e078', 'artemis-2', 521100, 7, 'propulsion', 'Return Trajectory Correction 1', 'First return mid-course correction to target the entry corridor.'),
('e079', 'artemis-2', 525600, 7, 'crew',      'Exercise & Off-Duty', 'Exercise period and personal time.'),
('e080', 'artemis-2', 539100, 7, 'system',    'Flight Director Conference', 'End-of-day planning and return trajectory review.'),
('e081', 'artemis-2', 549000, 7, 'crew',      'Crew Sleep Period (8.5 hrs)', 'Regular sleep period on the return coast.'),

-- ── FD08: Return Coast Day 2 ──────────────────────────────────────────
('e082', 'artemis-2', 585000, 8, 'system',    'CCU Operations', 'Crew Configuration Umbilical — systems checkout.'),
('e083', 'artemis-2', 579600, 8, 'crew',      'Crew Wakeup', 'Morning wake. Personal time before scheduled activities.'),
('e084', 'artemis-2', 590400, 8, 'crew',      'Exercise Period', 'Extended exercise session with P/TV monitoring.'),
('e085', 'artemis-2', 603000, 8, 'communication', 'CSA PAO Event', 'Canadian Space Agency public affairs broadcast with Jeremy Hansen.'),
('e086', 'artemis-2', 603900, 8, 'system',    'Cabin Repress Operations', 'Cabin repressurization procedure following earlier depress test.'),
('e087', 'artemis-2', 606600, 8, 'crew',      'Meal Period', 'Crew lunch.'),
('e088', 'artemis-2', 611100, 8, 'system',    'Radiation Shelter Demo', 'Crew demonstrates radiation shelter configuration — validating procedures for future deep-space missions.'),
('e089', 'artemis-2', 620100, 8, 'navigation', 'Manual Piloting Exercise', 'Second manual piloting session using hand controllers.'),
('e090', 'artemis-2', 627300, 8, 'system',    'Flight Director Conference', 'End-of-day planning.'),
('e091', 'artemis-2', 635400, 8, 'crew',      'Crew Sleep Period (8.5 hrs)', 'Rest period as Orion passes halfway home.'),

-- ── FD09: Entry Preparation ───────────────────────────────────────────
('e092', 'artemis-2', 666000, 9, 'crew',      'Crew Wakeup', 'Crew wakes for entry prep day. Earth now clearly visible as a sphere.'),
('e093', 'artemis-2', 675900, 9, 'system',    'Deep Flight Test Objectives', 'Final deep-space flight test operations before entry prep begins.'),
('e094', 'artemis-2', 682200, 9, 'system',    'Entry Study', 'Crew reviews entry procedures, checklist, and contingency plans.'),
('e095', 'artemis-2', 685800, 9, 'system',    'Entry Conference', 'Detailed briefing on reentry timeline, g-loads, and recovery plan.'),
('e096', 'artemis-2', 689400, 9, 'communication', 'PAO Broadcast', 'Pre-entry public affairs event. Crew reflects on the mission.'),
('e097', 'artemis-2', 693000, 9, 'crew',      'Meal Period', 'Crew meal.'),
('e098', 'artemis-2', 696600, 9, 'communication', 'Final Deep-Space PAO', 'Last public affairs event before entry prep begins.'),
('e099', 'artemis-2', 704700, 9, 'propulsion', 'Return Trajectory Correction 2', 'Second return correction burn — targeting the entry corridor.'),
('e100', 'artemis-2', 710100, 9, 'system',    'Entry Stow', 'Crew begins stowing loose equipment and configuring cabin for reentry.'),
('e101', 'artemis-2', 713700, 9, 'system',    'Flight Director Conference', 'Final pre-entry planning session.'),
('e102', 'artemis-2', 721800, 9, 'crew',      'Crew Sleep Period (8.5 hrs)', 'Final sleep period of the mission. Tomorrow is splashdown day.'),

-- ── FD10: Reentry & Splashdown ────────────────────────────────────────
('e103', 'artemis-2', 752400, 10, 'crew',      'Crew Wakeup — Splashdown Day', 'Final wakeup of the mission. Crew prepares for reentry.'),
('e103b', 'artemis-2', 760500, 10, 'system',   'Pre-Entry PMC & Cabin Prep', 'Final medical conference and cabin preparation begins.'),
('e104', 'artemis-2', 762300, 10, 'propulsion', 'Return Trajectory Correction 3', 'Final trajectory correction — precision targeting for the entry corridor.'),
('e105', 'artemis-2', 766800, 10, 'system',    'Cabin Configuration', 'Crew dons launch-and-entry suits. All equipment secured for high-g reentry.'),
('e106', 'artemis-2', 772200, 10, 'system',    'Entry Checklist', 'Comprehensive entry checklist — every system verified for atmospheric reentry at ~40,000 km/h.'),
('e107', 'artemis-2', 780000, 10, 'propulsion', 'Service Module Separation', 'Crew module separates from the service module. Orion is now in entry configuration.'),
('e108', 'artemis-2', 781200, 10, 'navigation', 'Entry Interface', 'Orion enters Earth''s atmosphere at ~40,000 km/h. Heat shield faces temperatures up to 2,760°C (5,000°F).'),
('e109', 'artemis-2', 783000, 10, 'system',    'Drogue Chute Deploy', 'Drogue parachutes deploy to stabilize and slow Orion through the upper atmosphere.'),
('e110', 'artemis-2', 783600, 10, 'system',    'Main Chute Deploy', 'Three main parachutes open — Orion decelerates to ~30 km/h for water landing.'),
('e111', 'artemis-2', 783900, 10, 'navigation', 'Splashdown', 'Orion touches down in the Pacific Ocean. Recovery teams move in to retrieve the crew.'),
('e112', 'artemis-2', 792000, 10, 'crew',      'Crew Recovery', 'Crew extracted from Orion and brought aboard the USS Portland. Mission complete.');
