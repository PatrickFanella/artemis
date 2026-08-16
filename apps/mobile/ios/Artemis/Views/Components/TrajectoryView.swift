//
//  TrajectoryView.swift
//  Artemis
//
//  Animated Earth → Orion → Moon trajectory arc driven by mission progress.
//


import SwiftUI


struct TrajectoryView: View {
    /// 0...1 progress of the spacecraft along the arc.
    let progress: Double
    let phaseLabel: String


    @State private var orbitPhase: Double = 0


    var body: some View {
        GeometryReader { geo in
            content(in: geo.size)
        }
        .onAppear {
            withAnimation(.linear(duration: 8).repeatForever(autoreverses: false)) {
                orbitPhase = 360
            }
        }
    }


    private func content(in size: CGSize) -> some View {
        let w: CGFloat = size.width
        let h: CGFloat = size.height
        let earth = CGPoint(x: w * 0.12, y: h * 0.82)
        let moon = CGPoint(x: w * 0.88, y: h * 0.22)
        let control = CGPoint(x: w * 0.5, y: h * -0.15)
        let craft = quadPoint(t: progress, p0: earth, c: control, p1: moon)


        return ZStack {
            plannedPath(earth: earth, control: control, moon: moon)
            travelledPath(earth: earth, control: control, moon: moon)
            earthBody.position(earth)
            earthLabel.position(x: earth.x, y: earth.y + 36)
            moonBody.position(moon)
            moonLabel.position(x: moon.x, y: moon.y + 28)
            craftMarker.position(craft)
        }
    }


    // MARK: - Paths


    private func plannedPath(earth: CGPoint, control: CGPoint, moon: CGPoint) -> some View {
        arcPath(from: earth, control: control, to: moon)
            .stroke(style: StrokeStyle(lineWidth: 1.5, dash: [4, 6]))
            .foregroundStyle(Theme.cyan.opacity(0.22))
    }


    private func travelledPath(earth: CGPoint, control: CGPoint, moon: CGPoint) -> some View {
        let gradient = LinearGradient(colors: [Theme.cyan, Theme.amber],
                                      startPoint: .bottomLeading, endPoint: .topTrailing)
        return arcPath(from: earth, control: control, to: moon)
            .trim(from: 0, to: progress)
            .stroke(gradient, style: StrokeStyle(lineWidth: 2.5, lineCap: .round))
            .shadow(color: Theme.amber.opacity(0.6), radius: 6)
    }


    // MARK: - Bodies


    private var earthBody: some View {
        planet(colors: [Theme.cyan, Color(red: 0.13, green: 0.3, blue: 0.6)],
               diameter: 46, glow: Theme.cyan)
    }


    private var earthLabel: some View { bodyLabel("EARTH") }
    private var moonLabel: some View { bodyLabel("MOON") }

