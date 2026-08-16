//
//  RootView.swift
//  Artemis
//
//  Tab-based shell for the mission-control experience.
//


import SwiftUI


struct RootView: View {
    @Environment(MissionStore.self) private var store


    var body: some View {
        TabView {
            DashboardView()
                .tabItem { Label("Control", systemImage: "gauge.with.dots.needle.67percent") }


            MissionTimelineView()
                .tabItem { Label("Flight Plan", systemImage: "list.bullet.indent") }


            UpdatesView()
                .tabItem { Label("Updates", systemImage: "newspaper.fill") }


            MediaView()
                .tabItem { Label("Gallery", systemImage: "photo.stack.fill") }


            MissionView()
                .tabItem { Label("Mission", systemImage: "moon.stars.fill") }
        }
        .tint(Theme.amber)
        .task {
            await store.load()
            store.startClock()
        }
        .onDisappear { store.stopClock() }
    }
}

