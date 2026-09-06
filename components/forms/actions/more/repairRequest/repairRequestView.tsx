"use client";
import { useState } from "react";
import RepairRequestTable from "./repairRequestTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import NewRepairRequestForm from "./repairRequestForm";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RepairRequestView() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="default">New</Button>
        </DialogTrigger>
        <DialogContent className="w-4/5">
          <DialogHeader>
            <DialogTitle>Add New Repair request </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[calc(70vh-120px)] pr-4 mt-2">
            <NewRepairRequestForm />
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <RepairRequestTable />
    </div>
  );
}
