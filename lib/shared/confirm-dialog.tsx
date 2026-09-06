"use client"

import { useDialog } from "@/lib/providers/dialog-provider"
import { Button } from "@/components/ui/button"
import { useCallback, type ReactNode } from "react"
import { AlertTriangle, CheckCircle2, Info, Trash2 } from "lucide-react"

type ConfirmOptions = {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive" | "secondary" | "outline" | "ghost" | "link"
  tone?: "danger" | "warning" | "info" | "success"
  icon?: ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

export function useConfirmDialog() {
  const { openDialog, closeDialog } = useDialog()

  const confirm = useCallback((opts: ConfirmOptions = {}) => {
    const {
      title = "Are you sure?",
      description,
      confirmText = "Confirm",
      cancelText = "Cancel",
      variant = "destructive",
      tone,
      icon,
      size = "lg",
    } = opts

    const resolvedTone: "danger" | "warning" | "info" | "success" = tone
      ? tone
      : variant === "destructive"
      ? "danger"
      : "warning"

    const toneClasses: Record<"danger" | "warning" | "info" | "success", { iconColor: string; bg: string; text: string; ring: string }> = {
      danger: { iconColor: "text-red-600", bg: "bg-red-50", text: "text-red-800", ring: "ring-red-100" },
      warning: { iconColor: "text-amber-600", bg: "bg-amber-50", text: "text-amber-800", ring: "ring-amber-100" },
      info: { iconColor: "text-blue-600", bg: "bg-blue-50", text: "text-blue-800", ring: "ring-blue-100" },
      success: { iconColor: "text-emerald-600", bg: "bg-emerald-50", text: "text-emerald-800", ring: "ring-emerald-100" },
    }

    const defaultIconByTone: Record<"danger" | "warning" | "info" | "success", ReactNode> = {
      danger: <Trash2 className="h-5 w-5" aria-hidden />,
      warning: <AlertTriangle className="h-5 w-5" aria-hidden />,
      info: <Info className="h-5 w-5" aria-hidden />,
      success: <CheckCircle2 className="h-5 w-5" aria-hidden />,
    }

    return new Promise<boolean>((resolve) => {
      const handleCancel = () => {
        closeDialog()
        resolve(false)
      }
      const handleConfirm = () => {
        closeDialog()
        resolve(true)
      }

      openDialog({
        title: (
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`inline-flex h-9 w-9 m-4 items-center justify-center rounded-full ${toneClasses[resolvedTone].bg} ${toneClasses[resolvedTone].ring} ${toneClasses[resolvedTone].iconColor} ring-8`}
            >
              {icon ?? defaultIconByTone[resolvedTone]}
            </span>
            <span className="leading-tight">{title}</span>
          </div>
        ),
        description,
        content: (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                {cancelText}
              </Button>
              <Button variant={variant} onClick={handleConfirm}>
                {confirmText}
              </Button>
            </div>
          </div>
        ),
        size,
      })
    })
  }, [openDialog, closeDialog])

  return confirm
}


