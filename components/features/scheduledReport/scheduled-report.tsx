"use client";

import NewScheduledReportForm from "@/components/forms/entities/new-scheduled-report-form";
import ScheduledReportDataTable from "./scheduledReportDataTable";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useState } from "react";

const NESTED_DRAWER_CLASS =
  "w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none";

export default function ScheduledReportView() {
  const [newOpen, setNewOpen] = useState(false);

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-4">
      <div className="flex shrink-0 flex-row items-center justify-end gap-2">
        <Drawer
          open={newOpen}
          onOpenChange={setNewOpen}
          trigger={
            <Button variant="primary">
              <Plus className="size-4" />
              New Scheduled Report
            </Button>
          }
          title="New Scheduled Report"
          description="Configure report filters, schedule, and recipients."
          className={NESTED_DRAWER_CLASS}
          renderActions={
            <Button
              form="new-scheduled-report-form"
              type="submit"
              variant="primary"
            >
              Save Report
            </Button>
          }
        >
          <ScrollArea className="h-[calc(100vh-160px)] pr-4">
            <NewScheduledReportForm
              formId="new-scheduled-report-form"
              hideSubmitButton
              onSuccess={() => setNewOpen(false)}
            />
          </ScrollArea>
        </Drawer>
      </div>

      <div className="min-h-0 min-w-0 flex-1">
        <ScheduledReportDataTable />
      </div>
    </div>
  );
}
