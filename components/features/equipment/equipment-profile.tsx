"use client";

import { Button } from "@/components/ui/button";
import { EllipsisVertical, Pen } from "lucide-react";
import EditEquipment from "./edit-equipment";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import {
  BookText,
  ClipboardList,
  FileText,
  History,
  Image as ImageIcon,
  Paperclip,
  StickyNote,
  ListChecks,
} from "lucide-react";
import SidebarLayout from "@/components/customUI/customSideBar";
import Summary from "./summary";
import { useGetEquipment } from "@/services/setups/equipments";
import { HistoryTabs } from "./history-tabs";
import { TasksTab } from "./tasks-tab";
import { WorkOrdersTab } from "./work-orders-tab";
import { PartsManager } from "./parts-manager";
import {
  AttachmentTable,
  EquipmentDetailsSection,
  ImageGrid,
  NotesSection,
} from "./profile-sections";

export default function EquipmentProfile({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: equipmentData, isLoading: isLoadingEquipment } = useGetEquipment(data?.id);
  const sidebarMenu = [
    {
      id: "summary",
      name: "Summary",
      icon: <FileText size={20} />,
      content: <Summary />,
    },
    {
      id: "details",
      name: "Details",
      icon: <ClipboardList size={20} />,
      content: <EquipmentDetailsSection data={equipmentData} />,
    },
    {
      id: "tasks",
      name: "Tasks",
      icon: <ListChecks size={20} />,
      content: <TasksTab equipmentId={data?.id} />,
    },
    {
      id: "workOrders",
      name: "Work Orders",
      icon: <ListChecks size={20} />,
      content: <WorkOrdersTab />,
    },
    {
      id: "history",
      name: "History",
      icon: <History size={20} />,
      content: <HistoryTabs />,
    },
    {
      id: "commonParts",
      name: "Common Parts",
      icon: <BookText size={20} />,
      content: <PartsManager equipmentId={data?.id} />,
    },
    {
      id: "images",
      name: "Images",
      icon: <ImageIcon size={20} />,
      content: <ImageGrid />,
    },
    {
      id: "attachments",
      name: "Attachments",
      icon: <Paperclip size={20} />,
      content: <AttachmentTable />,
    },
    {
      id: "notes",
      name: "Notes",
      icon: <StickyNote size={20} />,
      content: <NotesSection equipmentId={data?.id} equipmentNotes={data?.notes} />,
    },
  ];
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="w-5/6 p-2">
          <SheetHeader>
            <SheetTitle>
              <div className="flex justify-between">
                <div>{data.invoice_number}</div>
              </div>
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-20px)] pr-4 mt-6">
            <SidebarLayout
              menuItems={sidebarMenu}
              defaultActiveId="summary"
              headerItem={
                <>
                  <span>{(equipmentData as any)?.unit_number} - {(equipmentData as any)?.type_name}</span>
                  <div className=" pb-1 border-b border-gray-300 grid grid-cols-1 md:grid-cols-2 gap-1 bg-white ">
                    {/* Vehicle Image */}
                    <div className="w-full h-32 md:h-auto flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src="/placeholder-user.jpg" // replace with actual image path or prop
                        alt="Vehicle"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {/* Text Information */}
                    <div className="flex text-sm flex-col justify-center space-y-1 text-gray-800">
                      <div>
                        <span className="font-semibold text-gray-600">
                          {(equipmentData as any)?.type_name}
                        </span>{" "}
                      </div>
                      <div>
                        <span>{(equipmentData as any)?.serial_number}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <div>
                          <span className="font-semibold text-gray-600">
                            Hours:
                          </span>
                          <span>1,250 hrs</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600">
                            Status:
                          </span>
                          <span className="text-green-600 font-semibold">
                            {(equipmentData as any)?.status_name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row justify-end gap-1 col-span-2">
                      <EditEquipment
                        children={
                          <Button variant="outline" size="icon">
                            <Pen className="h-4 w-4" />
                          </Button>
                        }
                        data={data}
                      />
                      <Button variant="outline" size="icon">
                        <EllipsisVertical className="h-4 w-4 " />
                      </Button>
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
