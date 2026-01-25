"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={cn("prose prose-sm max-w-none dark:prose-invert", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // Open links in new tab
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:no-underline"
          >
            {children}
          </a>
        ),
        // Style blockquotes for theological citations
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground">
            {children}
          </blockquote>
        ),
        // Style code blocks (for Latin quotes, references)
        code: ({ children, className }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                {children}
              </code>
            );
          }
          return (
            <code className={cn("block rounded bg-muted p-3 font-mono text-sm overflow-x-auto", className)}>
              {children}
            </code>
          );
        },
        // Style pre blocks
        pre: ({ children }) => (
          <pre className="rounded bg-muted p-3 overflow-x-auto">
            {children}
          </pre>
        ),
        // Style headers appropriately
        h1: ({ children }) => (
          <h1 className="text-xl font-display font-semibold mt-6 mb-3">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-display font-semibold mt-5 mb-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-display font-semibold mt-4 mb-2">{children}</h3>
        ),
        // Style lists
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">{children}</li>
        ),
        // Paragraphs with proper spacing
        p: ({ children }) => (
          <p className="my-2 leading-relaxed">{children}</p>
        ),
        // Strong and emphasis
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),
        // Horizontal rules
        hr: () => <hr className="my-4 border-border" />,
      }}
    >
        {content}
      </ReactMarkdown>
    </div>
  );
}
