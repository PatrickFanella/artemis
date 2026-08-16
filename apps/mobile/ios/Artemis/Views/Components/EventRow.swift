//
//  EventRow.swift
//  Artemis
//
//  Timeline row for a mission event with a category spine and MET stamp.
//


import SwiftUI


struct EventRow: View {
    let event: MissionEvent
    var showConnector: Bool = true


    private var color: Color { Theme.categoryColor(event.category) }


    private var metStamp: String {
        let s = event.metSeconds
        return String(format: "T+%02d:%02d:%02d", s / 86_400, (s % 86_400) / 3_600, (s % 3_600) / 60)
    }


    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            VStack(spacing: 0) {
                ZStack {
                    Circle()
                        .fill(color.opacity(event.status == "upcoming" ? 0.15 : 0.25))
                        .frame(width: 30, height: 30)
                    Image(systemName: icon)
                        .font(.system(size: 12, weight: .bold))
                        .foregroundStyle(color)
                    if event.status == "active" {
                        Circle()
                            .stroke(color, lineWidth: 1.5)
                            .frame(width: 30, height: 30)
                    }
                }
                if showConnector {
                    Rectangle()
                        .fill(Theme.hairline)
                        .frame(width: 1.5)
                        .frame(maxHeight: .infinity)
                }
            }


            VStack(alignment: .leading, spacing: 6) {
                HStack(spacing: 8) {
                    Text(metStamp)
                        .font(.telemetry(11, weight: .semibold))
                        .foregroundStyle(color)
                    Text(event.status == "active" ? "FD\(event.flightDay) · NOW" : "FD\(event.flightDay)")
                        .font(.system(size: 10, weight: .bold, design: .rounded))
                        .foregroundStyle(event.status == "active" ? Theme.green : Theme.textTertiary)
                }
                Text(event.title)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundStyle(Theme.textPrimary)
                Text(event.description)
                    .font(.system(size: 12.5))
                    .foregroundStyle(Theme.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
                TagPill(text: event.category, color: color)
                    .padding(.top, 2)
            }
            .padding(.bottom, showConnector ? 22 : 0)
            Spacer(minLength: 0)
        }
        .opacity(event.status == "upcoming" ? 0.72 : 1)
    }


    private var icon: String {
        switch event.category.lowercased() {
        case "propulsion": return "flame.fill"
        case "navigation": return "location.north.line.fill"