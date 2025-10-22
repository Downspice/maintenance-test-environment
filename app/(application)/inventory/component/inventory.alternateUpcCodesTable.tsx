'use client'
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { GenericObject } from "@/types/types";

export default function AlternateUpcCodesTable({
  manufacturers,
  vendors,
  value,
  onChange,
}: {
  manufacturers: GenericObject[];
  vendors: GenericObject[];
  value: any[];
  onChange: (rows: any[]) => void;
}) {
  console.log("value",value)
  const handleAddRow = () => {
    const newRows = [...value, { manufacturer_id: "", vendor_id: "", upc: "" }];
    onChange(newRows);
  };

  const handleChange = (index: number, field: string, val: string) => {
    const updated = [...value];
    updated[index][field] = val;
    onChange(updated);
  };

  const handleDelete = (index: number) => {
    console.log('deleted index>>>>>>>',index)
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
        <Button type="button" onClick={handleAddRow} className="mt-2">
        + Add UPC Code
      </Button>
      <div className="grid grid-cols-4 gap-2 font-semibold text-sm">
        <span>Manufacturer</span>
        <span>Vendor</span>
        <span>UPC</span>
        <span className="text-right">Action</span>
      </div>

      {value.map((row, index) => (
        <div key={index} className="grid grid-cols-4 gap-2 items-center">
          <Select
            value={row.manufacturer_id}
            onValueChange={(val) => handleChange(index, "manufacturer_id", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Manufacturer" />
            </SelectTrigger>
            <SelectContent>
              {manufacturers.map((item) => (
                <SelectItem key={item.id} value={item.id??""}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={row.vendor_id}
            onValueChange={(val) => handleChange(index, "vendor_id", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Vendor" />
            </SelectTrigger>
            <SelectContent>
              {vendors.map((item) => (
                <SelectItem key={item.id} value={item.id??""}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={row.upc}
            onChange={(e) => handleChange(index, "upc", e.target.value)}
            placeholder="Enter UPC"
          />

          <div className="text-right">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

 