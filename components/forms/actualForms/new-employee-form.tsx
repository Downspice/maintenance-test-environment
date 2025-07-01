"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GitPullRequestArrow } from "lucide-react";
import TextareaWrapper from "../wrappers/TextareaWrapper";
import { toast } from "sonner";
import InputWrapper from "../wrappers/InputWrapper";
import {
  categoryOptions,
  employeeTypeOptions,
  statusOptions,
} from "@/lib/equipment-schema";
import SelectWrapper from "../wrappers/SelectWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EmployeeCheckboxOptions,
  equipmentCheckboxOptions,
  equipmentOptionsList,
  locationOptionsList,
} from "@/lib/option-list";
import FormSubheader from "../ui/formSubheader";
import CustomFieldsWrapper from "../wrappers/CustomFieldsWrapper";
import DatePickerWrapper from "../wrappers/DatePickerWrapper";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUploadWrapper from "../wrappers/FileUploadWrapper";
import CheckboxWrapper from "../wrappers/CheckboxWrapper";

// Define the form schema with Zod
export const vendorSchema = z.object({
  equipmentId: z.string({
    required_error: "Equipment is required",
  }),
  date: z.date().optional(),
  notes: z.string().optional(),
});

export default function NewEmployeeForm() {
  const [customFields, setCustomFields] = useState<
    { name: string; value: string }[]
  >([]);

  const vendorForm = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {},
  });

  async function handleSubmit(data: z.infer<typeof vendorSchema>) {
    console.log(data);
    // Here you would typically send the data to your API

    toast.success("Work Order submitted successfully!");
  }

  return (
    <div className="w-full">
      <Form {...vendorForm}>
        <form
          onSubmit={vendorForm.handleSubmit((data) => handleSubmit(data))}
          className="w-full"
        >
          <Tabs defaultValue="general" className="w-full">
            <TabsList>
              <TabsTrigger value="employee">Employee</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="renewals">Renewals</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
            </TabsList>
            <TabsContent value="employee">
              <div className="flex flex-col gap-1">
                <FormSubheader header={"Employment"} />
                <div className="flex flex-row">
                  <InputWrapper
                    control={vendorForm.control}
                    name="last"
                    label="Last Name"
                    type="text"
                    value={undefined}
                  />
                  <InputWrapper
                    control={vendorForm.control}
                    name="first"
                    label="First Name"
                    type="text"
                    value={undefined}
                  />
                  <InputWrapper
                    control={vendorForm.control}
                    name="middle"
                    label="Middle name"
                    type="text"
                    value={undefined}
                  />
                </div>

                <InputWrapper
                  control={vendorForm.control}
                  name="street1"
                  label="Address 1"
                  type="text"
                  value={undefined}
                />

                <InputWrapper
                  className="pt-0"
                  control={vendorForm.control}
                  name="street2"
                  placeholder="Address 2 "
                  label=""
                  type="text"
                  value={undefined}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <InputWrapper
                      control={vendorForm.control}
                      name="city"
                      label="City"
                      type="text"
                      value={undefined}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={vendorForm.control}
                      name="state"
                      label="State /Province"
                      type="text"
                      value={undefined}
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={vendorForm.control}
                      name="postalCode"
                      label="Postal Code"
                      type="text"
                      value={undefined}
                    />
                  </div>
                  <div className="col-span-1"></div>
                </div>

                <FormSubheader header={"Contact"} />
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-1">
                    {" "}
                    <InputWrapper
                      control={vendorForm.control}
                      name="home"
                      label="Home "
                      type="number"
                      value={" "}
                      className="col-span-1"
                    />{" "}
                  </div>
                  <div className="col-span-1">
                    {" "}
                    <InputWrapper
                      control={vendorForm.control}
                      name="altPhone"
                      label="Alt. Phone "
                      type="number"
                      value={""}
                      className="col-span-1"
                    />{" "}
                  </div>
                  <div className="col-span-1">
                    {" "}
                    <InputWrapper
                      control={vendorForm.control}
                      name="cell"
                      label="Cell"
                      type="number"
                      value={""}
                    />{" "}
                  </div>
                </div>
                <InputWrapper
                  control={vendorForm.control}
                  name="email"
                  label="Email"
                  type="text"
                  value={""}
                />
                <div className="flex flex-col gap-4">
                  <TextareaWrapper
                    control={vendorForm.control}
                    name="notes"
                    label="Notes"
                    rows={4}
                    value={undefined}
                  />
                </div>
                <FormSubheader header={"Miscellaneous"} />
                <CustomFieldsWrapper
                  control={vendorForm.control}
                  name="customFields"
                  label="Custom Fields"
                  maxFields={4}
                />
              </div>
            </TabsContent>
            <TabsContent value="details">
              <div className="flex flex-col gap-1">
                <FormSubheader header={"Employment"} />
                <SelectWrapper
                  control={vendorForm.control}
                  name="status"
                  label="Status "
                  required
                  options={statusOptions}
                />
                <div className="grid grid-cols-2 gap-1">
                  <div className="col-span-1">
                    {" "}
                    <DatePickerWrapper
                      control={vendorForm.control}
                      name="date"
                      label="Date"
                    />{" "}
                  </div>
                  <div className="col-span-1">
                    {" "}
                    <DatePickerWrapper
                      control={vendorForm.control}
                      name="leaveDate"
                      label="Leave Date"
                    />{" "}
                  </div>
                  <div className="col-span-1">
                    {" "}
                    <DatePickerWrapper
                      control={vendorForm.control}
                      name="dob"
                      label="DOB"
                    />{" "}
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={vendorForm.control}
                      name="ssn"
                      label="SSN"
                      type="text"
                      value={undefined}
                    />
                  </div>
                  <div className="col-span-1">
                    <SelectWrapper
                      control={vendorForm.control}
                      name="type"
                      label="Type "
                      required
                      options={employeeTypeOptions}
                    />
                  </div>
                  <div className="col-span-1"></div>
                  <div className="col-span-1">
                    {" "}
                    <InputWrapper
                      control={vendorForm.control}
                      name="laborRate"
                      label="Last Rate"
                      type="number"
                      value={undefined}
                    />
                  </div>
                  <div className="col-span-1">
                    {" "}
                    <InputWrapper
                      control={vendorForm.control}
                      name="billingRate"
                      label="Billing Rate"
                      type="number"
                      value={undefined}
                    />
                  </div>
                  <div className="col-span-1">
                    <SelectWrapper
                      control={vendorForm.control}
                      name="location"
                      label="Location "
                      required
                      options={locationOptionsList}
                    />
                  </div>

                  <div className="col-span-1">
                    <SelectWrapper
                      control={vendorForm.control}
                      name="category"
                      label="Category "
                      required
                      options={categoryOptions}
                    />
                  </div>
                </div>
                <FormSubheader header={"Driver's License "} />

                <InputWrapper
                  control={vendorForm.control}
                  name="driverNumber"
                  label="Number"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="driverClass"
                  label="Class"
                  type="text"
                  value={undefined}
                />
                <InputWrapper
                  control={vendorForm.control}
                  name="state"
                  label="State/Province"
                  type="text"
                  value={undefined}
                />
                <TextareaWrapper
                  control={vendorForm.control}
                  name="notes"
                  label="Notes"
                  rows={4}
                  value={undefined}
                />
              </div>
            </TabsContent>
            <TabsContent value="renewals">
              Change your password here.
            </TabsContent>
            <TabsContent value="notifications">
              <div className="grid grid-cols-2">
                <div className="col-span-1">
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {locationOptionsList.map((location) => (
                          <SelectItem
                            key={location.value}
                            value={location.value}
                          >
                            {location.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <div className="grid grid-cols-4">
                    <div className="col-span-1">Equipment Name</div>
                    <div className="col-span-3">Options</div>{" "}
                  </div>
                  {equipmentOptionsList.map((equipment) => (
                    <div className="grid grid-cols-4" key={equipment.value}>
                      <div className="col-span-1 flex item-baseline ">{equipment.label}</div>
                      <div className="col-span-3">
                        <CheckboxWrapper
                          control={vendorForm.control}
                          name={"tracker"}
                          label={""}
                          options={EmployeeCheckboxOptions}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="photos">
              <FileUploadWrapper
                control={vendorForm.control}
                name="Photos"
                label="Photos"
              />
            </TabsContent>
            <TabsContent value="attachments">
              <FileUploadWrapper
                control={vendorForm.control}
                name="Attachments"
                label="Attachments"
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-between gap-x-4 my-8 w-full">
            <Button className=" w-full">
              <GitPullRequestArrow className="mr-2" /> Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
