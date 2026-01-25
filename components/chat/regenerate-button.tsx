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
      className="opacity-0 group-hover:opacity-100 transition-opacity"
      title="Regenerate response"
    >
      <RefreshCw className="w-3.5 h-3.5" />
    </Button>
  );
}
