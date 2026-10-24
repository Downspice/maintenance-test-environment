"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useMemo } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MultiComboboxWrapper } from "@/components/forms/fields/ComboboxWrapper";
import { useGetEmployees } from "@/services/setups/employee";
import { useGetVendors } from "@/services/setups/vendor";
import { useUpdateWorkOrderAssignee } from "@/services/setups/workOrder";

// Define the form schema with Zod
export const ChangeAssigneeSchema = z.object({
  assignee_ids: z.array(z.string()).optional(),
});

export type ChangeAssigneeFormData = z.infer<typeof ChangeAssigneeSchema>;

interface ChangeAssigneesFormProps {
  data: {
    id: string;
    wo_number?: string | number;
    workOrderNumber?: string | number;
    assigned_to?: Array<{
      id?: string;
      assignee_id: string;
      assignee_type_name: string;
      assignee_name: string;
    }>;
  };
  onSuccess?: () => void;
}

export default function ChangeAssigneesForm({
  data,
  onSuccess,
}: ChangeAssigneesFormProps) {
  // Determine initial assignee type from existing data
  const initialAssigneeType = useMemo(() => {
    if (data.assigned_to && data.assigned_to.length > 0) {
      return data.assigned_to[0].assignee_type_name as "Employee" | "Vendor";
    }
    return "Employee";
  }, [data.assigned_to]);

  const [assigneeType, setAssigneeType] = useState<"Employee" | "Vendor">(
    initialAssigneeType
  );

  // Fetch employees and vendors
  const { data: employeeOptions } = useGetEmployees<any[]>();
  const { data: vendorOptions } = useGetVendors<any[]>();

  // Transform options for MultiComboboxWrapper
  const transformedEmployeeOptions = useMemo(() => {
    return (employeeOptions || []).map((emp: any) => ({
      id: emp.id,
      name: `${emp.last_name || ""}, ${emp.first_name || ""}`
        .trim()
        .replace(/^, /, "")
        .replace(/,$/, ""),
    }));
  }, [employeeOptions]);

  const transformedVendorOptions = useMemo(() => {
    return (vendorOptions || []).map((vendor: any) => ({
      id: vendor.id,
      name: vendor.name || "",
    }));
  }, [vendorOptions]);

  // Get initial assignee IDs
  const initialAssigneeIds = useMemo(() => {
    if (data.assigned_to && data.assigned_to.length > 0) {
      return data.assigned_to.map((a) => a.assignee_id);
    }
    return [];
  }, [data.assigned_to]);

  const { mutate: updateAssignee, isPending } = useUpdateWorkOrderAssignee();

  const form = useForm<ChangeAssigneeFormData>({
    resolver: zodResolver(ChangeAssigneeSchema),
    defaultValues: {
      assignee_ids: initialAssigneeIds,
    },
  });

  async function handleSubmit(formData: ChangeAssigneeFormData) {
    // Transform assignee_ids to assignees array format
    const assignees = (formData.assignee_ids || []).map((id) => ({
      assignee_type: assigneeType,
      assignee_id: id,
    }));

    const payload = {
      id: data.id,
      assignees,
    };

    updateAssignee(payload, {
      onSuccess: () => {
        toast.success("Assignee updated successfully!");
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to update assignee"
        );
        console.error(error);
      },
    });
  }

  // Reset form when assignee type changes
  const handleAssigneeTypeChange = (value: string) => {
    setAssigneeType(value as "Employee" | "Vendor");
    form.setValue("assignee_ids", []);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => handleSubmit(data))}
          className="w-full"
        >
          <div className="flex flex-col space-y-4">
            <div className="space-y-4">
              <RadioGroup
                value={assigneeType}
                onValueChange={handleAssigneeTypeChange}
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Employee" id="change-assignee-r1" />
                  <Label htmlFor="change-assignee-r1">Employee</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Vendor" id="change-assignee-r2" />
                  <Label htmlFor="change-assignee-r2">Vendor</Label>
                </div>
              </RadioGroup>

              <MultiComboboxWrapper
                control={form.control}
                name="assignee_ids"
                label=""
                options={
                  assigneeType === "Employee"
                    ? transformedEmployeeOptions
                    : transformedVendorOptions
                }
                placeholder={`Select ${assigneeType}s`}
                searchPlaceholder={`Search ${assigneeType}s...`}
                maxSelections={assigneeType === "Employee" ? 2 : 1}
              />
            </div>
          </div>

          <div className="flex justify-between gap-x-4 my-8 w-full">
            <Button className="w-full" disabled={isPending}>
              <GitPullRequestArrow className="mr-2" />
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
