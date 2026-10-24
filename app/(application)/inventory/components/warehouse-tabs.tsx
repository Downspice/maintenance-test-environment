"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Warehouse } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectActionModal } from "@/components/ui/select-action-modal";
import SelectWrapper from "@/components/forms/fields/SelectWrapper";
import InputWrapper from "@/components/forms/fields/InputWrapper";

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
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<string | undefined>();
  const [warehouseNames, setWarehouseNames] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const nameMap: Record<string, string> = {};
    options.forEach((opt) => {
      nameMap[opt.id] = opt.name;
    });
    setWarehouseNames(nameMap);
  }, [options]);

  const availableOptions = useMemo(
    () => options.filter((opt) => !warehouses.includes(opt.id)),
    [options, warehouses]
  );

  const handleAddWarehouse = () => {
    if (!selected || warehouses.includes(selected)) return;
    setWarehouses([...warehouses, selected]);
    setSelected(undefined);
    setAddOpen(false);
  };

  const handleDeleteWarehouse = (val: string) => {
    setWarehouses(warehouses.filter((w) => w !== val));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-label-md font-semibold text-text-strong-950">
          Warehouses
        </h2>
        <SelectActionModal
          open={addOpen}
          onOpenChange={(next) => {
            setAddOpen(next);
            if (!next) setSelected(undefined);
          }}
          trigger={
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <Plus className="size-4" />
              Add warehouse
            </Button>
          }
          title="Add warehouse"
          description="Select a warehouse to track aisle, row, bin, and stock settings for this item."
          confirmLabel="Add warehouse"
          confirmDisabled={!selected || availableOptions.length === 0}
          onConfirm={handleAddWarehouse}
        >
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="warehouse-picker"
              className="text-label-sm font-medium text-text-strong-950"
            >
              Warehouse
            </Label>
            {availableOptions.length === 0 ? (
              <p className="text-paragraph-sm text-text-sub-600">
                All available warehouses are already linked to this item.
              </p>
            ) : (
              <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger id="warehouse-picker" className="w-full">
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {availableOptions.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      <span className="flex items-center gap-2">
                        <Warehouse className="size-4 text-text-soft-400" />
                        {opt.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </SelectActionModal>
      </div>

      {warehouses.length > 0 && (
        <Tabs defaultValue={warehouses[0] ?? ""}>
          <TabsList className="flex gap-2 overflow-x-auto">
            {warehouses.map((w) => (
              <div key={w} className="flex items-center gap-1">
                <TabsTrigger value={w}>{warehouseNames[w] || w}</TabsTrigger>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteWarehouse(w)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </TabsList>

          {warehouses.map((w, index) => (
            <TabsContent
              key={w}
              value={w}
              className="mt-2 rounded-lg border p-4"
            >
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
                <div className="mt-4 grid grid-cols-3 gap-2">
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
                  <div className="col-span-1" />
                  <div className="col-span-1" />

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
