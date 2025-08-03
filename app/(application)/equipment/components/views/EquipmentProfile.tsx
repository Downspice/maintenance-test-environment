"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  EllipsisVertical,
  FilePenIcon,
  MinusSquare,
  Pen,
  PlusSquare,
} from "lucide-react";
import EditEquipment from "./EditEquipment";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
  TableFooter,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Summary from "./summary";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronUp, Plus } from "lucide-react";
import UpdateEquipmentRenewalForm, {
  NewEquipmentRenewalForm,
} from "./equipmentRenewal";
import NewRepairRequestForm from "@/components/forms/actualForms/moreButtonForms/repairRequest/repairRequestForm";
import ActualRepairRequestForm, {
  EditActualUpdateRepairRequestForm,
} from "@/components/forms/actualForms/repairRequest";
import NewWorkOrderForm, {
  ActualWorkOrderForm,
  EditActualWorkOrderForm,
} from "@/components/forms/actualForms/work-order-form";
import EditWorkOrderForm from "@/app/(application)/work-orders/view/edit-work-order";
import FluidConsumedForm, {
  EditFluidConsumption,
} from "../forms/FluidConsumed";
import NewAccident, {
  EditAccidents,
} from "@/components/forms/actualForms/new-accident";
import NewMeterReplacementForm, {
  UpdateMeterReplacementForm,
} from "../forms/MeterReplacement";
import FuelTransactionForm, {
  UpdateFuelTransactionForm,
} from "../forms/FuelTransactionForm";
import AssignEquipmentForm, {
  EditAssignEquipmentForm,
} from "../forms/AssignEquipment";
import GeneralExpense, {
  EditGeneralExpense,
} from "@/components/forms/actualForms/new-general-expense";
import InspectionForm, {
  EditInspectionForm,
} from "@/components/forms/actualForms/new-inspection";
import EquipmentPMServiceForm, { UpdateEquipmentPMServiceForm } from "../forms/equipmentPMServiceform";

