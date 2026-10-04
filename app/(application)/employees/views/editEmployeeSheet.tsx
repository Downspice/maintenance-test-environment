"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TableRowActions } from "@/components/ui/table-row-actions";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EmployeeCheckboxOptions,
  equipmentOptionsList,
} from "@/lib/shared/option-list";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import SelectWrapper from "@/components/forms/fields/SelectWrapper";
import TextareaWrapper from "@/components/forms/fields/TextareaWrapper";
import CustomFieldsWrapper from "@/components/forms/fields/CustomFieldsWrapper";
import FileUploadWrapper from "@/components/forms/fields/FileUploadWrapper";
import { Drawer } from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import FormSubheader from "@/components/forms/ui/formSubheader";
import DatePickerWrapper from "@/components/forms/fields/DatePickerWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CheckboxWrapper from "@/components/forms/fields/CheckboxWrapper";
import {
  useGetEmployee,
  useGetEmployeeCategories,
  useGetEmployeeRenewals,
  useGetEmployeeStatuses,
  useGetEmployeeTypes,
  useUpdateEmployee,
} from "@/services/setups/employee";
import { useGetLocations } from "@/services/setups/lookups";
import { employeeSchema } from "@/components/forms/entities/new-employee-form";
import { deepCleanNulls } from "@/lib/shared/utils";

// Renewal data type
export interface RenewalData {
  id: string;
  renewal_id: string;
  issued_date: Date;
  expiry_date: Date;
  notes: string;
}

interface EmployeeDetailData {
  id?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  employee_number?: string;
  address_one?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  home_contact?: string;
  alt_phone?: string;
  cell?: string;
  email?: string;
  status_id?: string;
  hire_date?: string;
  leave_date?: string;
  dob?: string;
  ssn?: string;
  type_id?: string;
  labor_rate?: string | number;
  billing_rate?: string | number;
  currency?: string;
  location_id?: string;
  category_id?: string;
  driver_license_number?: string;
  driver_license_class?: string;
  driver_license_state?: string;
  notes?: string;
  renewals?: RenewalData[];
  miscellaneous?: unknown;
  tracker?: string[];
  Photos?: unknown;
  Attachments?: unknown;
  [key: string]: unknown;
}

