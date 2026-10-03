"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useConfirmDialog } from "@/lib/shared/confirm-dialog";
import {
  ComboboxFieldWrapper,
  MultiComboboxWrapper,
} from "@/components/forms/fields/ComboboxWrapper";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  dateFieldTypeOptionsList,
  dateIntervalOptionsList,
  equipmentOptionsList,
  reportCategoryTypeOptionsList,
  reportFrequencyTypeOptionsList,
  reportTypeOptionsList,
} from "@/lib/shared/option-list";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetLocations } from "@/services/setups/lookups";

const NESTED_DRAWER_CLASS =
  "w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none";

const ScheduledReportSchema = z.object({
  report: z.string(),
  frequency: z.string(),
  dateField: z.string(),
  location: z.string(),
  category: z.string(),
  equipmentFilter: z.array(z.string()),
  dateInterval: z.string(),
  recipients: z.array(
    z.object({
      name: z.string(),
      email: z.string().email(),
    })
  ),
});

export type ScheduledReportInterface = z.infer<typeof ScheduledReportSchema>;

type EditScheduledReportFormProps = {
  children?: React.ReactNode;
  data: ScheduledReportInterface;
  formId?: string;
  hideSubmitButton?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
};

export default function EditScheduledReportForm({
  children,
  data,
  formId = "edit-scheduled-report-form",
  hideSubmitButton = true,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
}: EditScheduledReportFormProps) {
  const confirmDialog = useConfirmDialog();
  const { data: locationOptionsList } =
    useGetLocations<Array<{ id: string; name: string }>>();

  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipients, setRecipients] = useState<
    z.infer<typeof ScheduledReportSchema>["recipients"]
  >(data.recipients);
  const [tab, setTab] = useState("employees");

  const form = useForm<z.infer<typeof ScheduledReportSchema>>({
    resolver: zodResolver(ScheduledReportSchema),
    defaultValues: { ...data },
  });

  useEffect(() => {
    if (open) {
      form.reset({ ...data });
      setRecipients(data.recipients);
    }
  }, [open, data, form]);

  function onSubmit(submitData: z.infer<typeof ScheduledReportSchema>) {
    console.log("Form submitted with VALUES:", submitData);
    toast.success("Scheduled report updated");
    setOpen(false);
    onSuccess?.();
  }

  function onError(errors: unknown) {
    const errorMessages = Object.entries(errors as Record<string, { message?: string }>).map(
      ([field, error]) => `${field}: ${error.message ?? "Invalid value"}`
    );

    toast.error("Please fix the following errors:", {
      description: (
        <div className="mt-2">
          <ul className="list-disc list-inside space-y-1 text-sm">
            {errorMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      ),
      duration: 8000,
    });
  }

  useEffect(() => {
    form.setValue("recipients", recipients);
  }, [recipients, form]);

  const handleDelete = (email: string) => {
    (async () => {
      const recipient = recipients.find((r) => r.email === email);
      const ok = await confirmDialog({
        title: "Delete recipient?",
        description:
          "This person will be removed from the scheduled report recipients list.",
        confirmText: "Yes, Delete Recipient",
        item: recipient
          ? {
              name: recipient.name,
              description: recipient.email,
            }
          : undefined,
      });
      if (ok) {
        setRecipients((prev) => prev.filter((r) => r.email !== email));
        toast.success("Recipient deleted");
      }
    })();
  };

  const toggleRecipient = (name: string, email: string) => {
    const exists = recipients.find((r) => r.email === email);
    if (exists) {
      setRecipients((prev) => prev.filter((r) => r.email !== email));
    } else {
      setRecipients((prev) => [...prev, { name, email }]);
    }
  };

  const sampleUsers = {
    employees: [
      { name: "Alice Smith", email: "alice@company.com" },
      { name: "Bob Jones", email: "bob@company.com" },
    ],
    customers: [{ name: "Jane Customer", email: "jane@customer.com" }],
    vendors: [{ name: "Vendor Guy", email: "vendor@guy.com" }],
  };

  const formBody = (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        <div className="flex flex-col gap-1">
          <ComboboxFieldWrapper
            control={form.control}
            name="report"
            label="Report"
            options={reportTypeOptionsList}
          />
          <ComboboxFieldWrapper
            control={form.control}
            name="frequency"
            label="Frequency"
            options={reportFrequencyTypeOptionsList}
          />
          <ComboboxFieldWrapper
            control={form.control}
            name="dateField"
            label="Date Field"
            options={dateFieldTypeOptionsList}
          />
          <ComboboxFieldWrapper
            control={form.control}
            name="location"
            label="Location Filter"
            options={locationOptionsList}
          />
          <ComboboxFieldWrapper
            control={form.control}
            name="category"
            label="Category Filter"
            options={reportCategoryTypeOptionsList}
          />
          <MultiComboboxWrapper
            control={form.control}
            name="equipmentFilter"
            label="Equipment Filter"
            options={equipmentOptionsList}
          />
          <ComboboxFieldWrapper
            control={form.control}
            name="dateInterval"
            label="Date Interval"
            options={dateIntervalOptionsList}
          />

          <div className="my-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-label-md font-medium text-text-strong-950">
                Recipients
              </h3>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Recipients
              </Button>

              <Modal
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                title="Select Recipients"
                description="Choose the users who should receive this scheduled report."
                size="lg"
                closeable={true}
                closeText="Done"
              >
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                  <TabsList>
                    <TabsTrigger value="employees">Employees</TabsTrigger>
                    <TabsTrigger value="customers">Customers</TabsTrigger>
                    <TabsTrigger value="vendors">Vendors</TabsTrigger>
                  </TabsList>
                  {Object.entries(sampleUsers).map(([key, users]) => (
                    <TabsContent key={key} value={key}>
                      <div className="mt-2 space-y-2">
                        {users.map((user) => (
                          <div
                            key={user.email}
                            className="flex items-center justify-between rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-2.5"
                          >
                            <div className="flex items-center space-x-2.5">
                              <Checkbox
                                checked={
                                  !!recipients.find(
                                    (r) => r.email === user.email
                                  )
                                }
                                onCheckedChange={() =>
                                  toggleRecipient(user.name, user.email)
                                }
                              />
                              <span className="text-sm font-medium">
                                {user.name}
                              </span>
                            </div>
                            <span className="text-xs text-text-sub-600">
                              {user.email}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </Modal>
            </div>
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-bg-weak-50">
                  <tr>
                    <th className="p-2 text-left font-medium">Recipient</th>
                    <th className="p-2 text-left font-medium">Email</th>
                    <th className="p-2 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recipients.map((r) => (
                    <tr key={r.email} className="border-t">
                      <td className="p-2">{r.name}</td>
                      <td className="p-2">{r.email}</td>
                      <td className="p-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          onClick={() => handleDelete(r.email)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {recipients.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-4 text-center text-muted-foreground"
                      >
                        No recipients added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {!hideSubmitButton && (
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              className="min-w-32"
            >
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Report
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      trigger={children}
      title="Edit Scheduled Report"
      description="Update filters, schedule, and recipients for this export."
      className={NESTED_DRAWER_CLASS}
      showFooter={hideSubmitButton}
      renderActions={
        hideSubmitButton ? (
          <Button form={formId} type="submit" variant="primary">
            Save Report
          </Button>
        ) : undefined
      }
    >
      <ScrollArea className="h-[calc(100vh-160px)] pr-4">{formBody}</ScrollArea>
    </Drawer>
  );
}
