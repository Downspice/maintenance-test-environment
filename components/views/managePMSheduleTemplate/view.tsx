import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ManagePMScheduleTemplateView() {
  
  return (
    <Tabs defaultValue="main" orientation="vertical" className="w-full">
      <TabsList orientation="vertical">
        <TabsTrigger value="main">Main</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
        <TabsTrigger value="warranty">Warranty/Misc</TabsTrigger>
        <TabsTrigger value="purchase">Purchase</TabsTrigger>
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="attachments">Attachments</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <div className="flex-1">
        <TabsContent value="settings" className="space-y-2">
           
        </TabsContent>
        <TabsContent value="notes" className="space-y-2">
          
        </TabsContent>
        <TabsContent value="main">
         f
        </TabsContent>
        <TabsContent value="specifications" className="space-y-2"> 

        </TabsContent>
        <TabsContent
          value="warranty"
          className="space-x-2 space-y-2 grid grid-cols-2 "
        >
          f
        </TabsContent>

        <TabsContent
          value="purchase"
          className="space-x-2 space-y-2 grid grid-cols-2 "
        >
          <Fieldset
            className="col-span-1"
            legend="Purchase Details"
            content={
              <>
                <ComboboxFieldWrapper
                  label="Dealer"
                  control={form.control}
                  options={vendorOptions}
                  name="vendor"
                />
                <DatePickerWrapper
                  control={form.control}
                  name="purchaseDate"
                  label="Purchase Date"
                />
                <InputWrapper
                  control={form.control}
                  name="meter"
                  label={"Meter"}
                  type="number"
                  value={""}
                  className=""
                />
                <InputWrapper
                  control={form.control}
                  name="price"
                  label={"Price"}
                  type="number"
                  value={""}
                  className=""
                />
                <CustomFieldsWrapper
                  name="purchaseOrderCustom"
                  label="Custom Field"
                  control={form.control}
                />

                <InputWrapper
                  control={form.control}
                  name="note"
                  label={"Notes"}
                  type="text"
                  value={""}
                  className=""
                />
              </>
            }
          />
          <Fieldset
            className="col-span-1"
            legend="Depreciation"
            content={
              <>
                <InputWrapper
                  control={form.control}
                  name="depreciationLifeMonths"
                  label="Term (Months)"
                  type="number"
                  value={""}
                  className="flex-1"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm">$</span>
                  <InputWrapper
                    control={form.control}
                    name="startingPrice"
                    label="Starting Value"
                    type="number"
                    value={""}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2 pb-2">
                  <span className="text-sm">$</span>
                  <InputWrapper
                    control={form.control}
                    name="salvagePrice"
                    label="Salvage Value"
                    type="number"
                    value={""}
                    className="flex-1"
                  />
                </div>
                <div className="border-t flex flex-col">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Depreciation (Monthly)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">$</span>
                      <Input
                        type="number"
                        value={""}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Value</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">$</span>
                      <Input
                        type="number"
                        value={""}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </>
            }
          />

          <div className="col-span-2 space-x-2">
            <Fieldset
              legend="Ownership/Status"
              content={
                <div className="grid grid-cols-2 space-x-2">
                  <div className="col-span-1">
                    <ComboboxFieldWrapper
                      control={form.control}
                      name="ownership"
                      label="Ownership"
                      options={ownershipOptions}
                    />
                    <DatePickerWrapper
                      control={form.control}
                      name="inService"
                      label="In service"
                    />
                    <DatePickerWrapper
                      control={form.control}
                      name="outService"
                      label="Out of Service"
                    />
                  </div>
                  <div className="col-span-1">
                    <DatePickerWrapper
                      control={form.control}
                      name="transferred"
                      label="Transferred Date"
                    />
                    <DatePickerWrapper
                      control={form.control}
                      name="soldDate"
                      label="Date sold"
                    />
                    <InputWrapper
                      control={form.control}
                      name="soldTo"
                      label="Sold To"
                      type="text"
                      value={""}
                      className="flex-1"
                    />
                    <InputWrapper
                      control={form.control}
                      name="notes"
                      label="Notes"
                      type="text"
                      value={""}
                      className="flex-1"
                    />
                  </div>
                </div>
              }
            />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );


}
