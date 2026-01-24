"use client";

import { useMemo } from "react";
import { ConversationItem } from "./conversation-item";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";

interface Conversation {
  _id: Id<"conversations">;
  title: string;
  updatedAt: number;
}

interface ConversationListProps {
  conversations: Conversation[] | undefined;
  activeId: Id<"conversations"> | null;
  onDelete: (id: Id<"conversations">) => void;
  isLoading?: boolean;
}

// Group conversations by date
function groupConversations(conversations: Conversation[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const groups: Record<string, Conversation[]> = {
    Today: [],
    Yesterday: [],
    "Last 7 Days": [],
    Older: [],
  };

  for (const conversation of conversations) {
    const date = new Date(conversation.updatedAt);
    if (date >= today) {
      groups.Today.push(conversation);
    } else if (date >= yesterday) {
      groups.Yesterday.push(conversation);
    } else if (date >= lastWeek) {
      groups["Last 7 Days"].push(conversation);
    } else {
      groups.Older.push(conversation);
    }
  }

  return groups;
}

export function ConversationList({
  conversations,
  activeId,
  onDelete,
  isLoading,
}: ConversationListProps) {
  const groups = useMemo(() => {
    if (!conversations) return {};
    return groupConversations(conversations);
  }, [conversations]);

  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No conversations yet
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      {Object.entries(groups).map(
        ([label, convos]) =>
          convos.length > 0 && (
            <div key={label}>
              <h3 className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {label}
              </h3>
              <div className="space-y-1">
                {convos.map((conversation) => (
                  <ConversationItem
                    key={conversation._id}
                    id={conversation._id}
                    title={conversation.title}
                    isActive={activeId === conversation._id}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
}
