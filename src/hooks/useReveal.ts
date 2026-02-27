"use client";

import { useState, useEffect } from "react";

// Returns true when the reveal animation should start
export function useReveal(isActive: boolean, delay = 0) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setRevealed(true), delay);
    return () => clearTimeout(t);
  }, [isActive, delay]);

  return revealed;
}
