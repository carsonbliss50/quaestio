"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "@/components/chat/message-item";
import Link from "next/link";

interface ShareViewProps {
  conversationId: Id<"conversations">;
  title: string;
}

export function ShareView({ conversationId, title }: ShareViewProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages = useQuery(api.messages.list as any, { conversationId });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-lg font-display tracking-wide uppercase text-gold hover:opacity-80 transition-opacity">
                Quaestio
              </Link>
              <h1 className="text-xl font-display mt-1">{title}</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Shared conversation
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-4 space-y-4">
          {messages?.map((message: { _id: string; role: "user" | "assistant"; content: string; citations?: Array<{ title: string; source: string; url?: string; year?: string }> }) => (
            <MessageItem
              key={message._id}
              role={message.role}
              content={message.content}
              citations={message.citations}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-3xl mx-auto px-6 py-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            This is a shared conversation from Quaestio.
          </p>
          <Link
            href="/"
            className="text-gold hover:underline underline-offset-4 text-sm"
          >
            Start your own conversation
          </Link>
        </div>
      </footer>
    </div>
  );
}
