"use client";

import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { useConversationMutations } from "@/hooks/use-conversations";
import { useSession } from "@/hooks/use-session";
import { Book, GraduationCap } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const sessionId = useSession();
  const { create } = useConversationMutations();

  const handleNewChat = async (mode: "standard" | "aquinas") => {
    try {
      const id = await create(mode);
      router.push(`/chat/${id}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  // If no session yet, show loading
  if (!sessionId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <AppLayout activeConversationId={null}>
      <div className="flex flex-col items-center justify-center min-h-full p-8">
        <div className="max-w-xl text-center space-y-12">
          {/* Logo */}
          <div className="mx-auto animate-fade-in">
            <svg
              viewBox="0 0 100 100"
              className="h-24 w-24 text-primary mx-auto drop-shadow-sm"
              fill="currentColor"
            >
              <path d="M50 5 L95 30 L95 70 L50 95 L5 70 L5 30 Z" />
              <text
                x="50"
                y="60"
                textAnchor="middle"
                fill="white"
                fontSize="32"
                fontFamily="serif"
              >
                Q
              </text>
            </svg>
          </div>

          <div className="space-y-2 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-display tracking-wide uppercase">
              Quaestio
            </h1>
            <p className="text-base text-muted-foreground">
              Traditional Catholic wisdom, grounded in the perennial Magisterium
            </p>
          </div>

          {/* Mode selection */}
          <div className="grid gap-4 sm:grid-cols-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <button
              className="group h-auto p-6 flex flex-col items-start text-left gap-3 rounded-md border border-border bg-card hover:bg-muted transition-colors"
              onClick={() => handleNewChat("standard")}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-muted">
                  <Book className="h-5 w-5 text-foreground" />
                </div>
                <span className="font-semibold">Standard Mode</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Traditional Catholic answers from pre-Vatican II sources
              </p>
            </button>

            <button
              className="group h-auto p-6 flex flex-col items-start text-left gap-3 rounded-md border border-border bg-card hover:bg-muted transition-colors"
              onClick={() => handleNewChat("aquinas")}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-muted">
                  <GraduationCap className="h-5 w-5 text-gold" />
                </div>
                <span className="font-semibold">Aquinas Mode</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Scholastic disputatio format from the Summa Theologica
              </p>
            </button>
          </div>

          <p className="text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
            For important matters of faith and morals, consult a priest.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
