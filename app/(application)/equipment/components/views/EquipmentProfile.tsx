"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Pen } from "lucide-react";
import EditEquipment from "./EditEquipment";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookText,
  ClipboardList,
  FileText,
  FolderOpen,
  History,
  Image as ImageIcon,
  Paperclip,
  StickyNote,
  ListChecks,
} from "lucide-react";
import SidebarLayout from "@/components/customUI/customSideBar";
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
import { Trash2, X } from "lucide-react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { ComboboxFieldWrapper } from "@/components/forms/wrappers/ComboboxWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import InputWrapper from "@/components/forms/wrappers/InputWrapper";
import RadioGroupWrapper from "@/components/forms/wrappers/RadioGroupWrapper";
import { Form } from "@/components/ui/form";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import Summary from "./summary";

type TabKey =
  | "maintenance"
  | "inspections"
  | "expenses"
  | "fuel"
  | "assignments"
  | "fluids"
  | "accidents"
  | "meter-log"
  | "meter-replacement";

type Props = {
  defaultTab?: TabKey;
};

const tabItems: { label: string; value: TabKey }[] = [
  { label: "Maintenance", value: "maintenance" },
  { label: "Inspections", value: "inspections" },
  { label: "Expenses", value: "expenses" },
  { label: "Fuel", value: "fuel" },
  { label: "Assignments", value: "assignments" },
  { label: "Fluids", value: "fluids" },
  { label: "Accidents", value: "accidents" },
  { label: "Meter Log", value: "meter-log" },
  { label: "Meter Replacement", value: "meter-replacement" },
];

