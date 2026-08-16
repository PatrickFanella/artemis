//
//  UpdatesView.swift
//  Artemis
//
//  Latest mission updates / blog feed.
//


import SwiftUI


struct UpdatesView: View {
    @Environment(MissionStore.self) private var store


    private var updates: [BlogUpdate] {
        store.dashboard?.latestUpdates ?? SampleData.updates
    }


    var body: some View {
        NavigationStack {
            ZStack {
                Theme.backdrop.ignoresSafeArea()
                Starfield(starCount: 50)


                ScrollView {
                    LazyVStack(spacing: 16) {
                        ForEach(updates) { update in
                            UpdateCard(update: update)
                        }
                        Color.clear.frame(height: 8)
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 4)
                }
                .refreshable { await store.refresh() }
            }
            .navigationTitle("Updates")
            .navigationBarTitleDisplayMode(.large)
            .toolbarBackground(Theme.space, for: .navigationBar)
        }
        .tint(Theme.amber)
    }
}


private struct UpdateCard: View {
    let update: BlogUpdate


    var body: some View {
        Link(destination: URL(string: update.url) ?? URL(string: "https://www.nasa.gov")!) {
            VStack(alignment: .leading, spacing: 0) {
                if let img = update.imageURL, let url = URL(string: img) {
                    Color(.sRGB, white: 0.1)
                        .frame(height: 168)
                        .overlay {
                            AsyncImage(url: url) { phase in
                                if let image = phase.image {
                                    image.resizable().aspectRatio(contentMode: .fill)
                                } else {
                                    Theme.surface
                                }
                            }
                            .allowsHitTesting(false)
                        }
                        .clipped()
                        .overlay(alignment: .topLeading) {
                            TagPill(text: update.source, color: Theme.amber, filled: true)
                                .padding(12)
                        }
                        .overlay(alignment: .bottom) {
                            LinearGradient(colors: [.clear, Theme.surface.opacity(0.9)],
                                           startPoint: .center, endPoint: .bottom)
                                .frame(height: 60)
                                .allowsHitTesting(false)
                        }
                }