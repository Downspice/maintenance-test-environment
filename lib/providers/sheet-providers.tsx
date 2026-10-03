"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Drawer } from "@/components/ui/drawer";
import { DialogProvider } from "@/lib/providers/dialog-provider";
import { cn } from "@/utils/cn";

type SheetContentType = {
  title?: string;
  description?: string;
  content: ReactNode;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
  closeable?: boolean;
  renderActions?: React.ReactNode | (() => React.ReactNode);
  actions?: React.ReactNode | (() => React.ReactNode);
  closeText?: string;
  footer?: React.ReactNode;
  showFooter?: boolean;
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
    setTimeout(() => {
      setContent(null);
    }, 300);
  };

  const handleSheetOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setTimeout(() => {
        setContent(null);
      }, 300);
    }
  };

  const isFullscreenSheet = Boolean(content?.className?.includes("inset-0"));

  return (
    <SheetContext.Provider value={{ open, content, openSheet, closeSheet }}>
      {children}
      <Drawer
        open={open}
        onOpenChange={handleSheetOpenChange}
        modal={false}
        title={content?.title}
        description={content?.description}
        closeable={content?.closeable ?? true}
        renderActions={content?.renderActions ?? content?.actions}
        closeText={content?.closeText}
        footer={content?.footer}
        showFooter={content?.showFooter ?? true}
        side={content?.side}
        bodyClassName={
          isFullscreenSheet
            ? "flex min-h-0 flex-1 flex-col overflow-hidden !px-0 !py-0"
            : "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        }
        className={cn("w-full sm:max-w-2xl lg:max-w-3xl", content?.className)}
        onInteractOutside={(e) => {
          if (isDialogOpen) {
            e.preventDefault();
          }
        }}
      >
        <DialogProvider onOpenChange={setIsDialogOpen}>
          {isFullscreenSheet ? (
            <div className="flex h-[calc(100dvh-9.75rem)] min-h-0 flex-col overflow-y-auto px-6 py-4 pr-4">
              {content?.content}
            </div>
          ) : (
            content?.content
          )}
        </DialogProvider>
      </Drawer>
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
