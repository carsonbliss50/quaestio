"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Id } from "@/convex/_generated/dataModel";

interface MobileNavProps {
  activeConversationId: Id<"conversations"> | null;
}

export function MobileNav({ activeConversationId }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close sidebar on route change (mobile)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-80">
        <Sidebar activeConversationId={activeConversationId} />
      </SheetContent>
    </Sheet>
  );
}
