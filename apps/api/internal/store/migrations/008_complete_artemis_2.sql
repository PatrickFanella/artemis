-- Mark Artemis II as completed. The crewed lunar flyby launched 2026-04-01
-- and splashed down 2026-04-11, ending the first Artemis crewed mission.
-- Until the next mission (Artemis III) is active, the site shows "between
-- missions" and focuses on Artemis II updates and media.

UPDATE missions
SET status = 'completed',
    description = 'The first crewed mission of NASA''s Artemis program. Four astronauts flew around the Moon on a 10-day mission, testing Orion''s life support systems and validating capabilities needed for future lunar surface missions. The flight concluded with splashdown and crew recovery on April 11, 2026.',
    updated_at = datetime('now')
WHERE id = 'artemis-2';

-- All schedule sections for the completed mission are now complete.
UPDATE mission_sections
SET status = 'completed'
WHERE mission_id = 'artemis-2';

-- Close out remaining milestones that had not yet been marked complete.
UPDATE milestones
SET completed_at = COALESCE(completed_at, planned_at)
WHERE mission_id = 'artemis-2'
  AND completed_at IS NULL;
