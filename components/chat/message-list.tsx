"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./message-item";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Array<{ title: string; source: string; url?: string; year?: string }>;
}

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  streamingContent?: string;
  onRegenerate?: () => void;
}

export function MessageList({
  messages,
  isLoading,
  streamingContent,
  onRegenerate,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-lg space-y-6 animate-fade-in">
          <h2 className="text-4xl font-display tracking-tight">Ask a Question</h2>
          <p className="text-foreground-muted font-body italic text-lg leading-relaxed">
            Inquire about the Catholic Faith, and I shall answer from traditional sources, grounded in the perennial Magisterium.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-4 p-4">
        {messages.map((message, index) => {
          const isLastAssistant =
            message.role === "assistant" &&
            index === messages.length - 1 &&
            !streamingContent;
          return (
            <MessageItem
              key={message.id}
              role={message.role}
              content={message.content}
              citations={message.citations}
              isLast={isLastAssistant}
              onRegenerate={isLastAssistant ? onRegenerate : undefined}
            />
          );
        })}

        {/* Streaming message */}
        {streamingContent && (
          <MessageItem
            role="assistant"
            content={streamingContent}
            isStreaming
          />
        )}

        {/* Loading skeleton */}
        {isLoading && !streamingContent && (
          <div className="flex justify-start gap-5 py-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/10 border-2 border-gold/30" />
            <div className="flex-1 border-l-2 border-gold/20 pl-5">
              <Skeleton className="h-4 w-48 mb-3" />
              <Skeleton className="h-4 w-72 mb-3" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
