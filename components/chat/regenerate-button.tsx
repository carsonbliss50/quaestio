"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RegenerateButtonProps {
  onRegenerate: () => void;
  disabled?: boolean;
}

export function RegenerateButton({ onRegenerate, disabled }: RegenerateButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={onRegenerate}
      disabled={disabled}
      className="h-7 w-7 rounded-full transition-all duration-150 hover:bg-muted"
      title="Regenerate response"
    >
      <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
    </Button>
  );
}
