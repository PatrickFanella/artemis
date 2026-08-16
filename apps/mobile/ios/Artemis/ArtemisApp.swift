//
//  ArtemisApp.swift
//  Artemis
//
//  Created by Rork on June 12, 2026.
//


import SwiftUI


// Artemis mission-control app entry point.
@main
struct ArtemisApp: App {
    @State private var store = MissionStore()


    init() {
        // Force a consistent dark, deep-space appearance.
        UITabBar.appearance().unselectedItemTintColor = UIColor.white.withAlphaComponent(0.4)
    }


    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(store)
                .preferredColorScheme(.dark)
        }
    }
}

