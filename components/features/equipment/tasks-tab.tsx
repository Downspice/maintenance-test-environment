"use client";

import { Button } from "@/components/ui/button";
import { FilePenIcon, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import UpdateEquipmentRenewalForm, {
  NewEquipmentRenewalForm,
} from "./equipment-renewal";
import ActualRepairRequestForm, {
  EditActualUpdateRepairRequestForm,
} from "@/components/forms/entities/repairRequest";

import EquipmentPMServiceForm, {
  UpdateEquipmentPMServiceForm,
} from "@/components/forms/entities/equipment/equipmentPMServiceform";
import {
  useGetEquipmentPMs,
  useGetEquipmentRepairs,
  useGetEquipmentRenewalsByEquipmentId,
} from "@/services/setups/equipments";

export function TasksTab({ equipmentId }: { equipmentId?: string | number }) {
  const [openPM, setOpenPM] = useState(false);
  const [openRepair, setOpenRepair] = useState(false);
  const [openRenewal, setOpenRenewal] = useState(false);

  // Fetch data from API
  const { data: pmData = [], isLoading: isPMLoading } = useGetEquipmentPMs(
    equipmentId || ""
  );
  const { data: repairData = [], isLoading: isRepairLoading } =
    useGetEquipmentRepairs(equipmentId || "");
  const { data: renewalData = [], isLoading: isRenewalLoading } =
    useGetEquipmentRenewalsByEquipmentId(equipmentId || "");

  return (
    <Tabs defaultValue="preventive" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="preventive">Preventive Maintenance</TabsTrigger>
        <TabsTrigger value="repair">Repair Requests</TabsTrigger>
        <TabsTrigger value="renewals">Renewals</TabsTrigger>
      </TabsList>

      {/* --- Preventive Maintenance Tab --- */}
      <TabsContent value="preventive">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Preventive Maintenance</h2>

          <Sheet open={openPM} onOpenChange={setOpenPM}>
            <SheetTrigger asChild>
              <Button>Add PM Service</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Add Preventive Maintenance</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-20px)] pr-4 mt-6">
                <EquipmentPMServiceForm />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        {isPMLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PM Service</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Last Service Date</TableHead>
                <TableHead
                  className="text-right w-px whitespace-nowrap"
                  style={{ width: "1%" }}
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pmData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No PM services found
                  </TableCell>
                </TableRow>
              ) : (
                pmData.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.service}</TableCell>
                    <TableCell>{item.frequency}</TableCell>
                    <TableCell>{item.lastDate}</TableCell>
                    <TableCell
                      className="text-right space-x-2 w-px whitespace-nowrap"
                      style={{ width: "1%" }}
                    >
                      <UpdateEquipmentPMServiceForm
                        children={
                          <Button type="button" size="icon" variant="secondary">
                            <FilePenIcon className="size-4" />
                          </Button>
                        }
                        data={item}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TabsContent>

      {/* --- Repair Requests Tab --- */}
      <TabsContent value="repair">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Repair Requests</h2>

          <Drawer
            open={openRepair}
            onOpenChange={setOpenRepair}
            trigger={<Button>Add Repair Request</Button>}
            title="Create Repair Request"
            description="Fill out the form below to create a repair request."
            closeable={true}
            renderActions={
              <Button
                form="task-repair-request-form"
                type="submit"
                variant="primary"
              >
                Save Repair Request
              </Button>
            }
            className="inset-0 w-full max-w-none sm:max-w-none lg:max-w-none"
          >
            <ScrollArea className="h-[calc(100vh-160px)] pr-4">
              <ActualRepairRequestForm
                equipmentId={equipmentId}
                formId="task-repair-request-form"
                hideSubmitButton
                onSuccess={() => setOpenRepair(false)}
              />
            </ScrollArea>
          </Drawer>
        </div>

        {isRepairLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Repair</TableHead>
                <TableHead>Due On</TableHead>
                <TableHead>Due At</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>WO#</TableHead>
                <TableHead
                  className="text-right w-px whitespace-nowrap"
                  style={{ width: "1%" }}
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repairData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No repair requests found
                  </TableCell>
                </TableRow>
              ) : (
                repairData.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.repairs[0].repair_name}</TableCell>
                    <TableCell>{item.due_date}</TableCell>
                    <TableCell>{item.repair_by}</TableCell>
                    <TableCell>{item.employee_name}</TableCell>
                    <TableCell>{item.wo}</TableCell>

                    <TableCell
                      className="text-right space-x-2 w-px whitespace-nowrap"
                      style={{ width: "1%" }}
                    >
                      <EditActualUpdateRepairRequestForm
                        children={
                          <Button type="button" size="icon" variant="secondary">
                            <FilePenIcon className="size-4" />
                          </Button>
                        }
                        data={item}
                        equipmentId={equipmentId}
                      />

                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TabsContent>

      {/* --- Renewals Tab --- */}
      <TabsContent value="renewals">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Renewals</h2>

          <Sheet open={openRenewal} onOpenChange={setOpenRenewal}>
            <SheetTrigger asChild>
              <Button>Add Renewal</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px]">
              <SheetHeader>
                <SheetTitle>Add Renewal</SheetTitle>
              </SheetHeader>
              <NewEquipmentRenewalForm
                equipmentId={equipmentId}
                onSuccess={() => setOpenRenewal(false)}
              />
            </SheetContent>
          </Sheet>
        </div>

        {isRenewalLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Renewal</TableHead>
                <TableHead>Due On</TableHead>
                <TableHead
                  className="text-right w-px whitespace-nowrap"
                  style={{ width: "1%" }}
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renewalData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No renewals found
                  </TableCell>
                </TableRow>
              ) : (
                renewalData.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.renewal_name}</TableCell>
                    <TableCell>{item.due_on}</TableCell>
                    <TableCell
                      className="text-right space-x-2 w-px whitespace-nowrap"
                      style={{ width: "1%" }}
                    >
                      <UpdateEquipmentRenewalForm
                        children={
                          <Button variant={"secondary"} size={"icon"}>
                            <FilePenIcon />
                          </Button>
                        }
                        data={item}
                        equipmentId={equipmentId}
                      />

                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TabsContent>
    </Tabs>
  );
}

/** @deprecated Use TasksTab */
export { TasksTab as Tasks };
