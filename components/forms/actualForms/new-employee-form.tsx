"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow, Pen, Plus, Trash2 } from "lucide-react";
import TextareaWrapper from "../wrappers/TextareaWrapper";
import { toast } from "sonner";
import InputWrapper from "../wrappers/InputWrapper";
import { categoryOptions } from "@/lib/equipment-schema";
import SelectWrapper from "../wrappers/SelectWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EmployeeCheckboxOptions,
  equipmentOptionsList,
} from "@/lib/option-list";
import FormSubheader from "../ui/formSubheader";
import CustomFieldsWrapper from "../wrappers/CustomFieldsWrapper";
import DatePickerWrapper from "../wrappers/DatePickerWrapper";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUploadWrapper from "../wrappers/FileUploadWrapper";
import CheckboxWrapper from "../wrappers/CheckboxWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UpdateEmployeeRenewalForm from "./update-employee";
import { useSheet } from "@/lib/sheet-providers";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useAddEmployee,
  useGetEmployeeCategories,
  useGetEmployeeRenewals,
  useGetEmployeeStatuses,
  useGetEmployeeTypes,
  useUpdateEmployeeCategory,
} from "@/services/setups/employee";
import { useGetLocations } from "@/services/setups/vendor";

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
  last_name: z.string().optional(),
  first_name: z.string().optional(),
  middle_name: z.string().optional(),
  address_one: z.string().optional(),
  city: z.string().optional(),
  state: z.string(),
  postal_code: z.string().optional(),
  home_contact: z.string(),
  alt_phone: z.any().optional(),
  cell: z.string(),
  email: z.string().optional(),
  status_id: z.string(),
  hire_date: z.any(),
  leave_date: z.any(),
  dob: z.any(),
  ssn: z.string().optional(),
  type_id: z.string().optional(),
  labor_rate: z.string(),
  billing_rate: z.string(),
  currency: z.string().optional(),
  location_id: z.string(),
  category_id: z.string(),
  driver_license_number: z.string().optional(),
  driver_license_class: z.string().optional(),
  driver_license_state: z.string().optional(),
  notes: z.string().optional(),
  renewals: z.array(
    z.object({
      renewal_id: z.string(),
      issued_date: z.any(),
      expiry_date: z.any(),
      notes: z.string().optional(),
    })
  ).optional(),
});

export default function NewEmployeeForm() {
  const [miscellaneous, setCustomFields] = useState<
    { name: string; value: string }[]
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
  const { mutateAsync, isPending } = useAddEmployee();

  const handleAddRenewal = (newRenewal: RenewalData) => {
    if (editingId) {
      setRenewals(renewals.map(r => r.id === editingId ? newRenewal : r));
      setEditingId(null);
    } else {
      setRenewals([...renewals, newRenewal]);
    }
    employeeForm.setValue("renewals", [...renewals, newRenewal]);
    setOpen(false);
    toast.success(editingId ? "Renewal updated" : "Renewal added");
  };

  const handleDeleteRenewal = (id: string) => {
    const updated = renewals.filter(r => r.id !== id);
    setRenewals(updated);
    employeeForm.setValue("renewals", updated);
    toast.success("Renewal removed");
  };

  const handleEditRenewal = (id: string) => {
    setEditingId(id);
    setOpen(true);
  };

  async function handleSubmit(data: z.infer<typeof employeeSchema>) {
    console.log(data);
    const res = await mutateAsync(data);
    toast.success(res?.message);
    employeeForm.reset();
    setRenewals([]);
  }

  return (
    <div className="w-full">
      <Form {...employeeForm}>
        <form
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
          <Tabs defaultValue="general" className="w-full">
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
                <div className="flex flex-row">
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <InputWrapper
                      control={employeeForm.control}
                      name="city"
                      label="City"
                      type="text"
                      value={""}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={employeeForm.control}
                      name="state"
                      label="State /Province"
                      type="text"
                      value={""}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={employeeForm.control}
                      name="postal_code"
                      label="Postal Code"
                      type="text"
                      value={""}
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
                  <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                      <Button onClick={() => setEditingId(null)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Renewal
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>
                          {editingId ? "Edit Renewal" : "Add Renewal"}
                        </SheetTitle>
                      </SheetHeader>
                      <RenewalFormContent
                        onSubmit={handleAddRenewal}
                        editingRenewal={
                          editingId
                            ? renewals.find(r => r.id === editingId)
                            : undefined
                        }
                      />
                    </SheetContent>
                  </Sheet>
                </div>

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
                      {renewals.map((data) => (
                        <TableRow key={data.id}>
                          <TableCell>{data.renewal_id}</TableCell>
                          <TableCell>
                            {data.issued_date.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {data.expiry_date.toLocaleDateString()}
                          </TableCell>
                          <TableCell>{data.notes || "-"}</TableCell>
                          <TableCell className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditRenewal(data.id)}
                            >
                              <Pen className="h-4 w-4 text-blue-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRenewal(data.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
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
          </Tabs>

          <div className="flex justify-between gap-x-4 my-8 w-full">
            <Button className="w-full" type="submit" disabled={isPending}>
              <GitPullRequestArrow className="mr-2" /> Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
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
    const{data:renewalOptionsList}=useGetEmployeeRenewals()

  const form = useForm({
    defaultValues: editingRenewal || {
      
      renewal_id: "",
      issued_date: new Date(),
      expiry_date: new Date(),
      notes: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          if (data.renewal_id && data.issued_date && data.expiry_date) {
            onSubmit(data as RenewalData);
            form.reset();
          } else {
            toast.error("Please fill in all required fields");
          }
        })}
        className="mt-6 space-y-4"
      >
        <SelectWrapper
          control={form.control}
          name="renewal_id"
          label="Renewal Type"
          options={renewalOptionsList??[]}
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
          value=""
        />
        <Button type="submit" className="w-full">
          {editingRenewal ? "Update Renewal" : "Add Renewal"}
        </Button>
      </form>
    </Form>
  );
}