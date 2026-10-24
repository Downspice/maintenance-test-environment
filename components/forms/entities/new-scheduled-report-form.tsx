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
import { useGetLocations } from "@/services/setups/lookups";

const ScheduledReportSchema = z.object({
  report: z.string().min(1, "Report type is required"),
  frequency: z.string().min(1, "Frequency is required"),
  dateField: z.string().min(1, "Date field is required"),
  location: z.string().min(1, "Location is required"),
  category: z.string().min(1, "Category is required"),
  equipmentFilter: z.array(z.string()),
  dateInterval: z.string().min(1, "Date interval is required"),
  recipients: z.array(
    z.object({
      name: z.string().min(1, "Recipient name is required"),
      email: z.string().email("Please enter a valid email address"),
    })
  ),
});

type NewScheduledReportFormProps = {
  formId?: string;
  hideSubmitButton?: boolean;
  onSuccess?: () => void;
};

export default function NewScheduledReportForm({
  formId = "new-scheduled-report-form",
  hideSubmitButton = false,
  onSuccess,
}: NewScheduledReportFormProps) {
  const confirmDialog = useConfirmDialog();
  const [recipientModalOpen, setRecipientModalOpen] = useState(false);
  const {
    data: locationOptionsList,
    isLoading: locationOptionsListLoading,
    error: locationOptionsListError,
  } = useGetLocations<Array<{ id: string; name: string }>>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipients, setRecipients] = useState<
    z.infer<typeof ScheduledReportSchema>["recipients"]
  >([]);
  const [tab, setTab] = useState("employees");

  const form = useForm<z.infer<typeof ScheduledReportSchema>>({
    resolver: zodResolver(ScheduledReportSchema),
    defaultValues: { recipients: [] },
  });

  function onSubmit(data: z.infer<typeof ScheduledReportSchema>) {
    console.log("Form submitted with VALUES:", data);
    toast.success("Scheduled report created");
    form.reset();
    setRecipients([]);
    onSuccess?.();
  }

  function onError(errors: any) {
    const errorMessages = Object.entries(errors).map(
      ([field, error]: [string, any]) => {
        const fieldLabels: Record<string, string> = {
          unit: "Project Name",
        };
        return `${fieldLabels[field] || field}: ${error.message}`;
      }
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

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        <div className="flex flex-col">
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

          <div className="my-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Recipients</h3>
              <Button
                type="button"
                variant="primary"
                onClick={() => setRecipientModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Recipients
              </Button>

              <Modal
                open={recipientModalOpen}
                onOpenChange={setRecipientModalOpen}
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
                      <div className="space-y-2 mt-2">
                        {users.map((user) => (
                          <div
                            key={user.email}
                            className="flex items-center justify-between border border-stroke-soft-200 p-2.5 rounded-lg bg-bg-white-0"
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
                            <span className="text-text-sub-600 text-xs">
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
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2">Recipient</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Action</th>
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
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(r.email)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {recipients.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center p-4 text-muted-foreground"
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
              className="min-w-32 my-4"
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
}
