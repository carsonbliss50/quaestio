"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const from = searchParams.get("from") || "/";
        router.push(from);
        router.refresh();
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Failed to authenticate");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-center"
          autoFocus
        />
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Authenticating..." : "Enter"}
      </Button>
    </form>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Subtle dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      <Card className="w-full max-w-md relative z-10 border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto mb-2 animate-fade-in">
            <svg
              viewBox="0 0 100 100"
              className="h-20 w-20 text-primary drop-shadow-sm"
              fill="currentColor"
            >
              <path d="M50 5 L95 30 L95 70 L50 95 L5 70 L5 30 Z" />
              <text
                x="50"
                y="58"
                textAnchor="middle"
                fill="white"
                fontSize="28"
                fontFamily="serif"
              >
                Q
              </text>
            </svg>
          </div>
          <div className="space-y-2 animate-slide-up">
            <CardTitle className="text-3xl font-display tracking-tight">Quaestio</CardTitle>
            <p className="text-base text-muted-foreground font-serif italic">
              Traditional Catholic Theological Assistant
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
          <p className="mt-8 text-xs text-muted-foreground text-center font-serif italic">
            Private alpha access only
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
