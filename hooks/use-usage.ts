"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSession } from "./use-session";

export function useUsage() {
  const sessionId = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const usage = useQuery(
    api.usage.getToday as any,
    sessionId ? { sessionId } : "skip"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canSend = useQuery(
    api.usage.canSend as any,
    sessionId ? { sessionId } : "skip"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const incrementUsage = useMutation(api.usage.increment as any);

  return {
    usage,
    canSend: canSend ?? false,
    isLoading: usage === undefined,
    increment: async () => {
      if (!sessionId) throw new Error("No session");
      return incrementUsage({ sessionId });
    },
  };
}
