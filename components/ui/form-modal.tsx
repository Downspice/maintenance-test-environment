"use client";

import type { ReactNode } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/utils/cn";

export type FormModalProps<T extends FieldValues> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  formId: string;
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void | Promise<void>;
  submitLabel?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  scrollable?: boolean;
  className?: string;
};

export function FormModal<T extends FieldValues>({
  open,
  onOpenChange,
  title,
  description,
  formId,
  form,
  onSubmit,
  submitLabel = "Save",
  children,
  size = "md",
  scrollable = false,
  className,
}: FormModalProps<T>) {
  const fields = (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-1"
      >
        {children}
      </form>
    </Form>
  );

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size={size}
      closeable
      className={className}
      renderActions={
        <Button form={formId} type="submit" variant="primary">
          {submitLabel}
        </Button>
      }
    >
      {scrollable ? (
        <ScrollArea className={cn("max-h-[min(70vh,28rem)] pr-3")}>
          {fields}
        </ScrollArea>
      ) : (
        fields
      )}
    </Modal>
  );
}
