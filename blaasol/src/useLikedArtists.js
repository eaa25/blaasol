import { useState, useCallback } from "react";

const KEY = "blaasol_liked";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

// Shared hook — reads/writes liked act IDs to localStorage so the
// Schedule page and Profile page stay in sync across route changes.
export function useLikedArtists() {
  const [liked, setLiked] = useState(load);

  const toggle = useCallback((id) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return [liked, toggle];
}
