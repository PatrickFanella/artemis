//
//  APIClient.swift
//  Artemis
//
//  Thin async wrapper over the Artemis public read-only API.
//  Non-UI networking — kept nonisolated.
//


import Foundation


nonisolated enum APIError: Error {
    case badStatus(Int, String?)
    case decoding
    case transport
}


nonisolated struct APIClient {
    /// Base URL for the Artemis API. Reads RORK API base override if present,
    /// otherwise defaults to the documented local server.
    let baseURL: String


    init(baseURL: String? = nil) {
        if let baseURL, !baseURL.isEmpty {
            self.baseURL = baseURL
        } else {
            self.baseURL = "http://localhost:8090"
        }
    }


    private func get<T: Decodable>(_ path: String) async throws -> T {
        guard let url = URL(string: baseURL + path) else { throw APIError.transport }
        var request = URLRequest(url: url)
        request.timeoutInterval = 6
        request.setValue("application/json", forHTTPHeaderField: "Accept")


        let data: Data
        let response: URLResponse
        do {
            (data, response) = try await URLSession.shared.data(for: request)
        } catch {
            throw APIError.transport
        }


        guard let http = response as? HTTPURLResponse else { throw APIError.transport }
        guard (200..<300).contains(http.statusCode) else {
            let message = try? JSONDecoder().decode(APIErrorResponse.self, from: data).error
            throw APIError.badStatus(http.statusCode, message)
        }


        do {
            return try JSONDecoder().decode(T.self, from: data)
        } catch {
            throw APIError.decoding
        }
    }


    func health() async throws -> Bool {
        struct Health: Decodable { let status: String }
        let h: Health = try await get("/healthz")
        return h.status == "ok"
    }


    func activeDashboard() async throws -> ActiveMissionDashboard {
        try await get("/api/v1/active")
    }


    func missions() async throws -> [Mission] {
        try await get("/api/v1/missions")
    }


    func latestUpdates() async throws -> [BlogUpdate] {
        try await get("/api/v1/updates/latest")
    }