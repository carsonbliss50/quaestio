"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./message-item";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Array<{ title: string; source: string; url?: string }>;
}

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  streamingContent?: string;
}

export function MessageList({
  messages,
  isLoading,
  streamingContent,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-serif mb-2">Welcome to Quaestio</h2>
          <p className="text-muted-foreground">
            Ask any question about the Catholic Faith. I will answer from
            traditional sources, grounded in the perennial Magisterium.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            role={message.role}
            content={message.content}
            citations={message.citations}
          />
        ))}

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
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-lg px-4 py-3 bg-card border border-border">
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-4 w-64 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
