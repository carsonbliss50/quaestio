"use client";

import { cn } from "@/lib/utils";
import { User, Triangle } from "lucide-react";
import { CitationCard } from "./citation-card";
import { MarkdownContent } from "./markdown-content";
import { CopyButton } from "./copy-button";
import { RegenerateButton } from "./regenerate-button";

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
  isLast?: boolean;
  onRegenerate?: () => void;
}

export function MessageItem({
  role,
  content,
  citations,
  isStreaming,
  isLast,
  onRegenerate,
}: MessageItemProps) {
  return (
    <div className="flex gap-5 w-full animate-fade-in py-6 group">
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
          role === "user"
            ? "bg-background border-2 border-border"
            : "bg-gold/10 border-2 border-gold/30"
        )}
      >
        {role === "user" ? (
          <User className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Triangle className="w-5 h-5 text-gold fill-gold" />
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "flex-1 min-w-0",
        role === "assistant" && "border-l-2 border-gold/20 pl-5"
      )}>
        {role === "user" ? (
          // User messages render as plain text
          <div className="whitespace-pre-wrap leading-relaxed text-foreground font-body">
            {content}
          </div>
        ) : (
          // Assistant messages render with markdown
          <div className="relative">
            <MarkdownContent content={content} />
            {isStreaming && (
              <span className="streaming-cursor" />
            )}
          </div>
        )}

        {/* Citations */}
        {citations && citations.length > 0 && (
          <div className="mt-6 pt-5 border-t border-border space-y-3">
            <p className="text-label text-muted-foreground">
              References
            </p>
            {citations.map((citation, index) => (
              <CitationCard key={index} {...citation} index={index + 1} />
            ))}
          </div>
        )}
      </div>

      {/* Actions for assistant messages */}
      {role === "assistant" && (
        <div className="flex-shrink-0 flex items-start gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-1 bg-background-muted rounded-full px-2 py-1 border border-border">
            <CopyButton content={content} disabled={isStreaming} />
            {isLast && onRegenerate && (
              <RegenerateButton onRegenerate={onRegenerate} disabled={isStreaming} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
