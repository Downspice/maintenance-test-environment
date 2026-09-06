import NewScheduledReportForm from "@/components/forms/entities/new-scheduled-report-form";
import ScheduledReportDataTable from "./scheduledReportDataTable";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
export default function ScheduledReportView() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col mx-auto py-10 space-y-4">
      <div className="flex justify-between items-center space-x-4">
        <div className="flex flex-row items-center space-x-2">
          <h1 className="text-xl font-semibold">Manage Scheduled Report</h1>
        </div>
        <div className="flex flex-row space-x-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button>New</Button>
            </SheetTrigger>
            <SheetContent className="w-3/4 ">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex justify-between">
                    <div>New Scheduled report</div>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
                <NewScheduledReportForm />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div>
        <ScheduledReportDataTable />
      </div>
    </div>
  );
}
