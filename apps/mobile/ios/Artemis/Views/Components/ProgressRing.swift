//
//  ProgressRing.swift
//  Artemis
//
//  Circular mission-progress ring with a glowing leading edge.
//


import SwiftUI


struct ProgressRing: View {
    let progress: Double
    var size: CGFloat = 120
    var lineWidth: CGFloat = 9


    var body: some View {
        ZStack {
            Circle()
                .stroke(Theme.hairline, lineWidth: lineWidth)


            Circle()
                .trim(from: 0, to: progress)
                .stroke(
                    AngularGradient(
                        gradient: Gradient(colors: [Theme.cyan, Theme.amber, Theme.amberSoft]),
                        center: .center,
                        startAngle: .degrees(-90),
                        endAngle: .degrees(270)
                    ),
                    style: StrokeStyle(lineWidth: lineWidth, lineCap: .round)
                )
                .rotationEffect(.degrees(-90))
                .shadow(color: Theme.amber.opacity(0.5), radius: 5)


            VStack(spacing: 2) {
                Text("\(Int(progress * 100))")
                    .font(.telemetry(size * 0.26, weight: .bold))
                    .foregroundStyle(Theme.textPrimary)
                    .contentTransition(.numericText())
                Text("% COMPLETE")
                    .font(.system(size: 8, weight: .bold, design: .rounded))
                    .tracking(0.8)
                    .foregroundStyle(Theme.textTertiary)
            }
        }
        .frame(width: size, height: size)
    }
}

