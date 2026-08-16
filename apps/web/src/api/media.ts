import { api } from "./client";
import type { MediaSearchResult } from "@/lib/types";

export interface Apod {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  date: string;
  copyright?: string;
}

export function searchMedia(
  query = "artemis",
  type?: string,
  year?: number,
  page?: number
) {
  const params = new URLSearchParams();
  params.set("q", query);
  if (type) params.set("type", type);
  if (year) params.set("year", String(year));
  if (page && page > 1) params.set("page", String(page));
  return api<MediaSearchResult>(`/api/v1/media?${params}`);
}

export function getApod() {
  return api<Apod>("/api/v1/apod");
}
