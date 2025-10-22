"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SelectWrapper from "@/components/forms/wrappers/SelectWrapper";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";

export default function WarehouseTabs({
  warehouses,
  setWarehouses,
  options,
  control,
  enableTrackingWatch,
  vendorOptions,
  costCenterOptions,
  inventoryMovement,
}: {
  warehouses: any[];
  setWarehouses: (val: string[]) => void;
  options: { name: string; id: string }[];
  control: any;
  enableTrackingWatch: boolean;
  vendorOptions: any[];
  costCenterOptions: any[];
  inventoryMovement: any[];
}) {
  const [selected, setSelected] = useState<string | undefined>();
  const [warehouseNames, setWarehouseNames] = useState<Record<string, string>>({});

  // Build a map of warehouse IDs to names for display
  useEffect(() => {
    const nameMap: Record<string, string> = {};
    options.forEach((opt) => {
      nameMap[opt.id] = opt.name;
    });
    setWarehouseNames(nameMap);
  }, [options]);

  const handleAddWarehouse = (val: string) => {
    if (!warehouses.includes(val)) {
      setWarehouses([...warehouses, val]);
    }
  };

  const handleDeleteWarehouse = (val: string) => {
    setWarehouses(warehouses.filter((w) => w !== val));
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Warehouses</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button">+ Add Warehouse</Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <Select onValueChange={(val) => setSelected(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Warehouse" />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={() => selected && handleAddWarehouse(selected)}
              className="mt-4"
            >
              Add
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {warehouses.length > 0 && (
        <Tabs defaultValue={warehouses[0] ?? ""}>
          <TabsList className="flex gap-2 overflow-x-auto">
            {warehouses.map((w) => (
              <div key={w} className="flex items-center gap-1">
                <TabsTrigger value={w}>
                  {warehouseNames[w] || w}
                </TabsTrigger>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteWarehouse(w)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </TabsList>

          {warehouses.map((w, index) => (
            <TabsContent key={w} value={w} className="border rounded p-4 mt-2">
              {/* Hidden field to store warehouse ID */}
              <InputWrapper
                control={control}
                name={`inventory_trackings.${index}.warehouse`}
                label=" "
                type="hidden"
                required={false}
                value={w}
              />
              <div className="flex flex-row gap-x-3">
                <InputWrapper
                  control={control}
                  name={`inventory_trackings.${index}.aisle`}
                  label="Aisle"
                  type="text"
                  required={false}
                  value=""
                />
                <InputWrapper
                  control={control}
                  name={`inventory_trackings.${index}.row`}
                  label="Row"
                  type="text"
                  required={false}
                  value=""
                />
                <InputWrapper
                  control={control}
                  name={`inventory_trackings.${index}.bin`}
                  label="Bin"
                  type="text"
                  required={false}
                  value=""
                />
              </div>
              <SelectWrapper
                control={control}
                name={`inventory_trackings.${index}.vendor`}
                label="Vendor"
                options={vendorOptions}
              />
              <SelectWrapper
                control={control}
                name={`inventory_trackings.${index}.costCenter`}
                label="Cost Center"
                options={costCenterOptions}
              />
              {enableTrackingWatch && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="col-span-1">
                    <InputWrapper
                      control={control}
                      name={`inventory_trackings.${index}.quantity`}
                      label="Quantity"
                      type="number"
                      required={false}
                      value={0}
                    />
                  </div>
                  <div className="col-span-1"></div>
                  <div className="col-span-1"></div>

                  <div className="col-span-1">
                    <InputWrapper
                      control={control}
                      name={`inventory_trackings.${index}.reorderPoint`}
                      label="Reorder Point"
                      type="number"
                      required={false}
                      value=""
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={control}
                      name={`inventory_trackings.${index}.reorderQty`}
                      label="Reorder Qty"
                      type="number"
                      required={false}
                      value=""
                    />
                  </div>

                  <div className="col-span-1">
                    <InputWrapper
                      control={control}
                      name={`inventory_trackings.${index}.maxQty`}
                      label="Max Qty"
                      type="number"
                      required={false}
                      value=""
                    />
                  </div>
                  <div className="col-span-1">
                    <InputWrapper
                      control={control}
                      name={`inventory_trackings.${index}.leadTime`}
                      label="Lead Time"
                      type="number"
                      required={false}
                      value=""
                    />
                  </div>
                  <div className="col-span-1">
                    <SelectWrapper
                      control={control}
                      name={`inventory_trackings.${index}.movementType`}
                      label="Type"
                      options={inventoryMovement}
                      required
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}