//
//  MissionStore.swift
//  Artemis
//
//  Observable app state. Attempts the live API, falls back to embedded
//  sample data so the dashboard always renders. Drives a live mission clock.
//


import SwiftUI
import Observation


@MainActor
@Observable
final class MissionStore {
    private(set) var dashboard: ActiveMissionDashboard?
    private(set) var missions: [Mission] = []
    private(set) var media: [MediaAsset] = []
    private(set) var isLoading: Bool = false
    private(set) var usingLiveAPI: Bool = false


    /// Drives the live mission clock — updated every second.
    private(set) var now: Date = Date()


    private let client: APIClient
    private var clockTask: Task<Void, Never>?


    init() {
        self.client = APIClient(baseURL: Config.EXPO_PUBLIC_RORK_API_BASE_URL)
    }


    // MARK: - Live clock


    func startClock() {
        guard clockTask == nil else { return }
        clockTask = Task { [weak self] in
            while !Task.isCancelled {
                try? await Task.sleep(for: .seconds(1))
                guard let self else { return }
                self.now = Date()
            }
        }
    }


    func stopClock() {
        clockTask?.cancel()
        clockTask = nil
    }


    /// Mission elapsed time derived live from the launch instant.
    var liveElapsed: TimeInterval {
        guard let launch = launchDate else { return 0 }
        return max(0, now.timeIntervalSince(launch))
    }


    var launchDate: Date? {
        guard let iso = dashboard?.clock.launchTime else { return nil }
        return DateParsing.date(from: iso)
    }


    /// Formatted MET string "DD:HH:MM:SS".
    var metDisplay: String {
        let e = Int(liveElapsed)
        return String(format: "%02d:%02d:%02d:%02d",
                      e / 86_400, (e % 86_400) / 3_600, (e % 3_600) / 60, e % 60)
    }


    var liveFlightDay: Int { Int(liveElapsed) / 86_400 + 1 }


    var liveProgress: Double {
        let total = 10.0 * 86_400.0
        return min(1.0, max(0.0, liveElapsed / total))
    }

