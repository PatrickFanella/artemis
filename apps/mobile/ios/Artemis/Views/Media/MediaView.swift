//
//  MediaView.swift
//  Artemis
//
//  NASA media gallery with search.
//


import SwiftUI


struct MediaView: View {
    @Environment(MissionStore.self) private var store
    @State private var query: String = ""
    @State private var selected: MediaAsset? = nil


    private let columns = [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)]


    var body: some View {
        NavigationStack {
            ZStack {
                Theme.backdrop.ignoresSafeArea()
                Starfield(starCount: 40)


                ScrollView {
                    LazyVGrid(columns: columns, spacing: 12) {
                        ForEach(store.media) { asset in
                            MediaTile(asset: asset)
                                .onTapGesture { selected = asset }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 6)
                    Color.clear.frame(height: 8)
                }
                .scrollDismissesKeyboard(.immediately)


                if store.media.isEmpty {
                    ContentUnavailableView("No media found", systemImage: "photo.on.rectangle.angled",
                                           description: Text("Try a different search term."))
                        .foregroundStyle(Theme.textSecondary)
                }
            }
            .navigationTitle("Gallery")
            .navigationBarTitleDisplayMode(.large)
            .toolbarBackground(Theme.space, for: .navigationBar)
            .searchable(text: $query, prompt: "Search NASA media")
            .onSubmit(of: .search) {
                Task { await store.searchMedia(query: query) }
            }
            .onChange(of: query) { _, newValue in
                if newValue.isEmpty {
                    Task { await store.searchMedia(query: "") }
                }
            }
            .sheet(item: $selected) { asset in
                MediaDetailSheet(asset: asset)
            }
        }
        .tint(Theme.amber)
    }
}


private struct MediaTile: View {
    let asset: MediaAsset


    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Color(.sRGB, white: 0.1)
                .aspectRatio(1, contentMode: .fit)
                .overlay {
                    AsyncImage(url: URL(string: asset.previewURL)) { phase in
                        if let image = phase.image {
                            image.resizable().aspectRatio(contentMode: .fill)
                        } else {