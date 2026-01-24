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
        <Button variant="outline" size="sm" disabled={disabled} className="rounded-md">
          {mode === "aquinas" ? (
            <>
              <GraduationCap className="h-4 w-4 mr-2 text-gold" />
              Aquinas Mode
            </>
          ) : (
            <>
              <Book className="h-4 w-4 mr-2 text-primary" />
              Standard Mode
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => onModeChange("standard")} className="rounded-md">
          <Book className="h-4 w-4 mr-2 text-primary" />
          <div>
            <div className="font-medium">Standard Mode</div>
            <div className="text-xs text-muted-foreground">
              Traditional Catholic answers
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onModeChange("aquinas")} className="rounded-md">
          <GraduationCap className="h-4 w-4 mr-2 text-gold" />
          <div>
            <div className="font-medium">Aquinas Mode</div>
            <div className="text-xs text-muted-foreground">
              Scholastic disputatio format
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
