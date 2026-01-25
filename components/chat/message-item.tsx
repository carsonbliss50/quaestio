"use client";

import { cn } from "@/lib/utils";
import { User, Triangle } from "lucide-react";
import { CitationCard } from "./citation-card";
import { MarkdownContent } from "./markdown-content";

interface Citation {
  title: string;
  source: string;
  url?: string;
  year?: string;
}

interface MessageItemProps {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  isStreaming?: boolean;
}

export function MessageItem({
  role,
  content,
  citations,
  isStreaming,
}: MessageItemProps) {
  return (
    <div className="flex gap-4 w-full animate-fade-in py-4">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
        {role === "user" ? (
          <User className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Triangle className="w-4 h-4 text-gold fill-gold" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {role === "user" ? (
          // User messages render as plain text
          <div className="whitespace-pre-wrap leading-relaxed text-foreground">
            {content}
          </div>
        ) : (
          // Assistant messages render with markdown
          <div className="relative">
            <MarkdownContent content={content} />
            {isStreaming && (
              <span className="inline-block w-1.5 h-5 ml-1 bg-gold rounded-sm animate-blink align-middle" />
            )}
          </div>
        )}

        {/* Citations */}
        {citations && citations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              References
            </p>
            {citations.map((citation, index) => (
              <CitationCard key={index} {...citation} index={index + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
