//
//  TimelineView.swift
//  Artemis
//
//  Full mission event timeline with flight-day filtering.
//


import SwiftUI


struct MissionTimelineView: View {
    @Environment(MissionStore.self) private var store
    @State private var selectedDay: Int? = nil


    private var events: [MissionEvent] { store.liveEvents }


    private var flightDays: [Int] {
        Array(Set(events.map(\.flightDay))).sorted()
    }


    private var filtered: [MissionEvent] {
        guard let day = selectedDay else { return events }
        return events.filter { $0.flightDay == day }
    }


    var body: some View {
        NavigationStack {
            ZStack {
                Theme.backdrop.ignoresSafeArea()
                Starfield(starCount: 60)


                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        dayFilter
                        legend
                        VStack(alignment: .leading, spacing: 0) {
                            ForEach(Array(filtered.enumerated()), id: \.element.id) { index, event in
                                EventRow(event: event, showConnector: index < filtered.count - 1)
                            }
                        }
                        .padding(.top, 4)
                        Color.clear.frame(height: 8)
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 4)
                }
            }
            .navigationTitle("Flight Plan")
            .navigationBarTitleDisplayMode(.large)
            .toolbarBackground(Theme.space, for: .navigationBar)
        }
        .tint(Theme.amber)
    }


    private var dayFilter: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                chip(label: "ALL", active: selectedDay == nil) { selectedDay = nil }
                ForEach(flightDays, id: \.self) { day in
                    chip(label: "FD\(String(format: "%02d", day))", active: selectedDay == day) {
                        selectedDay = (selectedDay == day) ? nil : day
                    }
                }
            }
            .padding(.vertical, 2)
        }
        .contentMargins(.horizontal, 0)
    }


    private func chip(label: String, active: Bool, action: @escaping () -> Void) -> some View {
        Button(action: {
            withAnimation(.snappy) { action() }
        }) {
            Text(label)