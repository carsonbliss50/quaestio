"use client";

import { useRouter } from "next/navigation";
import { Plus, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationList } from "./conversation-list";
import {
  useConversations,
  useConversationMutations,
} from "@/hooks/use-conversations";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

interface SidebarProps {
  activeConversationId: Id<"conversations"> | null;
}

export function Sidebar({ activeConversationId }: SidebarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { conversations, isLoading } = useConversations();
  const { create, remove } = useConversationMutations();

  const handleNewChat = async () => {
    try {
      const id = await create("standard");
      router.push(`/chat/${id}`);
    } catch (error) {
      toast.error("Failed to create conversation");
      console.error(error);
    }
  };

  const handleDelete = async (id: Id<"conversations">) => {
    try {
      await remove(id);
      if (activeConversationId === id) {
        router.push("/");
      }
      toast.success("Conversation deleted");
    } catch (error) {
      toast.error("Failed to delete conversation");
      console.error(error);
    }
  };

  // Type the conversations for the list
  const typedConversations = conversations as Array<{
    _id: Id<"conversations">;
    title: string;
    updatedAt: number;
  }> | undefined;

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Header */}
      <div className="p-6 flex items-center gap-3 border-b border-sidebar-border">
        <div className="flex-1">
          <h1 className="text-xl font-display tracking-wider uppercase">Quaestio</h1>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      {/* New Chat button */}
      <div className="px-4 py-4">
        <Button onClick={handleNewChat} className="w-full justify-center gap-2 rounded-xl h-11 group">
          <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
          New Chat
        </Button>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        <ConversationList
          conversations={typedConversations}
          activeId={activeConversationId}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </ScrollArea>

      {/* Footer */}
      <div className="p-6 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center font-sans">
          Consult a priest for important matters
        </p>
      </div>
    </div>
  );
}
