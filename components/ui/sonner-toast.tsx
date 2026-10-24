"use client";

import type React from "react";

import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/shared/utils";

interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  cancel?: React.ReactNode;
  actionAltText?: string;
  cancelAltText?: string;
  duration?: number;
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
}

export function Toaster() {
  return (
    <SonnerToaster
      toastOptions={{
        classNames: {
          toast: "group toast-root",
          title: "toast-title",
          description: "toast-description",
          actionButton: "toast-action",
          cancelButton: "toast-cancel",
          success: "toast-success",
          error: "toast-error",
          warning: "toast-warning",
          info: "toast-info",
        },
      }}
      className="toaster"
    />
  );
}

export const toast = {
  success: ({ title, description, ...props }: ToastProps) => {
    return sonnerToast.success(title, {
      description,
      icon: <CheckCircle2 className="h-5 w-5 text-white" />,
      className: cn(
        "bg-green-600 text-white border-green-700",
        "dark:bg-green-700 dark:border-green-800"
      ),
      ...props,
    });
  },
  error: ({ title, description, ...props }: ToastProps) => {
    return sonnerToast.error(title, {
      description,
      icon: <XCircle className="h-5 w-5 text-white" />,
      className: cn(
        "bg-red-600 text-white border-red-700",
        "dark:bg-red-700 dark:border-red-800"
      ),
      ...props,
    });
  },
  warning: ({ title, description, ...props }: ToastProps) => {
    return sonnerToast.warning(title, {
      description,
      icon: <AlertCircle className="h-5 w-5 text-white" />,
      className: cn(
        "bg-amber-500 text-white border-amber-600",
        "dark:bg-amber-600 dark:border-amber-700"
      ),
      ...props,
    });
  },
  info: ({ title, description, ...props }: ToastProps) => {
    return sonnerToast.info(title, {
      description,
      icon: <Info className="h-5 w-5 text-white" />,
      className: cn(
        "bg-blue-600 text-white border-blue-700",
        "dark:bg-blue-700 dark:border-blue-800"
      ),
      ...props,
    });
  },
  message: ({ title, description, ...props }: ToastProps) => {
    return sonnerToast(title, {
      description,
      ...props,
    });
  },
};
