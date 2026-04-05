-- Detailed mission events table for granular minute-by-minute schedule
CREATE TABLE IF NOT EXISTS mission_events (
    id TEXT PRIMARY KEY,
    mission_id TEXT NOT NULL REFERENCES missions(id),
    met_seconds INTEGER NOT NULL, -- Mission Elapsed Time in seconds from launch
    flight_day INTEGER NOT NULL,
    category TEXT NOT NULL, -- propulsion, navigation, crew, communication, system, science
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    UNIQUE(mission_id, met_seconds, title)
);

CREATE INDEX IF NOT EXISTS idx_events_mission ON mission_events(mission_id);
CREATE INDEX IF NOT EXISTS idx_events_met ON mission_events(mission_id, met_seconds);
CREATE INDEX IF NOT EXISTS idx_events_fd ON mission_events(mission_id, flight_day);

-- Update Artemis II launch time to be more precise (12:35 PM ET = 16:35 UTC)
UPDATE missions SET launch_date = '2026-04-01T16:35:00Z' WHERE id = 'artemis-2';

-- Update milestone times to align with new launch (shifted +4h35m from original 12:00 UTC)
UPDATE milestones SET planned_at = '2026-04-01T16:35:00Z', completed_at = '2026-04-01T16:35:00Z' WHERE id = 'a2-m1';
UPDATE milestones SET planned_at = '2026-04-01T18:35:00Z', completed_at = '2026-04-01T18:40:00Z' WHERE id = 'a2-m2';
UPDATE milestones SET planned_at = '2026-04-01T20:35:00Z', completed_at = '2026-04-01T20:45:00Z' WHERE id = 'a2-m3';
UPDATE milestones SET planned_at = '2026-04-02T12:35:00Z', completed_at = '2026-04-02T12:20:00Z' WHERE id = 'a2-m4';
UPDATE milestones SET planned_at = '2026-04-02T15:05:00Z', completed_at = '2026-04-02T15:07:00Z' WHERE id = 'a2-m5';
UPDATE milestones SET planned_at = '2026-04-02T15:35:00Z', completed_at = '2026-04-02T15:33:00Z' WHERE id = 'a2-m6';
UPDATE milestones SET planned_at = '2026-04-03T10:35:00Z' WHERE id = 'a2-m7';
UPDATE milestones SET planned_at = '2026-04-05T04:35:00Z' WHERE id = 'a2-m8';
UPDATE milestones SET planned_at = '2026-04-05T16:35:00Z' WHERE id = 'a2-m9';
UPDATE milestones SET planned_at = '2026-04-06T10:35:00Z' WHERE id = 'a2-m10';
UPDATE milestones SET planned_at = '2026-04-10T14:35:00Z' WHERE id = 'a2-m11';
UPDATE milestones SET planned_at = '2026-04-10T15:05:00Z' WHERE id = 'a2-m12';
UPDATE milestones SET planned_at = '2026-04-10T15:35:00Z' WHERE id = 'a2-m13';

-- ============================================================
-- ARTEMIS II DETAILED EVENT TIMELINE (~85 events)
-- MET = Mission Elapsed Time in seconds from launch
-- Launch: 2026-04-01T16:35:00Z
-- Flight Day = floor(met_seconds / 86400) + 1
-- ============================================================

