"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow, Pen, Plus, Trash2 } from "lucide-react";
import TextareaWrapper from "../fields/TextareaWrapper";
import { toast } from "sonner";
import InputWrapper from "../fields/InputWrapper";
import SelectWrapper from "../fields/SelectWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import FormSubheader from "../ui/formSubheader";
import CustomFieldsWrapper from "../fields/CustomFieldsWrapper";
import DatePickerWrapper from "../fields/DatePickerWrapper";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import {
  useAddEmployee,
  useGetEmployeeCategories,
  useGetEmployeeRenewals,
  useGetEmployeeStatuses,
  useGetEmployeeTypes,
} from "@/services/setups/employee";
import { useGetLocations } from "@/services/setups/lookups";

// Renewal data type
export interface RenewalData {
  id: string;
  renewal_id: string;
  issued_date: Date;
  expiry_date: Date;
  notes: string;
}

// Define the form schema with Zod
export const employeeSchema = z.object({
  id: z.string().optional(),
  employee_number: z.string().optional(),
  last_name: z.string().optional(),
  first_name: z.string().optional(),
  middle_name: z.string().optional(),
  address_one: z.string().optional(),
  city: z.string().optional(),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().optional(),
  home_contact: z.string().min(1, "Home contact number is required"),
  alt_phone: z.any().optional(),
  cell: z.string().min(1, "Cell number is required"),
  email: z.string().optional(),
  status_id: z.string().min(1, "Status is required"),
  hire_date: z.any(),
  leave_date: z.any(),
  dob: z.any(),
  ssn: z.string().optional(),
  type_id: z.string().optional(),
  labor_rate: z.string().min(1, "Labor rate is required"),
  billing_rate: z.string().min(1, "Billing rate is required"),
  currency: z.string().optional(),
  location_id: z.string().min(1, "Location is required"),
  category_id: z.string().min(1, "Category is required"),
  driver_license_number: z.string().optional(),
  driver_license_class: z.string().optional(),
  driver_license_state: z.string().optional(),
  notes: z.string().optional(),
  renewals: z
    .array(
      z.object({
        renewal_id: z.string().min(1, "Renewal type is required"),
        issued_date: z.any(),
        expiry_date: z.any(),
        notes: z.string().optional(),
      })
    )
    .optional(),
});

