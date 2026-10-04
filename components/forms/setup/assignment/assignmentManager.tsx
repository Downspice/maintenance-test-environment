// app/components/AssignmentConfigurations.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import {
  laborAssociationSchema,
  PartAssociationFormValues,
  partAssociationSchema,
  type LaborAssociationFormValues,
} from "@/lib/schemas/labor-schema";

import InputWrapper from "@/components/forms/fields/InputWrapper";
import FileUploadWrapper from "@/components/forms/fields/FileUploadWrapper";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import RadioGroupWrapper from "@/components/forms/fields/RadioGroupWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilePenIcon, Plus, Trash2 } from "lucide-react";

const pmTemplates = [
  "Drill Press",
  "AC Units",
  "Air Compressor",
  "Fire Extinguishers",
];
const equipmentList = [
  "Compressor A",
  "Compressor B",
  "Unit 12",
  "Extinguisher 4",
];

const partsMap: Record<
  string,
  { warehouse: string; name: string; description: string }
> = {
  "P-1001": {
    warehouse: "Warehouse A",
    name: "Filter",
    description: "Oil Filter",
  },
  "P-1002": {
    warehouse: "Warehouse B",
    name: "Seal",
    description: "Compressor Seal",
  },
};

const dummyLaborData = [
  {
    name: "John Doe",
    rate: 25,
    hours: 3,
    service: "Preventive Maintenance",
    cost: 75,
  },
  {
    name: "Acme Vendor",
    rate: 30,
    hours: 2,
    service: "Seal Replacement",
    cost: 60,
  },
];

const dummyPartData = [
  {
    partNumber: "P-1001",
    name: "Filter",
    description: "Oil Filter",
    quantity: 2,
    service: "Preventive Maintenance",
    cost: 50,
  },
  {
    partNumber: "P-1002",
    name: "Seal",
    description: "Compressor Seal",
    quantity: 1,
    service: "Seal Replacement",
    cost: 25,
  },
];

