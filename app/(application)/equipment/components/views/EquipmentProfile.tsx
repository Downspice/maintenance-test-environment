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
import { useState } from "react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, X } from "lucide-react";
import Image from "next/image";
import { Pencil } from "lucide-react";


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
            <button
              className="absolute top-1 right-1 p-1 rounded-full bg-white shadow hover:bg-red-100"
              onClick={() => handleDelete(img.id)}
            >
              <Trash2 className="text-red-500" size={16} />
            </button>

            {/* Clickable Image */}
            <div
              onClick={() => handlePreview(img)}
              className="w-full aspect-square relative overflow-hidden rounded cursor-pointer hover:opacity-90"
            >
              <Image
                src={img.src}
                alt={img.name}
                fill
                className="object-cover"
              />
            </div>

            {/* File Name */}
            <p className="mt-2 text-center text-sm text-gray-700 font-medium truncate">
              {img.name}
            </p>
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
          att.id === editingId ? { ...att, name: newName, file: newFile || att.file } : att
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
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          if (!open) {
            setEditingId(null);
            setNewName("");
            setNewFile(null);
          }
          setDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button size="sm">+ Add</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Attachment" : "Add Attachment"}</DialogTitle>
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
                  {newFile ? `New File: ${newFile.name}` : "Existing file will be kept"}
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

export const sidebarMenu = [
  {
    id: "summary",
    label: "Summary",
    icon: <FileText size={20} />,
    content: <div>Overview and quick stats</div>,
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
    content: <div>Maintenance and usage history</div>,
  },
  {
    id: "commonParts",
    label: "Common Parts",
    icon: <BookText size={20} />,
    content: <div>Frequently used parts</div>,
  },
  {
    id: "images",
    label: "Images",
    icon: <ImageIcon size={20} />,
    content: <ImageGrid/>,
  },
  {
    id: "attachments",
    label: "Attachments",
    icon: <Paperclip size={20} />,
    content: <AttachmentTable/>,
  },
  {
    id: "notes",
    label: "Notes",
    icon: <StickyNote size={20} />,
    content: <Textarea 
        className="w-full h-full resize-none rounded-md border border-gray-300 p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
     placeholder="Add notes here..." />,
  },
];

export default function EquipmentProfile({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="w-3/4 ">
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
