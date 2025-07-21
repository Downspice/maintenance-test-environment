"use client";
import Fieldset from "@/components/customUI/fieldset";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import z from "zod";
import RadioGroupWrapper from "@/components/forms/wrappers/RadioGroupWrapper";
import { PurchaseOrderInterface } from "@/lib/PurchaseOrder/purchaseOrder-data";
import EditPurchaseOrderFormMoreButton from "./editGeneratePOMoreButton";

// === Options ===
const generatePOOptions = [
  { value: "Manual PO", label: "Manual PO" },
  {
    value: "Automatic PO -Work Order Based",
    label: "Automatic PO -Work Order Based",
  },
  {
    value: "Automatic PO -Reorder Based",
    label: "Automatic PO -Reorder Based",
  },
];

// === Schema ===
export const GeneratePO = z.object({
  generatePO: z.string().min(1, "Selection is required"),
});
type GeneratePOFormValues = z.infer<typeof GeneratePO>;

// === Component ===
export default function GeneratePOMoreButtonView() {
  const form = useForm<GeneratePOFormValues>({
    resolver: zodResolver(GeneratePO),
    defaultValues: {},
  });

  const [showEditPOForm, setShowEditPOForm] = useState(false);
  const [submittedPOData, setSubmittedPOData] =
    useState<Partial<PurchaseOrderInterface> | null>(null);

  const onSubmit = (data: GeneratePOFormValues) => {
    if (data.generatePO === "Manual PO") {
      setSubmittedPOData({ purchaseorderNumber: "PO-001", ...data }); // Replace with actual PO data
      setShowEditPOForm(true);
    } else {
      // Handle other types if needed
      toast.success(`PO type "${data.generatePO}" selected`);
    }
  };

  const onError = (errors: any) => {
    const errorMessages = Object.entries(errors).map(
      ([field, error]: [string, any]) => {
        return `${field}: ${error.message}`;
      }
    );

    toast.error("Please fix the following errors:", {
      description: (
        <div className="mt-2">
          <ul className="list-disc list-inside space-y-1 text-sm">
            {errorMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      ),
      duration: 8000,
    });
  };

  return (
    <>
      {showEditPOForm && submittedPOData ? (
        <EditPurchaseOrderFormMoreButton data={submittedPOData} />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-6"
          >
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
            <Button type="submit" className="w-full">
              Generate
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