export default function AssignmentConfigurations() {
 const [selectedPM, setSelectedPM] = useState<string>(pmTemplates[0]);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("labor");
  const [radioType, setRadioType] = useState("preventive");
  const [method, setMethod] = useState("assignLabourer");
  const [labourerType, setLabourerType] = useState("employee");
  const [instructions, setInstructions] = useState<{ service: string; files: string[] }[]>([]);
  const [laborAssociations, setLaborAssociations] = useState<any[]>(dummyLaborData);
  const [partAssociations, setPartAssociations] = useState<any[]>(dummyPartData);
  const [editingLaborIndex, setEditingLaborIndex] = useState<number | null>(null);
  const [editingPartIndex, setEditingPartIndex] = useState<number | null>(null);

  const isEditing = editingLaborIndex !== null || editingPartIndex !== null;

const laborForm = useForm<LaborAssociationFormValues>({
    resolver: zodResolver(laborAssociationSchema),
    defaultValues: {
      type: "preventive",
      method: "assignLabourer",
    },
  });

  const partForm = useForm<PartAssociationFormValues>({
    resolver: zodResolver(partAssociationSchema),
    defaultValues: {
      type: "preventive",
      method: "assignedPart",
    },
  });

  const handleSelectEquipment = (equip: string) => {
    setSelectedEquipment(equip);
  };

  const handlePartChange = (partNumber: string) => {
    const partDetails = partsMap[partNumber];
    if (partDetails) {
      partForm.setValue("warehouse", partDetails.warehouse);
      partForm.setValue("name", partDetails.name);
      partForm.setValue("description", partDetails.description);
    }
  };

  const handleEditLabor = (index: number) => {
    const data = laborAssociations[index];
    laborForm.reset(data);
    setEditingLaborIndex(index);
    setOpenDialog(true);
    setActiveTab("labor");
  };

  const handleEditPart = (index: number) => {
    const data = partAssociations[index];
    partForm.reset(data);
    setEditingPartIndex(index);
    setOpenDialog(true);
    setActiveTab("parts");
  };

  const renderDialogContent = () => {
    if (activeTab === "labor") {
      return (
        <Form {...laborForm}>
          <form
            id="association-labor-form"
            onSubmit={laborForm.handleSubmit((data) =>
              console.log("submit:", data)
            )}
            className="flex flex-col gap-1"
          >
            <RadioGroupWrapper
              control={laborForm.control}
              name="type_id"
              label="Type"
              orientation="horizontal"
              options={[
                { id: "preventive", name: "Preventive" },
                { id: "repair", name: "Repair" },
              ]}
              onChange={setRadioType}
              disabled={isEditing}
            />

            <ComboboxFieldWrapper
              control={laborForm.control}
              name="equipment"
              label="Equipment"
              options={equipmentList.map((e) => ({ name: e, id: e }))}
              disabled
              value={selectedEquipment || undefined}
            />

            <ComboboxFieldWrapper
              control={laborForm.control}
              name="service"
              label="Service"
              options={
                radioType === "preventive"
                  ? ["Inspection", "Cleaning", "Test"].map((s) => ({
                      name: s,
                      id: s,
                    }))
                  : ["Repair Motor", "Replace Seal"].map((s) => ({
                      name: s,
                      id: s,
                    }))
              }
            />

            <RadioGroupWrapper
              control={laborForm.control}
              name="method"
              label="Cost Method"
              orientation="horizontal"
              options={[
                { id: "assignLabourer", name: "Assign Labourer" },
                { id: "fixedCost", name: "Fixed Cost" },
              ]}
              onChange={(val) => setMethod(val as any)}
              disabled={isEditing}
            />

            {method === "assignLabourer" && (
              <>
                <RadioGroupWrapper
                  control={laborForm.control}
                  name="labourerType"
                  label="Labourer Type"
                  orientation="horizontal"
                  options={[
                    { id: "employee", name: "Employee" },
                    { id: "vendor", name: "Vendor" },
                  ]}
                  onChange={(val) => setLabourerType(val as any)}
                  disabled={isEditing}
                />

                {labourerType === "employee" && (
                  <ComboboxFieldWrapper
                    control={laborForm.control}
                    name="labourer"
                    label="Employee"
                    options={["John Doe", "Jane Smith"].map((x) => ({
                      name: x,
                      id: x,
                    }))}
                  />
                )}
                {labourerType === "vendor" && (
                  <ComboboxFieldWrapper
                    control={laborForm.control}
                    name="labourer"
                    label="Vendor"
                    options={["ACME Services", "Vendor Corp"].map((x) => ({
                      name: x,
                      id: x,
                    }))}
                  />
                )}

                <InputWrapper
                  control={laborForm.control}
                  name="rate"
                  label="Rate"
                  type="number"
                />
                <InputWrapper
                  control={laborForm.control}
                  name="hours"
                  label="Labour Hours"
                  type="number"
                />
              </>
            )}

            {method === "fixedCost" && (
              <InputWrapper
                control={laborForm.control}
                name="cost"
                label="Fixed Cost"
                type="number"
              />
            )}

          </form>
        </Form>
      );
    }
    if (activeTab === "parts") {
      return (
        <Form {...partForm}>
          <form
            id="association-part-form"
            onSubmit={partForm.handleSubmit((data) =>
              console.log("part submit:", data)
            )}
            className="flex flex-col gap-1"
          >
            <ComboboxFieldWrapper
              control={partForm.control}
              name="equipment"
              label="Equipment"
              options={equipmentList.map((e) => ({ name: e, id: e }))}
              disabled
              value={selectedEquipment || undefined}
            />

            <RadioGroupWrapper
              control={partForm.control}
              name="type_id"
              label="Type"
              orientation="horizontal"
              options={[
                { id: "preventive", name: "Preventive" },
                { id: "repair", name: "Repair" },
              ]}
              onChange={setRadioType}
              disabled={isEditing}
            />

            <ComboboxFieldWrapper
              control={partForm.control}
              name="service"
              label="Service"
              options={
                radioType === "preventive"
                  ? ["Inspection", "Cleaning", "Test"].map((s) => ({
                      name: s,
                      id: s,
                    }))
                  : ["Repair Motor", "Replace Seal"].map((s) => ({
                      name: s,
                      id: s,
                    }))
              }
            />

            <RadioGroupWrapper
              control={partForm.control}
              name="method"
              label="Method"
              orientation="horizontal"
              options={[
                { id: "assignedPart", name: "Assigned Part" },
                { id: "fixedCost", name: "Fixed Cost" },
              ]}
              onChange={(val) => partForm.setValue("method", val as any)} disabled={isEditing}
            />

            {partForm.watch("method") === "assignedPart" ? (
              <>
                <ComboboxFieldWrapper
                  control={partForm.control}
                  name="partNumber"
                  label="Part Number"
                  options={Object.keys(partsMap).map((p) => ({
                    name: p,
                    id: p,
                  }))}
                  onChange={handlePartChange}
                />
                <InputWrapper
                  control={partForm.control}
                  name="warehouse"
                  label="Warehouse"
                  disabled
                />
                <InputWrapper
                  control={partForm.control}
                  name="name"
                  label="Name"
                  disabled
                />
                <InputWrapper
                  control={partForm.control}
                  name="description"
                  label="Description"
                  disabled
                />
                <InputWrapper
                  control={partForm.control}
                  name="quantity"
                  label="Quantity"
                  type="number"
                />
              </>
            ) : (
              <InputWrapper
                control={partForm.control}
                name="cost"
                label="Fixed Cost"
                type="number"
              />
            )}

          </form>
        </Form>
      );
    }

    if (activeTab === "instructions") {
      return (
        <Form {...partForm}>
          <form
            id="association-instruction-form"
            onSubmit={partForm.handleSubmit((data) => {
              const newEntry = {
                service: data.instructionService || "",
                files: data.instructionFiles?.map((f: File) => f.name) || [],
              };
              setInstructions((prev) => [...prev, newEntry]);
              setOpenDialog(false);
            })}
            className="flex flex-col gap-1"
          >
            <ComboboxFieldWrapper
              control={partForm.control}
              name="equipment"
              label="Equipment"
              options={equipmentList.map((e) => ({ name: e, id: e }))}
              disabled
              value={selectedEquipment || ""}
            />

            <ComboboxFieldWrapper
              control={partForm.control}
              name="instructionService"
              label="Service"
              options={[
                "Inspection",
                "Cleaning",
                "Repair Motor",
                "Replace Seal",
              ].map((s) => ({ name: s, id: s }))}
            />

            <FileUploadWrapper
              multiple
              control={partForm.control}
              name="instructionFiles"
              label="Upload Files"
            />

          </form>
        </Form>
      );
    }
  };

  const renderInstructionTable = () => {
    return (
      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Files</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instructions.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{item.service}</TableCell>
                <TableCell>
                  <ul className="list-disc pl-4">
                    {item.files.map((file, i) => (
                      <li key={i}>{file}</li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const openAddAssociation = () => {
    setEditingLaborIndex(null);
    setEditingPartIndex(null);
    setOpenDialog(true);
  };

  const renderAssociationActions = (
    onEdit: () => void,
    onDelete: () => void,
  ) => (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="secondary" size="icon" onClick={onEdit}>
        <FilePenIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="text-destructive hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );

  const renderLaborTable = () => (
    <div className="overflow-auto rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-bg-white-0">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Labour Hours</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead className="w-[5.5rem] text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {laborAssociations.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.rate}</TableCell>
              <TableCell>{item.hours}</TableCell>
              <TableCell>{item.service}</TableCell>
              <TableCell>{item.cost}</TableCell>
              <TableCell>
                {renderAssociationActions(
                  () => handleEditLabor(idx),
                  () =>
                    setLaborAssociations((rows) =>
                      rows.filter((_, i) => i !== idx),
                    ),
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderPartTable = () => (
    <div className="overflow-auto rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-bg-white-0">
          <TableRow>
            <TableHead>Part Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead className="w-[5.5rem] text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partAssociations.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell>{item.partNumber}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.service}</TableCell>
              <TableCell>{item.cost}</TableCell>
              <TableCell>
                {renderAssociationActions(
                  () => handleEditPart(idx),
                  () =>
                    setPartAssociations((rows) =>
                      rows.filter((_, i) => i !== idx),
                    ),
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(260px,1fr)_2.5fr]">
        <div className="flex min-h-0 flex-col gap-3">
          <div className="shrink-0 space-y-1">
            <Label className="text-label-sm text-text-sub-600">PM Template</Label>
            <Select
              value={selectedPM}
              onValueChange={(value) => {
                setSelectedPM(value);
                setSelectedEquipment(null);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select PM Template" />
              </SelectTrigger>
              <SelectContent>
                {pmTemplates.map((template) => (
                  <SelectItem key={template} value={template}>
                    {template}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-1">
            <span className="shrink-0 text-label-sm font-medium text-text-sub-600">
              Equipment in Schedule
            </span>
            <div className="min-h-0 flex-1 overflow-auto rounded-md border p-1">
              {equipmentList.map((equip) => (
                <button
                  key={equip}
                  type="button"
                  onClick={() => handleSelectEquipment(equip)}
                  className={`w-full cursor-pointer rounded-md px-2 py-2 text-left text-paragraph-sm transition-colors hover:bg-bg-weak-50 ${
                    selectedEquipment === equip ? "bg-muted font-medium" : ""
                  }`}
                >
                  {equip}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-col gap-1">
          {selectedEquipment ? (
            <>
              <div className="flex shrink-0 items-center justify-between gap-2">
                <p className="text-label-md font-medium text-text-strong-950">
                  {selectedPM} — {selectedEquipment}
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={openAddAssociation}
                >
                  <Plus className="mr-2 size-4" />
                  Add New
                </Button>
              </div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex min-h-0 flex-1 flex-col gap-2"
              >
                <TabsList className="shrink-0 w-full justify-start">
                  <TabsTrigger value="parts">
                    Part Associations ({partAssociations.length})
                  </TabsTrigger>
                  <TabsTrigger value="labor">
                    Labor Associations ({laborAssociations.length})
                  </TabsTrigger>
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                </TabsList>

                <TabsContent
                  value="labor"
                  className="mt-0 min-h-0 flex-1 overflow-auto data-[state=inactive]:hidden"
                >
                  {renderLaborTable()}
                </TabsContent>

                <TabsContent
                  value="parts"
                  className="mt-0 min-h-0 flex-1 overflow-auto data-[state=inactive]:hidden"
                >
                  {renderPartTable()}
                </TabsContent>

                <TabsContent
                  value="instructions"
                  className="mt-0 min-h-0 flex-1 overflow-auto data-[state=inactive]:hidden"
                >
                  {renderInstructionTable()}
                </TabsContent>
              </Tabs>

              <Modal
                open={openDialog}
                onOpenChange={setOpenDialog}
                title={
                  isEditing
                    ? `Edit ${activeTab === "labor" ? "labor" : activeTab === "parts" ? "part" : "instruction"} association`
                    : `Add ${activeTab === "labor" ? "labor" : activeTab === "parts" ? "part" : "instruction"} association`
                }
                description="Configure how this equipment links to services, parts, labor, or instruction files."
                size="xl"
                renderActions={
                  <Button
                    form={
                      activeTab === "labor"
                        ? "association-labor-form"
                        : activeTab === "parts"
                          ? "association-part-form"
                          : "association-instruction-form"
                    }
                    type="submit"
                    variant="primary"
                  >
                    {activeTab === "instructions"
                      ? "Attach files"
                      : isEditing
                        ? "Save changes"
                        : "Add association"}
                  </Button>
                }
              >
                <ScrollArea className="max-h-[min(70vh,28rem)] pr-3">
                  {renderDialogContent()}
                </ScrollArea>
              </Modal>
            </>
          ) : (
            <p className="text-paragraph-sm text-text-sub-600">
              Select equipment on the left to configure associations.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
