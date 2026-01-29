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

function getDocumentIconType(title: string): "book" | "scroll" | "church" {
  const lower = title.toLowerCase();
  if (lower.includes("catechism")) return "book";
  if (lower.includes("encyclical") || lower.includes("letter") || lower.includes("apostolic")) return "scroll";
  if (lower.includes("council") || lower.includes("vatican") || lower.includes("trent")) return "church";
  return "book";
}

function DocumentIcon({ type, className }: { type: "book" | "scroll" | "church"; className?: string }) {
  switch (type) {
    case "scroll":
      return <Scroll className={className} />;
    case "church":
      return <Church className={className} />;
    default:
      return <Book className={className} />;
  }
}

export function CitationCard({ title, source, url, year, index }: CitationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const iconType = getDocumentIconType(title ?? "");
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
        "rounded-xl border border-border bg-card transition-all duration-200 hover-lift",
        url && "cursor-pointer hover:border-gold/30"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3 p-4 text-sm">
        {index && (
          <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-background-muted text-xs flex items-center justify-center text-muted-foreground font-semibold">
            {index}
          </span>
        )}
        <DocumentIcon type={iconType} className="flex-shrink-0 w-5 h-5 text-gold mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground truncate font-serif">{title}</p>
            {year && (
              <span className="text-xs text-muted-foreground flex-shrink-0 font-sans">({year})</span>
            )}
          </div>
          <p
            className={cn(
              "text-sm text-muted-foreground mt-1.5 font-body",
              !expanded && isLong && "line-clamp-2"
            )}
          >
            {source}
          </p>
          {isLong && (
            <button
              onClick={handleExpandClick}
              className="text-xs text-gold mt-2 flex items-center gap-1 hover:text-gold-light transition-colors font-sans font-medium"
            >
              {expanded ? "Show less" : "Show more"}
              <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", expanded && "rotate-180")} />
            </button>
          )}
        </div>
        {url && <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:text-gold transition-colors" />}
      </div>
    </div>
  );
}
