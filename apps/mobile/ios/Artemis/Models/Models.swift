//
//  Models.swift
//  Artemis
//
//  Codable DTOs mirroring the Artemis public API (openapi 0.1.0).
//  Kept nonisolated so decoding can happen off the main actor.
//


import Foundation


nonisolated struct CrewMember: Codable, Identifiable, Hashable {
    let name: String
    let role: String
    let bio: String
    let image: String


    var id: String { name }
}


nonisolated struct Mission: Codable, Identifiable, Hashable {
    let id: String
    let name: String
    let tagline: String
    let description: String
    let status: String
    let launchDate: String?
    let duration: String
    let crew: [CrewMember]
    let imageURL: String
    let createdAt: String
    let updatedAt: String


    enum CodingKeys: String, CodingKey {
        case id, name, tagline, description, status, duration, crew
        case launchDate = "launch_date"
        case imageURL = "image_url"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}


nonisolated struct MissionSection: Codable, Identifiable, Hashable {
    let id: String
    let missionID: String
    let name: String
    let slug: String
    let description: String
    let order: Int
    let dayRange: String
    let status: String


    enum CodingKeys: String, CodingKey {
        case id, name, slug, description, order, status
        case missionID = "mission_id"
        case dayRange = "day_range"
    }
}


nonisolated struct Milestone: Codable, Identifiable, Hashable {
    let id: String
    let missionID: String
    let sectionID: String
    let title: String
    let description: String
    let plannedAt: String?
    let completedAt: String?
    let order: Int


    enum CodingKeys: String, CodingKey {
        case id, title, description, order
        case missionID = "mission_id"
        case sectionID = "section_id"
        case plannedAt = "planned_at"