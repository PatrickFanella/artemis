//
//  Starfield.swift
//  Artemis
//
//  Subtle animated starfield used behind the deep-space backdrop.
//


import SwiftUI


struct Starfield: View {
    var starCount: Int = 90


    private struct Star: Identifiable {
        let id = UUID()
        let x: CGFloat
        let y: CGFloat
        let size: CGFloat
        let baseOpacity: Double
        let twinkleSpeed: Double
        let phase: Double
    }


    @State private var stars: [Star] = []


    var body: some View {
        TimelineView(.animation(minimumInterval: 0.08, paused: false)) { timeline in
            Canvas { context, size in
                let t = timeline.date.timeIntervalSinceReferenceDate
                for star in stars {
                    let twinkle = (sin(t * star.twinkleSpeed + star.phase) + 1) / 2
                    let opacity = star.baseOpacity * (0.35 + 0.65 * twinkle)
                    let rect = CGRect(x: star.x * size.width,
                                      y: star.y * size.height,
                                      width: star.size, height: star.size)
                    context.fill(Path(ellipseIn: rect),
                                 with: .color(.white.opacity(opacity)))
                }
            }
        }
        .onAppear {
            if stars.isEmpty {
                stars = (0..<starCount).map { _ in
                    Star(x: .random(in: 0...1),
                         y: .random(in: 0...1),
                         size: .random(in: 0.8...2.6),
                         baseOpacity: .random(in: 0.2...0.9),
                         twinkleSpeed: .random(in: 0.6...2.2),
                         phase: .random(in: 0...(.pi * 2)))
                }
            }
        }
        .allowsHitTesting(false)
        .ignoresSafeArea()
    }
}

