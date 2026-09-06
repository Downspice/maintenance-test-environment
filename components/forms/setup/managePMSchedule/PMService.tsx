"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
 import InputWrapper from "@/components/forms/fields/InputWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ComboboxFieldWrapper } from "@/components/forms/fields/ComboboxWrapper";

const partOptions = [
  { name: "Oil Filter (PN-123)", id: "PN-123" },
  { name: "Hydraulic Fluid (PN-456)", id: "PN-456" },
];

const equipmentOptions = [
  { name: "Forklift", id: "forklift" },
  { name: "Light System", id: "lights" },
];

const MaintenanceFormSchema = z.object({
  parts_equipment: z.string().min(1),
  partNumber: z.string().optional(),
  part_quantity: z.coerce.number().optional(),
  part_cost: z.coerce.number().optional(),
  labor_equipment: z.string().min(1),
  labor_rate: z.coerce.number().optional(),
  labor_hours: z.coerce.number().optional(),
  labor_cost: z.coerce.number().optional(),
  instruction_equipment: z.string().min(1),
  photos: z.any().optional(),
  generalNotes: z.string().optional(),
  estimatedLaborTime: z.coerce.number().optional(),
  includePMServiceEmail: z.boolean().optional(),
  linkedPMService: z.boolean().optional(),
  linkedServiceOption: z.string().optional(),
  terminateOnDate: z.boolean().optional(),
  terminateDate: z.date().optional(),
  terminateAtMeter: z.boolean().optional(),
  meterReading: z.coerce.number().optional(),
  ignorePMInDateRange: z.boolean().optional(),
  ignoreStartDate: z.date().optional(),
  ignoreEndDate: z.date().optional(),
});

type MaintenanceFormValues = z.infer<typeof MaintenanceFormSchema>;

export default function FullMaintenanceForm() {
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(MaintenanceFormSchema),
  });
  const { handleSubmit, control, watch, reset } = form;

  const [openTab, setOpenTab] = useState<"parts" | "labor">("parts");
  const [openDialog, setOpenDialog] = useState(false);
  const [partsRecords, setPartsRecords] = useState<any[]>([]);
  const [laborRecords, setLaborRecords] = useState<any[]>([]);

  const onSubmit = (data: MaintenanceFormValues) => {
    if (openTab === "parts") {
      setPartsRecords(prev => [...prev, data]);
    } else {
      setLaborRecords(prev => [...prev, data]);
    }
    reset();
    setOpenDialog(false);
  };

  return (
    <Tabs defaultValue="parts" className="space-y-4">
      <TabsList>
        <TabsTrigger value="parts" onClick={() => setOpenTab("parts")}>Parts</TabsTrigger>
        <TabsTrigger value="labor" onClick={() => setOpenTab("labor")}>Labor</TabsTrigger>
      </TabsList>

      <TabsContent value="parts">
        <Button onClick={() => setOpenDialog(true)}>Add Part</Button>
        <table className="w-full mt-4 border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Part Number</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Cost</th>
              <th className="p-2">Equipment</th>
            </tr>
          </thead>
          <tbody>
            {partsRecords.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{item.partNumber}</td>
                <td className="p-2">{item.part_quantity}</td>
                <td className="p-2">{item.part_cost}</td>
                <td className="p-2">{item.parts_equipment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TabsContent>

      <TabsContent value="labor">
        <Button onClick={() => setOpenDialog(true)}>Add Labor</Button>
        <table className="w-full mt-4 border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Equipment</th>
              <th className="p-2">Rate</th>
              <th className="p-2">Hours</th>
              <th className="p-2">Cost</th>
            </tr>
          </thead>
          <tbody>
            {laborRecords.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{item.labor_equipment}</td>
                <td className="p-2">{item.labor_rate}</td>
                <td className="p-2">{item.labor_hours}</td>
                <td className="p-2">{item.labor_cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TabsContent>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{openTab === "parts" ? "Add Part" : "Add Labor"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {openTab === "parts" ? (
              <>
                <ComboboxFieldWrapper control={control} name="parts_equipment" label="Equipment" options={equipmentOptions} />
                <ComboboxFieldWrapper control={control} name="partNumber" label="Part Number" options={partOptions} />
                <InputWrapper control={control} name="part_quantity" label="Quantity" type="number" />
                <InputWrapper control={control} name="part_cost" label="Cost" type="number" />
              </>
            ) : (
              <>
                <ComboboxFieldWrapper control={control} name="labor_equipment" label="Equipment" options={equipmentOptions} />
                <InputWrapper control={control} name="labor_rate" label="Rate" type="number" />
                <InputWrapper control={control} name="labor_hours" label="Hours" type="number" />
                <InputWrapper control={control} name="labor_cost" label="Cost" type="number" />
              </>
            )}
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
