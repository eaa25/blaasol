// Shared hook for liking/unliking festival acts.
// Used by both Schedule and ProfilePage so they stay in sync — liking an act
// in the schedule automatically shows it in the Artists tab on your profile.
// The liked set is persisted in localStorage so it survives page refreshes.

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

export function useLikedArtists() {
  const [liked, setLiked] = useState(load);

  // toggle(id) adds the act if not liked, removes it if already liked
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
