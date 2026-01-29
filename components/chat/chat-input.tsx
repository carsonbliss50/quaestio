"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onStop,
  isStreaming,
  disabled,
  placeholder = "Ask a question about the Catholic Faith...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed && !disabled && !isStreaming) {
      onSend(trimmed);
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 bg-background p-4 safe-area-bottom">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-3 items-end bg-background-muted border border-border rounded-2xl p-3 shadow-inner transition-all duration-200 focus-within:border-border-strong focus-within:ring-2 focus-within:ring-ring/20">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isStreaming}
            className="min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:border-0 placeholder:italic placeholder:text-muted-foreground/70"
            rows={1}
          />
          {isStreaming ? (
            <Button
              onClick={onStop}
              variant="outline"
              size="icon"
              className="flex-shrink-0 h-11 w-11 rounded-full transition-all duration-150 hover:scale-105"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!value.trim() || disabled}
              size="icon"
              className="flex-shrink-0 h-11 w-11 rounded-full transition-all duration-150 hover:scale-105 focus-visible:ring-gold/50"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3 font-sans">
          Quaestio&apos;s responses are not always perfect. When in doubt consult a human.
        </p>
      </div>
    </div>
  );
}