-- ========== FD01: Launch, Ascent, Orbit, Prox Ops Begin ==========
INSERT INTO mission_events (id, mission_id, met_seconds, flight_day, category, title, description) VALUES
('e001', 'artemis-2', 0,     1, 'propulsion',    'Liftoff',                          'Space Launch System lifts off from Kennedy Space Center Launch Complex 39B with 8.8 million pounds of thrust'),
('e002', 'artemis-2', 30,    1, 'navigation',    'Roll Program',                     'Vehicle rolls to correct flight azimuth heading downrange over the Atlantic'),
('e003', 'artemis-2', 60,    1, 'navigation',    'Max-Q',                            'Maximum aerodynamic pressure on the vehicle — approximately 800 lb/ft²'),
('e004', 'artemis-2', 126,   1, 'system',        'SRB Separation',                   'Twin five-segment solid rocket boosters separate after burning 5.5 million pounds of propellant'),
('e005', 'artemis-2', 195,   1, 'system',        'SM Fairing Jettison',              'Three protective fairing panels around the European Service Module are jettisoned'),
('e006', 'artemis-2', 225,   1, 'system',        'LAS Jettison',                     'Launch Abort System tower is jettisoned — no longer needed above the atmosphere'),
('e007', 'artemis-2', 502,   1, 'propulsion',    'MECO',                             'Main Engine Cutoff — four RS-25 engines on the core stage shut down after 8+ minutes of burn'),
('e008', 'artemis-2', 510,   1, 'system',        'Core Stage Separation',            'Spent SLS core stage separates from ICPS+Orion stack'),
('e009', 'artemis-2', 525,   1, 'propulsion',    'ICPS Ignition',                    'Interim Cryogenic Propulsion Stage RL-10B2 engine ignites for orbit insertion burn'),
('e010', 'artemis-2', 570,   1, 'propulsion',    'Orbit Insertion',                  'ICPS engine cuts off — Orion+ICPS in stable parking orbit at ~185 km altitude'),
('e011', 'artemis-2', 1500,  1, 'system',        'Solar Array Deploy',               'All four Orion solar array wings unfurl and begin generating electrical power'),
('e012', 'artemis-2', 2400,  1, 'system',        'Star Tracker Activation',          'Orion star trackers power on for autonomous celestial navigation'),
('e013', 'artemis-2', 3600,  1, 'crew',          'Cabin Pressure Check',             'Crew verifies cabin atmospheric pressure, O₂/N₂ composition, and CO₂ scrubbing'),
('e014', 'artemis-2', 5400,  1, 'navigation',    'Orbit Confirmed',                  'Tracking data confirms stable parking orbit — all orbital parameters nominal'),
('e015', 'artemis-2', 6300,  1, 'crew',          'Suit Doffing',                     'Crew removes Orion Crew Survival System (OCSS) launch-and-entry suits, stows equipment'),
('e016', 'artemis-2', 7200,  1, 'system',        'Orion/ICPS Separation',            'Orion spacecraft undocks and separates from ICPS upper stage for proximity operations'),
('e017', 'artemis-2', 8100,  1, 'system',        'Post-Separation Checkout',         'Full vehicle systems assessment after ICPS separation — power, thermal, propulsion verified'),
('e018', 'artemis-2', 9000,  1, 'communication', 'First Crew Downlink',              'Commander Wiseman reports to Houston: all four crew healthy, Orion performing nominally'),
('e019', 'artemis-2', 10800, 1, 'crew',          'First Meal in Space',              'Crew prepares and eats first meal aboard Orion using rehydratable food pouches'),
('e020', 'artemis-2', 12600, 1, 'system',        'Nav Sensor Calibration',           'Relative navigation sensors and LIDAR calibrated for proximity operations'),
('e021', 'artemis-2', 14400, 1, 'navigation',    'Proximity Ops Demo Begins',        'Manual piloting demonstration initiated — crew takes manual control near ICPS'),
('e022', 'artemis-2', 16200, 1, 'navigation',    'Station-Keeping Exercise',         'Crew holds Orion at fixed 100-meter distance from ICPS demonstrating precision stationkeeping'),
('e023', 'artemis-2', 18000, 1, 'navigation',    'Fly-Around Maneuver',              'Pilot Glover executes circumnavigation of ICPS using hand controllers'),
('e024', 'artemis-2', 21600, 1, 'communication', 'Proximity Ops Status Report',      'Mid-demo data downlink — crew discusses piloting impressions with Mission Control'),
('e025', 'artemis-2', 25200, 1, 'crew',          'Crew Dinner',                      'Evening meal period — first dinner in orbit'),
('e026', 'artemis-2', 28800, 1, 'navigation',    'Night-Side Proximity Ops',         'Low-light proximity flying using Orion nav lights and IR sensors'),
('e027', 'artemis-2', 36000, 1, 'navigation',    'LIDAR Mapping Exercise',           'High-resolution LIDAR scan of ICPS structure for relative navigation validation'),
('e028', 'artemis-2', 43200, 1, 'crew',          'Crew Sleep Period',                'First scheduled sleep period — crew configures sleeping bags in lower equipment bay'),
('e029', 'artemis-2', 64800, 1, 'crew',          'Crew Wakeup',                      'Morning wakeup tone, medical checks, hygiene, and daily planning conference'),
('e030', 'artemis-2', 66600, 1, 'crew',          'Breakfast & Daily Brief',          'Morning meal and mission planning review with Houston for day ahead'),
('e031', 'artemis-2', 68400, 1, 'navigation',    'Final Prox Ops Sequences',         'Last piloting exercises: approach to 20m and controlled retreat maneuvers'),
('e032', 'artemis-2', 72000, 1, 'navigation',    'Proximity Ops Complete',           'All manual piloting objectives achieved — data indicates crew proficiency for future docking'),
('e033', 'artemis-2', 73800, 1, 'propulsion',    'Separation Burn',                  'Small OMS burn to create safe separation distance from ICPS before TLI'),
('e034', 'artemis-2', 75600, 1, 'system',        'Pre-TLI Systems Check',            'Comprehensive vehicle checkout: propulsion, navigation, thermal, power ahead of TLI'),
('e035', 'artemis-2', 78000, 1, 'communication', 'TLI GO/NO-GO Poll',                'Flight Director polls all console positions for Trans-Lunar Injection readiness'),
('e036', 'artemis-2', 79200, 1, 'propulsion',    'TLI Burn Ignition',                'Orion main engine ignites for Trans-Lunar Injection — the burn that sends crew moonward'),
('e037', 'artemis-2', 80400, 1, 'propulsion',    'TLI Burn Complete',                'TLI burn MECO — Orion now on free-return trajectory to the Moon at 38,600 km/h'),
('e038', 'artemis-2', 81000, 1, 'navigation',    'Free-Return Trajectory Confirmed', 'Navigation team confirms free-return trajectory — lunar flyby will send Orion back to Earth'),
('e039', 'artemis-2', 82800, 1, 'system',        'Post-TLI Systems Assessment',      'All systems green after TLI burn — propulsion, thermal, and power performance nominal'),
('e040', 'artemis-2', 84600, 1, 'communication', 'TLI Press Conference',             'Commander Wiseman addresses media: "We are on our way to the Moon"');

