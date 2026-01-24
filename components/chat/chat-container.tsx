"use client";

import { useState, useCallback } from "react";
import { useChat } from "ai/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { ModeSelector } from "./mode-selector";
import { useUsage } from "@/hooks/use-usage";
import { toast } from "sonner";

interface ChatContainerProps {
  conversationId: Id<"conversations">;
  initialMode: "standard" | "aquinas";
  onModeChange: (mode: "standard" | "aquinas") => void;
}

export function ChatContainer({
  conversationId,
  initialMode,
  onModeChange,
}: ChatContainerProps) {
  const [mode, setMode] = useState(initialMode);
  const { usage, canSend, increment } = useUsage();

  // Convex queries and mutations (use any cast for stub types)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbMessages = useQuery(api.messages.list as any, { conversationId });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addUserMessage = useMutation(api.messages.addUserMessage as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addAssistantMessage = useMutation(api.messages.addAssistantMessage as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateTitle = useMutation(api.conversations.updateTitle as any);

  // AI chat hook
  const {
    messages: aiMessages,
    append,
    isLoading,
    stop,
  } = useChat({
    api: "/api/chat",
    body: { mode },
    onFinish: async (message) => {
      // Save assistant message to database
      await addAssistantMessage({
        conversationId,
        content: message.content,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to get response");
    },
  });

  // Handle mode change
  const handleModeChange = useCallback(
    (newMode: "standard" | "aquinas") => {
      setMode(newMode);
      onModeChange(newMode);
    },
    [onModeChange]
  );

  // Handle sending a message
  const handleSend = useCallback(
    async (content: string) => {
      if (!canSend) {
        toast.error("Daily message limit reached. Try again tomorrow.");
        return;
      }

      try {
        // Save user message to database
        await addUserMessage({ conversationId, content });

        // Increment usage
        await increment();

        // Update title if this is the first message
        if (!dbMessages || dbMessages.length === 0) {
          const title =
            content.length > 50 ? content.substring(0, 50) + "..." : content;
          await updateTitle({ id: conversationId, title });
        }

        // Send to AI
        await append({ role: "user", content });
      } catch (error) {
        toast.error("Failed to send message");
        console.error(error);
      }
    },
    [
      canSend,
      conversationId,
      addUserMessage,
      increment,
      dbMessages,
      updateTitle,
      append,
    ]
  );

  // Combine database messages with streaming message
  const displayMessages =
    dbMessages?.map((m: { _id: string; role: "user" | "assistant"; content: string; citations?: Array<{ title: string; source: string; url?: string }> }) => ({
      id: m._id,
      role: m.role,
      content: m.content,
      citations: m.citations,
    })) ?? [];

  // Get streaming content from the last AI message if it's not yet saved
  const lastAiMessage = aiMessages[aiMessages.length - 1];
  const streamingContent =
    isLoading && lastAiMessage?.role === "assistant"
      ? lastAiMessage.content
      : undefined;

  return (
    <div className="flex flex-col h-full">
      {/* Header with mode selector and usage */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <ModeSelector
          mode={mode}
          onModeChange={handleModeChange}
          disabled={isLoading}
        />
        {usage && (
          <div className="text-sm text-muted-foreground">
            {usage.remaining}/{usage.limit} messages remaining
          </div>
        )}
      </div>

      {/* Messages */}
      <MessageList
        messages={displayMessages}
        isLoading={isLoading}
        streamingContent={streamingContent}
      />

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        onStop={stop}
        isStreaming={isLoading}
        disabled={!canSend}
      />
    </div>
  );
}
