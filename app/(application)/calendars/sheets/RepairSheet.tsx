"use client";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { WrenchIcon } from "lucide-react";
import NewRepairRequestForm from "@/components/forms/actions/more/repairRequest/repairRequestForm";

export default function RepairSheet() {
  const [sheetOpen, setSheetOpen] = useState();
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="flex items-center gap-2">
          Repair <WrenchIcon className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className=" ">
        <SheetHeader>
          <SheetTitle>New Repair Request</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <NewRepairRequestForm />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
