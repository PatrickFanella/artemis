-- Add duration to events so sleep and other long activities render as time ranges
ALTER TABLE mission_events ADD COLUMN duration_seconds INTEGER NOT NULL DEFAULT 0;

-- Set sleep durations (from NASA crew schedule start/end times)
UPDATE mission_events SET duration_seconds = 14400  WHERE id = 'e015'; -- FD01 sleep 1: 4 hrs
UPDATE mission_events SET duration_seconds = 7200   WHERE id = 'e017'; -- FD01 sleep 2: 2 hrs
UPDATE mission_events SET duration_seconds = 28800  WHERE id = 'e026'; -- FD02 sleep: 8 hrs
UPDATE mission_events SET duration_seconds = 28800  WHERE id = 'e036'; -- FD03 sleep: 8 hrs
UPDATE mission_events SET duration_seconds = 29700  WHERE id = 'e047'; -- FD04 sleep: 8.25 hrs
UPDATE mission_events SET duration_seconds = 30600  WHERE id = 'e056'; -- FD05 sleep: 8.5 hrs
UPDATE mission_events SET duration_seconds = 34200  WHERE id = 'e072'; -- FD06 sleep: 9.5 hrs
UPDATE mission_events SET duration_seconds = 30600  WHERE id = 'e081'; -- FD07 sleep: 8.5 hrs
UPDATE mission_events SET duration_seconds = 30600  WHERE id = 'e091'; -- FD08 sleep: 8.5 hrs
UPDATE mission_events SET duration_seconds = 30600  WHERE id = 'e102'; -- FD09 sleep: 8.5 hrs

-- Revert wakeup events to NASA's actual DPC/first-activity times
-- (sleep duration now covers the gap, so wakeups mark when formal activities resume)
UPDATE mission_events SET met_seconds = 75600,  title = 'Daily Planning Conference' WHERE id = 'e018'; -- FD02
UPDATE mission_events SET met_seconds = 161100, title = 'Daily Planning Conference' WHERE id = 'e027'; -- FD03
UPDATE mission_events SET met_seconds = 245700, title = 'Daily Planning Conference' WHERE id = 'e037'; -- FD04
UPDATE mission_events SET met_seconds = 328500, title = 'Daily Planning Conference' WHERE id = 'e048'; -- FD05
UPDATE mission_events SET met_seconds = 411300, title = 'Daily Planning Conference' WHERE id = 'e057'; -- FD06
UPDATE mission_events SET met_seconds = 502200, title = 'Daily Planning Conference' WHERE id = 'e073'; -- FD07
UPDATE mission_events SET met_seconds = 587700, title = 'Daily Planning Conference' WHERE id = 'e083'; -- FD08
UPDATE mission_events SET met_seconds = 674100, title = 'Daily Planning Conference' WHERE id = 'e092'; -- FD09
UPDATE mission_events SET met_seconds = 760500, title = 'Daily Planning Conference' WHERE id = 'e103'; -- FD10
DELETE FROM mission_events WHERE id = 'e103b'; -- Remove duplicate FD10 entry
