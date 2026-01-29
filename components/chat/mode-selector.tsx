"use client";

import { Book, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ModeSelectorProps {
  mode: "standard" | "aquinas";
  onModeChange: (mode: "standard" | "aquinas") => void;
  disabled?: boolean;
}

export function ModeSelector({
  mode,
  onModeChange,
  disabled,
}: ModeSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} className="rounded-xl gap-2">
          {mode === "aquinas" ? (
            <>
              <GraduationCap className="h-4 w-4 text-gold" />
              <span className="font-semibold">Aquinas Mode</span>
            </>
          ) : (
            <>
              <Book className="h-4 w-4 text-foreground" />
              <span className="font-semibold">Standard Mode</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuItem onClick={() => onModeChange("standard")} className="rounded-lg p-3">
          <Book className="h-5 w-5 mr-3 text-foreground flex-shrink-0" />
          <div>
            <div className="font-semibold">Standard Mode</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Traditional Catholic answers
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onModeChange("aquinas")} className="rounded-lg p-3">
          <GraduationCap className="h-5 w-5 mr-3 text-gold flex-shrink-0" />
          <div>
            <div className="font-semibold">Aquinas Mode</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Scholastic disputatio format
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
