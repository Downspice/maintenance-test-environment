"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { FormModal } from "@/components/ui/form-modal";
import InputWrapper from "@/components/forms/fields/InputWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const partOptions = [
  { name: "Oil Filter (PN-123)", id: "PN-123" },
  { name: "Hydraulic Fluid (PN-456)", id: "PN-456" },
];

const equipmentOptions = [
  { name: "Forklift", id: "forklift" },
  { name: "Light System", id: "lights" },
];

const pmPartSchema = z.object({
  parts_equipment: z.string().min(1, "Equipment is required"),
  partNumber: z.string().optional(),
  part_quantity: z.coerce.number().optional(),
  part_cost: z.coerce.number().optional(),
});

const pmLaborSchema = z.object({
  labor_equipment: z.string().min(1, "Equipment is required"),
  labor_rate: z.coerce.number().optional(),
  labor_hours: z.coerce.number().optional(),
  labor_cost: z.coerce.number().optional(),
});

type PmPartFormValues = z.infer<typeof pmPartSchema>;
type PmLaborFormValues = z.infer<typeof pmLaborSchema>;

export default function FullMaintenanceForm() {
  const partForm = useForm<PmPartFormValues>({
    resolver: zodResolver(pmPartSchema),
    defaultValues: {
      parts_equipment: "",
      partNumber: "",
      part_quantity: undefined,
      part_cost: undefined,
    },
  });

  const laborForm = useForm<PmLaborFormValues>({
    resolver: zodResolver(pmLaborSchema),
    defaultValues: {
      labor_equipment: "",
      labor_rate: undefined,
      labor_hours: undefined,
      labor_cost: undefined,
    },
  });

  const [openTab, setOpenTab] = useState<"parts" | "labor">("parts");
  const [openDialog, setOpenDialog] = useState(false);
  const [partsRecords, setPartsRecords] = useState<PmPartFormValues[]>([]);
  const [laborRecords, setLaborRecords] = useState<PmLaborFormValues[]>([]);

  const isParts = openTab === "parts";

  useEffect(() => {
    if (!openDialog) return;
    if (isParts) {
      partForm.reset({
        parts_equipment: "",
        partNumber: "",
        part_quantity: undefined,
        part_cost: undefined,
      });
    } else {
      laborForm.reset({
        labor_equipment: "",
        labor_rate: undefined,
        labor_hours: undefined,
        labor_cost: undefined,
      });
    }
  }, [openDialog, isParts, partForm, laborForm]);

  const onPartSubmit = (data: PmPartFormValues) => {
    setPartsRecords((prev) => [...prev, data]);
    setOpenDialog(false);
  };

  const onLaborSubmit = (data: PmLaborFormValues) => {
    setLaborRecords((prev) => [...prev, data]);
    setOpenDialog(false);
  };

  const openAddDialog = () => {
    setOpenDialog(true);
  };

  return (
    <Tabs
      value={openTab}
      onValueChange={(value) => setOpenTab(value as "parts" | "labor")}
      className="space-y-4"
    >
      <div className="flex items-center justify-between gap-2">
        <TabsList>
          <TabsTrigger value="parts">Parts</TabsTrigger>
          <TabsTrigger value="labor">Labor</TabsTrigger>
        </TabsList>
        <Button
          type="button"
          size="sm"
          variant="primary"
          onClick={openAddDialog}
        >
          <Plus className="mr-2 size-4" />
          {isParts ? "Add Part" : "Add Labor"}
        </Button>
      </div>

      <TabsContent value="parts">
        <div className="mt-4 overflow-hidden rounded-md ring-1 ring-inset ring-stroke-soft-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part number</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Equipment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partsRecords.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.partNumber}</TableCell>
                  <TableCell>{item.part_quantity}</TableCell>
                  <TableCell>{item.part_cost}</TableCell>
                  <TableCell>{item.parts_equipment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="labor">
        <div className="mt-4 overflow-hidden rounded-md ring-1 ring-inset ring-stroke-soft-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {laborRecords.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.labor_equipment}</TableCell>
                  <TableCell>{item.labor_rate}</TableCell>
                  <TableCell>{item.labor_hours}</TableCell>
                  <TableCell>{item.labor_cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      {isParts ? (
        <FormModal
          open={openDialog}
          onOpenChange={setOpenDialog}
          title="Add part"
          description="Assign a part, quantity, and cost to this PM template service."
          formId="pm-template-part-form"
          form={partForm}
          onSubmit={onPartSubmit}
          submitLabel="Add part"
          size="md"
          scrollable
        >
          <ComboboxFieldWrapper
            control={partForm.control}
            name="parts_equipment"
            label="Equipment"
            options={equipmentOptions}
          />
          <ComboboxFieldWrapper
            control={partForm.control}
            name="partNumber"
            label="Part number"
            options={partOptions}
          />
          <InputWrapper
            control={partForm.control}
            name="part_quantity"
            label="Quantity"
            type="number"
          />
          <InputWrapper
            control={partForm.control}
            name="part_cost"
            label="Cost"
            type="number"
          />
        </FormModal>
      ) : (
        <FormModal
          open={openDialog}
          onOpenChange={setOpenDialog}
          title="Add labor"
          description="Add labor rate, hours, and cost for this PM template service."
          formId="pm-template-labor-form"
          form={laborForm}
          onSubmit={onLaborSubmit}
          submitLabel="Add labor"
          size="md"
          scrollable
        >
          <ComboboxFieldWrapper
            control={laborForm.control}
            name="labor_equipment"
            label="Equipment"
            options={equipmentOptions}
          />
          <InputWrapper
            control={laborForm.control}
            name="labor_rate"
            label="Rate"
            type="number"
          />
          <InputWrapper
            control={laborForm.control}
            name="labor_hours"
            label="Hours"
            type="number"
          />
          <InputWrapper
            control={laborForm.control}
            name="labor_cost"
            label="Cost"
            type="number"
          />
        </FormModal>
      )}
    </Tabs>
  );
}
