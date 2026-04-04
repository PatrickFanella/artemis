import { api } from "./client";
import type { BlogUpdate } from "@/lib/types";

export function getUpdates(source?: string, limit = 20, offset = 0) {
  const params = new URLSearchParams();
  if (source) params.set("source", source);
  if (limit) params.set("limit", String(limit));
  if (offset) params.set("offset", String(offset));
  return api<BlogUpdate[]>(`/api/v1/updates?${params}`);
}

export function getLatestUpdates() {
  return api<BlogUpdate[]>("/api/v1/updates/latest");
}
