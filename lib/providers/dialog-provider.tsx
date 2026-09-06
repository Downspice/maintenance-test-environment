"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

type DialogContentType = {
  title: ReactNode
  description?: ReactNode
  content: ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

type DialogContextType = {
  open: boolean
  content: DialogContentType | null
  openDialog: (content: DialogContentType) => void
  closeDialog: () => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

const getMaxWidthClass = (size?: string) => {
  switch (size) {
    case "sm":
      return "max-w-sm"
    case "md":
      return "max-w-md"
    case "lg":
      return "max-w-lg"
    case "xl":
      return "max-w-xl"
    case "full":
      return "max-w-[calc(100vw-2rem)]"
    default:
      return "max-w-lg"
  }
}

export function DialogProvider({ children, onOpenChange }: { children: ReactNode; onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState<DialogContentType | null>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")

  const openDialog = (dialogContent: DialogContentType) => {
    setContent(dialogContent)
    setOpen(true)
    onOpenChange?.(true)
  }

  const closeDialog = () => {
    setOpen(false)
    onOpenChange?.(false)
    // We don't immediately clear content so the dialog can animate out nicely
    setTimeout(() => {
      setContent(null)
    }, 300)
  }

  return (
    <DialogContext.Provider value={{ open, content, openDialog, closeDialog }}>
      {children}
      {isMobile ? (
        // Use Sheet on mobile
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="overflow-y-auto">
            {content && (
              <>
                <SheetHeader>
                  <SheetTitle>{content.title}</SheetTitle>
                  {content.description && <SheetDescription>{content.description}</SheetDescription>}
                </SheetHeader>
                <div className="mt-6">{content.content}</div>
              </>
            )}
          </SheetContent>
        </Sheet>
      ) : (
        // Use Dialog on desktop
        <Dialog modal={false} open={open} onOpenChange={setOpen}>
          <DialogContent className={content?.size ? getMaxWidthClass(content.size) : "max-w-lg"}>
            {content && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-3xl">{content.title}</DialogTitle>
                  {content.description && <DialogDescription className="text-lg">{content.description}</DialogDescription>}
                </DialogHeader>
                <div className="mt-6">{content.content}</div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </DialogContext.Provider>
  )
}

export const useDialog = () => {
  const context = useContext(DialogContext)
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider")
  }
  return context
}