-- ========== FD02: Outbound Coast, First Corrections ==========
INSERT INTO mission_events (id, mission_id, met_seconds, flight_day, category, title, description) VALUES
('e041', 'artemis-2', 90000,  2, 'crew',          'Crew Sleep Period',                'Scheduled rest period after intense FD01 operations'),
('e042', 'artemis-2', 111600, 2, 'crew',          'Crew Wakeup & Health Checks',      'Morning routine, medical telemetry review, exercise protocol'),
('e043', 'artemis-2', 115200, 2, 'science',       'First Earthrise Photography',      'Crew photographs Earth receding through Orion windows — first human deep-space images in 50+ years'),
('e044', 'artemis-2', 118800, 2, 'system',        'Thermal Roll Maneuver',            'Orion enters passive thermal control (barbecue roll) to equalize solar heating'),
('e045', 'artemis-2', 122400, 2, 'navigation',    'Mid-Course Navigation Check',      'Star tracker and DSN ranging data used to verify trajectory accuracy'),
('e046', 'artemis-2', 129600, 2, 'crew',          'Crew Lunch & Earth Observation',   'Meal period combined with Earth photography session'),
('e047', 'artemis-2', 136800, 2, 'communication', 'Live Public Downlink',             'Crew gives video tour of Orion cabin, shows Earth growing smaller through window'),
('e048', 'artemis-2', 144000, 2, 'system',        'Water Recovery System Check',      'Humidity condensate collection and water recycling system verification'),
('e049', 'artemis-2', 151200, 2, 'propulsion',    'Outbound Correction Burn 1',       'OCC-1: First trajectory correction maneuver on lunar-bound leg — small delta-V adjustment'),
('e050', 'artemis-2', 154800, 2, 'navigation',    'Post-OCC-1 Vector Update',         'Navigation team processes tracking data and confirms trajectory within corridor'),
('e051', 'artemis-2', 162000, 2, 'crew',          'Crew Dinner & Movie Night',        'Evening meal followed by scheduled recreational time'),
('e052', 'artemis-2', 169200, 2, 'crew',          'Crew Sleep Period',                'Second night rest period — crew adapts to deep-space sleep rhythm');

