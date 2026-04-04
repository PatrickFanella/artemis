-- Artemis I (completed)
INSERT INTO missions (id, name, tagline, description, status, launch_date, duration, crew_json, image_url) VALUES
('artemis-1', 'Artemis I', 'Around the Moon and Back', 'The first integrated flight test of NASA''s Space Launch System and Orion spacecraft. An uncrewed mission that traveled 1.4 million miles over 25.5 days, flying beyond the Moon and returning to Earth.', 'completed', '2022-11-16T06:47:00Z', '25.5 days', '[]', '');

-- Artemis II (active)
INSERT INTO missions (id, name, tagline, description, status, launch_date, duration, crew_json, image_url) VALUES
('artemis-2', 'Artemis II', 'First Crewed Lunar Flyby in 50 Years', 'The first crewed mission of NASA''s Artemis program. Four astronauts will fly around the Moon on a 10-day mission, testing Orion''s life support systems and validating capabilities needed for future lunar surface missions.', 'active', '2026-04-01T12:00:00Z', '~10 days', '[{"name":"Reid Wiseman","role":"Commander","bio":"NASA astronaut and Navy test pilot. Previously flew on ISS Expedition 41.","image":""},{"name":"Victor Glover","role":"Pilot","bio":"NASA astronaut and Navy aviator. Pilot of SpaceX Crew-1, the first operational SpaceX Crew Dragon mission.","image":""},{"name":"Christina Koch","role":"Mission Specialist 1","bio":"NASA astronaut and electrical engineer. Holds the record for longest single spaceflight by a woman (328 days).","image":""},{"name":"Jeremy Hansen","role":"Mission Specialist 2","bio":"Canadian Space Agency astronaut and former CF-18 fighter pilot. First Canadian to fly to the Moon.","image":""}]', '');

-- Artemis III (upcoming)
INSERT INTO missions (id, name, tagline, description, status, launch_date, duration, crew_json, image_url) VALUES
('artemis-3', 'Artemis III', 'Low Earth Orbit Rendezvous and Docking', 'A crewed mission to demonstrate rendezvous and docking operations in low Earth orbit, validating techniques needed for future lunar surface missions.', 'upcoming', '2027-01-01T00:00:00Z', 'TBD', '[]', '');

-- Artemis IV (upcoming)
INSERT INTO missions (id, name, tagline, description, status, launch_date, duration, crew_json, image_url) VALUES
('artemis-4', 'Artemis IV', 'First Crewed Lunar Surface Landing', 'The first Artemis mission to land astronauts on the lunar surface. Crew will conduct surface exploration, collect samples, and demonstrate sustainable operations on the Moon.', 'upcoming', '2028-01-01T00:00:00Z', 'TBD', '[]', '');

-- Artemis V (upcoming)
INSERT INTO missions (id, name, tagline, description, status, launch_date, duration, crew_json, image_url) VALUES
('artemis-5', 'Artemis V', 'Expanding Lunar Presence', 'Building on Artemis IV, this mission continues surface exploration and begins establishing longer-duration lunar presence.', 'upcoming', '2028-06-01T00:00:00Z', 'TBD', '[]', '');

