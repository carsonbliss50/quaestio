"use client";

import { ExternalLink } from "lucide-react";

interface CitationCardProps {
  title: string;
  source: string;
  url?: string;
  index?: number;
}

export function CitationCard({ title, source, url, index }: CitationCardProps) {
  const content = (
    <div className="flex items-start gap-3 py-3 text-sm">
      {index && (
        <span className="flex-shrink-0 w-6 h-6 rounded border border-border text-xs flex items-center justify-center text-muted-foreground">
          {index}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{source}</p>
      </div>
      {url && <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />}
    </div>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:bg-muted rounded-md -mx-2 px-2 transition-colors"
      >
        {content}
      </a>
    );
  }

  return content;
}
