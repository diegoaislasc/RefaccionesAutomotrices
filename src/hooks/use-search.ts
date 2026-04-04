"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database";

const DEFAULT_DEBOUNCE_MS = 300;
const SUGGESTION_LIMIT = 8;

export function useSearch(
  debounceMs = DEFAULT_DEBOUNCE_MS,
  initialQuery = ""
) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);
  const [results, setResults] = useState<Tables<"products">[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const seq = useRef(0);

  const fetchSuggestions = useCallback(async (q: string, requestId: number) => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("search_products", {
      search_query: q.trim(),
      page_limit: SUGGESTION_LIMIT,
      page_offset: 0,
    });
    if (requestId !== seq.current) return;
    if (rpcError) {
      setError(rpcError.message);
      setResults([]);
    } else {
      setResults(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const id = ++seq.current;
    const t = window.setTimeout(() => {
      void fetchSuggestions(query, id);
    }, debounceMs);
    return () => window.clearTimeout(t);
  }, [query, debounceMs, fetchSuggestions]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
  };
}