-- ========== FD03: Outbound Coast Continues ==========
INSERT INTO mission_events (id, mission_id, met_seconds, flight_day, category, title, description) VALUES
('e053', 'artemis-2', 194400, 3, 'crew',          'Crew Wakeup',                      'Morning wakeup, medical checks, daily planning conference'),
('e054', 'artemis-2', 198000, 3, 'system',        'Radiation Monitoring Report',       'Crew dosimeters and Orion radiation sensors data reviewed — levels well within limits'),
('e055', 'artemis-2', 205200, 3, 'science',       'Deep Space Photography Session',   'High-resolution imagery of Earth, Moon, and star fields from unique vantage point'),
('e056', 'artemis-2', 212400, 3, 'communication', 'Crew Press Conference',            'Live Q&A session with media — crew discusses experience of leaving Earth orbit'),
('e057', 'artemis-2', 219600, 3, 'system',        'Life Support Consumables Review',  'Assessment of O₂, water, food, and CO₂ scrubber consumable margins'),
('e058', 'artemis-2', 226800, 3, 'navigation',    'Outbound Correction Burn 2',       'OCC-2: Second trajectory refinement — delta-V < 0.5 m/s'),
('e059', 'artemis-2', 234000, 3, 'crew',          'Exercise Period',                  'Crew performs resistance exercise protocol to maintain bone and muscle health'),
('e060', 'artemis-2', 241200, 3, 'system',        'Propulsion Health Check',          'Detailed checkout of OMS and RCS thruster systems ahead of lunar flyby'),
('e061', 'artemis-2', 248400, 3, 'crew',          'Crew Dinner',                      'Evening meal — halfway point to the Moon'),
('e062', 'artemis-2', 255600, 3, 'crew',          'Crew Sleep Period',                'Rest period — Moon visible as growing crescent through windows');

-- ========== FD04: Approaching the Moon ==========
INSERT INTO mission_events (id, mission_id, met_seconds, flight_day, category, title, description) VALUES
('e063', 'artemis-2', 280800, 4, 'crew',          'Crew Wakeup',                      'Morning routine — lunar features becoming visible to naked eye'),
('e064', 'artemis-2', 284400, 4, 'navigation',    'Lunar Approach Navigation',        'Precise ranging using DSN and onboard optical navigation to refine approach trajectory'),
('e065', 'artemis-2', 291600, 4, 'communication', 'Live Moon-Approach Broadcast',     'Crew streams real-time video of Moon growing in Orion windows to global audience'),
('e066', 'artemis-2', 295200, 4, 'system',        'Pre-Flyby Systems Check',          'Final systems verification before entering lunar sphere of influence'),
('e067', 'artemis-2', 302400, 4, 'navigation',    'Enter Lunar Sphere of Influence',  'Moon''s gravity now the dominant force acting on Orion — spacecraft accelerating toward Moon'),
('e068', 'artemis-2', 309600, 4, 'crew',          'Flyby Prep: Camera Setup',         'Crew mounts all cameras and configures windows for maximum lunar surface coverage'),
('e069', 'artemis-2', 316800, 4, 'navigation',    'Trajectory Trim Maneuver',         'Final small correction to optimize closest-approach altitude of ~130 km'),
('e070', 'artemis-2', 324000, 4, 'system',        'Communication Prep for Far Side',  'Systems configured for planned communication blackout during far-side passage'),
('e071', 'artemis-2', 331200, 4, 'science',       'Lunar Surface Imaging Begins',     'High-resolution photography of nearside features: craters, mare, potential landing sites'),
('e072', 'artemis-2', 338400, 4, 'crew',          'Pre-Closest-Approach Brief',       'Final crew briefing: closest approach procedures, timeline, photo assignments');