export default function NewEmployeeForm({
  formId = "new-employee-form",
  hideSubmitButton,
  onSuccess,
}: {
  formId?: string;
  hideSubmitButton?: boolean;
  onSuccess?: () => void;
} = {}) {
  const [miscellaneous, setCustomFields] = useState<
    { name: string; id: string }[]
  >([]);
  const [renewals, setRenewals] = useState<RenewalData[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const employeeForm = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      renewals: [],
    },
  });

  const {
    data: statusOptions,
    isLoading: statusOptionsLoading,
    error: statusOptionsError,
  } = useGetEmployeeStatuses<Array<{ id: string; name: string }>>();

  const {
    data: employeeTypeOptions,
    isLoading: employeeTypeOptionsLoading,
    error: employeeTypeOptionsError,
  } = useGetEmployeeTypes<Array<{ id: string; name: string }>>();

  const {
    data: locationOptionsList,
    isLoading: locationOptionsListLoading,
    error: locationOptionsListError,
  } = useGetLocations<Array<{ id: string; name: string }>>();

  const {
    data: categoryOptions,
    isLoading: categoryOptionsLoading,
    error: categoryOptionsError,
  } = useGetEmployeeCategories<Array<{ id: string; name: string }>>();
  const { data: renewalOptionsList } = useGetEmployeeRenewals();
  const { mutateAsync, isPending } = useAddEmployee();

  const handleAddRenewal = (newRenewal: RenewalData) => {
    let updatedRenewals: RenewalData[];
    if (editingId) {
      updatedRenewals = renewals.map((r) => (r.id === editingId ? newRenewal : r));
      setEditingId(null);
    } else {
      updatedRenewals = [
        ...renewals,
        { ...newRenewal, id: newRenewal.id || crypto.randomUUID() },
      ];
    }
    setRenewals(updatedRenewals);
    employeeForm.setValue("renewals", updatedRenewals);
    setOpen(false);
    toast.success(editingId ? "Renewal updated" : "Renewal added");
  };

  const handleDeleteRenewal = (id: string) => {
    const updated = renewals.filter((r) => r.id !== id);
    setRenewals(updated);
    employeeForm.setValue("renewals", updated);
    toast.success("Renewal removed");
  };

  const handleEditRenewal = (id: string) => {
    setEditingId(id);
    setOpen(true);
  };

  async function handleSubmit(data: z.infer<typeof employeeSchema>) {
    try {
      const res = await mutateAsync(data);
      toast.success(res?.message ?? "Employee created successfully!");
      employeeForm.reset();
      setRenewals([]);
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to create employee.";
      toast.error(errorMessage);
    }
  }

  return (
    <div className="w-full">
      <Form {...employeeForm}>
        <form
          id={formId}
          onSubmit={employeeForm.handleSubmit(handleSubmit, (errors) => {
            console.log(errors);
            const firstErrorField = Object.values(errors)[0];
            const message = firstErrorField?.message;

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
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
                  value={""}
                />
                <div className="flex flex-col gap-1">
                  <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
                    <InputWrapper
                      control={employeeForm.control}
                      name="last_name"
                      label="Last Name"
                      type="text"
                      value={""}
                    />
                    <InputWrapper
                      control={employeeForm.control}
                      name="first_name"
                      label="First Name"
                      type="text"
                      value={""}
                    />
                  </div>
                  <InputWrapper
                    control={employeeForm.control}
                    name="middle_name"
                    label="Middle name"
                    type="text"
                    value={""}
                  />
                </div>

                <InputWrapper
                  control={employeeForm.control}
                  name="address_one"
                  label="Address 1"
                  type="text"
                  value={""}
                />
                <div className="flex flex-col gap-1">
                  <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
                    <InputWrapper
                      control={employeeForm.control}
                      name="city"
                      label="City"
                      type="text"
                      value={""}
                    />
                    <InputWrapper
                      control={employeeForm.control}
                      name="state"
                      label="State / Province"
                      type="text"
                      value={""}
                    />
                  </div>
                  <InputWrapper
                    control={employeeForm.control}
                    name="postal_code"
                    label="Postal Code"
                    type="text"
                    value={""}
                  />
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
                      value={""}
                      className="col-span-1"
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={employeeForm.control}
                      name="cell"
                      label="Cell"
                      type="number"
                      value={""}
                    />
                  </div>
                </div>
                <InputWrapper
                  control={employeeForm.control}
                  name="email"
                  label="Email"
                  type="text"
                  value={""}
                />
                <div className="flex flex-col gap-4">
                  <TextareaWrapper
                    control={employeeForm.control}
                    name="notes"
                    label="Notes"
                    rows={4}
                    value={""}
                  />
                </div>
                <FormSubheader header={"Miscellaneous"} />
                <CustomFieldsWrapper
                  control={employeeForm.control}
                  name="miscellaneous"
                  label="Custom Fields"
                  maxFields={2}
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
                      value={""}
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
                      label="Labour Rate"
                      type="number"
                      value={""}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={employeeForm.control}
                      name="billing_rate"
                      label="Billing Rate"
                      type="number"
                      value={""}
                    />
                  </div>
                  <div className="col-span-1">
                    <SelectWrapper
                      control={employeeForm.control}
                      name="location_id"
                      label="Location "
                      required
                      options={locationOptionsList ?? []}
                    />
                  </div>

                  <div className="col-span-1">
                    <SelectWrapper
                      control={employeeForm.control}
                      name="category_id"
                      label="Category "
                      required
                      options={categoryOptions ?? []}
                    />
                  </div>
                </div>
                <FormSubheader header={"Driver's License "} />

                <InputWrapper
                  control={employeeForm.control}
                  name="driver_license_number"
                  label="Number"
                  type="text"
                  value={""}
                />
                <InputWrapper
                  control={employeeForm.control}
                  name="driver_license_class"
                  label="Class"
                  type="text"
                  value={""}
                />
                <InputWrapper
                  control={employeeForm.control}
                  name="driver_license_state"
                  label="State/Province"
                  type="text"
                  value={""}
                />
              </div>
            </TabsContent>
            <TabsContent value="renewals">
              <div className="flex flex-col gap-4">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      setEditingId(null);
                      setOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Renewal
                  </Button>
                </div>

                <Modal
                  open={open}
                  onOpenChange={(val) => {
                    setOpen(val);
                    if (!val) setEditingId(null);
                  }}
                  title={editingId ? "Edit Renewal" : "Add Renewal"}
                  description={
                    editingId
                      ? "Update the details of this employee renewal."
                      : "Fill out the information below to add a renewal for this employee."
                  }
                  closeable={true}
                  renderActions={
                    <Button form="renewal-form" type="submit" variant="primary">
                      {editingId ? "Update Renewal" : "Add Renewal"}
                    </Button>
                  }
                >
                  <RenewalFormContent
                    formId="renewal-form"
                    key={editingId || "new"}
                    onSubmit={handleAddRenewal}
                    editingRenewal={
                      editingId
                        ? renewals.find((r) => r.id === editingId)
                        : undefined
                    }
                  />
                </Modal>

                {renewals.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Renewal</TableHead>
                        <TableHead>Issued</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {renewals.map((data) => {
                        const renewalName =
                          renewalOptionsList?.find((r) => r.id === data.renewal_id)?.name ||
                          data.renewal_id;
                        return (
                          <TableRow key={data.id}>
                            <TableCell>{renewalName}</TableCell>
                            <TableCell>
                              {data.issued_date
                                ? new Date(data.issued_date).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {data.expiry_date
                                ? new Date(data.expiry_date).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell>{data.notes || "-"}</TableCell>
                            <TableCell className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                type="button"
                                onClick={() => handleEditRenewal(data.id)}
                              >
                                <Pen className="h-4 w-4 text-blue-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                type="button"
                                onClick={() => handleDeleteRenewal(data.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No renewals added yet
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {!hideSubmitButton && (
            <div className="flex justify-between gap-x-4 my-8 w-full">
              <Button className="w-full" type="submit" disabled={isPending}>
                <GitPullRequestArrow className="mr-2" /> Save
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}

interface RenewalFormContentProps {
  formId?: string;
  onSubmit: (data: RenewalData) => void;
  editingRenewal?: RenewalData;
}

function RenewalFormContent({
  formId = "renewal-form",
  onSubmit,
  editingRenewal,
}: RenewalFormContentProps) {
  const { data: renewalOptionsList } = useGetEmployeeRenewals();

  const form = useForm<Omit<RenewalData, "id">>({
    defaultValues: editingRenewal
      ? {
          renewal_id: editingRenewal.renewal_id || "",
          issued_date: editingRenewal.issued_date
            ? new Date(editingRenewal.issued_date)
            : new Date(),
          expiry_date: editingRenewal.expiry_date
            ? new Date(editingRenewal.expiry_date)
            : new Date(),
          notes: editingRenewal.notes || "",
        }
      : {
          renewal_id: "",
          issued_date: new Date(),
          expiry_date: new Date(),
          notes: "",
        },
  });

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit((data) => {
          if (data.renewal_id && data.issued_date && data.expiry_date) {
            onSubmit({
              id: editingRenewal?.id || crypto.randomUUID(),
              renewal_id: data.renewal_id,
              issued_date: data.issued_date,
              expiry_date: data.expiry_date,
              notes: data.notes || "",
            });
            form.reset();
          } else {
            toast.error("Please fill in all required fields");
          }
        })}
        className="flex flex-col gap-1 py-1"
      >
        <SelectWrapper
          control={form.control}
          name="renewal_id"
          label="Renewal Type"
          options={renewalOptionsList ?? []}
          required
        />
        <DatePickerWrapper
          control={form.control}
          name="issued_date"
          label="Date Issued"
          required
        />
        <DatePickerWrapper
          control={form.control}
          name="expiry_date"
          label="Date Expired"
          required
        />
        <InputWrapper
          control={form.control}
          name="notes"
          label="Notes"
          type="text"
          value=""
        />
      </form>
    </Form>
  );
}
