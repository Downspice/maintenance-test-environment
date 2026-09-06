"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UserRoundCheck } from "lucide-react";
import DatePickerWrapper from "../fields/DatePickerWrapper";
import { toast } from "sonner";
import InputWrapper from "../fields/InputWrapper";
import { ComboboxFieldWrapper } from "../fields/ComboboxWrapper";
import { useGetEmployeeRenewals } from "@/services/setups/employee";
// Define the form schema with Zod
export const updateEmployeeSchema = z.object({
  issued_on: z.date({
    required_error: "Date is required",
  }),
  expires_on: z.date({
    required_error: "Date is required",
  }),
  empNotes: z.string({}).optional(),
});

export default function UpdateEmployeeRenewalForm() {
  const { data: renewalOptionsList } = useGetEmployeeRenewals();

  const updateEmployee = useForm<z.infer<typeof updateEmployeeSchema>>({
    resolver: zodResolver(updateEmployeeSchema),
    // defaultValues: {
    //   equipmentId: "1311827",
    //   priority: "NORMAL",
    //   taskIds: ["25417067"],
    //   customFields: [],
    // },
  });

  async function handleSubmit(data: z.infer<typeof updateEmployeeSchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Work Order submitted successfully!");
  }

  return (
    <div>
      <Form {...updateEmployee}>
        <form
          onSubmit={updateEmployee.handleSubmit((data) => handleSubmit(data))}
        >
          <div id="fields">
            <div className="pt-4">
              <div className="grid grid-cols-1 gap-4 ">
                <ComboboxFieldWrapper
                  control={updateEmployee.control}
                  name="name"
                  label="Name"
                  options={renewalOptionsList}
                />
                <DatePickerWrapper
                  control={updateEmployee.control}
                  name="issued_on"
                  label="Issued"
                  required={true}
                />
                <DatePickerWrapper
                  control={updateEmployee.control}
                  name="expires_on"
                  required={true}
                  label="Expires"
                />
                <InputWrapper
                  control={updateEmployee.control}
                  name="empNotes"
                  label="NOTES"
                  type={""}
                  value={""}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-x-4 mt-8 w-full">
            <Button className="  w-full">
              <UserRoundCheck className="mr-2" /> Update Employee
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
