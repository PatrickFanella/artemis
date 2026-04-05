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
// Based on NASA Artemis II Overview Timeline (launch 2026-04-01T22:35Z)
// Closest approach at ~MET 04/20:38 (421080s)
var artemis2Waypoints = []TrajectoryWaypoint{
	// FD01: Launch & Orbit (MET 00/00:00 - 00/17:00)
	{0, 0, 384400, 0},              // Liftoff
	{60, 15, 384385, 4000},          // Max-Q ascent
	{510, 185, 384215, 28000},       // Orbit insertion
	{5400, 185, 384215, 27800},      // ARB (T+1.5h)
	{11700, 200, 384200, 27800},     // Prox ops demo (T+3.25h)
	{17100, 200, 384200, 27800},     // USS-2 (T+4.75h)
	{54000, 220, 384180, 27700},     // Pre-TLI sleep ends (T+15h)

	// FD02: TLI (MET 00/21:00 - 01/17:00)
	{75600, 250, 384150, 27700},     // FD02 wakeup (T+21h)
	{86400, 3000, 381400, 38600},    // TLI burn (T+24h)
	{90000, 8000, 376400, 18000},    // Post-TLI (T+25h)
	{104400, 32000, 352400, 10000},  // Window inspect (T+29h)
	{118800, 52000, 332400, 7500},   // FD02 sleep (T+33h)

	// FD03: Outbound Coast (MET 01/20:45 - 02/17:00)
	{161100, 88000, 296400, 5400},   // FD03 wakeup (T+44.75h)
	{169200, 96000, 288400, 5000},   // OTC-1 burn (T+47h)
	{194400, 120000, 264400, 4200},  // FD03 activities (T+54h)
	{205200, 132000, 252400, 3900},  // FD03 sleep (T+57h)

	// FD04: Outbound Coast (MET 02/20:15 - 03/17:00)
	{245700, 160000, 224400, 3500},  // FD04 wakeup (T+68.25h)
	{260100, 175000, 209400, 3300},  // OTC-2 burn (T+72.25h)
	{280800, 195000, 189400, 3100},  // Science imaging (T+78h)
	{290700, 205000, 179400, 3000},  // FD04 sleep (T+80.75h)

	// FD05: Flyby Prep (MET 03/19:15 - 04/16:15)
	{328500, 240000, 144400, 2800},  // FD05 wakeup (T+91.25h)
	{345600, 260000, 124400, 2700},  // Depress ops (T+96h)
	{359100, 280000, 104400, 2700},  // OTC-3 burn (T+99.75h)
	{373500, 305000, 79400, 2800},   // FD05 sleep (T+103.75h)

	// FD06: Lunar Flyby (MET 04/18:15 - 05/17:00)
	{411300, 350000, 34400, 3500},   // FD06 wakeup (T+114.25h)
	{413100, 355000, 29400, 3800},   // Lunar conference (T+114.75h)
	{417600, 365000, 19400, 4800},   // Obs window opens (T+116h)
	{419400, 375000, 9400, 6200},    // Approaching (T+116.5h)
	{420600, 393000, 10600, 3200},   // Close approach phase (T+116.8h)
	{421080, 395100, 8900, 2900},    // CLOSEST APPROACH (~8,900 km from surface)
	{421800, 393000, 10600, 3200},   // Departing (T+117.2h)
	{423000, 375000, 9400, 6500},    // LOS far side (T+117.5h)
	{425400, 365000, 19400, 5200},   // AOS (T+118.2h)
	{428400, 350000, 34400, 4200},   // Earthrise photo (T+119h)
	{434700, 330000, 54400, 3500},   // Obs window closes (T+120.75h)
	{459000, 280000, 104400, 3000},  // FD06 sleep (T+127.5h)

	// FD07: Return Coast (MET 05/19:30 - 06/17:00)
	{502200, 235000, 149400, 2800},  // FD07 wakeup (T+139.5h)
	{521100, 210000, 174400, 2800},  // RTC-1 burn (T+144.75h)
	{549000, 178000, 206400, 2900},  // FD07 sleep (T+152.5h)

	// FD08: Return Coast (MET 06/18:30 - 07/17:00)
	{585000, 142000, 242400, 3200},  // FD08 wakeup (T+162.5h)
	{620100, 105000, 279400, 3800},  // Manual pilot (T+172.25h)
	{635400, 88000, 296400, 4200},   // FD08 sleep (T+176.5h)

	// FD09: Entry Prep (MET 07/19:15 - 08/17:00)
	{674100, 55000, 329400, 5400},   // FD09 wakeup (T+187.25h)
	{704700, 28000, 356400, 7500},   // RTC-2 burn (T+195.75h)
	{721800, 16000, 368400, 9500},   // FD09 sleep (T+200.5h)

	// FD10: Reentry & Splashdown (MET 08/19:15 - 09/04:00)
	{760500, 4000, 380400, 16000},   // FD10 wakeup (T+211.25h)
	{762300, 3200, 381200, 18000},   // RTC-3 burn (T+211.75h)
	{772200, 800, 383600, 28000},    // Entry checklist (T+214.5h)
	{780000, 400, 384000, 36000},    // SM separation (T+216.7h)
	{781200, 200, 384200, 40000},    // Entry interface (T+217h)
	{783000, 8, 384392, 300},        // Main chutes
	{783900, 0, 384400, 30},         // Splashdown
	{792000, 0, 384400, 0},          // Recovery
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
	case metSeconds < 485:
		return "ascent", "Ascent"
	case metSeconds < 5400:
		return "orbit_insertion", "Earth Orbit"
	case metSeconds < 17100:
		return "proximity_ops", "Proximity Operations"
	case metSeconds < 75600:
		return "pre_tli", "Pre-TLI"
	case metSeconds < 90000:
		return "tli_burn", "Trans-Lunar Injection"
	case metSeconds < 411300:
		return "outbound_coast", "Outbound Coast"
	case metSeconds < 420600:
		return "lunar_approach", "Lunar Approach"
	case metSeconds < 421800:
		return "closest_approach", "Lunar Closest Approach"
	case metSeconds < 434700:
		return "lunar_departure", "Lunar Departure"
	case metSeconds < 772200:
		return "return_coast", "Return Coast"
	case metSeconds < 781200:
		return "entry_prep", "Entry Preparation"
	case metSeconds < 783000:
		return "reentry", "Atmospheric Reentry"
	case metSeconds < 783900:
		return "descent", "Parachute Descent"
	case metSeconds < 792000:
		return "splashdown", "Splashdown"
	default:
		return "recovery", "Recovery"
	}
}

// TrajectoryWaypointsForViz returns simplified waypoints for frontend visualization
func TrajectoryWaypointsForViz() []TrajectoryVizPoint {
	points := make([]TrajectoryVizPoint, 0, 25)
	maxDist := 384400.0
	for _, wp := range artemis2Waypoints {
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
