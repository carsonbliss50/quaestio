"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "quaestio-session-id";

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export function useSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for existing session
    let id = localStorage.getItem(SESSION_KEY);

    if (!id) {
      id = generateSessionId();
      localStorage.setItem(SESSION_KEY, id);
    }

    setSessionId(id);
  }, []);

  return sessionId;
}