function HistoryTabs({ defaultTab = "maintenance" }: Props) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full space-y-4">
      <TabsList className="flex flex-wrap justify-start gap-2">
        {tabItems.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabItems.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="border rounded p-4">
            <p className="text-sm text-muted-foreground">
              {tab.label} content goes here.
            </p>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

const partOptions = [
  {
    label: "Oil Filter (PN-123)",
    value: "PN-123",
    name: "Oil Filter",
    warehouse: "WH1",
    description: "Standard oil filter",
  },
  {
    label: "Hydraulic Fluid (PN-456)",
    value: "PN-456",
    name: "Hydraulic Fluid",
    warehouse: "WH2",
    description: "High pressure fluid",
  },
];

const equipmentOptions = [
  { label: "Forklift", value: "forklift" },
  { label: "Light System", value: "lights" },
];

const serviceOptions = [
  { label: "repairTypes", value: "Repair Types" },
  { label: "repairs", value: "Repairs" },
  { label: "taskTypes", value: "Task Types" },
];

const partSchema = z.object({
  equipment: z.string().min(1, "Equipment is required"),
  service: z.string(),
  mode: z.enum(["assigned", "fixed"]),
  partNumber: z.string().optional(),
  name: z.string().optional(),
  warehouse: z.string().optional(),
  description: z.string().optional(),
  quantity: z.coerce.number().optional(),
  cost: z.coerce.number().optional(),
});

type PartForm = z.infer<typeof partSchema>;
type PartRecord = PartForm & { id: string };

type PartsProps = {
  equipment: string;
};

function PartsManager({ equipment }: PartsProps) {
  const [parts, setParts] = useState<PartRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<PartRecord | null>(null);

  const form = useForm<PartForm>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      equipment: equipment,
      mode: "assigned",
    },
  });

  const { watch, setValue, reset, handleSubmit } = form;
  const mode = watch("mode");
  const partNumber = watch("partNumber");

  useEffect(() => {
    if (editingPart) {
      reset(editingPart);
    } else {
      reset({
        equipment: equipment, 
        mode: "assigned",
      });
    }
  }, [editingPart, reset, equipment]);

  useEffect(() => {
    if (mode === "assigned" && partNumber) {
      const selected = partOptions.find((p) => p.value === partNumber);
      if (selected) {
        setValue("warehouse", selected.warehouse);
        setValue("name", selected.name);
        setValue("description", selected.description);
      }
    }
  }, [partNumber, mode, setValue]);

  const onSubmit = (data: PartForm) => {
    if (editingPart) {
      setParts((prev) =>
        prev.map((p) =>
          p.id === editingPart.id
            ? { ...p, quantity: data.quantity, cost: data.cost }
            : p
        )
      );
    } else {
      setParts((prev) => [...prev, { ...data, id: crypto.randomUUID() }]);
    }

    setOpen(false);
    setEditingPart(null);
    reset();
  };

  const onEdit = (part: PartRecord) => {
    setEditingPart(part);
    setOpen(true);
  };

  const onDelete = (id: string) => {
    setParts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>+ Add Part</Button>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-x-auto">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Part#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parts.map((part) => (
            <TableRow key={part.id}>
              <TableCell>{part.partNumber ?? "N/A"}</TableCell>
              <TableCell>{part.name ?? "N/A"}</TableCell>
              <TableCell>{part.description ?? "N/A"}</TableCell>
              <TableCell>{part.equipment ?? "N/A"}</TableCell>
              <TableCell>{part.quantity ?? "N/A"}</TableCell>
              <TableCell>{part.cost ?? "N/A"}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(part)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(part.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>

      {/* Dialog Form */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPart ? "Edit Part" : "Add Part"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <InputWrapper
                  control={form.control}
                  name="equipment"
                  label="Equipment"
                  type="number" 
                  disabled
              />

              <ComboboxFieldWrapper
                control={form.control}
                disabled={!!editingPart}
                name="service"
                label="Service"
                options={serviceOptions}
              />

              <RadioGroupWrapper
                control={form.control}
                name="mode"
                label="Part Type"
                disabled={!!editingPart}
                options={[
                  { label: "Assigned Part", value: "assigned" },
                  { label: "Fixed Cost", value: "fixed" },
                ]}
              />

              {mode === "fixed" ? (
                <InputWrapper
                  control={form.control}
                  name="cost"
                  label="Cost"
                  type="number"
                  disabled={!!editingPart}
                />
              ) : (
                <>
                  <ComboboxFieldWrapper
                    control={form.control}
                    name="partNumber"
                    label="Part Number"
                    options={partOptions.map((p) => ({
                      label: p.label,
                      value: p.value,
                    }))}
                    placeholder="Select part"
                    emptyText="No part found"
                    searchPlaceholder="Search parts..."
                    disabled={!!editingPart}
                  />
                  <InputWrapper
                    control={form.control}
                    name="warehouse"
                    label="Warehouse"
                    disabled
                    type="text"
                  />
                  <InputWrapper
                    control={form.control}
                    name="name"
                    label="Name"
                    disabled
                    type="text"
                  />
                  <InputWrapper
                    control={form.control}
                    name="description"
                    label="Description"
                    disabled
                    type="text"
                  />
                  <InputWrapper
                    control={form.control}
                    name="quantity"
                    label="Quantity"
                    type="number"
                    disabled={!!editingPart && mode === "fixed"}
                  />
                </>
              )}

              <div className="flex justify-end">
                <Button type="submit">{editingPart ? "Update" : "Add"}</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type ImageItem = {
  id: string;
  name: string;
  src: string;
};

function ImageGrid() {
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
            <DialogHeader>
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

function AttachmentTable() {
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

          <DialogContent>
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

const EquipmentDetailsSection = () => {
  return (
    <div className="space-y-6">
      {/* Details */}
      <CollapsibleSection title="Details">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <p>
            <span className="font-medium">Unit #:</span> EQ-045
          </p>
          <p>
            <span className="font-medium">Make:</span> Komatsu
          </p>
          <p>
            <span className="font-medium">Model:</span> PC210LC
          </p>
          <p>
            <span className="font-medium">Serial:</span> 1234XYZ
          </p>
          <p>
            <span className="font-medium">Type:</span> Excavator
          </p>
        </div>
      </CollapsibleSection>

      {/* User Defined Location Info */}
      <CollapsibleSection title="User Location Info">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <p>
            <span className="font-medium">Fabrication:</span> Site A
          </p>
          <p>
            <span className="font-medium">Voltage/Phase:</span> 480/3P
          </p>
          <p>
            <span className="font-medium">Pallet Size:</span> 40x19
          </p>
        </div>
      </CollapsibleSection>

      {/* Purchase */}
      <CollapsibleSection title="Purchase">
        <p>
          <span className="font-medium">Price:</span> $45,000
        </p>
      </CollapsibleSection>
    </div>
  );
};



export default function EquipmentProfile({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
const sidebarMenu = [
  {
    id: "summary",
    label: "Summary",
    icon: <FileText size={20} />,
    content: <Summary/>,
  },
  {
    id: "details",
    label: "Details",
    icon: <ClipboardList size={20} />,
    content: <EquipmentDetailsSection />,
  },
  {
    id: "tasks",
    label: "Tasks / Work Orders",
    icon: <ListChecks size={20} />,
    content: <div>Assigned tasks and work orders</div>,
  },
  {
    id: "history",
    label: "History",
    icon: <History size={20} />,
    content: <HistoryTabs/>,
  },
  {
    id: "commonParts",
    label: "Common Parts",
    icon: <BookText size={20} />,
    content: <PartsManager equipment={data.name}  />,
  },
  {
    id: "images",
    label: "Images",
    icon: <ImageIcon size={20} />,
    content: <ImageGrid />,
  },
  {
    id: "attachments",
    label: "Attachments",
    icon: <Paperclip size={20} />,
    content: <AttachmentTable />,
  },
  {
    id: "notes",
    label: "Notes",
    icon: <StickyNote size={20} />,
    content: (
      <Textarea
        className="w-full h-full resize-none rounded-md border border-gray-300 p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Add notes here..."
      />
    ),
  },
];
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="w-5/6 ">
          <SheetHeader>
            <SheetTitle>
              <div className="flex justify-between">
                <div>{data.invoiceNumber}</div>
              </div>
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-20px)] pr-4 mt-6">
            <SidebarLayout
              menuItems={sidebarMenu}
              defaultActiveId="summary"
              headerItem={
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-white ">
                    {/* Vehicle Image */}
                    <div className="w-full h-32 md:h-auto flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src="/placeholder-user.jpg" // replace with actual image path or prop
                        alt="Vehicle"
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Text Information */}
                    <div className="flex text-sm flex-col justify-center gap-3 text-gray-800">
                      <div>
                        <span className="font-semibold text-gray-600">
                          CNC:
                        </span>{" "}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">
                          Serial:
                        </span>{" "}
                        <span>SN-44983-21A</span>
                      </div>
                      <div className="flex flex-wrap gap-8 mt-2">
                        <div>
                          <span className="font-semibold text-gray-600">
                            Hours:
                          </span>{" "}
                          <span>1,250 hrs</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600">
                            Status:
                          </span>{" "}
                          <span className="text-green-600 font-semibold">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <EditEquipment
                        children={
                          <Button variant="ghost" size="icon">
                            <Pen className="h-4 w-4" />
                          </Button>
                        }
                        data={data}
                      />
                    </div>
                  </div>
                </>
              }
            />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