-- Artemis II schedule sections
INSERT INTO mission_sections (id, mission_id, name, slug, description, "order", day_range, status) VALUES
('a2-s1', 'artemis-2', 'Launch & Early Orbit', 'launch', 'Liftoff aboard the Space Launch System, ascent through the atmosphere, and initial Earth-orbit operations. The crew checks spacecraft systems and prepares for the next phase.', 1, 'Day 1', 'completed'),
('a2-s2', 'artemis-2', 'Proximity Operations Demo', 'prox-ops', 'Orion separates from the Interim Cryogenic Propulsion Stage (ICPS) upper stage. The crew practices flying toward and around it to validate piloting techniques needed for future docking operations.', 2, 'Day 1-2', 'completed'),
('a2-s3', 'artemis-2', 'Translunar Injection (TLI)', 'tli', 'The main engine burn that sends Orion onto its Moon-bound trajectory. This burn also sets up the free-return path that will use the Moon''s gravity to swing the spacecraft back toward Earth.', 3, 'Day 2', 'completed'),
('a2-s4', 'artemis-2', 'Outbound Trajectory Corrections', 'outbound', 'Smaller burns on the outbound leg to fine-tune Orion''s path toward the Moon. The crew monitors navigation data and adjusts course as needed.', 4, 'Days 2-4', 'active'),
('a2-s5', 'artemis-2', 'Lunar Flyby', 'flyby', 'The point where lunar gravity dominates, followed by closest approach to the Moon. The crew captures photography and video of the lunar surface and performs scientific observations.', 5, 'Day 5', 'upcoming'),
('a2-s6', 'artemis-2', 'Return Trajectory Corrections', 'return', 'Burns after the lunar flyby that refine Orion''s path back to Earth. These corrections ensure precise targeting for atmospheric reentry.', 6, 'Days 5-8', 'upcoming'),
('a2-s7', 'artemis-2', 'Reentry & Splashdown', 'reentry', 'Final correction burn, service module separation, heat-shielded reentry through Earth''s atmosphere, parachute deployment, splashdown in the Pacific Ocean, and crew recovery.', 7, 'Day 10', 'upcoming');

-- Artemis II milestones
INSERT INTO milestones (id, mission_id, section_id, title, description, planned_at, completed_at, "order") VALUES
('a2-m1', 'artemis-2', 'a2-s1', 'Liftoff', 'SLS launches from Kennedy Space Center LC-39B', '2026-04-01T12:00:00Z', '2026-04-01T12:00:00Z', 1),
('a2-m2', 'artemis-2', 'a2-s1', 'Orion Separation from Upper Stage', 'Orion spacecraft separates from the ICPS', '2026-04-01T14:00:00Z', '2026-04-01T14:05:00Z', 2),
('a2-m3', 'artemis-2', 'a2-s2', 'Proximity Ops Begin', 'Crew begins manual piloting exercises near ICPS', '2026-04-01T16:00:00Z', '2026-04-01T16:10:00Z', 3),
('a2-m4', 'artemis-2', 'a2-s2', 'Proximity Ops Complete', 'All proximity operations objectives met', '2026-04-02T08:00:00Z', '2026-04-02T07:45:00Z', 4),
('a2-m5', 'artemis-2', 'a2-s3', 'Translunar Injection Burn', 'Main engine burn to depart Earth orbit for the Moon', '2026-04-02T10:00:00Z', '2026-04-02T10:02:00Z', 5),
('a2-m6', 'artemis-2', 'a2-s3', 'TLI Burn Complete', 'Spacecraft on free-return trajectory to the Moon', '2026-04-02T10:30:00Z', '2026-04-02T10:28:00Z', 6),
('a2-m7', 'artemis-2', 'a2-s4', 'Outbound Correction 1', 'First trajectory correction maneuver on outbound leg', '2026-04-03T06:00:00Z', NULL, 7),
('a2-m8', 'artemis-2', 'a2-s5', 'Enter Lunar Sphere of Influence', 'Moon''s gravity becomes dominant force on spacecraft', '2026-04-05T00:00:00Z', NULL, 8),
('a2-m9', 'artemis-2', 'a2-s5', 'Closest Lunar Approach', 'Orion reaches closest point to the lunar surface', '2026-04-05T12:00:00Z', NULL, 9),
('a2-m10', 'artemis-2', 'a2-s6', 'Return Correction 1', 'First trajectory correction on return leg', '2026-04-06T06:00:00Z', NULL, 10),
('a2-m11', 'artemis-2', 'a2-s7', 'Service Module Separation', 'Orion crew module separates from service module', '2026-04-10T10:00:00Z', NULL, 11),
('a2-m12', 'artemis-2', 'a2-s7', 'Atmospheric Entry', 'Orion enters Earth''s atmosphere at ~25,000 mph', '2026-04-10T10:30:00Z', NULL, 12),
('a2-m13', 'artemis-2', 'a2-s7', 'Splashdown', 'Orion lands in the Pacific Ocean', '2026-04-10T11:00:00Z', NULL, 13);
