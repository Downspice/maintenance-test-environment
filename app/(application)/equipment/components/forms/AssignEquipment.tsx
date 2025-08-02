import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import RadioGroupWrapper from "@/components/forms/wrappers/RadioGroupWrapper";
import SingleCheckboxWrapper from "@/components/forms/wrappers/SingleCheckboxWrapper";
import Fieldset from "@/components/customUI/fieldset";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import { EditableDataTable } from "@/components/customUI/editableTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import FluidConsumedForm, { EditFluidConsumption } from "./FluidConsumed";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

// Example options (replace with your actual options)
const equipmentOptions = [{ label: "Excavator", value: "excavator" }];
const assignmentTypeOptions = [
  { label: "Job Site", value: "jobSite" },
  { label: "Employee", value: "employee" },
  { label: "Customer", value: "customer" },
];
const employeeOptions = [{ label: "John Doe", value: "john" }];
const jobOptions = [{ label: "Site A", value: "siteA" }];
const customerOptions = [{ label: "Acme Corp", value: "acme" }];
const destinationOptions = [{ label: "Yard", value: "yard" }];
const typeOptions = [{ label: "Type 1", value: "type1" }];
const stateOptions = [{ label: "CA", value: "CA" }];
const perOptions = [
  { label: "Hour", value: "hour" },
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
];

// Fuel Table Schema
const fuelTableSchema = z.object({
  date: z.string().min(1),
  consumed: z.coerce.number().min(0),
  price: z.coerce.number().min(0),
  totalCost: z.coerce.number().min(0),
  state: z.string().optional(),
});

// Misc Table Schema
const miscTableSchema = z.object({
  description: z.string().min(1),
  cost: z.coerce.number().min(0),
});

// Main Form Schema
export const assignEquipmentSchema = z.object({
  equipment: z.string().min(1, "Equipment is required"),
  assignmentType: z.enum(["jobSite", "employee", "customer"]),
  employee: z.string().optional(),
  job: z.string().optional(),
  customer: z.string().optional(),
  // Duration
  outDate: z.string().min(1),
  inDate: z.string().min(1),
  outTime: z.string().min(1),
  inTime: z.string().min(1),
  outHour: z.coerce.number().min(0),
  inHour: z.coerce.number().min(0),
  assignedPeriod: z.coerce.number().min(0),
  excludeWeekend: z.boolean().optional(),
  // Optional Details
  destination: z.string().optional(),
  type: z.string().optional(),
  state: z.string().optional(),
  rate: z.coerce.number().optional(),
  per: z.string().optional(),
  total: z.coerce.number().optional(),
  // Expenses
  fuel: z.array(fuelTableSchema).optional(),
  misc: z.array(miscTableSchema).optional(),
  // Notes
  notes: z.string().optional(),
});

type AssignEquipmentFormValues = z.infer<typeof assignEquipmentSchema>;

