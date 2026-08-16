//
//  Theme.swift
//  Artemis
//
//  Central design system: deep-space mission-control palette and typography.
//


import SwiftUI


enum Theme {
    // Backgrounds
    static let space = Color(red: 0.02, green: 0.027, blue: 0.06)      // #05070F
    static let spaceLight = Color(red: 0.055, green: 0.078, blue: 0.157) // #0E1428
    static let surface = Color(red: 0.08, green: 0.10, blue: 0.18)
    static let surfaceElevated = Color(red: 0.11, green: 0.14, blue: 0.23)


    // Accents
    static let amber = Color(red: 1.0, green: 0.42, blue: 0.21)        // #FF6B35
    static let amberSoft = Color(red: 1.0, green: 0.58, blue: 0.35)
    static let cyan = Color(red: 0.30, green: 0.82, blue: 0.88)        // #4DD0E1
    static let green = Color(red: 0.36, green: 0.85, blue: 0.55)
    static let violet = Color(red: 0.55, green: 0.45, blue: 0.95)


    // Text
    static let textPrimary = Color.white
    static let textSecondary = Color.white.opacity(0.62)
    static let textTertiary = Color.white.opacity(0.38)


    static let hairline = Color.white.opacity(0.08)


    /// Full-screen deep space gradient used as the app backdrop.
    static var backdrop: LinearGradient {
        LinearGradient(
            colors: [space, spaceLight, space],
            startPoint: .top,
            endPoint: .bottom
        )
    }


    static func categoryColor(_ category: String) -> Color {
        switch category.lowercased() {
        case "propulsion": return amber
        case "navigation": return cyan
        case "crew": return green
        case "communication": return violet
        case "science": return Color(red: 0.95, green: 0.78, blue: 0.30)
        default: return Color.white.opacity(0.7)
        }
    }


    static func statusColor(_ status: String) -> Color {
        switch status.lowercased() {
        case "active": return green
        case "completed": return cyan
        case "upcoming": return Color.white.opacity(0.5)
        default: return Color.white.opacity(0.5)
        }
    }
}


extension Font {
    /// Monospaced digits for telemetry / clock readouts.
    static func telemetry(_ size: CGFloat, weight: Font.Weight = .semibold) -> Font {
        .system(size: size, weight: weight, design: .monospaced)
    }
}

