'use client'
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";


export interface PartTableInterface {
  id: string
  inventory_id: string
  part_number: string
  name: string
  manufacturer_id: any
  description: string
  created_by: any
  updated_by: any
  created_at: string
  updated_at: string
}
export default function PartSubstitutionTable({
  parts,
  value,
  onChange,
}: {
  parts: PartTableInterface[];
  value: any[];
  onChange: (rows: any[]) => void;
}) {
  const handleAddRow = () => {
    const newRows = [...value, { part_number: "", name: "", manufacturer_id: "", description: "" }];
    onChange(newRows);
  };

  const handleChange = (index: number, field: string, val: string) => {
    const updated = [...value];
    updated[index][field] = val;
    if (field === "part_number") {
      const selected = parts.find((p) => p.part_number === val);
      if (selected) {
        updated[index] = {
          part_number: selected.part_number,
          name: selected.name,
          manufacturer_id: selected.manufacturer_id,
          description: selected.description,
        };
      }
    }
    onChange(updated);
  };

  const handleDelete = (index: number) => {
    console.log('deleted index>>>>>>>',index)

    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-2 font-semibold text-sm">
        <span>Part#</span>
        <span>Name</span>
        <span>manufacturer_id</span>
        <span>Description</span>
        <span className="text-right">Action</span>
      </div>

      {value.map((row, index) => (
        <div key={index} className="grid grid-cols-5 gap-2 items-center">
          <Select
            value={row.part_number}
            onValueChange={(val) => handleChange(index, "part_number", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Part#" />
            </SelectTrigger>
            <SelectContent>
              {parts.map((item) => (
                <SelectItem key={item.part_number} value={item.part_number}>
                  {item.part_number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input value={row.name} readOnly />
          <Input value={row.manufacturer_id} readOnly />
          <Input value={row.description} readOnly />

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

      <Button type="button" onClick={handleAddRow} className="mt-2">
        + Add Part Substitution
      </Button>
    </div>
  );
}