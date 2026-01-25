"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ShareView } from "@/components/share/share-view";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface SharePageProps {
  params: Promise<{ token: string }>;
}

export default function SharePage({ params }: SharePageProps) {
  const { token } = use(params);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversation = useQuery(api.conversations.getByShareToken as any, { token });

  // Loading state
  if (conversation === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto p-6">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-20 w-3/4 ml-auto rounded-2xl" />
            <Skeleton className="h-32 w-3/4 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Not found or not shared
  if (conversation === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-display tracking-tight mb-4">
            Conversation Not Found
          </h1>
          <p className="text-muted-foreground font-serif italic mb-6">
            This conversation may have been deleted or is no longer shared.
          </p>
          <Link
            href="/"
            className="text-gold hover:underline underline-offset-4"
          >
            Start your own conversation
          </Link>
        </div>
      </div>
    );
  }

  return <ShareView conversationId={conversation._id} title={conversation.title} />;
}
