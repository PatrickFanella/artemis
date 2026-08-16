//
//  DashboardView.swift
//  Artemis
//
//  Live mission-control dashboard for the active mission.
//


import SwiftUI


struct DashboardView: View {
    @Environment(MissionStore.self) private var store


    var body: some View {
        NavigationStack {
            ZStack {
                Theme.backdrop.ignoresSafeArea()
                Starfield()


                if let dash = store.dashboard {
                    ScrollView {
                        VStack(spacing: 18) {
                            header(dash)
                            clockCard(dash)
                            trajectoryCard(dash)
                            telemetryGrid(dash)
                            if let current = dash.currentEvent {
                                currentEventCard(current, next: dash.nextEvent)
                            }
                            sectionsStrip(dash)
                            linksRow(dash)
                            Color.clear.frame(height: 8)
                        }
                        .padding(.horizontal, 16)
                        .padding(.top, 4)
                    }
                    .refreshable { await store.refresh() }
                } else {
                    ProgressView().controlSize(.large).tint(Theme.amber)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    HStack(spacing: 6) {
                        Image(systemName: "moon.stars.fill")
                            .foregroundStyle(Theme.amber)
                        Text("MISSION CONTROL")
                            .font(.system(size: 13, weight: .heavy, design: .rounded))
                            .tracking(1.6)
                            .foregroundStyle(Theme.textPrimary)
                    }
                }
            }
            .toolbarBackground(Theme.space, for: .navigationBar)
        }
        .tint(Theme.amber)
    }


    // MARK: - Sections


    private func header(_ dash: ActiveMissionDashboard) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                TagPill(text: dash.mission.status, color: Theme.green, filled: true)
                Spacer()
                if dash.clock.isLive { LiveBadge() }
            }
            Text(dash.mission.name)
                .font(.system(size: 34, weight: .heavy, design: .rounded))
                .foregroundStyle(Theme.textPrimary)
            Text(dash.mission.tagline)
                .font(.system(size: 14))
                .foregroundStyle(Theme.textSecondary)