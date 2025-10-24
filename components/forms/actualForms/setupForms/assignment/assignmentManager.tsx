// app/components/AssignmentConfigurations.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import {
  laborAssociationSchema,
  PartAssociationFormValues,
  partAssociationSchema,
  type LaborAssociationFormValues,
} from "@/lib/schemas/labor-schema";

import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import FileUploadWrapper from "@/components/forms/wrappers/FileUploadWrapper";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import RadioGroupWrapper from "@/components/forms/wrappers/RadioGroupWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilePenIcon, Trash2Icon } from "lucide-react";

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
            onSubmit={laborForm.handleSubmit((data) =>
              console.log("submit:", data)
            )}
            className="space-y-4"
          >
            <RadioGroupWrapper
              control={laborForm.control}
              name="type_id"
              label="Type"
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
              options={[
                { id: "assignLabourer", name: "Assign Labourer" },
                { id: "fixedCost", name: "Fixed Cost" },
              ]}
              onChange={(val) => setMethod(val as any)} disabled={isEditing}
            />

            {method === "assignLabourer" && (
              <>
                <RadioGroupWrapper
                  control={laborForm.control}
                  name="labourerType"
                  label="Labourer Type"
                  options={[
                    { id: "employee", name: "Employee" },
                    { id: "vendor", name: "Vendor" },
                  ]}
                  onChange={(val) => setLabourerType(val as any)} disabled={isEditing}
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

            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      );
    }
    if (activeTab === "parts") {
      return (
        <Form {...partForm}>
          <form
            onSubmit={partForm.handleSubmit((data) =>
              console.log("part submit:", data)
            )}
            className="space-y-4"
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
              options={[
                { id: "preventive", name: "Preventive" },
                { id: "repair", name: "Repair" },
              ]}
              onChange={setRadioType} disabled={isEditing}
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

            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      );
    }

    if (activeTab === "instructions") {
      return (
        <Form {...partForm}>
          <form
            onSubmit={partForm.handleSubmit((data) => {
              const newEntry = {
                service: data.instructionService || "",
                files: data.instructionFiles?.map((f: File) => f.name) || [],
              };
              setInstructions((prev) => [...prev, newEntry]);
              setOpenDialog(false);
            })}
            className="space-y-4"
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

            <div className="flex justify-end">
              <Button type="submit">Attach</Button>
            </div>
          </form>
        </Form>
      );
    }
  };

  const renderInstructionTable = () => {
    return (
      <div className="mt-6">
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

  const renderLaborTable = () => (
    <div className="mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Labour Hours</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead className="w-28">Actions</TableHead>
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditLabor(idx)}
                >
                  <FilePenIcon/>
                </Button>
                <Button size="sm"
                  variant="outline" className="ml-2">
                  <Trash2Icon/>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderPartTable = () => (
    <div className="mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Part Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead className="w-28">Actions</TableHead>
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditPart(idx)}
                >
                  <FilePenIcon/>
                </Button>
                <Button size="sm"
                  variant="outline" className="ml-2">
                  <Trash2Icon/>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="flex h-full gap-4 p-4">
      {/* Left Panel */}
      <div className="w-1/4 space-y-4 h-full bg-accent">
        <div>
          <Label>PM Template</Label>
          <Select onValueChange={setSelectedPM} defaultValue={selectedPM}>
            <SelectTrigger>
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

        <div>
          <h2 className="text-sm font-semibold mt-4 mb-2">
            Equipment in Schedule
          </h2>
          <ScrollArea className="h-[calc(100vh-200px)] border rounded p-2">
            {equipmentList.map((equip) => (
              <div
                key={equip}
                onClick={() => handleSelectEquipment(equip)}
                className={`cursor-pointer p-2 rounded hover:bg-muted ${
                  selectedEquipment === equip ? "bg-muted" : ""
                }`}
              >
                {equip}
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1">
        {selectedEquipment ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-semibold">
                {selectedPM} - {selectedEquipment}
              </h1>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button>Add New</Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Add New Association</DialogTitle>
                  </DialogHeader>
                  {renderDialogContent()}
                </DialogContent>
              </Dialog>
            </div>

            <Tabs defaultValue="labor" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="parts">Part Associations (2)</TabsTrigger>
                <TabsTrigger value="labor">Labor Associations (3)</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
              </TabsList>

              <TabsContent value="labor">
                {/* Labor table and add dialog will go here */}
                {renderLaborTable()}
              </TabsContent>

              <TabsContent value="parts">
                {/* Part Association table and dialog will go here */}
                {renderPartTable()}
              </TabsContent>

              <TabsContent value="instructions">
                {/* Service combobox + file uploader */}
                {renderInstructionTable()}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Select equipment to configure...
          </p>
        )}
      </div>
    </div>
  );
}
