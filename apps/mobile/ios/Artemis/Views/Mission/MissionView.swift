//
//  MissionView.swift
//  Artemis
//
//  Mission overview, crew roster, and milestones.
//


import SwiftUI


struct MissionView: View {
    @Environment(MissionStore.self) private var store


    private var mission: Mission? { store.dashboard?.mission }


    var body: some View {
        NavigationStack {
            ZStack {
                Theme.backdrop.ignoresSafeArea()
                Starfield(starCount: 45)


                if let mission {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 20) {
                            hero(mission)
                            overview(mission)
                            crewSection(mission)
                            milestonesSection()
                            Color.clear.frame(height: 8)
                        }
                        .padding(.bottom, 8)
                    }
                } else {
                    ProgressView().tint(Theme.amber)
                }
            }
            .navigationTitle("Mission")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(Theme.space, for: .navigationBar)
        }
        .tint(Theme.amber)
    }


    private func hero(_ mission: Mission) -> some View {
        Color(.sRGB, white: 0.1)
            .frame(height: 280)
            .overlay {
                AsyncImage(url: URL(string: mission.imageURL)) { phase in
                    if let image = phase.image {
                        image.resizable().aspectRatio(contentMode: .fill)
                    } else {
                        Theme.spaceLight
                    }
                }
                .allowsHitTesting(false)
            }
            .clipped()
            .overlay {
                LinearGradient(colors: [.clear, Theme.space.opacity(0.4), Theme.space],
                               startPoint: .top, endPoint: .bottom)
                .allowsHitTesting(false)
            }
            .overlay(alignment: .bottomLeading) {
                VStack(alignment: .leading, spacing: 8) {
                    HStack(spacing: 8) {
                        TagPill(text: mission.status, color: Theme.green, filled: true)
                        TagPill(text: mission.duration, color: Theme.cyan)
                    }
                    Text(mission.name)
                        .font(.system(size: 32, weight: .heavy, design: .rounded))
                        .foregroundStyle(Theme.textPrimary)
                    Text(mission.tagline)
                        .font(.system(size: 14))
                        .foregroundStyle(Theme.textSecondary)