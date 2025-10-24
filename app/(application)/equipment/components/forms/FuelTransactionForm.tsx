import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CheckboxWrapper from "@/components/forms/wrappers/CheckboxWrapper";
import SingleCheckboxWrapper from "@/components/forms/wrappers/SingleCheckboxWrapper";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import { EditableDataTable } from "@/components/customUI/editableTable";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetVendors } from "@/services/setups/vendor";

// Example options (replace with your actual options)
const equipmentOptions = [{ name: "Excavator", id: "excavator" }];
const fuelTypeOptions = [{ name: "Diesel", id: "diesel" }];
const driverOptions = [{ name: "John Doe", id: "john" }];
const costCentreOptions = [{ name: "Main", id: "main" }];
const stockTankOptions = [{ name: "Tank 1", id: "tank1" }];
const brandOptions = [{ name: "BrandX", id: "brandx" }];
const stateOptions = [{ name: "CA", id: "CA" }];
const expenseOptions = [{ name: "Oil", id: "oil" }];
const partOptions = [{ name: "Filter", id: "filter" }];

// Misc Expense Row Schema
const miscExpenseSchema = z.object({
  equipment: z.string().min(1, "Equipment is required"),
  date: z.string().min(1, "Date is required"),
  hours: z.coerce.number().min(0, "Hours required"),
  expense: z.string().min(1, "Expense is required"),
  specifyPart: z.boolean().optional(),
  part: z.string().optional(),
  costCentre: z.string().min(1, "Cost Centre is required"),
  cost: z.coerce.number().min(0, "Cost required"),
  extendedCost: z.coerce.number().min(0, "Extended cost required"),
  notes: z.string().optional(),
});

// Main Form Schema
export const fuelTransactionSchema = z.object({
  equipment: z.string().min(1, "Equipment is required"),
  date: z.string().min(1, "Date is required"),
  fill: z.coerce.number().min(0, "Fill is required"),
  gallons: z.coerce.number().min(0, "Gallons is required"),
  pricePerGallon: z.coerce.number().min(0, "Price per gallon is required"),
  total: z.coerce.number().min(0, "Total is required"),
  // Optional Details
  fuelType: z.string().optional(),
  vendor: z.string().optional(),
  driver: z.string().optional(),
  costCentre: z.string().optional(),
  stockTank: z.string().optional(),
  brand: z.string().optional(),
  state: z.string().optional(),
  notes: z.string().optional(),
  // Misc Expenses
  miscExpenses: z.array(miscExpenseSchema).optional(),
});

type FuelTransactionFormValues = z.infer<typeof fuelTransactionSchema>;
type MiscExpenseFormValues = z.infer<typeof miscExpenseSchema>;

