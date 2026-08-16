//
//  SampleData.swift
//  Artemis
//
//  Embedded fallback data so the dashboard is alive even when the live API
//  (localhost:8090) is unreachable from the simulator. The clock launch_time
//  is anchored relative to "now" so the mission elapsed time ticks live.
//


import Foundation


nonisolated enum SampleData {


    /// Launch anchored ~4 days, 6 hours ago so the live clock reads FD04.
    static let launchDate: Date = Date().addingTimeInterval(-(4 * 86_400 + 6 * 3_600 + 12 * 60))


    static var launchISO: String { DateParsing.iso.string(from: launchDate) }
    static var nowISO: String { DateParsing.iso.string(from: Date()) }


    static let crew: [CrewMember] = [
        CrewMember(name: "Reid Wiseman", role: "Commander",
                   bio: "Veteran naval aviator commanding humanity's return to lunar orbit. Previously logged 165 days aboard the ISS.",
                   image: "https://images.unsplash.com/photo-1541873676-a18131494184?w=400"),
        CrewMember(name: "Victor Glover", role: "Pilot",
                   bio: "Test pilot and first African American to pilot a crewed flight around the Moon. SpaceX Crew-1 veteran.",
                   image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400"),
        CrewMember(name: "Christina Koch", role: "Mission Specialist 1",
                   bio: "Record holder for the longest single spaceflight by a woman and first all-female spacewalk participant.",
                   image: "https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=400"),
        CrewMember(name: "Jeremy Hansen", role: "Mission Specialist 2",
                   bio: "CSA astronaut and fighter pilot — the first Canadian to travel to the Moon.",
                   image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400")
    ]


    static let mission = Mission(
        id: "artemis-ii",
        name: "Artemis II",
        tagline: "The first crewed flight to the Moon in over 50 years",
        description: "Artemis II is the first crewed mission of NASA's Artemis program. Four astronauts aboard the Orion spacecraft perform a free-return flyby of the Moon, validating life-support, navigation, and deep-space systems ahead of a future lunar landing.",
        status: "active",
        launchDate: launchISO,
        duration: "10 days",
        crew: crew,
        imageURL: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800",
        createdAt: nowISO,
        updatedAt: nowISO
    )


    static let sections: [MissionSection] = [
        MissionSection(id: "s1", missionID: "artemis-ii", name: "Launch & Ascent", slug: "launch",
                       description: "SLS lifts off and Orion separates into a high Earth orbit.",
                       order: 1, dayRange: "FD01", status: "completed"),
        MissionSection(id: "s2", missionID: "artemis-ii", name: "Earth Orbit Checkout", slug: "checkout",
                       description: "Crew validates Orion's systems and performs the proximity operations demo.",
                       order: 2, dayRange: "FD01–FD02", status: "completed"),
        MissionSection(id: "s3", missionID: "artemis-ii", name: "Outbound Transit", slug: "outbound",
                       description: "Translunar injection sends Orion on its multi-day coast toward the Moon.",
                       order: 3, dayRange: "FD02–FD04", status: "active"),
        MissionSection(id: "s4", missionID: "artemis-ii", name: "Lunar Flyby", slug: "flyby",
                       description: "Free-return flyby carries the crew around the far side of the Moon.",
                       order: 4, dayRange: "FD05", status: "upcoming"),
        MissionSection(id: "s5", missionID: "artemis-ii", name: "Return & Splashdown", slug: "return",
                       description: "Orion coasts home for a high-speed reentry and Pacific splashdown.",
                       order: 5, dayRange: "FD06–FD10", status: "upcoming")
    ]


    static let milestones: [Milestone] = [
        Milestone(id: "m1", missionID: "artemis-ii", sectionID: "s1", title: "Liftoff",
                  description: "SLS clears the tower at Launch Complex 39B.",
                  plannedAt: DateParsing.iso.string(from: launchDate),
                  completedAt: DateParsing.iso.string(from: launchDate), order: 1),
        Milestone(id: "m2", missionID: "artemis-ii", sectionID: "s2", title: "Proximity Ops Demo",
                  description: "Crew manually pilots Orion relative to the upper stage.",