"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSession } from "./use-session";

export function useConversations() {
  const sessionId = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversations = useQuery(
    api.conversations.list as any,
    sessionId ? { sessionId } : "skip"
  );

  return {
    conversations,
    isLoading: conversations === undefined,
  };
}

export function useConversation(id: Id<"conversations"> | null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversation = useQuery(
    api.conversations.get as any,
    id ? { id } : "skip"
  );

  return {
    conversation,
    isLoading: conversation === undefined,
  };
}

export function useConversationMutations() {
  const sessionId = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createConversation = useMutation(api.conversations.create as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateTitle = useMutation(api.conversations.updateTitle as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateMode = useMutation(api.conversations.updateMode as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const removeConversation = useMutation(api.conversations.remove as any);

  return {
    create: async (mode: "standard" | "aquinas") => {
      if (!sessionId) throw new Error("No session");
      return createConversation({ sessionId, mode });
    },
    updateTitle: async (id: Id<"conversations">, title: string) => {
      return updateTitle({ id, title });
    },
    updateMode: async (id: Id<"conversations">, mode: "standard" | "aquinas") => {
      return updateMode({ id, mode });
    },
    remove: async (id: Id<"conversations">) => {
      return removeConversation({ id });
    },
  };
}
