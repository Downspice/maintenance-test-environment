'use client'
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function PartSubstitutionTable({
  parts,
  value,
  onChange,
}: {
  parts: { label: string; value: string; partNumber: string; name: string; manufacturer: string; description: string }[];
  value: any[];
  onChange: (rows: any[]) => void;
}) {
  const handleAddRow = () => {
    const newRows = [...value, { partNumber: "", name: "", manufacturer: "", description: "" }];
    onChange(newRows);
  };

  const handleChange = (index: number, field: string, val: string) => {
    const updated = [...value];
    updated[index][field] = val;
    if (field === "partNumber") {
      const selected = parts.find((p) => p.partNumber === val);
      if (selected) {
        updated[index] = {
          partNumber: selected.partNumber,
          name: selected.name,
          manufacturer: selected.manufacturer,
          description: selected.description,
        };
      }
    }
    onChange(updated);
  };

  const handleDelete = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-2 font-semibold text-sm">
        <span>Part#</span>
        <span>Name</span>
        <span>Manufacturer</span>
        <span>Description</span>
        <span className="text-right">Action</span>
      </div>

      {value.map((row, index) => (
        <div key={index} className="grid grid-cols-5 gap-2 items-center">
          <Select
            value={row.partNumber}
            onValueChange={(val) => handleChange(index, "partNumber", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Part#" />
            </SelectTrigger>
            <SelectContent>
              {parts.map((item) => (
                <SelectItem key={item.partNumber} value={item.partNumber}>
                  {item.partNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input value={row.name} readOnly />
          <Input value={row.manufacturer} readOnly />
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