-- ========== FD05: Lunar Flyby & Return Begins ==========
INSERT INTO mission_events (id, mission_id, met_seconds, flight_day, category, title, description) VALUES
('e073', 'artemis-2', 342000, 4, 'navigation',    'Closest Approach Phase Begins',    'Orion descends toward 130 km above the lunar surface at increasing velocity'),
('e074', 'artemis-2', 345600, 5, 'navigation',    'Closest Lunar Approach',           'Closest point to the Moon: ~130 km above the far side — crew are the farthest humans from Earth since Apollo'),
('e075', 'artemis-2', 345660, 5, 'science',       'Far-Side Observation Window',      'Crew photographs the lunar far side — craters, highlands, and South Pole-Aitken basin visible'),
('e076', 'artemis-2', 348000, 5, 'communication', 'Loss of Signal (Far Side)',        'Orion passes behind the Moon — planned communication blackout with Earth'),
('e077', 'artemis-2', 352800, 5, 'communication', 'Acquisition of Signal',            'Orion emerges from behind the Moon — communication with Houston restored'),
('e078', 'artemis-2', 356400, 5, 'navigation',    'Return Trajectory Confirmed',      'Free-return trajectory verified — Moon''s gravity has bent Orion''s path back toward Earth'),
('e079', 'artemis-2', 360000, 5, 'science',       'Earthrise Photography',            'Crew captures Earthrise over the lunar horizon — iconic perspective from deep space'),
('e080', 'artemis-2', 367200, 5, 'communication', 'Post-Flyby Press Event',           'Commander Wiseman: "The Moon was spectacular. Craters in incredible detail."'),
('e081', 'artemis-2', 374400, 5, 'crew',          'Crew Celebration Dinner',          'Special meal to mark successful lunar flyby — farthest point from Earth achieved'),
('e082', 'artemis-2', 381600, 5, 'crew',          'Crew Sleep Period',                'Rest period after emotionally intense flyby operations');

-- ========== FD06: Return Coast ==========
INSERT INTO mission_events (id, mission_id, met_seconds, flight_day, category, title, description) VALUES
('e083', 'artemis-2', 410400, 6, 'crew',          'Crew Wakeup',                      'Morning routine — Earth now a bright blue marble growing slowly in the windows'),
('e084', 'artemis-2', 414000, 6, 'navigation',    'Return Coast Navigation Update',   'DSN tracking confirms return trajectory is nominal — no correction needed yet'),
('e085', 'artemis-2', 421200, 6, 'propulsion',    'Return Correction Burn 1',         'RCC-1: First return trajectory correction maneuver — fine-tuning Earth approach'),
('e086', 'artemis-2', 428400, 6, 'communication', 'In-Flight Science Review',         'Crew discusses scientific observations and photography with ground teams'),
('e087', 'artemis-2', 435600, 6, 'system',        'Mid-Return Systems Health',        'Comprehensive vehicle assessment at mission halfway point (by time)'),
('e088', 'artemis-2', 442800, 6, 'crew',          'Exercise & Recreation Period',     'Crew physical exercise followed by scheduled personal time');

-- ========== FD07: Return Coast Continues ==========
INSERT INTO mission_events (id, mission_id, met_seconds, flight_day, category, title, description) VALUES
('e089', 'artemis-2', 496800, 7, 'crew',          'Crew Wakeup',                      'Morning routine — Earth distinctly larger, approaching home'),
('e090', 'artemis-2', 504000, 7, 'navigation',    'Return Correction Burn 2',         'RCC-2: Second return trajectory correction — tightening entry corridor targeting'),
('e091', 'artemis-2', 514800, 7, 'science',       'Final Deep-Space Photography',     'Last opportunity for deep-space Earth/Moon imagery as distance closes'),
('e092', 'artemis-2', 525600, 7, 'communication', 'Crew Educational Downlink',        'Live educational broadcast to schools — crew answers student questions about deep space'),
('e093', 'artemis-2', 540000, 7, 'system',        'Heat Shield Inspection',           'Visual inspection of thermal protection system via cameras before reentry'),
('e094', 'artemis-2', 554400, 7, 'crew',          'Crew Sleep Period',                'Rest period — crew prepares mentally for return and reentry');