function generateRenewalId(): string {
  return `renewal_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function EditEmployeeSkeleton() {
  return (
    <div className="space-y-6">
      {/* Tabs Header Skeleton */}
      <div className="flex gap-2 border-b border-stroke-soft-200 pb-2">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      {/* Fields Skeleton */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>

        <Skeleton className="h-6 w-24 mt-2" />
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <div className="space-y-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function EditEmployee({
  children,
  pageId,
}: {
  children: React.ReactNode;
  pageId: string;
}) {
  const [open, setOpen] = useState(false);
  const [openRenewal, setOpenRenewal] = useState(false);
  const [editingRenewalId, setEditingRenewalId] = useState<string | null>(null);

  const { data, isLoading: isEmployeeLoading } = useGetEmployee<EmployeeDetailData>(pageId, {
    enabled: open && !!pageId,
  });

  const { data: statusOptions } = useGetEmployeeStatuses<Array<{ id: string; name: string }>>({
    enabled: open,
  });

  const { data: employeeTypeOptions } = useGetEmployeeTypes<Array<{ id: string; name: string }>>({
    enabled: open,
  });

  const { data: locationOptionsList } = useGetLocations<Array<{ id: string; name: string }>>({
    enabled: open,
  });

  const { data: categoryOptions } = useGetEmployeeCategories<Array<{ id: string; name: string }>>({
    enabled: open,
  });

  const { mutateAsync, isPending } = useUpdateEmployee();

  const employeeForm = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
  });

  const renewals = (employeeForm.watch("renewals") as RenewalData[] | undefined) ?? [];
  const isLoading = isEmployeeLoading || (open && !data);

  useEffect(() => {
    if (open && data) {
      employeeForm.reset(
        deepCleanNulls({
          ...data,
          renewals: data.renewals || [],
        })
      );
    }
  }, [data, open, employeeForm]);

  const handleAddRenewal = (newRenewal: RenewalData) => {
    const currentRenewals = (employeeForm.getValues("renewals") as RenewalData[] | undefined) ?? [];
    let updated: RenewalData[];

    if (editingRenewalId) {
      updated = currentRenewals.map((r) =>
        r.id === editingRenewalId ? newRenewal : r
      );
      toast.success("Renewal updated");
    } else {
      updated = [...currentRenewals, newRenewal];
      toast.success("Renewal added");
    }

    employeeForm.setValue("renewals", updated, { shouldDirty: true });
    setEditingRenewalId(null);
    setOpenRenewal(false);
  };

  const handleDeleteRenewal = (id: string) => {
    const currentRenewals = (employeeForm.getValues("renewals") as RenewalData[] | undefined) ?? [];
    const updated = currentRenewals.filter((r) => r.id !== id);
    employeeForm.setValue("renewals", updated, { shouldDirty: true });
    toast.success("Renewal removed");
  };

  const handleEditRenewal = (id: string) => {
    setEditingRenewalId(id);
    setTimeout(() => {
      setOpenRenewal(true);
    }, 0);
  };

  async function handleSubmit(formData: z.infer<typeof employeeSchema>) {
    try {
      const payload = {
        ...formData,
        id: pageId,
      };
      const res = await mutateAsync(
        payload as unknown as Parameters<typeof mutateAsync>[0]
      );
      toast.success(
        (res as { message?: string })?.message ?? "Employee updated successfully!"
      );
      employeeForm.reset();
      setOpen(false);
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to update employee.";
      toast.error(errorMessage);
    }
  }

  const employeeFullName = data
    ? [data.first_name, data.middle_name, data.last_name].filter(Boolean).join(" ")
    : "Employee";

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      trigger={children}
      title={data ? `Edit ${employeeFullName}` : "Edit Employee"}
      description="Edit employee details and records."
      closeable={true}
      renderActions={
        <Button
          form="edit-employee-form"
          type="submit"
          variant="primary"
          disabled={isPending || isLoading}
        >
          {isPending ? "Saving..." : "Save Employee"}
        </Button>
      }
      className="w-full sm:w-2/3 sm:min-w-[1200px] sm:max-w-none lg:max-w-none"
    >
      <ScrollArea className="h-[calc(100vh-160px)] pr-4">
        {isLoading ? (
          <EditEmployeeSkeleton />
        ) : (
          <Form {...employeeForm}>
            <form
              id="edit-employee-form"
              onSubmit={employeeForm.handleSubmit(handleSubmit, (errors) => {
                console.log(errors);
                const firstErrorField = Object.values(errors)[0];
                const message =
                  firstErrorField &&
                    typeof firstErrorField === "object" &&
                    "message" in firstErrorField
                    ? String(firstErrorField.message)
                    : undefined;

                if (message) {
                  toast.error(message);
                } else {
                  toast.error("Please check the form for errors.");
                }
              })}
              className="w-full"
            >
              <Tabs defaultValue="employee" className="w-full">
                <TabsList>
                  <TabsTrigger value="employee">Employee</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="renewals">Renewals</TabsTrigger>
                  <TabsTrigger value="notifications">
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                </TabsList>
                <TabsContent value="employee">
                  <div className="flex flex-col gap-1">
                    <FormSubheader header={"Employment"} />
                    <InputWrapper
                      control={employeeForm.control}
                      name="employee_number"
                      label="Employee Number"
                      type="text"
                    />
                    <div className="flex flex-row">
                      <InputWrapper
                        control={employeeForm.control}
                        name="last_name"
                        label="Last Name"
                        type="text"
                      />
                      <InputWrapper
                        control={employeeForm.control}
                        name="first_name"
                        label="First Name"
                        type="text"
                      />
                      <InputWrapper
                        control={employeeForm.control}
                        name="middle_name"
                        label="Middle name"
                        type="text"
                      />
                    </div>

                    <InputWrapper
                      control={employeeForm.control}
                      name="address_one"
                      label="Address 1"
                      type="text"
                    />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className="col-span-1">
                        <InputWrapper
                          control={employeeForm.control}
                          name="city"
                          label="City"
                          type="text"
                        />
                      </div>
                      <div className="col-span-1">
                        <InputWrapper
                          control={employeeForm.control}
                          name="state"
                          label="State /Province"
                          type="text"
                        />
                      </div>
                      <div className="col-span-1">
                        <InputWrapper
                          control={employeeForm.control}
                          name="postal_code"
                          label="Postal Code"
                          type="text"
                        />
                      </div>
                      <div className="col-span-1"></div>
                    </div>

                    <FormSubheader header={"Contact"} />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-1">
                        <InputWrapper
                          control={employeeForm.control}
                          name="home_contact"
                          label="Home "
                          type="number"
                          value={" "}
                          className="col-span-1"
                        />
                      </div>
                      <div className="col-span-1">
                        <InputWrapper
                          control={employeeForm.control}
                          name="alt_phone"
                          label="Alt. Phone "
                          type="number"
                          className="col-span-1"
                        />
                      </div>
                      <div className="col-span-1">
                        <InputWrapper
                          control={employeeForm.control}
                          name="cell"
                          label="Cell"
                          type="number"
                        />
                      </div>
                    </div>
                    <InputWrapper
                      control={employeeForm.control}
                      name="email"
                      label="Email"
                      type="text"
                    />
                    <div className="flex flex-col gap-4">
                      <TextareaWrapper
                        control={employeeForm.control}
                        name="notes"
                        label="Notes"
                        rows={4}
                      />
                    </div>
                    <FormSubheader header={"Miscellaneous"} />
                    <CustomFieldsWrapper
                      control={employeeForm.control}
                      name="miscellaneous"
                      label="Custom Fields"
                      maxFields={4}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="details">
                  <div className="flex flex-col gap-1">
                    <FormSubheader header={"Employment"} />
                    <SelectWrapper
                      control={employeeForm.control}
                      name="status_id"
                      label="Status "
                      required
                      options={statusOptions ?? []}
                    />
                    <div className="grid grid-cols-2 gap-1">
                      <div className="col-span-1">
                        <DatePickerWrapper
                          control={employeeForm.control}
                          name="hire_date"
                          label="Date"
                        />
                      </div>
                      <div className="col-span-1">
                        <DatePickerWrapper
                          control={employeeForm.control}
                          name="leave_date"
                          label="Leave Date"
                        />
                      </div>
                      <div className="col-span-1">
                        <DatePickerWrapper
                          control={employeeForm.control}
                          name="dob"
                          label="DOB"
                        />
                      </div>
                      <div className="col-span-1">
                        <InputWrapper
                          control={employeeForm.control}
                          name="ssn"
                          label="SSN"
                          type="text"
                        />
                      </div>
                      <div className="col-span-1">
                        <SelectWrapper
                          control={employeeForm.control}
                          name="type_id"
                          label="Type "
                          required
                          options={employeeTypeOptions ?? []}
                        />
                      </div>
                      <div className="col-span-1"></div>
                      <div className="col-span-1">
                        <InputWrapper
                          control={employeeForm.control}
                          name="labor_rate"
                          label="Last Rate"
                          type="number"
                        />
                      </div>
                      <div className="col-span-1">
                        <InputWrapper
                          control={employeeForm.control}
                          name="billing_rate"
                          label="Billing Rate"
                          type="number"
                        />
                      </div>
                      <div className="col-span-1">
                        <SelectWrapper
                          control={employeeForm.control}
                          name="location_id"
                          label="Location "
                          required
                          options={locationOptionsList}
                        />
                      </div>

                      <div className="col-span-1">
                        <SelectWrapper
                          control={employeeForm.control}
                          name="category_id"
                          label="Category "
                          required
                          options={categoryOptions}
                        />
                      </div>
                    </div>
                    <FormSubheader header={"Driver's License "} />

                    <InputWrapper
                      control={employeeForm.control}
                      name="driver_license_number"
                      label="Number"
                      type="text"
                    />
                    <InputWrapper
                      control={employeeForm.control}
                      name="driver_license_class"
                      label="Class"
                      type="text"
                    />
                    <InputWrapper
                      control={employeeForm.control}
                      name="driver_license_state"
                      label="State/Province"
                      type="text"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="renewals">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-end">
                      <Sheet open={openRenewal} onOpenChange={setOpenRenewal}>
                        <SheetTrigger asChild>
                          <Button
                            onClick={() => setEditingRenewalId(null)}
                            type="button"
                            className="w-fit"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Renewal
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-1/4">
                          <SheetHeader>
                            <SheetTitle>
                              {editingRenewalId
                                ? "Edit Renewal"
                                : "Create Renewal"}
                            </SheetTitle>
                            <SheetDescription>
                              Fill out the form below to{" "}
                              {editingRenewalId ? "edit" : "create"} a
                              renewal.
                            </SheetDescription>
                          </SheetHeader>
                          <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
                            <RenewalFormContent
                              onSubmit={handleAddRenewal}
                              editingRenewal={
                                editingRenewalId
                                  ? renewals.find(
                                    (r) => r.id === editingRenewalId
                                  )
                                  : undefined
                              }
                            />
                          </ScrollArea>
                        </SheetContent>
                      </Sheet>
                    </div>

                    {renewals.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Renewal</TableHead>
                            <TableHead>Issued</TableHead>
                            <TableHead>Expired</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {renewals.map((data) => (
                            <TableRow key={data.id}>
                              <TableCell>{data?.renewal_id}</TableCell>
                              <TableCell>
                                {data?.issued_date instanceof Date
                                  ? data.issued_date.toLocaleDateString()
                                  : new Date(data?.issued_date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {data?.expiry_date instanceof Date
                                  ? data.expiry_date.toLocaleDateString()
                                  : new Date(data?.expiry_date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{data?.notes || "-"}</TableCell>
                              <TableCell>
                                <TableRowActions
                                  onEdit={() => handleEditRenewal(data.id)}
                                  onDelete={() => handleDeleteRenewal(data.id)}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No renewals added yet
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="notifications">
                  <div className="grid grid-cols-2">
                    <div className="col-span-1">
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {locationOptionsList?.map((location) => (
                              <SelectItem
                                key={location.id}
                                value={location.id}
                              >
                                {location.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <div className="grid grid-cols-4">
                        <div className="col-span-1">Equipment Name</div>
                        <div className="col-span-3">Options</div>
                      </div>
                      {equipmentOptionsList.map((equipment) => (
                        <div
                          className="grid grid-cols-4"
                          key={equipment.value}
                        >
                          <div className="col-span-1 flex item-baseline ">
                            {equipment.label}
                          </div>
                          <div className="col-span-3">
                            <CheckboxWrapper
                              control={employeeForm.control}
                              name={"tracker"}
                              label={""}
                              options={EmployeeCheckboxOptions}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="photos">
                  <FileUploadWrapper
                    control={employeeForm.control}
                    name="Photos"
                    label="Photos"
                  />
                </TabsContent>
                <TabsContent value="attachments">
                  <FileUploadWrapper
                    control={employeeForm.control}
                    name="Attachments"
                    label="Attachments"
                  />
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        )}
      </ScrollArea>
    </Drawer>
  );
}

interface RenewalFormContentProps {
  onSubmit: (data: RenewalData) => void;
  editingRenewal?: RenewalData;
}

function RenewalFormContent({
  onSubmit,
  editingRenewal,
}: RenewalFormContentProps) {
  const { data: renewalOptionsList } = useGetEmployeeRenewals();

  const form = useForm({
    defaultValues: {
      id: editingRenewal?.id ?? "",
      renewal_id: editingRenewal?.renewal_id ?? "",
      issued_date: editingRenewal?.issued_date ?? new Date(),
      expiry_date: editingRenewal?.expiry_date ?? new Date(),
      notes: editingRenewal?.notes ?? "",
    },
  });

  // Reset form when editingRenewal changes
  useEffect(() => {
    form.reset({
      id: editingRenewal?.id ?? "",
      renewal_id: editingRenewal?.renewal_id ?? "",
      issued_date: editingRenewal?.issued_date ?? new Date(),
      expiry_date: editingRenewal?.expiry_date ?? new Date(),
      notes: editingRenewal?.notes ?? "",
    });
  }, [editingRenewal, form]);

  const handleFormSubmit = (formData: {
    id?: string;
    renewal_id: string;
    issued_date: Date;
    expiry_date: Date;
    notes?: string;
  }) => {
    if (formData.renewal_id && formData.issued_date && formData.expiry_date) {
      const renewalId =
        formData.id && formData.id.length > 0
          ? formData.id
          : generateRenewalId();
      onSubmit({
        id: renewalId,
        renewal_id: formData.renewal_id,
        issued_date: formData.issued_date,
        expiry_date: formData.expiry_date,
        notes: formData.notes || "",
      });
      form.reset();
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <SelectWrapper
          control={form.control}
          name="renewal_id"
          label="Renewal Type"
          options={renewalOptionsList ?? []}
        />
        <DatePickerWrapper
          control={form.control}
          name="issued_date"
          label="Date Issued"
        />
        <DatePickerWrapper
          control={form.control}
          name="expiry_date"
          label="Date Expired"
        />
        <InputWrapper
          control={form.control}
          name="notes"
          label="Notes"
          type="text"
        />
        <Button type="submit" className="w-full">
          {editingRenewal ? "Update Renewal" : "Add Renewal"}
        </Button>
      </form>
    </Form>
  );
}