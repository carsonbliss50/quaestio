"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { MobileNav } from "./mobile-nav";
import { Id } from "@/convex/_generated/dataModel";

interface AppLayoutProps {
  children: ReactNode;
  activeConversationId: Id<"conversations"> | null;
}

export function AppLayout({ children, activeConversationId }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-72 flex-shrink-0 border-r border-border">
        <Sidebar activeConversationId={activeConversationId} />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center gap-3 p-4 border-b border-border bg-background">
          <MobileNav activeConversationId={activeConversationId} />
          <h1 className="text-xl font-display tracking-wider uppercase">Quaestio</h1>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
