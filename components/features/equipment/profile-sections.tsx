"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Pencil, Trash2, X } from "lucide-react";

import { useEffect, useState } from "react";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

import { useUpdateEquipmentNotes } from "@/services/setups/equipments";

export function ImageGrid() {
  const [images, setImages] = useState<ImageItem[]>([
    {
      id: "1",
      name: "joseph",
      src: "/joseph.png",
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null);

  const handleAddImage = () => {
    if (!newName || !newFile) return;

    const imageUrl = URL.createObjectURL(newFile);
    const newImage: ImageItem = {
      id: Date.now().toString(),
      name: newName,
      src: imageUrl,
    };

    setImages((prev) => [...prev, newImage]);
    setNewName("");
    setNewFile(null);
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handlePreview = (img: ImageItem) => {
    setPreviewImage(img);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Images</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">+ Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="w-sm">
              <DialogTitle>Add Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Image name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setNewFile(e.target.files?.[0] || null)}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAddImage}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative group border rounded-md p-2 bg-white shadow hover:shadow-md transition"
          >
            {/* Delete Button */}

            {/* Clickable Image */}
            <div
              onClick={() => handlePreview(img)}
              className="w-full aspect-square relative overflow-hidden rounded cursor-pointer hover:opacity-40"
            >
              <Image
                src={img.src}
                alt={img.name}
                fill
                className="object-cover"
              />
            </div>

            {/* File Name */}
            <div className="flex justify-between items-center mt-1">
              <p className="mt-2 text-center text-sm text-gray-700 font-medium truncate">
                {img.name}
              </p>
              <button
                className=" p-1 rounded-full bg-white shadow hover:bg-text-destructive"
                onClick={() => handleDelete(img.id)}
              >
                <Trash2 className="text-red-500" size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Dialog */}
      {previewImage && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden">
            <div className="relative w-full h-[70vh]">
              <Image
                src={previewImage.src}
                alt={previewImage.name}
                fill
                className="object-contain bg-black"
              />
              <button
                onClick={() => setPreviewOpen(false)}
                className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow hover:bg-red-100"
              >
                <X size={20} className="text-red-600" />
              </button>
            </div>
            <div className="p-4 text-center text-sm text-gray-600">
              {previewImage.name}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

type Attachment = {
  id: string;
  name: string;
  file: File | null;
};

export function AttachmentTable() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddOrUpdate = () => {
    if (!newName) return;

    if (editingId) {
      // Update
      setAttachments((prev) =>
        prev.map((att) =>
          att.id === editingId
            ? { ...att, name: newName, file: newFile || att.file }
            : att
        )
      );
    } else {
      // Add
      const newAttachment: Attachment = {
        id: Date.now().toString(),
        name: newName,
        file: newFile,
      };
      setAttachments((prev) => [...prev, newAttachment]);
    }

    // Reset form
    setNewName("");
    setNewFile(null);
    setEditingId(null);
    setDialogOpen(false);
  };

  const handleEdit = (attachment: Attachment) => {
    setEditingId(attachment.id);
    setNewName(attachment.name);
    setNewFile(null); // keep original file unless replaced
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Attachments</h2>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setEditingId(null);
              setNewName("");
              setNewFile(null);
            }
            setDialogOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm">+ Add</Button>
          </DialogTrigger>

          <DialogContent className="w-sm">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Attachment" : "Add Attachment"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Attachment name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Input
                type="file"
                onChange={(e) => setNewFile(e.target.files?.[0] || null)}
              />
              {editingId && (
                <p className="text-sm text-muted-foreground">
                  {newFile
                    ? `New File: ${newFile.name}`
                    : "Existing file will be kept"}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleAddOrUpdate}>
                {editingId ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attachments.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleEdit(item)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const CollapsibleSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon">
              <ChevronDown
                className={`transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-2 text-sm text-gray-700">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export const EquipmentDetailsSection = ({ data }: { data: any }) => {
  return (
    <div className="space-y-6">
      {/* Details */}
      <CollapsibleSection title="Details">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <p>
            <span className="font-medium">Unit #:</span> {data?.unit_number}
          </p>
          <p>
            <span className="font-medium">Make:</span>{" "}
            {data?.make_name ?? data?.make}
          </p>
          <p>
            <span className="font-medium">Model:</span>{" "}
            {data?.model_name ?? data?.model}
          </p>
          <p>
            <span className="font-medium">Year:</span> {data?.year}
          </p>
          <p>
            <span className="font-medium">Serial:</span> {data?.serial_number}
          </p>
          <p>
            <span className="font-medium">Type:</span>{" "}
            {data?.type_name ?? data?.equipmentType}
          </p>
          <p>
            <span className="font-medium">Color:</span>{" "}
            {data?.color_name ?? data?.color}
          </p>
          <p>
            <span className="font-medium">License:</span> {data?.license}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            {data?.status_name ?? data?.status}
          </p>
          <p>
            <span className="font-medium">Ownership:</span>{" "}
            {data?.ownership_name ?? data?.ownership}
          </p>
        </div>
      </CollapsibleSection>

      {/* Meters */}
      {/* <CollapsibleSection title="Meters">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <p>
            <span className="font-medium">Primary Meter:</span> {data?.primary_meter} {data?.primary_meter_units ?? data?.primaryMeterUnits}
          </p>
          <p>
            <span className="font-medium">Secondary Meter:</span> {data?.secondary_meter} {data?.secondary_meter_units ?? data?.secondaryMeterUnits}
          </p>
        </div>
      </CollapsibleSection> */}

      {/* Purchase */}
      <CollapsibleSection title="Purchase">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <p>
            <span className="font-medium">Purchase Date:</span>{" "}
            {data?.purchase_date ?? data?.purchaseDate}
          </p>
          <p>
            <span className="font-medium">Purchase Price:</span>{" "}
            {data?.purchase_price != null
              ? `$${Number(data.purchase_price ?? data.purchasePrice).toLocaleString()}`
              : "—"}
          </p>
          <p>
            <span className="font-medium">Vendor:</span>{" "}
            {data?.vendor_name ?? data?.vendorId}
          </p>
          <p>
            <span className="font-medium">Salvage Price:</span>{" "}
            {data?.salvage_price != null
              ? `$${Number(data.salvage_price ?? data.salvagePrice).toLocaleString()}`
              : "—"}
          </p>
        </div>
      </CollapsibleSection>

      {/* Engine & Specs */}
      {/* <CollapsibleSection title="Engine & Specs">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <p>
            <span className="font-medium">Engine:</span> {data?.engine}
          </p>
          <p>
            <span className="font-medium">Transmission:</span> {data?.transmission}
          </p>
          <p>
            <span className="font-medium">Fuel Type:</span> {data?.fuel_type ?? data?.fuelType}
          </p>
          <p>
            <span className="font-medium">Fuel Capacity:</span> {data?.fuel_capacity ?? data?.fuelCapacity} {data?.fuel_volume_units ?? data?.fuelVolumeUnits}
          </p>
          <p>
            <span className="font-medium">Weight:</span> {data?.weight}
          </p>
          <p>
            <span className="font-medium">Gross Weight:</span> {data?.gross_weight ?? data?.grossWeight}
          </p>
        </div>
      </CollapsibleSection> */}
    </div>
  );
};

// Notes Section Component
export function NotesSection({
  equipmentId,
  equipmentNotes,
}: {
  equipmentId?: string | number;
  equipmentNotes?: string;
}) {
  const { mutate: updateNotes, isPending } = useUpdateEquipmentNotes();
  const [noteText, setNoteText] = useState("");

  // Pre-fill textarea when data loads
  useEffect(() => {
    const existing = equipmentNotes ?? "";
    if (existing) setNoteText(existing);
  }, [equipmentNotes]);

  const handleSave = () => {
    if (!equipmentId) return;
    updateNotes({ id: equipmentId, notes: noteText });
  };

  return (
    <div className="space-y-3">
      <Textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Type your notes here..."
        className="min-h-[200px] resize-y"
      />
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Note"}
        </Button>
      </div>
    </div>
  );
}

export { ImageGrid, AttachmentTable, EquipmentDetailsSection, NotesSection };