export default function FuelTransactionForm() {
  const [tab, setTab] = useState("optional");
  const [miscDialogOpen, setMiscDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [specifyPart, setSpecifyPart] = useState(false);
    const { data: vendorOptions } = useGetVendors();

  const form = useForm<FuelTransactionFormValues>({
    resolver: zodResolver(fuelTransactionSchema),
    defaultValues: {
      equipment: "",
      date: "",
      fill: 0,
      gallons: 0,
      pricePerGallon: 0,
      total: 0,
      fuelType: "",
      vendor: "",
      driver: "",
      costCentre: "",
      stockTank: "",
      brand: "",
      state: "",
      notes: "",
      miscExpenses: [],
    },
  });

  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: "miscExpenses",
  });

  // Watch gallons and pricePerGallon to update total
  const gallons = form.watch("gallons");
  const pricePerGallon = form.watch("pricePerGallon");
  useEffect(() => {
    form.setValue("total", gallons * pricePerGallon);
  }, [gallons, pricePerGallon]);

  // Misc Expense Dialog Form State
  const [miscExpense, setMiscExpense] = useState<MiscExpenseFormValues>({
    equipment: "",
    date: "",
    hours: 0,
    expense: "",
    specifyPart: false,
    part: "",
    costCentre: "",
    cost: 0,
    extendedCost: 0,
    notes: "",
  });

  function handleMiscSave() {
    if (editIndex !== null) {
      update(editIndex, miscExpense);
    } else {
      append(miscExpense);
    }
    setMiscDialogOpen(false);
    setEditIndex(null);
    setMiscExpense({
      equipment: "",
      date: "",
      hours: 0,
      expense: "",
      specifyPart: false,
      part: "",
      costCentre: "",
      cost: 0,
      extendedCost: 0,
      notes: "",
    });
    setSpecifyPart(false);
  }

  function handleMiscEdit(idx: number) {
    setEditIndex(idx);
    setMiscExpense(fields[idx]);
    setSpecifyPart(!!fields[idx].specifyPart);
    setMiscDialogOpen(true);
  }

  function handleMiscDelete(idx: number) {
    remove(idx);
  }

  function onSubmit(data: FuelTransactionFormValues) {
    // Submit logic
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
        <ComboboxFieldWrapper
          control={form.control}
          name="equipment"
          label="Equipment"
          options={equipmentOptions}
        />
        <DatePickerWrapper control={form.control} name="date" label="Date" />
        <InputWrapper
          control={form.control}
          name="fill"
          label="Fill"
          type="number"
        />
        <InputWrapper
          control={form.control}
          name="gallons"
          label="Gallons"
          type="number"
        />
        <InputWrapper
          control={form.control}
          name="pricePerGallon"
          label="Price Per Gallon"
          type="number"
        />
        <InputWrapper
          control={form.control}
          name="total"
          label="Total"
          type="number"
          value={form.watch("total")}
          disabled
        />

        <Tabs defaultValue="optional" value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="optional">Optional Details</TabsTrigger>
            <TabsTrigger value="misc">Misc Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value="optional" className="space-y-2">
            <ComboboxFieldWrapper
              control={form.control}
              name="fuelType"
              label="Fuel Type"
              options={fuelTypeOptions}
            />
            <ComboboxFieldWrapper
              control={form.control}
              name="vendor"
              label="Vendor"
              options={vendorOptions}
            />
            <ComboboxFieldWrapper
              control={form.control}
              name="driver"
              label="Driver"
              options={driverOptions}
            />
            <ComboboxFieldWrapper
              control={form.control}
              name="costCentre"
              label="Cost Centre"
              options={costCentreOptions}
            />
            <ComboboxFieldWrapper
              control={form.control}
              name="stockTank"
              label="Stock Tank"
              options={stockTankOptions}
            />
            <ComboboxFieldWrapper
              control={form.control}
              name="brand"
              label="Brand"
              options={brandOptions}
            />
            <ComboboxFieldWrapper
              control={form.control}
              name="state"
              label="State"
              options={stateOptions}
            />
            <TextareaWrapper
              control={form.control}
              name="notes"
              label="Notes"
            />
          </TabsContent>
          <TabsContent value="misc" className="space-y-2">
            <div className="flex justify-end mb-2">
              <Dialog open={miscDialogOpen} onOpenChange={setMiscDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button" onClick={() => setMiscDialogOpen(true)}>
                    Add Misc Expense
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>
                    {editIndex !== null
                      ? "Edit Misc Expense"
                      : "Add Misc Expense"}
                  </DialogTitle>
                  <div className="space-y-2">
                    <ComboboxFieldWrapper
                      value={miscExpense.equipment}
                      onChange={(v) =>
                        setMiscExpense((e) => ({ ...e, equipment: v }))
                      }
                      name="equipment"
                      label="Equipment"
                      options={equipmentOptions}
                      disabled={editIndex !== null}
                    />
                    <DatePickerWrapper
                      value={miscExpense.date}
                      onChange={(v) =>
                        setMiscExpense((e) => ({ ...e, date: v }))
                      }
                      name="date"
                      label="Date"
                    />
                    <InputWrapper
                      value={miscExpense.hours}
                      onChange={(v) =>
                        setMiscExpense((e) => ({ ...e, hours: Number(v) }))
                      }
                      name="hours"
                      label="Hours"
                      type="number"
                    />
                    <ComboboxFieldWrapper
                      value={miscExpense.expense}
                      onChange={(v) =>
                        setMiscExpense((e) => ({ ...e, expense: v }))
                      }
                      name="expense"
                      label="Expense"
                      options={expenseOptions}
                    />
                    <SingleCheckboxWrapper
                      checked={specifyPart}
                      onCheckedChange={(checked) => {
                        setSpecifyPart(!!checked);
                        setMiscExpense((e) => ({
                          ...e,
                          specifyPart: !!checked,
                          part: checked ? e.part : "",
                        }));
                      }}
                      name="specifyPart"
                      label="Specify Part Used"
                    />
                    {specifyPart && (
                      <ComboboxFieldWrapper
                        value={miscExpense.part}
                        onChange={(v) =>
                          setMiscExpense((e) => ({ ...e, part: v }))
                        }
                        name="part"
                        label="Part"
                        options={partOptions}
                      />
                    )}
                    <ComboboxFieldWrapper
                      value={miscExpense.costCentre}
                      onChange={(v) =>
                        setMiscExpense((e) => ({ ...e, costCentre: v }))
                      }
                      name="costCentre"
                      label="Cost Centre"
                      options={costCentreOptions}
                    />
                    <InputWrapper
                      value={miscExpense.cost}
                      onChange={(v) =>
                        setMiscExpense((e) => ({ ...e, cost: Number(v) }))
                      }
                      name="cost"
                      label="Cost"
                      type="number"
                    />
                    <InputWrapper
                      value={miscExpense.extendedCost}
                      onChange={(v) =>
                        setMiscExpense((e) => ({
                          ...e,
                          extendedCost: Number(v),
                        }))
                      }
                      name="extendedCost"
                      label="Extended Cost"
                      type="number"
                    />
                    <TextareaWrapper
                      value={miscExpense.notes}
                      onChange={(v) =>
                        setMiscExpense((e) => ({ ...e, notes: v }))
                      }
                      name="notes"
                      label="Notes"
                    />
                    <div className="flex justify-end gap-2">
                      <Button type="button" onClick={handleMiscSave}>
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setMiscDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <EditableDataTable
              columns={[
                { header: "Date", accessorKey: "date" },
                { header: "Expense", accessorKey: "expense" },
                { header: "Qty", accessorKey: "hours" },
                { header: "Cost", accessorKey: "cost" },
                {
                  header: "Actions",
                  cell: ({ row }: any) => (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        type="button"
                        onClick={() => handleMiscEdit(row.index)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        type="button"
                        variant="destructive"
                        onClick={() => handleMiscDelete(row.index)}
                      >
                        Delete
                      </Button>
                    </div>
                  ),
                },
              ]}
              data={fields}
            />
          </TabsContent>
        </Tabs>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export function UpdateFuelTransactionForm({
  children,
  data,
}: {
  children: React.ReactNode;
  data: FuelTransactionFormValues;
}) {
  const [open, setOpen] = useState(false);

  const [tab, setTab] = useState("optional");
  const [miscDialogOpen, setMiscDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [specifyPart, setSpecifyPart] = useState(false);

  const form = useForm<FuelTransactionFormValues>({
    resolver: zodResolver(fuelTransactionSchema),
    defaultValues: data,
  });

  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: "miscExpenses",
  });

  // Watch gallons and pricePerGallon to update total
  const gallons = form.watch("gallons");
  const pricePerGallon = form.watch("pricePerGallon");
  useEffect(() => {
    form.setValue("total", gallons * pricePerGallon);
  }, [gallons, pricePerGallon]);

  // Misc Expense Dialog Form State
  const [miscExpense, setMiscExpense] = useState<MiscExpenseFormValues>({
    equipment: "",
    date: "",
    hours: 0,
    expense: "",
    specifyPart: false,
    part: "",
    costCentre: "",
    cost: 0,
    extendedCost: 0,
    notes: "",
  });

  function handleMiscSave() {
    if (editIndex !== null) {
      update(editIndex, miscExpense);
    } else {
      append(miscExpense);
    }
    setMiscDialogOpen(false);
    setEditIndex(null);
    setMiscExpense({
      equipment: "",
      date: "",
      hours: 0,
      expense: "",
      specifyPart: false,
      part: "",
      costCentre: "",
      cost: 0,
      extendedCost: 0,
      notes: "",
    });
    setSpecifyPart(false);
  }

  function handleMiscEdit(idx: number) {
    setEditIndex(idx);
    setMiscExpense(fields[idx]);
    setSpecifyPart(!!fields[idx].specifyPart);
    setMiscDialogOpen(true);
  }

  function handleMiscDelete(idx: number) {
    remove(idx);
  }

  function onSubmit(data: FuelTransactionFormValues) {
    // Submit logic
    console.log(data);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-3/4 ">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>Update Fuel Transaction</div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-1"
              >
                <ComboboxFieldWrapper
                  control={form.control}
                  name="equipment"
                  label="Equipment"
                  options={equipmentOptions}
                />
                <DatePickerWrapper
                  control={form.control}
                  name="date"
                  label="Date"
                />
                <InputWrapper
                  control={form.control}
                  name="fill"
                  label="Fill"
                  type="number"
                />
                <InputWrapper
                  control={form.control}
                  name="gallons"
                  label="Gallons"
                  type="number"
                />
                <InputWrapper
                  control={form.control}
                  name="pricePerGallon"
                  label="Price Per Gallon"
                  type="number"
                />
                <InputWrapper
                  control={form.control}
                  name="total"
                  label="Total"
                  type="number"
                  value={form.watch("total")}
                  disabled
                />

                <Tabs
                  defaultValue="optional"
                  value={tab}
                  onValueChange={setTab}
                >
                  <TabsList>
                    <TabsTrigger value="optional">Optional Details</TabsTrigger>
                    <TabsTrigger value="misc">Misc Expenses</TabsTrigger>
                  </TabsList>
                  <TabsContent value="optional" className="space-y-2">
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="fuelType"
                      label="Fuel Type"
                      options={fuelTypeOptions}
                    />
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="vendor"
                      label="Vendor"
                      options={vendorOptions}
                    />
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="driver"
                      label="Driver"
                      options={driverOptions}
                    />
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="costCentre"
                      label="Cost Centre"
                      options={costCentreOptions}
                    />
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="stockTank"
                      label="Stock Tank"
                      options={stockTankOptions}
                    />
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="brand"
                      label="Brand"
                      options={brandOptions}
                    />
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="state"
                      label="State"
                      options={stateOptions}
                    />
                    <TextareaWrapper
                      control={form.control}
                      name="notes"
                      label="Notes"
                    />
                  </TabsContent>
                  <TabsContent value="misc" className="space-y-2">
                    <div className="flex justify-end mb-2">
                      <Dialog
                        open={miscDialogOpen}
                        onOpenChange={setMiscDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            onClick={() => setMiscDialogOpen(true)}
                          >
                            Add Misc Expense
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>
                            {editIndex !== null
                              ? "Edit Misc Expense"
                              : "Add Misc Expense"}
                          </DialogTitle>
                          <div className="space-y-2">
                            <ComboboxFieldWrapper
                              value={miscExpense.equipment}
                              onChange={(v) =>
                                setMiscExpense((e) => ({ ...e, equipment: v }))
                              }
                              name="equipment"
                              label="Equipment"
                              options={equipmentOptions}
                              disabled={editIndex !== null}
                            />
                            <DatePickerWrapper
                              value={miscExpense.date}
                              onChange={(v) =>
                                setMiscExpense((e) => ({ ...e, date: v }))
                              }
                              name="date"
                              label="Date"
                            />
                            <InputWrapper
                              value={miscExpense.hours}
                              onChange={(v) =>
                                setMiscExpense((e) => ({
                                  ...e,
                                  hours: Number(v),
                                }))
                              }
                              name="hours"
                              label="Hours"
                              type="number"
                            />
                            <ComboboxFieldWrapper
                              value={miscExpense.expense}
                              onChange={(v) =>
                                setMiscExpense((e) => ({ ...e, expense: v }))
                              }
                              name="expense"
                              label="Expense"
                              options={expenseOptions}
                            />
                            <SingleCheckboxWrapper
                              checked={specifyPart}
                              onCheckedChange={(checked) => {
                                setSpecifyPart(!!checked);
                                setMiscExpense((e) => ({
                                  ...e,
                                  specifyPart: !!checked,
                                  part: checked ? e.part : "",
                                }));
                              }}
                              name="specifyPart"
                              label="Specify Part Used"
                            />
                            {specifyPart && (
                              <ComboboxFieldWrapper
                                value={miscExpense.part}
                                onChange={(v) =>
                                  setMiscExpense((e) => ({ ...e, part: v }))
                                }
                                name="part"
                                label="Part"
                                options={partOptions}
                              />
                            )}
                            <ComboboxFieldWrapper
                              value={miscExpense.costCentre}
                              onChange={(v) =>
                                setMiscExpense((e) => ({ ...e, costCentre: v }))
                              }
                              name="costCentre"
                              label="Cost Centre"
                              options={costCentreOptions}
                            />
                            <InputWrapper
                              value={miscExpense.cost}
                              onChange={(v) =>
                                setMiscExpense((e) => ({
                                  ...e,
                                  cost: Number(v),
                                }))
                              }
                              name="cost"
                              label="Cost"
                              type="number"
                            />
                            <InputWrapper
                              value={miscExpense.extendedCost}
                              onChange={(v) =>
                                setMiscExpense((e) => ({
                                  ...e,
                                  extendedCost: Number(v),
                                }))
                              }
                              name="extendedCost"
                              label="Extended Cost"
                              type="number"
                            />
                            <TextareaWrapper
                              value={miscExpense.notes}
                              onChange={(v) =>
                                setMiscExpense((e) => ({ ...e, notes: v }))
                              }
                              name="notes"
                              label="Notes"
                            />
                            <div className="flex justify-end gap-2">
                              <Button type="button" onClick={handleMiscSave}>
                                Save
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setMiscDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <EditableDataTable
                      columns={[
                        { header: "Date", accessorKey: "date" },
                        { header: "Expense", accessorKey: "expense" },
                        { header: "Qty", accessorKey: "hours" },
                        { header: "Cost", accessorKey: "cost" },
                        {
                          header: "Actions",
                          cell: ({ row }: any) => (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                type="button"
                                onClick={() => handleMiscEdit(row.index)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                type="button"
                                variant="destructive"
                                onClick={() => handleMiscDelete(row.index)}
                              >
                                Delete
                              </Button>
                            </div>
                          ),
                        },
                      ]}
                      data={fields}
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
