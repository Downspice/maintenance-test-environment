"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  ComboboxFieldWrapper,
  MultiComboboxWrapper,
} from "@/components/forms/wrappers/ComboboxWrapper";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox"; 
import {
  dateFieldTypeOptionsList,
  dateIntervalOptionsList,
  equipmentOptionsList,
  locationOptionsList,
  reportCategoryTypeOptionsList,
  reportFrequencyTypeOptionsList,
  reportTypeOptionsList,
} from "@/lib/option-list";

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

export default function NewScheduledReportForm() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipients, setRecipients] = useState<z.infer<typeof ScheduledReportSchema>["recipients"]>([]);
  const [tab, setTab] = useState("employees");

  const form = useForm<z.infer<typeof ScheduledReportSchema>>({
    resolver: zodResolver(ScheduledReportSchema),
    defaultValues: { recipients: [] },
  });

  function onSubmit(data: z.infer<typeof ScheduledReportSchema>) {
    console.log("Form submitted with VALUES:", data);
    toast("Project created successfully!", { duration: 10000 });
    setOpen(false);
    form.reset();
    form.setValue("recipients", []);
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
    if (confirm("Are you sure you want to delete this recipient?")) {
      setRecipients(prev => prev.filter(r => r.email !== email));
    }
  };

  const toggleRecipient = (name: string, email: string) => {
    const exists = recipients.find(r => r.email === email);
    if (exists) {
      setRecipients(prev => prev.filter(r => r.email !== email));
    } else {
      setRecipients(prev => [...prev, { name, email }]);
    }
  };

  const sampleUsers = {
    employees: [
      { name: "Alice Smith", email: "alice@company.com" },
      { name: "Bob Jones", email: "bob@company.com" },
    ],
    customers: [
      { name: "Jane Customer", email: "jane@customer.com" },
    ],
    vendors: [
      { name: "Vendor Guy", email: "vendor@guy.com" },
    ],
  };

  return (
    
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        <div className="flex flex-col">
          <ComboboxFieldWrapper control={form.control} name="report" label="Report" options={reportTypeOptionsList} />
          <ComboboxFieldWrapper control={form.control} name="frequency" label="Frequency" options={reportFrequencyTypeOptionsList} />
          <ComboboxFieldWrapper control={form.control} name="dateField" label="Date Field" options={dateFieldTypeOptionsList} />
          <ComboboxFieldWrapper control={form.control} name="location" label="Location Filter" options={locationOptionsList} />
          <ComboboxFieldWrapper control={form.control} name="category" label="Category Filter" options={reportCategoryTypeOptionsList} />
          <MultiComboboxWrapper control={form.control} name="equipmentFilter" label="Equipment Filter" options={equipmentOptionsList} />
          <ComboboxFieldWrapper control={form.control} name="dateInterval" label="Date Interval" options={dateIntervalOptionsList} />

          <div className="my-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Recipients</h3>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Add Recipients</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Select Recipients</DialogTitle>
                  </DialogHeader>
                  <Tabs value={tab} onValueChange={setTab} className="mt-4">
                    <TabsList>
                      <TabsTrigger value="employees">Employees</TabsTrigger>
                      <TabsTrigger value="customers">Customers</TabsTrigger>
                      <TabsTrigger value="vendors">Vendors</TabsTrigger>
                    </TabsList>
                    {Object.entries(sampleUsers).map(([key, users]) => (
                      <TabsContent key={key} value={key}>
                        <div className="space-y-2">
                          {users.map(user => (
                            <div
                              key={user.email}
                              className="flex items-center justify-between border border-border p-2 rounded"
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={!!recipients.find(r => r.email === user.email)}
                                  onCheckedChange={() => toggleRecipient(user.name, user.email)}
                                />
                                <span>{user.name}</span>
                              </div>
                              <span className="text-muted-foreground text-sm">{user.email}</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </DialogContent>
              </Dialog>
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
                  {recipients.map(r => (
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
                      <td colSpan={3} className="text-center p-4 text-muted-foreground">
                        No recipients added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="min-w-32 my-4 w-full">
            {isSubmitting ? "Creating..." : (<><Save className="mr-2 h-4 w-4" /> Create Equipment</>)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
