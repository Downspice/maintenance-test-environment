"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DeleteConfirmationModal,
  type DeleteConfirmationItem,
} from "@/components/reusable/modals/delete-confirmation-modal";

export type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?:
    "default" | "destructive" | "secondary" | "outline" | "ghost" | "link";
  tone?: "danger" | "warning" | "info" | "success";
  item?: DeleteConfirmationItem;
  warningTitle?: ReactNode;
  warningText?: ReactNode;
  switchLabel?: ReactNode;
  switchDescription?: ReactNode;
  /** When false, confirm is enabled without toggling the switch. Default: true for destructive, false otherwise. */
  requireSwitch?: boolean;
};

type ConfirmDialogContextValue = {
  confirm: (opts?: ConfirmOptions) => Promise<boolean>;
};

const ConfirmDialogContext = createContext<
  ConfirmDialogContextValue | undefined
>(undefined);

const defaultWarningText = (
  <>
    This action{" "}
    <strong className="font-semibold text-text-strong-950">
      cannot be undone
    </strong>
    .
  </>
);

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const settle = useCallback((value: boolean) => {
    resolveRef.current?.(value);
    resolveRef.current = null;
    setOpen(false);
    setOptions({});
  }, []);

  const confirm = useCallback((opts: ConfirmOptions = {}) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setOptions(opts);
      setOpen(true);
    });
  }, []);

  const isDestructive =
    options.tone === "danger" ||
    options.variant === "destructive" ||
    (options.variant === undefined &&
      options.tone === undefined &&
      options.requireSwitch !== false);

  const requireSwitch = options.requireSwitch ?? isDestructive;

  const confirmText =
    options.confirmText ?? (isDestructive ? "Yes, Delete" : "Confirm");

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      <DeleteConfirmationModal
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && resolveRef.current) {
            settle(false);
          }
        }}
        title={options.title ?? "Are you sure?"}
        description={
          options.description ??
          (isDestructive
            ? "Please review the details below before continuing."
            : "Please confirm this action.")
        }
        warningTitle={options.warningTitle ?? "Warning:"}
        warningText={options.warningText ?? defaultWarningText}
        item={options.item}
        switchLabel={options.switchLabel ?? "Confirm permanent deletion"}
        switchDescription={
          options.switchDescription ??
          "Toggle the switch to authorize and enable this action."
        }
        cancelText={options.cancelText ?? "Cancel"}
        confirmText={confirmText}
        requireSwitch={requireSwitch}
        onDelete={async () => {
          settle(true);
        }}
      />
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirmDialog() {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error(
      "useConfirmDialog must be used within ConfirmDialogProvider"
    );
  }
  return context.confirm;
}
