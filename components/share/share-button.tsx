"use client";

import { useState } from "react";
import { Share2, Link2, Check, X } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface ShareButtonProps {
  conversationId: Id<"conversations">;
}

export function ShareButton({ conversationId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversation = useQuery(api.conversations.get as any, { id: conversationId });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleShare = useMutation(api.conversations.toggleShare as any);

  const isShared = conversation?.isPublic ?? false;
  const shareToken = conversation?.shareToken;
  const shareUrl = shareToken ? `${window.location.origin}/share/${shareToken}` : null;

  const handleToggleShare = async () => {
    try {
      const newToken = await toggleShare({ id: conversationId });
      if (newToken) {
        toast.success("Sharing enabled");
      } else {
        toast.success("Sharing disabled");
      }
    } catch (error) {
      toast.error("Failed to update sharing");
      console.error(error);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" title="Share conversation">
          <Share2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-1">Share Conversation</h4>
            <p className="text-xs text-muted-foreground">
              {isShared
                ? "Anyone with the link can view this conversation."
                : "Create a public link to share this conversation."}
            </p>
          </div>

          {isShared && shareUrl ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <Link2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs truncate flex-1">{shareUrl}</span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleToggleShare}
              >
                <X className="h-4 w-4 mr-2" />
                Stop Sharing
              </Button>
            </div>
          ) : (
            <Button
              variant="gold"
              size="sm"
              className="w-full"
              onClick={handleToggleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Enable Sharing
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
