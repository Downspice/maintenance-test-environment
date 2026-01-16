"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogProvider } from "@/lib/dialog-provider";

type SheetContentType = {
  title: string;
  description?: string;
  content: ReactNode;
};

type SheetContextType = {
  open: boolean;
  content: SheetContentType | null;
  openSheet: (content: SheetContentType) => void;
  closeSheet: () => void;
};

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export function SheetProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<SheetContentType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openSheet = (sheetContent: SheetContentType) => {
    setContent(sheetContent);
    setOpen(true);
  };

  const closeSheet = () => {
    setOpen(false);
    // We don't immediately clear content so the sheet can animate out nicely
    setTimeout(() => {
      setContent(null);
    }, 300);
  };

  return (
    <SheetContext.Provider value={{ open, content, openSheet, closeSheet }}>
      {children}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          onInteractOutside={(e) => {
            // Prevent closing the sheet if the dialog is open
            if (isDialogOpen) {
              e.preventDefault();
            }
          }}
        >
          <DialogProvider onOpenChange={setIsDialogOpen}>
            <ScrollArea className="h-full px-5">
              {content && (
                <>
                  <SheetHeader>
                    <SheetTitle>{content.title}</SheetTitle>
                    {content.description && (
                      <SheetDescription>{content.description}</SheetDescription>
                    )}
                  </SheetHeader>
                  <div className="mt-6">{content.content}</div>
                </>
              )}
            </ScrollArea>
          </DialogProvider>
        </SheetContent>
      </Sheet>
    </SheetContext.Provider>
  );
}

export const useSheet = () => {
  const context = useContext(SheetContext);
  if (context === undefined) {
    throw new Error("useSheet must be used within a SheetProvider");
  }
  return context;
};
