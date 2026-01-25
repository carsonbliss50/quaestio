"use client";

import { useState } from "react";
import { ExternalLink, ChevronDown, Book, Scroll, Church } from "lucide-react";
import { cn } from "@/lib/utils";

interface CitationCardProps {
  title: string;
  source: string;
  url?: string;
  year?: string;
  index?: number;
}

function getDocumentIcon(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("catechism")) return Book;
  if (lower.includes("encyclical") || lower.includes("letter") || lower.includes("apostolic")) return Scroll;
  if (lower.includes("council") || lower.includes("vatican") || lower.includes("trent")) return Church;
  return Book;
}

export function CitationCard({ title, source, url, year, index }: CitationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = getDocumentIcon(title ?? "");
  const isLong = source.length > 200;

  const handleClick = () => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <div
      className={cn(
        "rounded-md border border-border bg-card",
        url && "cursor-pointer hover:bg-muted transition-colors"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3 p-3 text-sm">
        {index && (
          <span className="flex-shrink-0 w-6 h-6 rounded bg-muted text-xs flex items-center justify-center text-muted-foreground font-medium">
            {index}
          </span>
        )}
        <Icon className="flex-shrink-0 w-4 h-4 text-gold mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground truncate">{title}</p>
            {year && (
              <span className="text-xs text-muted-foreground flex-shrink-0">({year})</span>
            )}
          </div>
          <p
            className={cn(
              "text-sm text-muted-foreground mt-1",
              !expanded && isLong && "line-clamp-2"
            )}
          >
            {source}
          </p>
          {isLong && (
            <button
              onClick={handleExpandClick}
              className="text-xs text-gold mt-1 flex items-center gap-1 hover:underline"
            >
              {expanded ? "Show less" : "Show more"}
              <ChevronDown className={cn("w-3 h-3 transition-transform", expanded && "rotate-180")} />
            </button>
          )}
        </div>
        {url && <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
      </div>
    </div>
  );
}