const MaintenanceHistoryComponent = () => {
  const [filter, setFilter] = useState("outstanding");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredOrders = workOrders.filter((wo) =>
    wo.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Input
          placeholder="Search work orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />

        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New
            </Button>
          </SheetTrigger>
          <SheetContent>
            <h2 className="text-lg font-semibold mb-4">Add Work Order</h2>
            <ActualWorkOrderForm />
          </SheetContent>
        </Sheet>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>WO</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Maintenance Performed</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((wo) => (
            <React.Fragment key={wo.id}>
              <TableRow
                className="cursor-pointer"
                onClick={() =>
                  setExpandedRow(expandedRow === wo.id ? null : wo.id)
                }
              >
                <TableCell>
                  {expandedRow === wo.id ? (
                    <PlusSquare className="inline ml-1" />
                  ) : (
                    <MinusSquare className="inline ml-1" />
                  )}
                  {wo.date}
                </TableCell>
                <TableCell>{wo.id}</TableCell>
                <TableCell>{wo.hours}</TableCell>
                <TableCell>{wo.maintenancePerformed}</TableCell>
                <TableCell>{wo.assignedTo}</TableCell>
                <TableCell>{wo.total}</TableCell>
                <TableCell className="text-right">
                  <EditActualWorkOrderForm
                    children={
                      <Button size="icon" variant="outline">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                    data={wo}
                    // onEdit={(wo) => {
                    //   // Handle edit logic
                    //   console.log("Edited data:", fuel);
                    // }}
                  />

                  <Button size="icon" variant="destructive">
                    <Trash2 className="w-4 h-4 text-white" />
                  </Button>
                </TableCell>
              </TableRow>
              {expandedRow === wo.id && (
                <TableRow>
                  <TableCell colSpan={7} className="p-0 bg-muted">
                    <div className="p-4">
                      <Tabs defaultValue="pm">
                        <TabsList>
                          <TabsTrigger value="pm">PM</TabsTrigger>
                          <TabsTrigger value="repairs">Repairs</TabsTrigger>
                          <TabsTrigger value="parts">Parts</TabsTrigger>
                          <TabsTrigger value="labor">Labor</TabsTrigger>
                        </TabsList>

                        <TabsContent value="pm">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Preventive Maintenance</TableHead>
                                <TableHead>Cost (Parts)</TableHead>
                                <TableHead>Cost (Labor)</TableHead>
                                <TableHead>Total Cost (PM)</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {/* Dummy row */}
                              <TableRow>
                                <TableCell>2025-07-01</TableCell>
                                <TableCell>Oil Change</TableCell>
                                <TableCell>$50</TableCell>
                                <TableCell>$30</TableCell>
                                <TableCell>$80</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TabsContent>

                        <TabsContent value="repairs">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Repairs Performed</TableHead>
                                <TableHead>Cost (Parts)</TableHead>
                                <TableHead>Cost (Labor)</TableHead>
                                <TableHead>Total Cost (Repairs)</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>2025-07-01</TableCell>
                                <TableCell>Brake Replacement</TableCell>
                                <TableCell>$70</TableCell>
                                <TableCell>$40</TableCell>
                                <TableCell>$110</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TabsContent>

                        <TabsContent value="parts">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Part#</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Unit Cost</TableHead>
                                <TableHead>Extended Cost</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>001</TableCell>
                                <TableCell>Filter</TableCell>
                                <TableCell>Oil filter</TableCell>
                                <TableCell>2</TableCell>
                                <TableCell>$10</TableCell>
                                <TableCell>$20</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TabsContent>

                        <TabsContent value="labor">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Labor Provider</TableHead>
                                <TableHead>Description of Work</TableHead>
                                <TableHead>Hours</TableHead>
                                <TableHead>Rate</TableHead>
                                <TableHead>Extended Cost</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>John Smith</TableCell>
                                <TableCell>Engine inspection</TableCell>
                                <TableCell>3</TableCell>
                                <TableCell>$25</TableCell>
                                <TableCell>$75</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell>
              ${filteredOrders.reduce((acc, curr) => acc + curr.total, 0)}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

const sampleFluids = [
  {
    date: "2025-07-28",
    fluid: "Engine Oil",
    partNumber: "EO-1001",
    qty: 5,
    meter1: 12500,
    unitCost: 12.5,
    total: 62.5,
  },
  {
    date: "2025-07-27",
    fluid: "Transmission Fluid",
    partNumber: "TF-2030",
    qty: 3,
    meter1: 12300,
    unitCost: 15.0,
    total: 45.0,
  },
  {
    date: "2025-07-25",
    fluid: "Coolant",
    partNumber: "CL-4578",
    qty: 2,
    meter1: 12050,
    unitCost: 10.0,
    total: 20.0,
  },
  {
    date: "2025-07-22",
    fluid: "Brake Fluid",
    partNumber: "BF-8870",
    qty: 1,
    meter1: 11800,
    unitCost: 8.0,
    total: 8.0,
  },
];

function FluidsTab() {
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);

  const filteredData = sampleFluids.filter((item) =>
    item.fluid.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Filter Fuel..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>Add</Button>
          </SheetTrigger>
          <SheetContent className="w-1/4">
            <SheetHeader>
              <SheetTitle>Add New Fuel</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
              <FluidConsumedForm />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Fluid</TableHead>
            <TableHead>Part #</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Meter 1</TableHead>
            <TableHead>Unit Cost</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item, index) => (
            <TableRow key={item.date}>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.fluid}</TableCell>
              <TableCell>{item.partNumber}</TableCell>
              <TableCell>{item.qty}</TableCell>
              <TableCell>{item.meter1}</TableCell>
              <TableCell>${item.unitCost.toFixed(2)}</TableCell>
              <TableCell>${item.total.toFixed(2)}</TableCell>{" "}
              <TableCell className="text-right space-x-2">
                <EditFluidConsumption
                  children={
                    <Button size="icon" variant="outline">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                  data={item}
                />
                <Button size="icon" variant="destructive">
                  <Trash2 className="w-4 h-4 text-white" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const sampleAssignments = [
  {
    operator: "Samuel Tetteh",
    jobSite: "Tema Port Expansion",
    signOut: {
      date: "2025-07-01",
      time: "08:00",
      mileage: 10234,
    },
    signIn: {
      date: "2025-07-01",
      time: "17:30",
      mileage: 10310,
    },
  },
  {
    operator: "Akosua Dapaah",
    jobSite: "Accra Mall Construction",
    signOut: {
      date: "2025-07-02",
      time: "07:45",
      mileage: 20300,
    },
    signIn: {
      date: "2025-07-02",
      time: "16:15",
      mileage: 20375,
    },
  },
  {
    operator: "Kwabena Boateng",
    jobSite: "Takoradi Highway Repair",
    signOut: {
      date: "2025-07-03",
      time: "06:30",
      mileage: 45560,
    },
    signIn: {
      date: "2025-07-03",
      time: "15:00",
      mileage: 45640,
    },
  },
  {
    operator: "Efua Kyei",
    jobSite: "Kumasi Industrial Hub",
    signOut: {
      date: "2025-07-04",
      time: "08:10",
      mileage: 12000,
    },
    signIn: {
      date: "2025-07-04",
      time: "17:00",
      mileage: 12085,
    },
  },
  {
    operator: "Joseph Awer",
    jobSite: "North Ridge Office Tower",
    signOut: {
      date: "2025-07-05",
      time: "09:00",
      mileage: 33050,
    },
    signIn: {
      date: "2025-07-05",
      time: "18:00",
      mileage: 33130,
    },
  },
];

function AssignmentsTab() {
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);

  const filteredData = sampleAssignments.filter((item) =>
    item.operator.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Filter Fuel..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>Add</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Fuel</SheetTitle>
            </SheetHeader>
            {/* Add your form here */}
            <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
              <AssignEquipmentForm />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {/* First header row */}
            <TableRow>
              <TableHead colSpan={3} className="text-center border-r">
                Sign In
              </TableHead>
              <TableHead colSpan={3} className="text-center border-r">
                Sign Out
              </TableHead>
              <TableHead rowSpan={2}>Operator</TableHead>
              <TableHead rowSpan={2}>Job Site</TableHead>
              <TableHead rowSpan={2} className="text-right">
                Actions
              </TableHead>
            </TableRow>

            {/* Second header row */}
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Mileage</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Mileage</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.jobSite}>
                <TableCell>{item.signIn.date}</TableCell>
                <TableCell>{item.signIn.time}</TableCell>
                <TableCell>{item.signIn.mileage}</TableCell>
                <TableCell>{item.signOut.date}</TableCell>
                <TableCell>{item.signOut.time}</TableCell>
                <TableCell>{item.signOut.mileage}</TableCell>
                <TableCell>{item.operator}</TableCell>
                <TableCell>{item.jobSite}</TableCell>
                <TableCell className="text-right space-x-2">
                  <EditAssignEquipmentForm
                    children={
                      <Button variant={"secondary"} size={"icon"}>
                        <FilePenIcon />
                      </Button>
                    }
                    data={item}
                  />
                  <Button size="icon" variant="destructive">
                    <Trash2 className="w-4 h-4 text-white" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const sampleAccidents = [
  {
    id: "ACC001",
    date: "2025-07-10",
    time: "14:35",
    driver: "James Owusu",
    claimNumber: "CLM1023",
    meter1: "34560",
    units: 2,
    injuries: 0,
    damage: "Minor dent on rear bumper",
    other: "No police report filed",
  },
  {
    id: "ACC002",
    date: "2025-07-14",
    time: "09:20",
    driver: "Akua Mensah",
    claimNumber: "CLM1048",
    meter1: "45800",
    units: 1,
    injuries: 1,
    damage: "Front left fender damaged",
    other: "Passenger taken to clinic",
  },
  {
    id: "ACC003",
    date: "2025-07-18",
    time: "17:45",
    driver: "Kwame Nkrumah",
    claimNumber: "CLM1062",
    meter1: "50120",
    units: 3,
    injuries: 0,
    damage: "Broken side mirror",
    other: "Accident occurred during delivery",
  },
  {
    id: "ACC004",
    date: "2025-07-21",
    time: "11:10",
    driver: "Linda Boateng",
    claimNumber: "CLM1090",
    meter1: "52005",
    units: 1,
    injuries: 2,
    damage: "Vehicle totaled",
    other: "Insurance contacted, investigation ongoing",
  },
  {
    id: "ACC005",
    date: "2025-07-28",
    time: "07:55",
    driver: "Yaw Asante",
    claimNumber: "CLM1111",
    meter1: "54800",
    units: 2,
    injuries: 0,
    damage: "Cracked windshield",
    other: "Reported by supervisor",
  },
];

function AccidentsTab() {
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);

  const filteredData = sampleAccidents.filter((item) =>
    item.damage.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search Accidents..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>Add</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Accident</SheetTitle>
            </SheetHeader>
            {/* Add your form here */}
            <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
              <NewAccident />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Claim #</TableHead>
              <TableHead>Meter #1</TableHead>
              <TableHead>Units #</TableHead>
              <TableHead>Injuries</TableHead>
              <TableHead>Damage</TableHead>
              <TableHead>Other</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.time}</TableCell>
                <TableCell>{item.driver}</TableCell>
                <TableCell>{item.claimNumber}</TableCell>
                <TableCell>{item.meter1}</TableCell>
                <TableCell>{item.units}</TableCell>
                <TableCell>{item.injuries}</TableCell>
                <TableCell>{item.damage}</TableCell>
                <TableCell>{item.other}</TableCell>
                <TableCell className="text-right space-x-2">
                  <EditAccidents
                    children={
                      <Button size="icon" variant="outline">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    }
                    data={item}
                  />

                  <Button size="icon" variant="destructive">
                    <Trash2 className="w-4 h-4 text-white" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const sampleMeterReplacement = [
  {
    replaceDate: "2025-07-01",
    currentMeter: "12345",
    replacementMeter: "67890",
    description: "Replaced due to malfunction during diagnostics",
  },
  {
    replaceDate: "2025-07-05",
    currentMeter: "23456",
    replacementMeter: "78901",
    description: "Preventive replacement after 10,000 hours",
  },
  {
    replaceDate: "2025-07-10",
    currentMeter: "34567",
    replacementMeter: "89012",
    description: "Old meter inaccurate, replaced with new unit",
  },
  {
    replaceDate: "2025-07-15",
    currentMeter: "45678",
    replacementMeter: "90123",
    description: "Meter",
  },
];

export function MeterReplacementTab() {
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);

  const filteredData = sampleMeterReplacement.filter((item) =>
    item.replacementMeter.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Filter Fuel..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>Add</Button>
          </SheetTrigger>
          <SheetContent className="w-1/4">
            <SheetHeader>
              <SheetTitle>Add New Fuel</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
              <NewMeterReplacementForm />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Replace Date</TableHead>
              <TableHead>Current Meter</TableHead>
              <TableHead>Replacement Meter</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.replaceDate}>
                <TableCell>{item.replaceDate}</TableCell>
                <TableCell>{item.currentMeter}</TableCell>
                <TableCell>{item.replacementMeter}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right space-x-2">
                  <UpdateMeterReplacementForm
                    children={
                      <Button size="icon" variant="outline">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    }
                    data={item}
                  />
                  <Button size="icon" variant="destructive">
                    <Trash2 className="w-4 h-4 text-white" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function MeterLog() {
  const [rows, setRows] = useState(meterData);

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Log Date</TableHead>
            <TableHead className="text-center  ">Meter 1</TableHead>
            <TableHead className="text-center">Meter 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.logDate}</TableCell>
              <TableCell>
                <Input
                  value={row.meter1.new}
                  onChange={(e) => {
                    const updated = [...rows];
                    updated[index].meter1.new = e.target.value;
                    setRows(updated);
                  }}
                />
              </TableCell>
              <TableCell>
                {row.meter2 ? (
                  <Input
                    value={row.meter2.new}
                    onChange={(e) => {
                      const updated = [...rows];
                      if (updated[index].meter2) {
                        updated[index].meter2!.new = e.target.value;
                      }
                      setRows(updated);
                    }}
                  />
                ) : (
                  <span className="text-muted-foreground italic">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface MeterRow {
  equipment: string;
  category: string;
  meter1: {
    current: string;
    new: string;
  };
  meter2?: {
    current: string;
    new: string;
  };
  logDate: string;
}

const meterData: MeterRow[] = [
  {
    equipment: "Compressor A",
    category: "Pressure",
    meter1: { current: "250 psi", new: "260 psi" },
    meter2: { current: "87 hrs", new: "90 hrs" },
    logDate: "2025-07-18",
  },
  {
    equipment: "Generator B",
    category: "Voltage",
    meter1: { current: "480 V", new: "482 V" },
    meter2: { current: "123 hrs", new: "126 hrs" },
    logDate: "2025-07-18",
  },
  {
    equipment: "Pump C",
    category: "Flow Rate",
    meter1: { current: "15 L/min", new: "16 L/min" },
    logDate: "2025-07-17", // No meter2
  },
  {
    equipment: "Fan D",
    category: "Speed",
    meter1: { current: "1800 RPM", new: "1850 RPM" },
    meter2: { current: "310 hrs", new: "312 hrs" },
    logDate: "2025-07-17",
  },
];

const sampleFuel = [
  {
    id: "1",
    date: "2025-07-25",
    hours: 1800,
    volume: 45.5,
    price: 5.2,
    total: 236.6,
    economy: "9.2 L/100km",
    vendor: "Shell",
  },
  {
    id: "2",
    date: "2025-07-26",
    hours: 1825,
    volume: 38.0,
    price: 5.0,
    total: 190.0,
    economy: "8.9 L/100km",
    vendor: "Total",
  },
  {
    id: "3",
    date: "2025-07-27",
    hours: 1850,
    volume: 50.0,
    price: 4.95,
    total: 247.5,
    economy: "10.1 L/100km",
    vendor: "Goil",
  },
  {
    id: "4",
    date: "2025-07-28",
    hours: 1880,
    volume: 40.0,
    price: 5.1,
    total: 204.0,
    economy: "9.0 L/100km",
    vendor: "Allied",
  },
];

function FuelTab() {
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);

  const filteredData = sampleFuel.filter((item) =>
    item.vendor.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Filter Fuel..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>Add</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Fuel</SheetTitle>
            </SheetHeader>
            {/* Add your form here */}
            <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
              <FuelTransactionForm />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Economy</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.hours}</TableCell>
                <TableCell>{item.volume}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.total}</TableCell>
                <TableCell>{item.economy}</TableCell>
                <TableCell>{item.vendor}</TableCell>
                <TableCell className="text-right space-x-2">
                  <UpdateFuelTransactionForm
                    children={
                      <Button size="icon" variant="outline">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    }
                    data={item}
                  />

                  <Button size="icon" variant="destructive">
                    <Trash2 className="w-4 h-4 text-white" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const sampleExpenses = [
  {
    id: 1,
    date: "2025-07-01",
    expense: "Oil Change",
    meter: "12345",
    qty: 2,
    cost: 120,
    costCentre: "Fleet A",
    notes: "Routine change",
  },
  {
    id: 2,
    date: "2025-07-10",
    expense: "Brake Pads",
    meter: "12890",
    qty: 4,
    cost: 300,
    costCentre: "Fleet B",
    notes: "Emergency replacement",
  },
];

function ExpensesTab() {
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);

  const filteredData = sampleExpenses.filter((item) =>
    item.expense.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Filter expenses..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>Add Expense</Button>
          </SheetTrigger>
          <SheetContent className="w-1/4">
            <SheetHeader>
              <SheetTitle>Add New Expense</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
              <GeneralExpense />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Expense</TableHead>
              <TableHead>Meter#1</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Cost Centre</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.expense}</TableCell>
                <TableCell>{item.meter}</TableCell>
                <TableCell>{item.qty}</TableCell>
                <TableCell>{item.cost}</TableCell>
                <TableCell>{item.costCentre}</TableCell>
                <TableCell>{item.notes}</TableCell>
                <TableCell className="text-right space-x-2">
                  <EditGeneralExpense
                    children={
                      <Button size="icon" variant="outline">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                    data={item}
                    onEdit={(item) => {
                      console.log("Edited data:", item);
                    }}
                  />

                  <Button size="icon" variant="destructive">
                    <Trash2 className="w-4 h-4 text-white" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

type Inspection = {
  id: string;
  date: string;
  condition: string;
  inspector: string;
  notes: string;
  hours: number;
};

const sampleInspections: Inspection[] = [
  {
    id: "1",
    date: "2025-07-25",
    condition: "Good",
    inspector: "John Doe",
    notes: "All parts functional.",
    hours: 2,
  },
  {
    id: "2",
    date: "2025-07-20",
    condition: "Fair",
    inspector: "Jane Smith",
    notes: "Needs minor repairs.",
    hours: 1.5,
  },
  {
    id: "3",
    date: "2025-07-18",
    condition: "Poor",
    inspector: "Alex Johnson",
    notes: "Brake issue identified.",
    hours: 3,
  },
];

function InspectionTab() {
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = sampleInspections.filter(
    (item) =>
      item.inspector.toLowerCase().includes(filter.toLowerCase()) ||
      item.condition.toLowerCase().includes(filter.toLowerCase()) ||
      item.notes.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Filter by inspector, condition, or notes..."
          className="max-w-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Inspection
            </Button>
          </SheetTrigger>
          <SheetContent className=" ">
            <SheetHeader>
              <SheetTitle>Add Inspection</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
              <InspectionForm />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Inspector</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.condition}</TableCell>
                <TableCell>{item.inspector}</TableCell>
                <TableCell>{item.notes}</TableCell>
                <TableCell>{item.hours}</TableCell>
                <TableCell className="text-right space-x-2">
                  <EditInspectionForm
                    children={
                      <Button size="icon" variant="outline">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                    data={item}
                    // onEdit={(fuel) => {
                    //   // Handle edit logic
                    //   console.log("Edited data:", fuel);
                    // }}
                  />
                  <Button size="icon" variant="destructive">
                    <Trash2 className="w-4 h-4 text-white" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No inspection records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const workOrders = [
  {
    id: "WO-001",
    date: "2025-07-25",
    hours: 4,
    maintenancePerformed: "Oil Change, Tire Rotation",
    assignedTo: "James Mensah",
    total: 180,
    status: "outstanding",
    pm: [
      {
        date: "2025-07-25",
        maintenance: "Oil Change",
        costParts: 40,
        costLabor: 30,
        totalCost: 70,
      },
    ],
    repairs: [
      {
        date: "2025-07-25",
        repair: "Brake Pad Replacement",
        costParts: 50,
        costLabor: 20,
        totalCost: 70,
      },
    ],
    parts: [
      {
        partNo: "P-101",
        name: "Brake Pads",
        description: "Front brake pads",
        quantity: 1,
        unitCost: 50,
        extendedCost: 50,
      },
    ],
    labor: [
      {
        provider: "AutoFix Ltd.",
        description: "Replaced brake pads and test drive",
        hours: 1,
        rate: 20,
        extendedCost: 20,
      },
    ],
  },
  {
    id: "WO-002",
    date: "2025-07-20",
    hours: 2,
    maintenancePerformed: "AC Filter Cleaning",
    assignedTo: "Sarah Boateng",
    total: 95,
    status: "complete",
    pm: [
      {
        date: "2025-07-20",
        maintenance: "AC Filter Cleaning",
        costParts: 30,
        costLabor: 15,
        totalCost: 45,
      },
    ],
    repairs: [],
    parts: [
      {
        partNo: "P-205",
        name: "AC Filter",
        description: "Cabin air filter",
        quantity: 1,
        unitCost: 30,
        extendedCost: 30,
      },
    ],
    labor: [
      {
        provider: "CoolAir Services",
        description: "AC maintenance and inspection",
        hours: 1,
        rate: 20,
        extendedCost: 20,
      },
    ],
  },
];

const WorkOrdersComponent = () => {
  const [filter, setFilter] = useState("outstanding");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredOrders = workOrders.filter((wo) =>
    wo.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <RadioGroup
          defaultValue="outstanding"
          className="flex space-x-4"
          onValueChange={setFilter}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="outstanding" id="outstanding" />
            <label htmlFor="outstanding">Outstanding</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="complete" id="complete" />
            <label htmlFor="complete">Complete</label>
          </div>
        </RadioGroup>

        <Input
          placeholder="Search work orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />

        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create New Order</SheetTitle>
              <SheetDescription>
                Fill out the form below to set up your new Work Order.
              </SheetDescription>
            </SheetHeader>
            <ActualWorkOrderForm />
          </SheetContent>
        </Sheet>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>WO</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Maintenance Performed</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((wo) => (
            <React.Fragment key={wo.id}>
              <TableRow
                className="cursor-pointer"
                onClick={() =>
                  setExpandedRow(expandedRow === wo.id ? null : wo.id)
                }
              >
                <TableCell>
                  {expandedRow === wo.id ? (
                    <PlusSquare className="inline ml-1" />
                  ) : (
                    <MinusSquare className="inline ml-1" />
                  )}
                  {wo.date}
                </TableCell>
                <TableCell>{wo.id}</TableCell>
                <TableCell>{wo.hours}</TableCell>
                <TableCell>{wo.maintenancePerformed}</TableCell>
                <TableCell>{wo.assignedTo}</TableCell>
                <TableCell>{wo.total}</TableCell>
                <TableCell className="text-right">
                  <EditWorkOrderForm
                    children={
                      <Button size="icon" variant="outline">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    }
                    data={wo}
                  />

                  <Button size="icon" variant="destructive">
                    <Trash2 className="w-4 h-4 text-white" />
                  </Button>
                </TableCell>
              </TableRow>
              {expandedRow === wo.id && (
                <TableRow>
                  <TableCell colSpan={7} className="p-0 bg-muted">
                    <div className="p-4">
                      <Tabs defaultValue="pm">
                        <TabsList>
                          <TabsTrigger value="pm">PM</TabsTrigger>
                          <TabsTrigger value="repairs">Repairs</TabsTrigger>
                          <TabsTrigger value="parts">Parts</TabsTrigger>
                          <TabsTrigger value="labor">Labor</TabsTrigger>
                        </TabsList>

                        <TabsContent value="pm">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Preventive Maintenance</TableHead>
                                <TableHead>Cost (Parts)</TableHead>
                                <TableHead>Cost (Labor)</TableHead>
                                <TableHead>Total Cost (PM)</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {/* Dummy row */}
                              <TableRow>
                                <TableCell>2025-07-01</TableCell>
                                <TableCell>Oil Change</TableCell>
                                <TableCell>$50</TableCell>
                                <TableCell>$30</TableCell>
                                <TableCell>$80</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TabsContent>

                        <TabsContent value="repairs">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Repairs Performed</TableHead>
                                <TableHead>Cost (Parts)</TableHead>
                                <TableHead>Cost (Labor)</TableHead>
                                <TableHead>Total Cost (Repairs)</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>2025-07-01</TableCell>
                                <TableCell>Brake Replacement</TableCell>
                                <TableCell>$70</TableCell>
                                <TableCell>$40</TableCell>
                                <TableCell>$110</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TabsContent>

                        <TabsContent value="parts">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Part#</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Unit Cost</TableHead>
                                <TableHead>Extended Cost</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>001</TableCell>
                                <TableCell>Filter</TableCell>
                                <TableCell>Oil filter</TableCell>
                                <TableCell>2</TableCell>
                                <TableCell>$10</TableCell>
                                <TableCell>$20</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TabsContent>

                        <TabsContent value="labor">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Labor Provider</TableHead>
                                <TableHead>Description of Work</TableHead>
                                <TableHead>Hours</TableHead>
                                <TableHead>Rate</TableHead>
                                <TableHead>Extended Cost</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>John Smith</TableCell>
                                <TableCell>Engine inspection</TableCell>
                                <TableCell>3</TableCell>
                                <TableCell>$25</TableCell>
                                <TableCell>$75</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell>
              ${filteredOrders.reduce((acc, curr) => acc + curr.total, 0)}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

const pmData = [
  {
    id: 1,
    service: "Oil Change",
    frequency: "3 months",
    lastDate: "2025-06-15",
  },
  {
    id: 2,
    service: "Filter Check",
    frequency: "6 months",
    lastDate: "2025-04-20",
  },
];

const repairData = [
  {
    id: 1,
    repair: "Brake Failure",
    dueOn: "2025-08-01",
    dueAt: "08:00",
    requestedBy: "John Doe",
    wo: "WO-1234",
  },
  {
    id: 2,
    repair: "Engine Overheat",
    dueOn: "2025-08-05",
    dueAt: "13:30",
    requestedBy: "Jane Smith",
    wo: "WO-5678",
  },
];

const renewalData = [
  { id: 1, renewal: "Vehicle License", dueOn: "2025-09-10" },
  { id: 2, renewal: "Insurance", dueOn: "2025-09-20" },
];

function Tasks() {
  const [openPM, setOpenPM] = useState(false);
  const [openRepair, setOpenRepair] = useState(false);
  const [openRenewal, setOpenRenewal] = useState(false);

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

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PM Service</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Last Service Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pmData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.service}</TableCell>
                <TableCell>{item.frequency}</TableCell>
                <TableCell>{item.lastDate}</TableCell>
                <TableCell className="text-right space-x-2">
                  
                  <UpdateEquipmentPMServiceForm
                    children={
                      <Button size="icon" variant="outline">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    }
                    data={item}
                  />
                  <Button size="icon" variant="destructive">
                    <Trash2 className="w-4 h-4 text-white" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>

      {/* --- Repair Requests Tab --- */}
      <TabsContent value="repair">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Repair Requests</h2>

          <Sheet open={openRepair} onOpenChange={setOpenRepair}>
            <SheetTrigger asChild>
              <Button>Add Repair Request</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Add Repair Request</SheetTitle>
              </SheetHeader>
              <ActualRepairRequestForm />
            </SheetContent>
          </Sheet>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Repair</TableHead>
              <TableHead>Due On</TableHead>
              <TableHead>Due At</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>WO#</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repairData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.repair}</TableCell>
                <TableCell>{item.dueOn}</TableCell>
                <TableCell>{item.dueAt}</TableCell>
                <TableCell>{item.requestedBy}</TableCell>
                <TableCell>{item.wo}</TableCell>

                <TableCell className="text-right space-x-2">
                  <EditActualUpdateRepairRequestForm
                    children={
                      <Button size="icon" variant="outline">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    }
                    data={item}
                  />

                  <Button size="icon" variant="destructive">
                    <Trash2 className="w-4 h-4 text-white" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
              <NewEquipmentRenewalForm />
            </SheetContent>
          </Sheet>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Renewal</TableHead>
              <TableHead>Due On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renewalData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.renewal}</TableCell>
                <TableCell>{item.dueOn}</TableCell>
                <TableCell className="text-right space-x-2">
                  <UpdateEquipmentRenewalForm
                    children={
                      <Button variant={"secondary"} size={"icon"}>
                        <FilePenIcon />
                      </Button>
                    }
                    data={item}
                  />

                  <Button size="icon" variant="destructive">
                    <Trash2 className="w-4 h-4 text-white" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}

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

type TabItem = {
  label: string;
  value: TabKey;
  content: React.ReactNode;
};

const tabItems: TabItem[] = [
  {
    label: "Maintenance",
    value: "maintenance",
    content: <MaintenanceHistoryComponent />,
  },
  {
    label: "Inspections",
    value: "inspections",
    content: <InspectionTab />,
  },
  {
    label: "Expenses",
    value: "expenses",
    content: <ExpensesTab />,
  },
  {
    label: "Fuel",
    value: "fuel",
    content: <FuelTab />,
  },
  {
    label: "Assignments",
    value: "assignments",
    content: <AssignmentsTab />,
  },
  {
    label: "Fluids",
    value: "fluids",
    content: <FluidsTab />,
  },
  {
    label: "Accidents",
    value: "accidents",
    content: <AccidentsTab />,
  },
  {
    label: "Meter Log",
    value: "meter-log",
    content: <MeterLog />,
  },
  {
    label: "Meter Replacement",
    value: "meter-replacement",
    content: <MeterReplacementTab />,
  },
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
          {tab.content}
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
      content: <Summary />,
    },
    {
      id: "details",
      label: "Details",
      icon: <ClipboardList size={20} />,
      content: <EquipmentDetailsSection />,
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: <ListChecks size={20} />,
      content: <Tasks />,
    },
    {
      id: "workOrders",
      label: "Work Orders",
      icon: <ListChecks size={20} />,
      content: <WorkOrdersComponent />,
    },
    {
      id: "history",
      label: "History",
      icon: <History size={20} />,
      content: <HistoryTabs />,
    },
    {
      id: "commonParts",
      label: "Common Parts",
      icon: <BookText size={20} />,
      content: <PartsManager equipment={data.name} />,
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
        <SheetContent className="w-5/6 p-2">
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
                  <span>Equipment 100- Fully functional</span>
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
                          Equipment Name
                        </span>{" "}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">
                          Serial:
                        </span>{" "}
                        <span>SN-44983-21A</span>
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
                            Active
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
