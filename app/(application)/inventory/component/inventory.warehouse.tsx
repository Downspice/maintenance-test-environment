"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
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

      <Tabs defaultValue={warehouses[0] ?? ""}>
        <TabsList className="flex gap-2 overflow-x-auto">
          {warehouses.map((w) => (
            <div key={w} className="flex items-center gap-1">
              <TabsTrigger value={w}>{w}</TabsTrigger>
              <Button
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
             
            <InputWrapper
                control={control}
                name={`warehouses.${index}.warehouse`} 
                label=" "
                type="hidden"
                required={false}
                value={w}
              />
            <div className="flex flex-row gap-x-3">
              <InputWrapper
                control={control}
                name={`warehouses.${index}.aisle`}
                label="Aisle"
                type="text"
                required
                value=""
              />
              <InputWrapper
                control={control}
                name={`warehouses.${index}.row`}
                label="Row"
                type="text"
                required
                value=""
              />
              <InputWrapper
                control={control}
                name={`warehouses.${index}.bin`}
                label="Bin"
                type="text"
                required
                value=""
              />
            </div>
            <SelectWrapper
              control={control}
              name={`warehouses.${index}.vendor`}
              label="Vendor"
              options={vendorOptions}
            />
            <SelectWrapper
              control={control}
              name={`warehouses.${index}.costCenter`}
              label="Cost Center"
              options={costCenterOptions}
            />
            {enableTrackingWatch && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="col-span-1">
                  <InputWrapper
                    control={control}
                    name={`warehouses.${index}.quantity`}
                    label="Quantity"
                    type="number"
                    required
                    value={0}
                  />
                </div>
                <div className="col-span-1"></div>
                <div className="col-span-1"></div>

                <div className="col-span-1">
                  <InputWrapper
                    control={control}
                    name={`warehouses.${index}.reorderPoint`}
                    label="Reorder Point"
                    type="number"
                    required
                    value=""
                  />
                </div>
                <div className="col-span-1">
                  <InputWrapper
                    control={control}
                    name={`warehouses.${index}.reorderQty`}
                    label="Reorder Qty"
                    type="number"
                    required
                    value=""
                  />
                </div>

                <div className="col-span-1">
                  <InputWrapper
                    control={control}
                    name={`warehouses.${index}.maxQty`}
                    label="Max Qty"
                    type="number"
                    required
                    value=""
                  />
                </div>
                <div className="col-span-1">
                  <InputWrapper
                    control={control}
                    name={`warehouses.${index}.leadTime`}
                    label="Lead Time"
                    type="number"
                    required
                    value=""
                  />
                </div>
                <div className="col-span-1">
                  <SelectWrapper
                    control={control}
                    name={`warehouses.${index}.movementType`}
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
    </div>
  );
}
