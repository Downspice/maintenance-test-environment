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
import { TableRowActions } from "@/components/ui/table-row-actions";
import { GenericObject } from "@/types/types";

export default function AlternateUpcCodesTable({
  manufacturers,
  vendors,
  value,
  onChange,
}: {
  manufacturers: GenericObject[];
  vendors: GenericObject[];
  value?: Array<{ manufacturer_id: string; vendor_id: string; upc: string }>;
  onChange: (
    rows: Array<{ manufacturer_id: string; vendor_id: string; upc: string }>
  ) => void;
}) {
  const rows = value ?? [];

  const handleAddRow = () => {
    const newRows = [...rows, { manufacturer_id: "", vendor_id: "", upc: "" }];
    onChange(newRows);
  };

  const handleChange = (index: number, field: string, val: string) => {
    const updated = [...rows];
    updated[index][field] = val;
    onChange(updated);
  };

  const handleDelete = (index: number) => {
    const updated = rows.filter((_, i) => i !== index);
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

      {rows.map((row, index) => (
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
                <SelectItem key={item.id} value={item.id ?? ""}>
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
                <SelectItem key={item.id} value={item.id ?? ""}>
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
            <TableRowActions onDelete={() => handleDelete(index)} />
          </div>
        </div>
      ))}
    </div>
  );
}
