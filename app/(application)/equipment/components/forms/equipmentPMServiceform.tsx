import { useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import DatePickerWrapper from "@/components/forms/wrappers/DatePickerWrapper";
import SingleCheckboxWrapper from "@/components/forms/wrappers/SingleCheckboxWrapper";
import RadioGroupWrapper from "@/components/forms/wrappers/RadioGroupWrapper";
import Fieldset from "@/components/customUI/fieldset";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditableDataTable } from "@/components/customUI/editableTable";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

// Example options
const typeOptions = [
  { label: "Normal", value: "normal" },
  { label: "Forklift", value: "forklift" },
  { label: "Generator", value: "generator" },
];
const priorityOptions = [
  { label: "Normal", value: "normal" },
  { label: "High", value: "high" },
  { label: "Low", value: "low" },
];
const periodOptions = [
  { label: "Days", value: "days" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];
const pmOptions = [
  { label: "PM1", value: "pm1" },
  { label: "PM2", value: "pm2" },
];
const equipmentOptions = [{ label: "Excavator", value: "excavator" }];
const partNumberOptions = [{ label: "1234", value: "1234" }];

// Parts Table Schema
const partSchema = z.object({
  partNumber: z.string(),
  name: z.string(),
  qty: z.coerce.number(),
  cost: z.coerce.number(),
  equipment: z.string(),
  warehouse: z.string().optional(),
  description: z.string().optional(),
  fixedCost: z.coerce.number().optional(),
  assignedPart: z.boolean().optional(),
});

// Main Form Schema
export const pmServiceSchema = z.object({
  pmService: z.string().min(1, "PM Service is required"),
  type: z.enum(["normal", "forklift", "generator"]),
  priority: z.enum(["normal", "high", "low"]),
  // Frequency Tab
  frequency: z.object({
    dateEnabled: z.boolean().optional(),
    dateType: z.enum(["dueOn", "dueEvery"]).optional(),
    dueOnDate: z.string().optional(),
    dueEvery: z.coerce.number().optional(),
    dueEveryPeriod: z.string().optional(),
    notifyDaysDate: z.coerce.number().optional(),
    hoursEnabled: z.boolean().optional(),
    hoursType: z.enum(["dueEvery", "dueAt"]).optional(),
    dueEveryHours: z.coerce.number().optional(),
    dueAtHours: z.coerce.number().optional(),
    notifyDaysHours: z.coerce.number().optional(),
  }),
  // Advanced Tab
  estimatedLaborTime: z.coerce.number().optional(),
  includeEmail: z.boolean().optional(),
  linkedPMService: z.boolean().optional(),
  linkedPM: z.string().optional(),
  termination: z.object({
    terminateOnDate: z.boolean().optional(),
    terminateDate: z.string().optional(),
    terminateOnMeters: z.boolean().optional(),
    terminateMeters: z.coerce.number().optional(),
  }),
  seasonal: z.object({
    seasonalIgnore: z.boolean().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    ignoreYear: z.boolean().optional(),
  }),
  // Instructions Tab
  instructionsEquipment: z.string().optional(),
  attachments: z.array(z.any()).optional(),
  instructions: z.string().optional(),
  // Parts Tab
  parts: z.array(partSchema).optional(),
});

type PMServiceFormValues = z.infer<typeof pmServiceSchema>;
type PartFormValues = z.infer<typeof partSchema>;

export default function EquipmentPMServiceForm() {
  const [tab, setTab] = useState("frequency");

  const form = useForm<PMServiceFormValues>({
    resolver: zodResolver(pmServiceSchema),
    defaultValues: {
      pmService: "",
      type: "normal",
      priority: "normal",
      frequency: {},
      termination: {},
      seasonal: {},
      parts: [],
      attachments: [],
    },
  });

  const {
    fields: partFields,
    append: appendPart,
    update: updatePart,
    remove: removePart,
  } = useFieldArray({
    control: form.control,
    name: "parts",
  });

  // Use form.watch for all toggles and radios
  const dateEnabled = form.watch("frequency.dateEnabled");
  const dateType = form.watch("frequency.dateType") || "dueOn";
  const hoursEnabled = form.watch("frequency.hoursEnabled");
  const hoursType = form.watch("frequency.hoursType") || "dueEvery";
  const includeEmail = form.watch("includeEmail");
  const linkedPMService = form.watch("linkedPMService");
  const terminateOnDate = form.watch("termination.terminateOnDate");
  const terminateOnMeters = form.watch("termination.terminateOnMeters");
  const seasonalIgnore = form.watch("seasonal.seasonalIgnore");

  // Parts Dialog State (still needs local state for dialog and editing index)
  const [partDialogOpen, setPartDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [assignedPart, setAssignedPart] = useState(true);
  const [partForm, setPartForm] = useState<PartFormValues>({
    partNumber: "",
    name: "",
    qty: 0,
    cost: 0,
    equipment: "",
    warehouse: "",
    description: "",
    fixedCost: 0,
    assignedPart: true,
  });

  function handlePartSave() {
    if (editIndex !== null) {
      updatePart(editIndex, partForm);
    } else {
      appendPart(partForm);
    }
    setPartDialogOpen(false);
    setEditIndex(null);
    setPartForm({
      partNumber: "",
      name: "",
      qty: 0,
      cost: 0,
      equipment: "",
      warehouse: "",
      description: "",
      fixedCost: 0,
      assignedPart: true,
    });
    setAssignedPart(true);
  }

  function handlePartEdit(idx: number) {
    setEditIndex(idx);
    setPartForm(partFields[idx]);
    setAssignedPart(!!partFields[idx].assignedPart);
    setPartDialogOpen(true);
  }

  function handlePartDelete(idx: number) {
    removePart(idx);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="space-y-6"
      >
        <InputWrapper
          control={form.control}
          name="pmService"
          label="PM Service"
        />
        <ComboboxFieldWrapper
          control={form.control}
          name="type"
          label="Type"
          options={typeOptions}
        />
        <ComboboxFieldWrapper
          control={form.control}
          name="priority"
          label="Priority"
          options={priorityOptions}
        />
        <Tabs defaultValue="frequency" value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="frequency">Frequency</TabsTrigger>
            <TabsTrigger value="parts">Parts</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="frequency" className="space-y-2">
            <Fieldset
              legend="Date"
              content={
                <>
                  <SingleCheckboxWrapper
                    control={form.control}
                    name="frequency.dateEnabled"
                    label="Date"
                  />
                  {dateEnabled && (
                    <>
                      <RadioGroupWrapper
                        control={form.control}
                        name="frequency.dateType"
                        label="Due"
                        options={[
                          { label: "Due On", value: "dueOn" },
                          { label: "Due Every", value: "dueEvery" },
                        ]}
                      />
                      {dateType === "dueOn" && (
                        <DatePickerWrapper
                          control={form.control}
                          name="frequency.dueOnDate"
                          label="Due On Date"
                        />
                      )}
                      {dateType === "dueEvery" && (
                        <>
                          <InputWrapper
                            control={form.control}
                            name="frequency.dueEvery"
                            label="Due Every"
                            type="number"
                          />
                          <ComboboxFieldWrapper
                            control={form.control}
                            name="frequency.dueEveryPeriod"
                            label="Period"
                            options={periodOptions}
                          />
                        </>
                      )}
                      <InputWrapper
                        control={form.control}
                        name="frequency.notifyDaysDate"
                        label="Notify Days In Advance"
                        type="number"
                      />
                    </>
                  )}
                </>
              }
            />
            <Fieldset
              legend="Hours"
              content={
                <>
                  {" "}
                  <SingleCheckboxWrapper
                    control={form.control}
                    name="frequency.hoursEnabled"
                    label="Hours"
                  />
                  {hoursEnabled && (
                    <>
                      <RadioGroupWrapper
                        control={form.control}
                        name="frequency.hoursType"
                        label="Due"
                        options={[
                          { label: "Due Every", value: "dueEvery" },
                          { label: "Due At", value: "dueAt" },
                        ]}
                      />
                      {hoursType === "dueEvery" && (
                        <InputWrapper
                          control={form.control}
                          name="frequency.dueEveryHours"
                          label="Due Every (Hours)"
                          type="number"
                        />
                      )}
                      {hoursType === "dueAt" && (
                        <InputWrapper
                          control={form.control}
                          name="frequency.dueAtHours"
                          label="Due At (Hours)"
                          type="number"
                        />
                      )}
                      <InputWrapper
                        control={form.control}
                        name="frequency.notifyDaysHours"
                        label="Notify Days In Advance"
                        type="number"
                      />
                    </>
                  )}{" "}
                </>
              }
            />
          </TabsContent>
          <TabsContent value="parts" className="space-y-2">
            <div className="flex justify-end mb-2">
              <Dialog open={partDialogOpen} onOpenChange={setPartDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button" onClick={() => setPartDialogOpen(true)}>
                    Add Part
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>
                    {editIndex !== null ? "Edit Part" : "Add Part"}
                  </DialogTitle>
                  <div className="space-y-2">
                    <ComboboxFieldWrapper
                      value={partForm.equipment}
                      onChange={(v) =>
                        setPartForm((e) => ({ ...e, equipment: v }))
                      }
                      name="equipment"
                      label="Equipment"
                      options={equipmentOptions}
                      disabled={editIndex !== null}
                    />
                    <Fieldset
                      legend="Service"
                      content={
                        <>
                          <InputWrapper
                            value={form.watch("pmService")}
                            name="service"
                            label="Service"
                            disabled
                          />
                        </>
                      }
                    />
                    <RadioGroupWrapper
                      value={assignedPart ? "assignedPart" : "fixedCost"}
                      onChange={(v) => setAssignedPart(v === "assignedPart")}
                      name="partType"
                      label="Part Type"
                      options={[
                        { label: "Assigned Part", value: "assignedPart" },
                        { label: "Fixed Cost", value: "fixedCost" },
                      ]}
                    />
                    {assignedPart ? (
                      <>
                        <ComboboxFieldWrapper
                          value={partForm.partNumber}
                          onChange={(v) => {
                            // Simulate filling warehouse, name, description
                            setPartForm((e) => ({
                              ...e,
                              partNumber: v,
                              warehouse: "Warehouse A",
                              name: "Part Name",
                              description: "Part Description",
                            }));
                          }}
                          name="partNumber"
                          label="Part Number"
                          options={partNumberOptions}
                        />
                        <InputWrapper
                          value={partForm.warehouse}
                          name="warehouse"
                          label="Warehouse"
                          disabled
                        />
                        <InputWrapper
                          value={partForm.name}
                          name="name"
                          label="Name"
                          disabled
                        />
                        <InputWrapper
                          value={partForm.description}
                          name="description"
                          label="Description"
                          disabled
                        />
                        <InputWrapper
                          value={partForm.qty}
                          onChange={(v) =>
                            setPartForm((e) => ({ ...e, qty: Number(v) }))
                          }
                          name="qty"
                          label="Quantity"
                          type="number"
                        />
                        <InputWrapper
                          value={partForm.cost}
                          onChange={(v) =>
                            setPartForm((e) => ({ ...e, cost: Number(v) }))
                          }
                          name="cost"
                          label="Cost"
                          type="number"
                        />
                      </>
                    ) : (
                      <InputWrapper
                        value={partForm.fixedCost}
                        onChange={(v) =>
                          setPartForm((e) => ({ ...e, fixedCost: Number(v) }))
                        }
                        name="fixedCost"
                        label="Fixed Cost"
                        type="number"
                      />
                    )}
                    <div className="flex justify-end gap-2">
                      <Button type="button" onClick={handlePartSave}>
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setPartDialogOpen(false)}
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
                { header: "Part#", accessorKey: "partNumber" },
                { header: "Name", accessorKey: "name" },
                { header: "Qty", accessorKey: "qty" },
                { header: "Cost", accessorKey: "cost" },
                { header: "Equipment", accessorKey: "equipment" },
                {
                  header: "Actions",
                  cell: ({ row }: any) => (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        type="button"
                        onClick={() => handlePartEdit(row.index)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        type="button"
                        variant="destructive"
                        onClick={() => handlePartDelete(row.index)}
                      >
                        Delete
                      </Button>
                    </div>
                  ),
                },
              ]}
              data={partFields}
            />
          </TabsContent>

          <TabsContent value="instructions" className="space-y-2">
            <ComboboxFieldWrapper
              control={form.control}
              name="instructionsEquipment"
              label="Equipment"
              options={equipmentOptions}
            />
            <Button type="button">Insert Attachment</Button>
            <div className="flex flex-wrap gap-2 mt-2">
              {(form.watch("attachments") || []).map(
                (file: any, idx: number) => (
                  <div key={idx} className="border rounded p-2">
                    {file.name}
                  </div>
                )
              )}
            </div>
            <TextareaWrapper
              control={form.control}
              name="instructions"
              label="Instructions"
            />
          </TabsContent>
          <TabsContent value="advanced" className="space-y-2">
            <InputWrapper
              control={form.control}
              name="estimatedLaborTime"
              label="Estimated Labor Time (hours)"
              type="number"
            />
            <SingleCheckboxWrapper
              control={form.control}
              name="includeEmail"
              label="Include pm service with e-mail notifications"
            />
            <SingleCheckboxWrapper
              control={form.control}
              name="linkedPMService"
              label="Linked PM Service"
            />
            {linkedPMService && (
              <ComboboxFieldWrapper
                control={form.control}
                name="linkedPM"
                label="PM Options"
                options={pmOptions}
              />
            )}
            <Fieldset
              legend="PM Service Termination"
              content={
                <>
                  {" "}
                  <SingleCheckboxWrapper
                    control={form.control}
                    name="termination.terminateOnDate"
                    label="Terminate tracking on (date)"
                  />
                  {terminateOnDate && (
                    <DatePickerWrapper
                      control={form.control}
                      name="termination.terminateDate"
                      label="Terminate Date"
                    />
                  )}
                  <SingleCheckboxWrapper
                    control={form.control}
                    name="termination.terminateOnMeters"
                    label="Terminate tracking on (meters)"
                  />
                  {terminateOnMeters && (
                    <InputWrapper
                      control={form.control}
                      name="termination.terminateMeters"
                      label="Terminate Meters"
                      type="number"
                    />
                  )}
                </>
              }
            />
            <Fieldset
              legend="Seasonal Ticketing"
              content={
                <>
                  <SingleCheckboxWrapper
                    control={form.control}
                    name="seasonal.seasonalIgnore"
                    label="PM service will be ignored during the following date period"
                  />
                  {seasonalIgnore && (
                    <>
                      <DatePickerWrapper
                        control={form.control}
                        name="seasonal.startDate"
                        label="Start Date"
                      />
                      <DatePickerWrapper
                        control={form.control}
                        name="seasonal.endDate"
                        label="End Date"
                      />
                      <SingleCheckboxWrapper
                        control={form.control}
                        name="seasonal.ignoreYear"
                        label="Ignore Year"
                      />
                    </>
                  )}
                </>
              }
            />
          </TabsContent>
        </Tabs>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export function UpdateEquipmentPMServiceForm({
  children,
  data,
}: {
  children: React.ReactNode;
  data: PMServiceFormValues;
}) {
      const [open, setOpen] = useState(false);
    
  const form = useForm<PMServiceFormValues>({
    resolver: zodResolver(pmServiceSchema),
    defaultValues: data,
  });

  return (

    <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>{children}</SheetTrigger>
          <SheetContent  >
            <SheetHeader>
              <SheetTitle>
                <div className="flex justify-between">
                  <div>Edit PM Service</div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
              
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="space-y-6"
      >
        <InputWrapper
          control={form.control}
          name="pmService"
          label="PM Service"
        />
        <ComboboxFieldWrapper
          control={form.control}
          name="type"
          label="Type"
          options={typeOptions}
        />
        <ComboboxFieldWrapper
          control={form.control}
          name="priority"
          label="Priority"
          options={priorityOptions}
        />
        <Tabs defaultValue="frequency" value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="frequency">Frequency</TabsTrigger>
            <TabsTrigger value="parts">Parts</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="frequency" className="space-y-2">
            <Fieldset
              legend="Date"
              content={
                <>
                  <SingleCheckboxWrapper
                    control={form.control}
                    name="frequency.dateEnabled"
                    label="Date"
                  />
                  {dateEnabled && (
                    <>
                      <RadioGroupWrapper
                        control={form.control}
                        name="frequency.dateType"
                        label="Due"
                        options={[
                          { label: "Due On", value: "dueOn" },
                          { label: "Due Every", value: "dueEvery" },
                        ]}
                      />
                      {dateType === "dueOn" && (
                        <DatePickerWrapper
                          control={form.control}
                          name="frequency.dueOnDate"
                          label="Due On Date"
                        />
                      )}
                      {dateType === "dueEvery" && (
                        <>
                          <InputWrapper
                            control={form.control}
                            name="frequency.dueEvery"
                            label="Due Every"
                            type="number"
                          />
                          <ComboboxFieldWrapper
                            control={form.control}
                            name="frequency.dueEveryPeriod"
                            label="Period"
                            options={periodOptions}
                          />
                        </>
                      )}
                      <InputWrapper
                        control={form.control}
                        name="frequency.notifyDaysDate"
                        label="Notify Days In Advance"
                        type="number"
                      />
                    </>
                  )}
                </>
              }
            />
            <Fieldset
              legend="Hours"
              content={
                <>
                  {" "}
                  <SingleCheckboxWrapper
                    control={form.control}
                    name="frequency.hoursEnabled"
                    label="Hours"
                  />
                  {hoursEnabled && (
                    <>
                      <RadioGroupWrapper
                        control={form.control}
                        name="frequency.hoursType"
                        label="Due"
                        options={[
                          { label: "Due Every", value: "dueEvery" },
                          { label: "Due At", value: "dueAt" },
                        ]}
                      />
                      {hoursType === "dueEvery" && (
                        <InputWrapper
                          control={form.control}
                          name="frequency.dueEveryHours"
                          label="Due Every (Hours)"
                          type="number"
                        />
                      )}
                      {hoursType === "dueAt" && (
                        <InputWrapper
                          control={form.control}
                          name="frequency.dueAtHours"
                          label="Due At (Hours)"
                          type="number"
                        />
                      )}
                      <InputWrapper
                        control={form.control}
                        name="frequency.notifyDaysHours"
                        label="Notify Days In Advance"
                        type="number"
                      />
                    </>
                  )}{" "}
                </>
              }
            />
          </TabsContent>
          <TabsContent value="parts" className="space-y-2">
            <div className="flex justify-end mb-2">
              <Dialog open={partDialogOpen} onOpenChange={setPartDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button" onClick={() => setPartDialogOpen(true)}>
                    Add Part
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>
                    {editIndex !== null ? "Edit Part" : "Add Part"}
                  </DialogTitle>
                  <div className="space-y-2">
                    <ComboboxFieldWrapper
                      value={partForm.equipment}
                      onChange={(v) =>
                        setPartForm((e) => ({ ...e, equipment: v }))
                      }
                      name="equipment"
                      label="Equipment"
                      options={equipmentOptions}
                      disabled={editIndex !== null}
                    />
                    <Fieldset
                      legend="Service"
                      content={
                        <>
                          <InputWrapper
                            value={form.watch("pmService")}
                            name="service"
                            label="Service"
                            disabled
                          />
                        </>
                      }
                    />
                    <RadioGroupWrapper
                      value={assignedPart ? "assignedPart" : "fixedCost"}
                      onChange={(v) => setAssignedPart(v === "assignedPart")}
                      name="partType"
                      label="Part Type"
                      options={[
                        { label: "Assigned Part", value: "assignedPart" },
                        { label: "Fixed Cost", value: "fixedCost" },
                      ]}
                    />
                    {assignedPart ? (
                      <>
                        <ComboboxFieldWrapper
                          value={partForm.partNumber}
                          onChange={(v) => {
                            // Simulate filling warehouse, name, description
                            setPartForm((e) => ({
                              ...e,
                              partNumber: v,
                              warehouse: "Warehouse A",
                              name: "Part Name",
                              description: "Part Description",
                            }));
                          }}
                          name="partNumber"
                          label="Part Number"
                          options={partNumberOptions}
                        />
                        <InputWrapper
                          value={partForm.warehouse}
                          name="warehouse"
                          label="Warehouse"
                          disabled
                        />
                        <InputWrapper
                          value={partForm.name}
                          name="name"
                          label="Name"
                          disabled
                        />
                        <InputWrapper
                          value={partForm.description}
                          name="description"
                          label="Description"
                          disabled
                        />
                        <InputWrapper
                          value={partForm.qty}
                          onChange={(v) =>
                            setPartForm((e) => ({ ...e, qty: Number(v) }))
                          }
                          name="qty"
                          label="Quantity"
                          type="number"
                        />
                        <InputWrapper
                          value={partForm.cost}
                          onChange={(v) =>
                            setPartForm((e) => ({ ...e, cost: Number(v) }))
                          }
                          name="cost"
                          label="Cost"
                          type="number"
                        />
                      </>
                    ) : (
                      <InputWrapper
                        value={partForm.fixedCost}
                        onChange={(v) =>
                          setPartForm((e) => ({ ...e, fixedCost: Number(v) }))
                        }
                        name="fixedCost"
                        label="Fixed Cost"
                        type="number"
                      />
                    )}
                    <div className="flex justify-end gap-2">
                      <Button type="button" onClick={handlePartSave}>
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setPartDialogOpen(false)}
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
                { header: "Part#", accessorKey: "partNumber" },
                { header: "Name", accessorKey: "name" },
                { header: "Qty", accessorKey: "qty" },
                { header: "Cost", accessorKey: "cost" },
                { header: "Equipment", accessorKey: "equipment" },
                {
                  header: "Actions",
                  cell: ({ row }: any) => (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        type="button"
                        onClick={() => handlePartEdit(row.index)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        type="button"
                        variant="destructive"
                        onClick={() => handlePartDelete(row.index)}
                      >
                        Delete
                      </Button>
                    </div>
                  ),
                },
              ]}
              data={partFields}
            />
          </TabsContent>

          <TabsContent value="instructions" className="space-y-2">
            <ComboboxFieldWrapper
              control={form.control}
              name="instructionsEquipment"
              label="Equipment"
              options={equipmentOptions}
            />
            <Button type="button">Insert Attachment</Button>
            <div className="flex flex-wrap gap-2 mt-2">
              {(form.watch("attachments") || []).map(
                (file: any, idx: number) => (
                  <div key={idx} className="border rounded p-2">
                    {file.name}
                  </div>
                )
              )}
            </div>
            <TextareaWrapper
              control={form.control}
              name="instructions"
              label="Instructions"
            />
          </TabsContent>
          <TabsContent value="advanced" className="space-y-2">
            <InputWrapper
              control={form.control}
              name="estimatedLaborTime"
              label="Estimated Labor Time (hours)"
              type="number"
            />
            <SingleCheckboxWrapper
              control={form.control}
              name="includeEmail"
              label="Include pm service with e-mail notifications"
            />
            <SingleCheckboxWrapper
              control={form.control}
              name="linkedPMService"
              label="Linked PM Service"
            />
            {linkedPMService && (
              <ComboboxFieldWrapper
                control={form.control}
                name="linkedPM"
                label="PM Options"
                options={pmOptions}
              />
            )}
            <Fieldset
              legend="PM Service Termination"
              content={
                <>
                  {" "}
                  <SingleCheckboxWrapper
                    control={form.control}
                    name="termination.terminateOnDate"
                    label="Terminate tracking on (date)"
                  />
                  {terminateOnDate && (
                    <DatePickerWrapper
                      control={form.control}
                      name="termination.terminateDate"
                      label="Terminate Date"
                    />
                  )}
                  <SingleCheckboxWrapper
                    control={form.control}
                    name="termination.terminateOnMeters"
                    label="Terminate tracking on (meters)"
                  />
                  {terminateOnMeters && (
                    <InputWrapper
                      control={form.control}
                      name="termination.terminateMeters"
                      label="Terminate Meters"
                      type="number"
                    />
                  )}
                </>
              }
            />
            <Fieldset
              legend="Seasonal Ticketing"
              content={
                <>
                  <SingleCheckboxWrapper
                    control={form.control}
                    name="seasonal.seasonalIgnore"
                    label="PM service will be ignored during the following date period"
                  />
                  {seasonalIgnore && (
                    <>
                      <DatePickerWrapper
                        control={form.control}
                        name="seasonal.startDate"
                        label="Start Date"
                      />
                      <DatePickerWrapper
                        control={form.control}
                        name="seasonal.endDate"
                        label="End Date"
                      />
                      <SingleCheckboxWrapper
                        control={form.control}
                        name="seasonal.ignoreYear"
                        label="Ignore Year"
                      />
                    </>
                  )}
                </>
              }
            />
          </TabsContent>
        </Tabs>
        <Button type="submit">Submit</Button>
      </form>
    </Form>

    </ScrollArea>
          </SheetContent>
        </Sheet>
  );
}
