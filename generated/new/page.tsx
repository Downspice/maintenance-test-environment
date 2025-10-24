import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import TextareaWrapper from "@/components/forms/wrappers/TextareaWrapper";
import {ComboboxFieldWrapper} from "@/components/forms/wrappers/ComboboxWrapper";

// Zod schema
export const requestSchema = z.object({
  requestType: z.string().min(1, "Request type is required"),
  requestID: z.string().min(1, "Request ID is required"),
  description: z.string().min(1, "Description is required"),
  scheduleOfficer: z.string().min(1, "Schedule officer is required"),
  dateOfRequest: z.string().min(1, "Date of request is required"),
  institution: z.string().min(1, "Institution is required"),
  compensationBudget: z.coerce.number().min(0),
  compensationReleases: z.coerce.number().min(0),
  compensationBalance: z.coerce.number().min(0),
  compensationCurrent: z.coerce.number().min(0),
  compensationApproved: z.coerce.number().min(0),
  capexBudget: z.coerce.number().min(0),
  capexReleases: z.coerce.number().min(0),
  capexBalance: z.coerce.number().min(0),
  capexCurrent: z.coerce.number().min(0),
  capexApproved: z.coerce.number().min(0),
  goodsAndServicesBudget: z.coerce.number().min(0),
  goodsAndServicesReleases: z.coerce.number().min(0),
  goodsAndServicesBalance: z.coerce.number().min(0),
  goodsAndServicesCurrent: z.coerce.number().min(0),
  goodsAndServicesApproved: z.coerce.number().min(0),
  totalBudget: z.coerce.number().min(0),
  totalReleases: z.coerce.number().min(0),
  totalBalance: z.coerce.number().min(0),
  totalCurrent: z.coerce.number().min(0),
  totalApproved: z.coerce.number().min(0),
  entityApprovedBudgetWorkPerfomed: z.string().optional(),
  entityApprovedBudgetRefernceNumber: z.string().optional(),
  authorisedbytheHeadofEntityWorkPerfomed: z.string().optional(),
  authorisedbytheHeadofEntityRefernceNumber: z.string().optional(),
  fundsToAccommodateCurrentRequestWorkPerfomed: z.string().optional(),
  fundsToAccommodateCurrentRequestRefernceNumber: z.string().optional(),
  procurementPlanRequestWorkPerfomed: z.string().optional(),
  procurementPlanRefernceNumber: z.string().optional(),
  inclusiveOfApplicableTaxesWorkPerfomed: z.string().optional(),
  inclusiveOfApplicableTaxesRefernceNumber: z.string().optional(),
  controlsOrRelevantLawsWorkPerfomed: z.string().optional(),
  controlsOrRelevantLawsRefernceNumber: z.string().optional(),
  compliantStatus: z.enum(["Yes", "No"]),
  reasonForNonCompliance: z.string().optional(),
  statusOfRequest: z.enum(["passed", "failed", "outstanding"]),
  supportingDocument: z.array(z.any()).optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

const requestTypeOptions = [
  { name: "Type 1", id: "Type1" },
  { name: "Type 2", id: "Type2" },
];

const compliantStatusOptions = [
  { name: "Yes", id: "Yes" },
  { name: "No", id: "No" },
];

const statusOfRequestOptions = [
  { name: "Passed", id: "passed" },
  { name: "Failed", id: "failed" },
  { name: "Outstanding", id: "outstanding" },
];

export default function RequestFormPage() {
  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {},
  });

  function onSubmit(data: RequestFormValues) {
    console.log(data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <ComboboxFieldWrapper
        control={form.control}
        name="requestType"
        label="Request Type"
        options={requestTypeOptions}
      />
      <InputWrapper
        control={form.control}
        name="requestID"
        label="Request ID"
      />
      <TextareaWrapper
        control={form.control}
        name="description"
        label="Description"
      />
      <InputWrapper
        control={form.control}
        name="scheduleOfficer"
        label="Schedule Officer"
      />
      <InputWrapper
        control={form.control}
        name="dateOfRequest"
        label="Date of Request"
        type="date"
      />
      <InputWrapper
        control={form.control}
        name="institution"
        label="Institution"
      />
      <InputWrapper
        control={form.control}
        name="compensationBudget"
        label="Compensation Budget"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="compensationReleases"
        label="Compensation Releases"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="compensationBalance"
        label="Compensation Balance"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="compensationCurrent"
        label="Compensation Current"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="compensationApproved"
        label="Compensation Approved"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="capexBudget"
        label="Capex Budget"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="capexReleases"
        label="Capex Releases"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="capexBalance"
        label="Capex Balance"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="capexCurrent"
        label="Capex Current"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="capexApproved"
        label="Capex Approved"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="goodsAndServicesBudget"
        label="Goods and Services Budget"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="goodsAndServicesReleases"
        label="Goods and Services Releases"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="goodsAndServicesBalance"
        label="Goods and Services Balance"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="goodsAndServicesCurrent"
        label="Goods and Services Current"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="goodsAndServicesApproved"
        label="Goods and Services Approved"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="totalBudget"
        label="Total Budget"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="totalReleases"
        label="Total Releases"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="totalBalance"
        label="Total Balance"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="totalCurrent"
        label="Total Current"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="totalApproved"
        label="Total Approved"
        type="number"
      />
      <InputWrapper
        control={form.control}
        name="entityApprovedBudgetWorkPerfomed"
        label="Entity Approved Budget Work Perfomed"
      />
      <InputWrapper
        control={form.control}
        name="entityApprovedBudgetRefernceNumber"
        label="Entity Approved Budget Reference Number"
      />
      <InputWrapper
        control={form.control}
        name="authorisedbytheHeadofEntityWorkPerfomed"
        label="Authorised by the Head of Entity Work Perfomed"
      />
      <InputWrapper
        control={form.control}
        name="authorisedbytheHeadofEntityRefernceNumber"
        label="Authorised by the Head of Entity Reference Number"
      />
      <InputWrapper
        control={form.control}
        name="fundsToAccommodateCurrentRequestWorkPerfomed"
        label="Funds to Accommodate the Current Request Work Perfomed"
      />
      <InputWrapper
        control={form.control}
        name="fundsToAccommodateCurrentRequestRefernceNumber"
        label="Funds to Accommodate the Current Request Reference Number"
      />
      <InputWrapper
        control={form.control}
        name="procurementPlanRequestWorkPerfomed"
        label="Procurement Plan Request Work Perfomed"
      />
      <InputWrapper
        control={form.control}
        name="procurementPlanRefernceNumber"
        label="Procurement Plan Reference Number"
      />
      <InputWrapper
        control={form.control}
        name="inclusiveOfApplicableTaxesWorkPerfomed"
        label="Inclusive of Applicable Taxes Work Perfomed"
      />
      <InputWrapper
        control={form.control}
        name="inclusiveOfApplicableTaxesRefernceNumber"
        label="Inclusive of Applicable Taxes Reference Number"
      />
      <InputWrapper
        control={form.control}
        name="controlsOrRelevantLawsWorkPerfomed"
        label="Controls or Relevant Laws, Regulations or Policies Work Perfomed"
      />
      <InputWrapper
        control={form.control}
        name="controlsOrRelevantLawsRefernceNumber"
        label="Controls or Relevant Laws, Regulations or Policies Reference Number"
      />
      <ComboboxFieldWrapper
        control={form.control}
        name="compliantStatus"
        label="Compliant Status"
        options={compliantStatusOptions}
      />
      <TextareaWrapper
        control={form.control}
        name="reasonForNonCompliance"
        label="Reason for Non-Compliance"
      />
      <ComboboxFieldWrapper
        control={form.control}
        name="statusOfRequest"
        label="Status of Request"
        options={statusOfRequestOptions}
      />
      <InputWrapper
        control={form.control}
        name="supportingDocument"
        label="Supporting Document"
        type="file"
      />
      <button type="submit">Submit</button>
    </form>
  );
}