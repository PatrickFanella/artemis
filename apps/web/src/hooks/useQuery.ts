import { useState, useEffect, useRef, useCallback } from "react";
import { getSSRData } from "@/lib/ssrData";

interface QueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Data-fetching hook with optional build-time (SSG) data injection.
 *
 * When `key` is provided and the SSR data map contains that key, the initial
 * state is seeded from it (so prerendered HTML shows real content) and the
 * first client fetch is silent (no loading flash).  Otherwise it fetches
 * immediately as before.
 */
export function useQuery<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  key?: string,
): QueryResult<T> {
  const initial = key ? getSSRData<T>(key) : null;
  const [data, setData] = useState<T | null>(initial);
  const [loading, setLoading] = useState(initial == null);
  const [error, setError] = useState<string | null>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const fetchData = useCallback(
    (silent = false) => {
      let cancelled = false;
      if (!silent) setLoading(true);
      setError(null);

      fetcherRef.current()
        .then((result) => {
          if (!cancelled) {
            setData(result);
            setLoading(false);
          }
        })
        .catch((err: Error) => {
          if (!cancelled) {
            setError(err.message);
            setLoading(false);
          }
        });

      return () => {
        cancelled = true;
      };
    },
    deps,
  );

  useEffect(() => {
    // Refresh silently when hydrated from SSR data; otherwise fetch loudly.
    return fetchData(initial != null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

/**
 * useQuery with automatic refresh at a given interval (ms).
 * First fetch is immediate; subsequent fetches are silent (no loading flash).
 */
export function useLiveQuery<T>(
  fetcher: () => Promise<T>,
  intervalMs: number,
  deps: unknown[] = []
): QueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const refetch = useCallback(() => {
    fetcherRef.current()
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, deps);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcherRef.current()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    const id = setInterval(() => {
      if (!cancelled) {
        fetcherRef.current()
          .then((result) => {
            if (!cancelled) setData(result);
          })
          .catch(() => {});
      }
    }, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch };
}
