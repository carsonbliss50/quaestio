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
    <div className={cn("prose prose-sm max-w-none dark:prose-invert font-body", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // Open links in new tab
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline decoration-gold/40 hover:decoration-gold transition-colors"
          >
            {children}
          </a>
        ),
        // Style blockquotes for theological citations
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gold/40 pl-5 py-1 italic text-foreground-muted my-4 bg-gold-subtle rounded-r-lg">
            {children}
          </blockquote>
        ),
        // Style code blocks (for Latin quotes, references)
        code: ({ children, className }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="rounded-lg bg-muted px-2 py-1 font-mono text-sm">
                {children}
              </code>
            );
          }
          return (
            <code className={cn("block rounded-xl bg-muted p-4 font-mono text-sm overflow-x-auto", className)}>
              {children}
            </code>
          );
        },
        // Style pre blocks
        pre: ({ children }) => (
          <pre className="rounded-xl bg-muted p-4 overflow-x-auto my-4">
            {children}
          </pre>
        ),
        // Style headers appropriately
        h1: ({ children }) => (
          <h1 className="text-2xl font-display font-bold mt-8 mb-4 tracking-tight">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-display font-semibold mt-6 mb-3 tracking-tight">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-serif font-semibold mt-5 mb-2">{children}</h3>
        ),
        // Style lists
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-5 space-y-2 my-4">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-5 space-y-2 my-4">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed pl-1">{children}</li>
        ),
        // Paragraphs with proper spacing
        p: ({ children }) => (
          <p className="my-3 leading-relaxed">{children}</p>
        ),
        // Strong and emphasis
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),
        // Horizontal rules
        hr: () => <hr className="my-6 border-border" />,
      }}
    >
        {content}
      </ReactMarkdown>
    </div>
  );
}