export default function AssignEquipmentForm() {
  const [excludeWeekend, setExcludeWeekend] = useState(false);

  const form = useForm<AssignEquipmentFormValues>({
    resolver: zodResolver(assignEquipmentSchema),
    defaultValues: {
      equipment: "",
      assignmentType: "jobSite",
      employee: "",
      job: "",
      customer: "",
      outDate: "",
      inDate: "",
      outTime: "",
      inTime: "",
      outHour: 0,
      inHour: 0,
      assignedPeriod: 0,
      excludeWeekend: false,
      destination: "",
      type: "",
      state: "",
      rate: 0,
      per: "",
      total: 0,
      fuel: [],
      misc: [],
      notes: "",
    },
  });

  const {
    fields: fuelFields,
    append: appendFuel,
    remove: removeFuel,
  } = useFieldArray({
    control: form.control,
    name: "fuel",
  });

  const {
    fields: miscFields,
    append: appendMisc,
    remove: removeMisc,
  } = useFieldArray({
    control: form.control,
    name: "misc",
  });

  // Calculate assigned period (days between outDate and inDate, minus weekends if excludeWeekend)
  function calculateAssignedPeriod(
    outDate: string,
    inDate: string,
    excludeWeekend: boolean
  ) {
    if (!outDate || !inDate) return 0;
    const start = new Date(outDate);
    const end = new Date(inDate);
    let days = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (excludeWeekend) {
        if (d.getDay() !== 0 && d.getDay() !== 6) days++;
      } else {
        days++;
      }
    }
    return days;
  }

  // Watch for date changes and update assignedPeriod
  const outDate = form.watch("outDate");
  const inDate = form.watch("inDate");
  useEffect(() => {
    if (outDate && inDate) {
      form.setValue(
        "assignedPeriod",
        calculateAssignedPeriod(outDate, inDate, excludeWeekend)
      );
    }
  }, [outDate, inDate, excludeWeekend]);

  function onSubmit(data: AssignEquipmentFormValues) {
    // Submit logic
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="assignment">
          <TabsList>
            <TabsTrigger value="assignment">Assignment</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="assignment" className="space-y-2">
            <ComboboxFieldWrapper
              control={form.control}
              name="equipment"
              label="Equipment"
              options={equipmentOptions}
            />
            <RadioGroupWrapper
              control={form.control}
              name="assignmentType"
              label="Assignment Type"
              options={assignmentTypeOptions}
              //   onChange={(v) => setAssignmentType(v)}
              onChange={(v) => console.log(v)}
            />
            {form.watch("assignmentType") === "employee" && (
              <ComboboxFieldWrapper
                control={form.control}
                name="employee"
                label="Employee"
                options={employeeOptions}
              />
            )}
            {form.watch("assignmentType") === "jobSite" && (
              <ComboboxFieldWrapper
                control={form.control}
                name="job"
                label="Job"
                options={jobOptions}
              />
            )}
            {form.watch("assignmentType") === "customer" && (
              <ComboboxFieldWrapper
                control={form.control}
                name="customer"
                label="Customer"
                options={customerOptions}
              />
            )}
            <Fieldset
              legend="Duration"
              content={
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <DatePickerWrapper
                        control={form.control}
                        name="outDate"
                        label="Out Date"
                      />
                      <DatePickerWrapper
                        control={form.control}
                        name="inDate"
                        label="In Date"
                      />
                    </div>
                    <div>
                      <InputWrapper
                        control={form.control}
                        name="outTime"
                        label="Out Time"
                      />
                      <InputWrapper
                        control={form.control}
                        name="inTime"
                        label="In Time"
                      />
                    </div>
                    <div>
                      <InputWrapper
                        control={form.control}
                        name="outHour"
                        label="Out Hour"
                        type="number"
                      />
                      <InputWrapper
                        control={form.control}
                        name="inHour"
                        label="In Hour"
                        type="number"
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span>Assigned Period: </span>
                    <span>{form.watch("assignedPeriod")}</span>
                  </div>
                  <SingleCheckboxWrapper
                    control={form.control}
                    name="excludeWeekend"
                    label="Exclude Weekend"
                    checked={excludeWeekend}
                    onCheckedChange={(checked) => setExcludeWeekend(!!checked)}
                  />
                </>
              }
            />
            <Fieldset
              legend="Optional Details"
              content={
                <>
                  {form.watch("assignmentType") === "jobSite" && (
                    <>
                      <ComboboxFieldWrapper
                        control={form.control}
                        name="type"
                        label="Type"
                        options={typeOptions}
                      />
                      <ComboboxFieldWrapper
                        control={form.control}
                        name="state"
                        label="State/Prov"
                        options={stateOptions}
                      />
                      <InputWrapper
                        control={form.control}
                        name="rate"
                        label="Rate"
                        type="number"
                      />
                      <ComboboxFieldWrapper
                        control={form.control}
                        name="per"
                        label="Per"
                        options={perOptions}
                      />
                      <InputWrapper
                        control={form.control}
                        name="total"
                        label="Total"
                        type="number"
                        value={form.watch("total")}
                        disabled
                      />
                    </>
                  )}
                  {form.watch("assignmentType") === "customer" && (
                    <>
                      <ComboboxFieldWrapper
                        control={form.control}
                        name="type"
                        label="Type"
                        options={typeOptions}
                      />
                      <ComboboxFieldWrapper
                        control={form.control}
                        name="state"
                        label="State/Prov"
                        options={stateOptions}
                      />
                      <InputWrapper
                        control={form.control}
                        name="rate"
                        label="Rate"
                        type="number"
                      />
                      <ComboboxFieldWrapper
                        control={form.control}
                        name="per"
                        label="Per"
                        options={perOptions}
                      />
                      <InputWrapper
                        control={form.control}
                        name="total"
                        label="Total"
                        type="number"
                        value={form.watch("total")}
                        disabled
                      />
                    </>
                  )}
                  {form.watch("assignmentType") === "employee" && (
                    <>
                      <ComboboxFieldWrapper
                        control={form.control}
                        name="destination"
                        label="Destination"
                        options={destinationOptions}
                      />
                      <ComboboxFieldWrapper
                        control={form.control}
                        name="type"
                        label="Type"
                        options={typeOptions}
                      />
                      <ComboboxFieldWrapper
                        control={form.control}
                        name="state"
                        label="State/Prov"
                        options={stateOptions}
                      />
                    </>
                  )}
                </>
              }
            />
          </TabsContent>
          <TabsContent value="expenses" className="space-y-2">
            <Fieldset
              legend="Fuel"
              content={
                <>
                  <div className="flex justify-end mb-2">
                    <AddFluidConsumedInEquipment
                      log={(fuel) => {
                        // Handle edit logic
                        console.log("Edited data:", fuel);
                      }}
                    />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Consumed</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total Cost</TableHead>
                        <TableHead>State/Prov</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fuelFields.map((fuel, index) => (
                        <TableRow key={index}>
                          <TableCell>{fuel.date}</TableCell>
                          <TableCell>{fuel.consumed}</TableCell>
                          <TableCell>{fuel.price}</TableCell>
                          <TableCell>{fuel.totalCost}</TableCell>
                          <TableCell>{fuel.state}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <EditFluidConsumption
                                children={
                                  <Button size="icon" variant="outline">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                }
                                data={fuel}
                                onEdit={(fuel) => {
                                  // Handle edit logic
                                  console.log("Edited data:", fuel);
                                }}
                              />

                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeFuel(index)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              }
            />
            <Fieldset
              legend="Miscellaneous"
              content={
                <>
                  <EditableDataTable
                    columns={[
                      {
                        header: "Description",
                        accessorKey: "description",
                        cell: ({ row, updateRow, rowIndex }: any) => (
                          <Input
                            value={row.original.description}
                            onChange={(e) =>
                              updateRow(rowIndex, "description", e.target.value)
                            }
                          />
                        ),
                      },
                      {
                        header: "Cost",
                        accessorKey: "cost",
                        cell: ({ row, updateRow, rowIndex }: any) => (
                          <Input
                            value={row.original.cost}
                            onChange={(e) =>
                              updateRow(rowIndex, "cost", e.target.value)
                            }
                          />
                        ),
                      },
                      {
                        header: "Actions",
                        cell: ({ row }: any) => (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              type="button"
                              variant="destructive"
                              onClick={() => removeMisc(row.index)}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        ),
                      },
                    ]}
                    data={miscFields}
                    defaultRow={{ description: "" }}
                  />
                </>
              }
            />
          </TabsContent>
          <TabsContent value="notes" className="space-y-2">
            <TextareaWrapper
              control={form.control}
              name="notes"
              label="Notes"
            />
          </TabsContent>
        </Tabs>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export function AddFluidConsumedInEquipment({
  log,
}: {
  log: (data: FluidConsumedFormValues) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Add</Button>
      </SheetTrigger>
      <SheetContent className="w-1/4">
        <SheetHeader>
          <SheetTitle>Add New Fuel</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <FluidConsumedForm onCreate={log} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export function EditAssignEquipmentForm({
  children,
  data,
  onEdit, // optional callback
}: {
  children: React.ReactNode;
  data: AssignEquipmentFormValues;
  onEdit?: (data: AssignEquipmentFormValues) => void; // optional
}) {
  const [open, setOpen] = useState(false);
  const [excludeWeekend, setExcludeWeekend] = useState(false);

  const form = useForm<AssignEquipmentFormValues>({
    resolver: zodResolver(assignEquipmentSchema),
    defaultValues: data,
  });

  const {
    fields: fuelFields,
    append: appendFuel,
    remove: removeFuel,
  } = useFieldArray({
    control: form.control,
    name: "fuel",
  });

  const {
    fields: miscFields,
    append: appendMisc,
    remove: removeMisc,
  } = useFieldArray({
    control: form.control,
    name: "misc",
  });

  // Calculate assigned period (days between outDate and inDate, minus weekends if excludeWeekend)
  function calculateAssignedPeriod(
    outDate: string,
    inDate: string,
    excludeWeekend: boolean
  ) {
    if (!outDate || !inDate) return 0;
    const start = new Date(outDate);
    const end = new Date(inDate);
    let days = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (excludeWeekend) {
        if (d.getDay() !== 0 && d.getDay() !== 6) days++;
      } else {
        days++;
      }
    }
    return days;
  }

  // Watch for date changes and update assignedPeriod
  const outDate = form.watch("outDate");
  const inDate = form.watch("inDate");
  useEffect(() => {
    if (outDate && inDate) {
      form.setValue(
        "assignedPeriod",
        calculateAssignedPeriod(outDate, inDate, excludeWeekend)
      );
    }
  }, [outDate, inDate, excludeWeekend]);

  function onSubmit(data: AssignEquipmentFormValues) {
    // Submit logic
    console.log(data);
    onEdit?.(data); // Call the optional callback if provided
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-3/4 ">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>Edit Fluid consumption</div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <Tabs defaultValue="assignment">
                  <TabsList>
                    <TabsTrigger value="assignment">Assignment</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="assignment" className="space-y-2">
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="equipment"
                      label="Equipment"
                      options={equipmentOptions}
                    />
                    <RadioGroupWrapper
                      control={form.control}
                      name="assignmentType"
                      label="Assignment Type"
                      options={assignmentTypeOptions}
                      //   onChange={(v) => setAssignmentType(v)}
                      onChange={(v) => console.log(v)}
                    />
                    {form.watch("assignmentType") === "employee" && (
                      <ComboboxFieldWrapper
                        control={form.control}
                        name="employee"
                        label="Employee"
                        options={employeeOptions}
                      />
                    )}
                    {form.watch("assignmentType") === "jobSite" && (
                      <ComboboxFieldWrapper
                        control={form.control}
                        name="job"
                        label="Job"
                        options={jobOptions}
                      />
                    )}
                    {form.watch("assignmentType") === "customer" && (
                      <ComboboxFieldWrapper
                        control={form.control}
                        name="customer"
                        label="Customer"
                        options={customerOptions}
                      />
                    )}
                    <Fieldset
                      legend="Duration"
                      content={
                        <>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <DatePickerWrapper
                                control={form.control}
                                name="outDate"
                                label="Out Date"
                              />
                              <DatePickerWrapper
                                control={form.control}
                                name="inDate"
                                label="In Date"
                              />
                            </div>
                            <div>
                              <InputWrapper
                                control={form.control}
                                name="outTime"
                                label="Out Time"
                              />
                              <InputWrapper
                                control={form.control}
                                name="inTime"
                                label="In Time"
                              />
                            </div>
                            <div>
                              <InputWrapper
                                control={form.control}
                                name="outHour"
                                label="Out Hour"
                                type="number"
                              />
                              <InputWrapper
                                control={form.control}
                                name="inHour"
                                label="In Hour"
                                type="number"
                              />
                            </div>
                          </div>
                          <div className="mt-2">
                            <span>Assigned Period: </span>
                            <span>{form.watch("assignedPeriod")}</span>
                          </div>
                          <SingleCheckboxWrapper
                            control={form.control}
                            name="excludeWeekend"
                            label="Exclude Weekend"
                            checked={excludeWeekend}
                            onCheckedChange={(checked) =>
                              setExcludeWeekend(!!checked)
                            }
                          />
                        </>
                      }
                    />
                    <Fieldset
                      legend="Optional Details"
                      content={
                        <>
                          {form.watch("assignmentType") === "jobSite" && (
                            <>
                              <ComboboxFieldWrapper
                                control={form.control}
                                name="type"
                                label="Type"
                                options={typeOptions}
                              />
                              <ComboboxFieldWrapper
                                control={form.control}
                                name="state"
                                label="State/Prov"
                                options={stateOptions}
                              />
                              <InputWrapper
                                control={form.control}
                                name="rate"
                                label="Rate"
                                type="number"
                              />
                              <ComboboxFieldWrapper
                                control={form.control}
                                name="per"
                                label="Per"
                                options={perOptions}
                              />
                              <InputWrapper
                                control={form.control}
                                name="total"
                                label="Total"
                                type="number"
                                value={form.watch("total")}
                                disabled
                              />
                            </>
                          )}
                          {form.watch("assignmentType") === "customer" && (
                            <>
                              <ComboboxFieldWrapper
                                control={form.control}
                                name="type"
                                label="Type"
                                options={typeOptions}
                              />
                              <ComboboxFieldWrapper
                                control={form.control}
                                name="state"
                                label="State/Prov"
                                options={stateOptions}
                              />
                              <InputWrapper
                                control={form.control}
                                name="rate"
                                label="Rate"
                                type="number"
                              />
                              <ComboboxFieldWrapper
                                control={form.control}
                                name="per"
                                label="Per"
                                options={perOptions}
                              />
                              <InputWrapper
                                control={form.control}
                                name="total"
                                label="Total"
                                type="number"
                                value={form.watch("total")}
                                disabled
                              />
                            </>
                          )}
                          {form.watch("assignmentType") === "employee" && (
                            <>
                              <ComboboxFieldWrapper
                                control={form.control}
                                name="destination"
                                label="Destination"
                                options={destinationOptions}
                              />
                              <ComboboxFieldWrapper
                                control={form.control}
                                name="type"
                                label="Type"
                                options={typeOptions}
                              />
                              <ComboboxFieldWrapper
                                control={form.control}
                                name="state"
                                label="State/Prov"
                                options={stateOptions}
                              />
                            </>
                          )}
                        </>
                      }
                    />
                  </TabsContent>
                  <TabsContent value="expenses" className="space-y-2">
                    <Fieldset
                      legend="Fuel"
                      content={
                        <>
                          <div className="flex justify-end mb-2">
                            <AddFluidConsumedInEquipment
                              log={(fuel) => {
                                // Handle edit logic
                                console.log("Edited data:", fuel);
                              }}
                            />
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Consumed</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Total Cost</TableHead>
                                <TableHead>State/Prov</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {fuelFields.map((fuel, index) => (
                                <TableRow key={index}>
                                  <TableCell>{fuel.date}</TableCell>
                                  <TableCell>{fuel.consumed}</TableCell>
                                  <TableCell>{fuel.price}</TableCell>
                                  <TableCell>{fuel.totalCost}</TableCell>
                                  <TableCell>{fuel.state}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <EditFluidConsumption
                                        children={
                                          <Button size="icon" variant="outline">
                                            <Pencil className="h-4 w-4" />
                                          </Button>
                                        }
                                        data={fuel}
                                        onEdit={(fuel) => {
                                          // Handle edit logic
                                          console.log("Edited data:", fuel);
                                        }}
                                      />

                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => removeFuel(index)}
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </>
                      }
                    />
                    <Fieldset
                      legend="Miscellaneous"
                      content={
                        <>
                          <EditableDataTable
                            columns={[
                              {
                                header: "Description",
                                accessorKey: "description",
                                cell: ({ row, updateRow, rowIndex }: any) => (
                                  <Input
                                    value={row.original.description}
                                    onChange={(e) =>
                                      updateRow(
                                        rowIndex,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                  />
                                ),
                              },
                              {
                                header: "Cost",
                                accessorKey: "cost",
                                cell: ({ row, updateRow, rowIndex }: any) => (
                                  <Input
                                    value={row.original.cost}
                                    onChange={(e) =>
                                      updateRow(
                                        rowIndex,
                                        "cost",
                                        e.target.value
                                      )
                                    }
                                  />
                                ),
                              },
                              {
                                header: "Actions",
                                cell: ({ row }: any) => (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      type="button"
                                      variant="destructive"
                                      onClick={() => removeMisc(row.index)}
                                    >
                                      <Trash2 />
                                    </Button>
                                  </div>
                                ),
                              },
                            ]}
                            data={miscFields}
                            defaultRow={{ description: "" }}
                          />
                        </>
                      }
                    />
                  </TabsContent>
                  <TabsContent value="notes" className="space-y-2">
                    <TextareaWrapper
                      control={form.control}
                      name="notes"
                      label="Notes"
                    />
                  </TabsContent>
                </Tabs>
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
