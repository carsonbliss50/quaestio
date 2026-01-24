"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { AppLayout } from "@/components/layout/app-layout";
import { ChatContainer } from "@/components/chat/chat-container";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const conversationId = id as Id<"conversations">;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversation = useQuery(api.conversations.get as any, { id: conversationId });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateMode = useMutation(api.conversations.updateMode as any);

  // Loading state
  if (conversation === undefined) {
    return (
      <AppLayout activeConversationId={conversationId}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              <Skeleton className="h-20 w-3/4 ml-auto rounded-lg" />
              <Skeleton className="h-32 w-3/4 rounded-lg" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Conversation not found or deleted
  if (conversation === null) {
    return (
      <AppLayout activeConversationId={null}>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-serif mb-2">Conversation not found</h2>
          <p className="text-muted-foreground mb-4">
            This conversation may have been deleted.
          </p>
          <button
            onClick={() => router.push("/")}
            className="text-primary hover:underline"
          >
            Start a new conversation
          </button>
        </div>
      </AppLayout>
    );
  }

  const handleModeChange = async (mode: "standard" | "aquinas") => {
    await updateMode({ id: conversationId, mode });
  };

  return (
    <AppLayout activeConversationId={conversationId}>
      <ChatContainer
        conversationId={conversationId}
        initialMode={conversation.mode}
        onModeChange={handleModeChange}
      />
    </AppLayout>
  );
}
