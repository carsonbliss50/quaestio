"use client";

import { useState, useRef, useLayoutEffect } from "react";
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
  const prevPathnameRef = useRef(pathname);

  // Auto-close sidebar on route change (mobile)
  // Using useLayoutEffect to run synchronously after DOM mutations
  useLayoutEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      // Close via onOpenChange callback pattern instead of direct setState
      requestAnimationFrame(() => setOpen(false));
    }
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden rounded-full">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-80" showCloseButton={false}>
        <Sidebar activeConversationId={activeConversationId} />
      </SheetContent>
    </Sheet>
  );
}
