"use client";

import { useState } from "react";
import RepairRequestTable, { DummyRepairRequests } from "./repairRequestTable";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import NewRepairRequestForm, {
  MoreButtonRequestInterface,
} from "./repairRequestForm";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RepairRequestView() {
  const [open, setOpen] = useState(false);
  const [data, setData] =
    useState<MoreButtonRequestInterface[]>(DummyRepairRequests);

  const handleAdd = (newRecord: MoreButtonRequestInterface) => {
    setData((prev) => [newRecord, ...prev]);
    setOpen(false);
  };

  const handleUpdate = (updatedRecord: MoreButtonRequestInterface) => {
    setData((prev) =>
      prev.map((item) =>
        item.repairRequestId === updatedRecord.repairRequestId
          ? updatedRecord
          : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.repairRequestId !== id));
  };

  const handleDeleteMany = (ids: string[]) => {
    setData((prev) =>
      prev.filter((item) => !ids.includes(item.repairRequestId || ""))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Repair Requests (Outstanding)
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all outstanding equipment repair requests.
          </p>
        </div>

        <Drawer
          open={open}
          onOpenChange={setOpen}
          trigger={
            <Button variant="primary">
              <Plus className="size-4 mr-2" />
              Add Repair Request
            </Button>
          }
          title="Add New Repair Request"
          description="Fill out the form below to create a new repair request."
          closeable={true}
          renderActions={
            <Button
              form="new-repair-request-form"
              type="submit"
              variant="primary"
            >
              Save Repair Request
            </Button>
          }
          className="inset-0 w-full max-w-none sm:max-w-none lg:max-w-none"
        >
          <ScrollArea className="h-[calc(100vh-160px)] pr-4">
            <NewRepairRequestForm
              formId="new-repair-request-form"
              hideSubmitButton
              onSuccess={handleAdd}
            />
          </ScrollArea>
        </Drawer>
      </div>

      <RepairRequestTable
        data={data}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onDeleteMany={handleDeleteMany}
      />
    </div>
  );
}
