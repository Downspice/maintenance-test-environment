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
  useGetEmployeeStatuses,
  useGetEmployeeTypes,
  useUpdateEmployeeCategory,
} from "@/services/setups/employee";
import { useGetLocations } from "@/services/setups/vendor";

// Define the form schema with Zod
export const employeeSchema = z.object({
  id: z.string().optional(),
  last_name: z.string().optional(),
  first_name: z.string().optional(),
  middle_name: z.string().optional(),
  address_one: z.string().optional(),
  address_two: z.string().optional(),
  city: z.string().optional(),
  state: z.string(),
  postal_code: z.string().optional(),
  home_contact: z.string(),
  alt_phone: z.string().optional(),
  cell: z.string(),
  email: z.string().optional(),
  status_id: z.string(),
  hire_date: z.date(),
  leave_date: z.date(),
  dob: z.date(),
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
  created_by: z.string().optional(),
  updated_by: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export default function NewEmployeeForm() {
  const [customFields, setCustomFields] = useState<
    { name: string; value: string }[]
  >([]);

  const [open, setOpen] = useState(false);

  const employeeForm = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {},
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

  async function handleSubmit(data: z.infer<typeof employeeSchema>) {
    // console.log(data);
    console.log(data);
    // Here you would typically send the data to your API
    toast.success("Edited  successfully!");
    const res = await mutateAsync(data);
    toast.success(res?.message);
    employeeForm.reset();
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
                    {" "}
                    <InputWrapper
                      control={employeeForm.control}
                      name="home_contact"
                      label="Home "
                      type="number"
                      value={" "}
                      className="col-span-1"
                    />{" "}
                  </div>
                  <div className="col-span-1">
                    {" "}
                    <InputWrapper
                      control={employeeForm.control}
                      name="altPhone"
                      label="Alt. Phone "
                      type="number"
                      value={""}
                      className="col-span-1"
                    />{" "}
                  </div>
                  <div className="col-span-1">
                    {" "}
                    <InputWrapper
                      control={employeeForm.control}
                      name="cell"
                      label="Cell"
                      type="number"
                      value={""}
                    />{" "}
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
                  name="customFields"
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
                  options={statusOptions??[]}
                />
                <div className="grid grid-cols-2 gap-1">
                  <div className="col-span-1">
                    {" "}
                    <DatePickerWrapper
                      control={employeeForm.control}
                      name="hire_date"
                      label="Date"
                    />{" "}
                  </div>
                  <div className="col-span-1">
                    {" "}
                    <DatePickerWrapper
                      control={employeeForm.control}
                      name="leave_date"
                      label="Leave Date"
                    />{" "}
                  </div>
                  <div className="col-span-1">
                    {" "}
                    <DatePickerWrapper
                      control={employeeForm.control}
                      name="dob"
                      label="DOB"
                    />{" "}
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
                    {" "}
                    <InputWrapper
                      control={employeeForm.control}
                      name="labor_rate"
                      label="Labour Rate"
                      type="number"
                      value={""}
                    />
                  </div>
                  <div className="col-span-1">
                    {" "}
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
                      options={locationOptionsList??[]}
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
                  name="driverNumber"
                  label="Number"
                  type="text"
                  value={""}
                />
                <InputWrapper
                  control={employeeForm.control}
                  name="driverClass"
                  label="Class"
                  type="text"
                  value={""}
                />
                <InputWrapper
                  control={employeeForm.control}
                  name="state"
                  label="State/Province"
                  type="text"
                  value={""}
                />
                <TextareaWrapper
                  control={employeeForm.control}
                  name="notes"
                  label="Notes"
                  rows={4}
                  value={""}
                />
              </div>
            </TabsContent>
            <TabsContent value="renewals">
              <div className="flex items-end space-y-2 flex-col">
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button className="w-fit">
                      <Plus />
                      Create New
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-3/4">
                    <SheetHeader>
                      <SheetTitle>Create Renewal</SheetTitle>
                      <SheetDescription>
                        Fill out the form below to create a new Renewal.
                      </SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
                      <UpdateEmployeeRenewalForm />
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
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
                    {renewalData.map((data) => (
                      <TableRow key={data.id}>
                        <TableCell>{data.renewalName}</TableCell>
                        <TableCell>{data.dateIssued}</TableCell>
                        <TableCell>{data.dateExpired}</TableCell>
                        <TableCell>{data.notes}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteContact(data.renewalName)
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteContact(data.renewalName)
                            }
                          >
                            <Pen className="h-4 w-4 text-blue-400" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                        {locationOptionsList.map((location) => (
                          <SelectItem
                            key={location.value}
                            value={location.value}
                          >
                            {location.label}
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
                    <div className="grid grid-cols-4" key={equipment.value}>
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

          <div className="flex justify-between gap-x-4 my-8 w-full">
            <Button className=" w-full">
              <GitPullRequestArrow className="mr-2" /> Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

const renewalData = [
  {
    id: 1,
    renewalName: "Pesticide Applicator",
    dateIssued: "2023-05-12",
    dateExpired: "2026-05-11",
    notes: "Renew before expiry for seamless operations",
  },
  {
    id: 2,
    renewalName: "Hazardous Materials",
    dateIssued: "2022-08-20",
    dateExpired: "2025-08-20",
  },
  {
    id: 3,
    renewalName: "Safety Materials",
    dateIssued: "2024-01-15",
    dateExpired: "2027-01-14",
    notes: "Requires annual safety audit",
  },
  {
    id: 4,
    renewalName: "Pesticide Applicator",
    dateIssued: "2021-11-30",
    dateExpired: "2024-11-29",
  },
  {
    id: 5,
    renewalName: "Hazardous Materials",
    dateIssued: "2023-03-10",
    dateExpired: "2026-03-10",
    notes: "Handled by environmental compliance team",
  },
];

interface RenewalItem {
  id: number;
  renewalName: string;
  dateIssued: string; // Format: YYYY-MM-DD
  dateExpired: string; // Format: YYYY-MM-DD
  notes?: string;
}

const handleDeleteContact = (contactId: string) => {
  console.log("Delete contact:", contactId);
};
