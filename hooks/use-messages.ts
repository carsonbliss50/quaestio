"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useMessages(conversationId: Id<"conversations"> | null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages = useQuery(
    api.messages.list as any,
    conversationId ? { conversationId } : "skip"
  );

  return {
    messages,
    isLoading: messages === undefined,
  };
}

export function useMessageMutations() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addUserMessage = useMutation(api.messages.addUserMessage as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addAssistantMessage = useMutation(api.messages.addAssistantMessage as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateMessage = useMutation(api.messages.updateMessage as any);

  return {
    addUserMessage: async (
      conversationId: Id<"conversations">,
      content: string
    ) => {
      return addUserMessage({ conversationId, content });
    },
    addAssistantMessage: async (
      conversationId: Id<"conversations">,
      content: string,
      citations?: Array<{ title: string; source: string; url?: string }>
    ) => {
      return addAssistantMessage({ conversationId, content, citations });
    },
    updateMessage: async (
      id: Id<"messages">,
      content: string,
      citations?: Array<{ title: string; source: string; url?: string }>
    ) => {
      return updateMessage({ id, content, citations });
    },
  };
}
