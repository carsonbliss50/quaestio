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
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground font-body italic">Loading...</div>
      </div>
    );
  }

  return (
    <AppLayout activeConversationId={null}>
      <div className="flex flex-col items-center justify-center min-h-full p-8">
        <div className="max-w-2xl text-center space-y-16">
          {/* Logo */}
          <div className="mx-auto opacity-0 animate-fade-in">
            <svg
              viewBox="0 0 100 100"
              className="h-28 w-28 text-primary mx-auto"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M50 5 L95 30 L95 70 L50 95 L5 70 L5 30 Z" />
              <text
                x="50"
                y="62"
                textAnchor="middle"
                fill="currentColor"
                stroke="none"
                fontSize="34"
                fontFamily="serif"
                fontWeight="600"
              >
                Q
              </text>
            </svg>
          </div>

          <div className="space-y-4 opacity-0 animate-slide-up animation-delay-100">
            <h1 className="text-4xl md:text-5xl font-display tracking-wider uppercase">
              Quaestio
            </h1>
            <p className="text-lg text-foreground-muted font-body italic leading-relaxed max-w-lg mx-auto">
              Traditional Catholic wisdom, grounded in the perennial Magisterium
            </p>
          </div>

          {/* Mode selection */}
          <div className="grid gap-6 sm:grid-cols-2 opacity-0 animate-slide-up animation-delay-300">
            <button
              className="group h-auto p-8 flex flex-col items-start text-left gap-4 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-border-strong hover:-translate-y-1 transition-all duration-200"
              onClick={() => handleNewChat("standard")}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-background-muted group-hover:bg-muted transition-colors">
                  <Book className="h-6 w-6 text-foreground" />
                </div>
                <span className="font-display text-lg font-semibold tracking-wide">Standard Mode</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-body">
                Traditional Catholic answers from pre-Vatican II sources
              </p>
            </button>

            <button
              className="group h-auto p-8 flex flex-col items-start text-left gap-4 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-gold/30 hover:-translate-y-1 transition-all duration-200"
              onClick={() => handleNewChat("aquinas")}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gold-subtle group-hover:bg-gold/20 transition-colors">
                  <GraduationCap className="h-6 w-6 text-gold" />
                </div>
                <span className="font-display text-lg font-semibold tracking-wide">Aquinas Mode</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-body">
                Scholastic disputatio format from the Summa Theologica
              </p>
            </button>
          </div>

          <p className="text-sm text-muted-foreground font-sans opacity-0 animate-fade-in animation-delay-500">
            For important matters of faith and morals, consult a priest.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
