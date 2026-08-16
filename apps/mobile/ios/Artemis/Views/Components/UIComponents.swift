//
//  UIComponents.swift
//  Artemis
//
//  Reusable glass cards, badges, and section headers.
//


import SwiftUI


/// A translucent panel with a hairline border — the core surface unit.
struct Panel<Content: View>: View {
    var padding: CGFloat = 16
    @ViewBuilder var content: Content


    var body: some View {
        content
            .padding(padding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(
                RoundedRectangle(cornerRadius: 20, style: .continuous)
                    .fill(Theme.surface.opacity(0.55))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 20, style: .continuous)
                    .stroke(Theme.hairline, lineWidth: 1)
            )
    }
}


/// Small pill label for categories / statuses.
struct TagPill: View {
    let text: String
    let color: Color
    var filled: Bool = false


    var body: some View {
        Text(text.uppercased())
            .font(.system(size: 10, weight: .bold, design: .rounded))
            .tracking(0.8)
            .foregroundStyle(filled ? Theme.space : color)
            .padding(.horizontal, 9)
            .padding(.vertical, 4)
            .background(
                Capsule().fill(filled ? color : color.opacity(0.14))
            )
            .overlay(
                Capsule().stroke(color.opacity(filled ? 0 : 0.35), lineWidth: 1)
            )
    }
}


/// "LIVE" indicator with a pulsing dot.
struct LiveBadge: View {
    @State private var pulse = false


    var body: some View {
        HStack(spacing: 6) {
            Circle()
                .fill(Theme.green)
                .frame(width: 7, height: 7)
                .overlay(
                    Circle()
                        .stroke(Theme.green, lineWidth: 1.5)
                        .scaleEffect(pulse ? 2.4 : 1)
                        .opacity(pulse ? 0 : 0.8)
                )
            Text("LIVE")
                .font(.system(size: 11, weight: .heavy, design: .rounded))
                .tracking(1.2)
                .foregroundStyle(Theme.green)
        }
        .onAppear {
            withAnimation(.easeOut(duration: 1.4).repeatForever(autoreverses: false)) {