-- ========== FD08: Pre-Entry Preparations ==========
INSERT INTO mission_events (id, mission_id, met_seconds, flight_day, category, title, description) VALUES
('e095', 'artemis-2', 583200, 8, 'crew',          'Crew Wakeup',                      'Early wakeup for reentry preparation day — Earth nearly fills the window'),
('e096', 'artemis-2', 590400, 8, 'system',        'Entry Systems Checkout',           'Parachute system, uprighting bags, and recovery beacon verification'),
('e097', 'artemis-2', 601200, 8, 'navigation',    'Entry Corridor Verification',      'Final navigation fix confirms entry targeting — corridor width and skip-entry parameters set'),
('e098', 'artemis-2', 612000, 8, 'system',        'Cabin Stowage for Entry',          'All loose items secured, equipment prepared for high-G reentry loads'),
('e099', 'artemis-2', 626400, 8, 'communication', 'Pre-Entry Press Conference',       'Final crew comments before reentry: reflections on the journey'),
('e100', 'artemis-2', 640800, 8, 'crew',          'Pre-Entry Rest Period',            'Final sleep period before entry day — crew required to be fully rested');

-- ========== FD09: Reentry & Splashdown ==========
INSERT INTO mission_events (id, mission_id, met_seconds, flight_day, category, title, description) VALUES
('e101', 'artemis-2', 669600, 9, 'crew',          'Entry Day Wakeup',                 'Special early wakeup — crew begins final preparations for atmospheric entry'),
('e102', 'artemis-2', 676800, 9, 'crew',          'OCSS Suit Donning',                'Crew puts on Orion Crew Survival System suits and straps into seats'),
('e103', 'artemis-2', 684000, 9, 'system',        'Final Entry GO/NO-GO',             'Flight Director polls all consoles — all stations report GO for entry'),
('e104', 'artemis-2', 691200, 9, 'navigation',    'Entry Attitude Maneuver',          'Orion rotates to entry attitude — heat shield forward, crew facing backwards'),
('e105', 'artemis-2', 698400, 9, 'system',        'Service Module Separation',        'European Service Module separates from Orion crew module — now committed to entry'),
('e106', 'artemis-2', 702000, 9, 'propulsion',    'Deorbit / Entry Correction Burn',  'Final precision burn to target the entry corridor — down to meters of accuracy'),
('e107', 'artemis-2', 712800, 9, 'navigation',    'Entry Interface (EI)',             'Orion contacts upper atmosphere at 122 km altitude — velocity ~40,000 km/h, heating begins'),
('e108', 'artemis-2', 713400, 9, 'navigation',    'Peak Heating',                     'Heat shield surface exceeds 2,700°C — plasma surrounds crew module, communications blacked out'),
('e109', 'artemis-2', 714000, 9, 'navigation',    'Skip-Entry Maneuver',              'Orion skips off the atmosphere like a stone on water — extending range and reducing G-loads'),
('e110', 'artemis-2', 715200, 9, 'navigation',    'Second Atmospheric Entry',         'Orion re-enters the atmosphere on final descent toward the Pacific Ocean'),
('e111', 'artemis-2', 716400, 9, 'system',        'Drogue Parachute Deploy',          'Two drogue chutes deploy at ~7.6 km altitude to slow and stabilize the capsule'),
('e112', 'artemis-2', 717000, 9, 'system',        'Main Parachute Deploy',            'Three massive main parachutes deploy — Orion slows to ~30 km/h for water landing'),
('e113', 'artemis-2', 718200, 9, 'navigation',    'Splashdown',                       'Orion splashes down in the Pacific Ocean — Artemis II crew safely home after 10 days in deep space'),
('e114', 'artemis-2', 720000, 9, 'crew',          'Crew Hatch Opening',               'Recovery swimmers reach capsule, hatch opened — crew breathing fresh ocean air'),
('e115', 'artemis-2', 723600, 9, 'crew',          'Crew Extraction & Recovery',       'All four astronauts extracted from Orion and transported to USS recovery ship');
