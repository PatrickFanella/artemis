package service

import "math"

// TrajectoryWaypoint defines a point on the spacecraft's trajectory
type TrajectoryWaypoint struct {
	MetSeconds      int
	EarthDistanceKm float64
	MoonDistanceKm  float64
	VelocityKmh     float64
}

// Artemis II free-return trajectory waypoints
// Earth-Moon distance ~384,400 km
var artemis2Waypoints = []TrajectoryWaypoint{
	// FD01: Launch & Orbit
	{0, 0, 384400, 0},              // Liftoff (on pad)
	{60, 15, 384385, 4000},          // Max-Q ascent
	{510, 185, 384215, 28000},       // Orbit insertion
	{7200, 185, 384215, 27800},      // In orbit (T+2h)
	{14400, 200, 384200, 27800},     // Prox ops (T+4h)
	{72000, 250, 384150, 27700},     // Prox ops complete (T+20h)
	{79200, 250, 384150, 27700},     // Pre-TLI (T+22h)
	{80400, 3000, 381400, 38600},    // TLI complete (T+22.3h)

	// FD01-02: Early outbound coast
	{86400, 12000, 372400, 14000},   // T+24h
	{108000, 42000, 342400, 8000},   // T+30h
	{129600, 67000, 317400, 6200},   // T+36h

	// FD02-03: Outbound coast
	{151200, 95000, 289400, 5000},   // T+42h (OCC-1)
	{172800, 118000, 266400, 4400},  // T+48h
	{194400, 140000, 244400, 4000},  // T+54h
	{216000, 158000, 226400, 3700},  // T+60h

	// FD03-04: Approaching Moon
	{237600, 175000, 209400, 3400},  // T+66h
	{259200, 193000, 191400, 3200},  // T+72h
	{280800, 215000, 169400, 3000},  // T+78h
	{302400, 250000, 134400, 2800},  // T+84h (Lunar SOI entry)
	{316800, 285000, 99400, 3000},   // T+88h
	{324000, 310000, 74400, 3300},   // T+90h
	{331200, 335000, 49400, 3800},   // T+92h
	{338400, 358000, 26400, 4800},   // T+94h
	{342000, 370000, 14400, 6000},   // T+95h
	{344400, 380000, 4400, 7200},    // T+95.7h
	{345000, 383000, 1400, 7800},    // T+95.8h

	// FD05: Closest approach & departure
	{345600, 384270, 130, 8200},     // T+96h — CLOSEST APPROACH
	{346200, 383000, 1400, 7800},    // T+96.2h
	{348000, 375000, 9400, 6500},    // T+96.7h
	{352800, 355000, 29400, 4800},   // T+98h
	{360000, 325000, 59400, 3800},   // T+100h
	{374400, 280000, 104400, 3200},  // T+104h

	// FD06: Return coast
	{388800, 245000, 139400, 2900},  // T+108h
	{410400, 210000, 174400, 2800},  // T+114h
	{432000, 180000, 204400, 2900},  // T+120h

	// FD07: Return coast continues
	{475200, 138000, 246400, 3300},  // T+132h
	{518400, 102000, 282400, 3800},  // T+144h

	// FD08: Heading home
	{561600, 72000, 312400, 4800},   // T+156h
	{604800, 46000, 338400, 6200},   // T+168h
	{648000, 28000, 356400, 8500},   // T+180h

	// FD09: Approach & reentry
	{691200, 14000, 370400, 12000},  // T+192h
	{698400, 10000, 374400, 14000},  // T+194h
	{706000, 5000, 379400, 20000},   // T+196h
	{712800, 400, 384000, 38000},    // Entry interface
	{713400, 200, 384200, 40000},    // Peak heating
	{717000, 8, 384392, 300},        // Main chutes
	{718200, 0, 384400, 30},         // Splashdown
	{720000, 0, 384400, 0},          // Recovery
}

// InterpolateTrajectory computes spacecraft position at a given MET
func InterpolateTrajectory(metSeconds int) (earthKm, moonKm, velKmh float64) {
	wps := artemis2Waypoints
	if len(wps) == 0 {
		return 0, 0, 0
	}

	// Before mission start
	if metSeconds <= wps[0].MetSeconds {
		return wps[0].EarthDistanceKm, wps[0].MoonDistanceKm, wps[0].VelocityKmh
	}
	// After mission end
	if metSeconds >= wps[len(wps)-1].MetSeconds {
		last := wps[len(wps)-1]
		return last.EarthDistanceKm, last.MoonDistanceKm, last.VelocityKmh
	}

	// Find bracketing waypoints and interpolate
	for i := 0; i < len(wps)-1; i++ {
		if metSeconds >= wps[i].MetSeconds && metSeconds < wps[i+1].MetSeconds {
			t := float64(metSeconds-wps[i].MetSeconds) / float64(wps[i+1].MetSeconds-wps[i].MetSeconds)
			earthKm = lerp(wps[i].EarthDistanceKm, wps[i+1].EarthDistanceKm, t)
			moonKm = lerp(wps[i].MoonDistanceKm, wps[i+1].MoonDistanceKm, t)
			velKmh = lerp(wps[i].VelocityKmh, wps[i+1].VelocityKmh, t)
			return
		}
	}

	last := wps[len(wps)-1]
	return last.EarthDistanceKm, last.MoonDistanceKm, last.VelocityKmh
}

func lerp(a, b, t float64) float64 {
	return a + (b-a)*t
}

// PhaseFromMET determines the mission phase name from elapsed time
func PhaseFromMET(metSeconds int) (phase, label string) {
	switch {
	case metSeconds < 570:
		return "ascent", "Ascent"
	case metSeconds < 7200:
		return "orbit_insertion", "Earth Orbit"
	case metSeconds < 72000:
		return "proximity_ops", "Proximity Operations"
	case metSeconds < 79200:
		return "pre_tli", "Pre-TLI"
	case metSeconds < 81000:
		return "tli_burn", "Trans-Lunar Injection"
	case metSeconds < 302400:
		return "outbound_coast", "Outbound Coast"
	case metSeconds < 345000:
		return "lunar_approach", "Lunar Approach"
	case metSeconds < 346200:
		return "closest_approach", "Lunar Closest Approach"
	case metSeconds < 360000:
		return "lunar_departure", "Lunar Departure"
	case metSeconds < 706000:
		return "return_coast", "Return Coast"
	case metSeconds < 712800:
		return "entry_prep", "Entry Preparation"
	case metSeconds < 717000:
		return "reentry", "Atmospheric Reentry"
	case metSeconds < 718200:
		return "descent", "Parachute Descent"
	case metSeconds < 720000:
		return "splashdown", "Splashdown"
	default:
		return "recovery", "Recovery"
	}
}

// TrajectoryWaypointsForViz returns simplified waypoints for frontend visualization
// Returns ~20 points along the trajectory for the SVG path
func TrajectoryWaypointsForViz() []TrajectoryVizPoint {
	// Normalized 0-1 for Earth distance (where 1 = at Moon)
	points := make([]TrajectoryVizPoint, 0, 25)
	maxDist := 384400.0
	for _, wp := range artemis2Waypoints {
		// Only include select waypoints for visualization
		norm := wp.EarthDistanceKm / maxDist
		points = append(points, TrajectoryVizPoint{
			MetSeconds: wp.MetSeconds,
			NormDist:   math.Min(norm, 1.0),
		})
	}
	return points
}

type TrajectoryVizPoint struct {
	MetSeconds int     `json:"met_seconds"`
	NormDist   float64 `json:"norm_dist"` // 0 = at Earth, 1 = at Moon
}
