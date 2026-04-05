-- Fix e073: met_seconds=342000 is FD4 (floor(342000/86400)+1=4), not FD5
UPDATE mission_events SET flight_day = 4 WHERE id = 'e073';
