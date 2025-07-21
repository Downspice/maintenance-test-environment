"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Fieldset from "@/components/customUI/fieldset";
import RadioGroupWrapper from "@/components/forms/wrappers/RadioGroupWrapper";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { PurchaseOrderInterface } from "@/lib/PurchaseOrder/purchaseOrder-data";
import EditPurchaseOrderFormMoreButton from "./editGeneratePOMoreButton";

// Dummy table data
const dummyTableData = [
  { vendor: "Vendor A", workOrder: "WO-101", partNumber: "P-001", name: "Part A" },
  { vendor: "Vendor B", workOrder: "WO-102", partNumber: "P-002", name: "Part B" },
];

const generatePOOptions = [
  { value: "Manual PO", label: "Manual PO" },
  { value: "Automatic PO -Work Order Based", label: "Automatic PO -Work Order Based" },
  { value: "Automatic PO -Reorder Based", label: "Automatic PO -Reorder Based" },
];

const GeneratePO = z.object({
  generatePO: z.string().min(1, "Selection is required"),
});
type GeneratePOFormValues = z.infer<typeof GeneratePO>;

export default function GeneratePOMoreButtonView() {
  const form = useForm<GeneratePOFormValues>({
    resolver: zodResolver(GeneratePO),
  });

  const [showEditPOForm, setShowEditPOForm] = useState(false);
  const [submittedPOData, setSubmittedPOData] = useState<Partial<PurchaseOrderInterface> | null>(null);
  const [showTableModal, setShowTableModal] = useState(false);

  const onSubmit = (data: GeneratePOFormValues) => {
    if (data.generatePO === "Manual PO") {
      setSubmittedPOData({ purchaseOrderNumber: "PO-001", ...data });
      setShowEditPOForm(true);
    } else {
      setShowTableModal(true); // open table modal for other options
    }
  };

  const onError = (errors: any) => {
    const errorMessages = Object.entries(errors).map(
      ([field, error]: [string, any]) => `${field}: ${error.message}`
    );

    toast.error("Please fix the following errors:", {
      description: (
        <ul className="list-disc list-inside text-sm mt-2">
          {errorMessages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      ),
    });
  };

  const handleOkay = () => {
    setSubmittedPOData({ purchaseOrderNumber: "AUTO-PO-XYZ" });
    setShowTableModal(false);
    setShowEditPOForm(true);
  };

  const handleCancel = () => {
    setShowTableModal(false);
  };

  return (
    <>
      {showEditPOForm && submittedPOData ? (
        // Replace with your actual EditPurchaseOrderForm
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Edit Purchase Order</h2>
          {/* <pre>{JSON.stringify(submittedPOData, null, 2)}</pre> */}
          <EditPurchaseOrderFormMoreButton data={submittedPOData}/>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
            <Fieldset
              legend="Generate PO"
              content={
                <RadioGroupWrapper
                  control={form.control}
                  name="generatePO"
                  label=""
                  options={generatePOOptions}
                />
              }
            />
            <Button type="submit" className="w-full">Generate</Button>
          </form>
        </Form>
      )}

      {/* Modal with Table */}
      <Dialog open={showTableModal} onOpenChange={setShowTableModal}>
        <DialogContent className="max-w-3xl">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Purchase Order Details</h3>
            <div className="overflow-auto max-h-[300px] border rounded">
              <table className="min-w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left">Vendor</th>
                    <th className="px-4 py-2 text-left">WorkOrder #</th>
                    <th className="px-4 py-2 text-left">Part #</th>
                    <th className="px-4 py-2 text-left">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyTableData.map((row, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{row.vendor}</td>
                      <td className="px-4 py-2">{row.workOrder}</td>
                      <td className="px-4 py-2">{row.partNumber}</td>
                      <td className="px-4 py-2">{row.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleOkay}>Okay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
