"use client";



import { Button } from "@/components/ui/button";
import {
  FilePenIcon,
  MinusSquare,
  PlusSquare,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import React from "react";


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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";




import {
  ActualWorkOrderForm,
  EditActualWorkOrderForm,
} from "@/components/forms/entities/work-order-form";
import FluidConsumedForm, {
  EditFluidConsumption,
} from "@/components/forms/entities/equipment/FluidConsumed";
import NewAccident, {
  EditAccidents,
} from "@/components/forms/entities/new-accident";
import FuelTransactionForm, {
  UpdateFuelTransactionForm,
} from "@/components/forms/entities/equipment/FuelTransactionForm";
import AssignEquipmentForm, {
  EditAssignEquipmentForm,
} from "@/components/forms/entities/equipment/AssignEquipment";
import GeneralExpense, {
  EditGeneralExpense,
} from "@/components/forms/entities/new-general-expense";
import InspectionForm, {
  EditInspectionForm,
} from "@/components/forms/entities/new-inspection";


import { MeterReplacementTab } from "./meter-replacement-tab";



const MaintenanceHistoryComponent = ({ equipmentId }: { equipmentId: string }) => {
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
            <TableHead className="w-px whitespace-nowrap" style={{ width: "1%" }}>Actions</TableHead>
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
                <TableCell className="text-right w-px whitespace-nowrap" style={{ width: "1%" }}>
                  <EditActualWorkOrderForm
                    children={
                      <Button type="button" size="icon" variant="secondary">
                        <FilePenIcon className="size-4" />
                      </Button>
                    }
                    data={wo}
                  // onEdit={(wo) => {
                  //   // Handle edit logic
                  //   console.log("Edited data:", fuel);
                  // }}
                  />

                  <Button type="button" size="icon" variant="secondary" className="text-destructive focus:text-destructive">
                    <Trash2 className="size-4" />
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
    unit_cost: 12.5,
    total: 62.5,
  },
  {
    date: "2025-07-27",
    fluid: "Transmission Fluid",
    partNumber: "TF-2030",
    qty: 3,
    meter1: 12300,
    unit_cost: 15.0,
    total: 45.0,
  },
  {
    date: "2025-07-25",
    fluid: "Coolant",
    partNumber: "CL-4578",
    qty: 2,
    meter1: 12050,
    unit_cost: 10.0,
    total: 20.0,
  },
  {
    date: "2025-07-22",
    fluid: "Brake Fluid",
    partNumber: "BF-8870",
    qty: 1,
    meter1: 11800,
    unit_cost: 8.0,
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
              <SheetTitle>Add New Fluids</SheetTitle>
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
            <TableHead className="w-px whitespace-nowrap" style={{ width: "1%" }}>Actions</TableHead>
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
              <TableCell>${item.unit_cost.toFixed(2)}</TableCell>
              <TableCell>${item.total.toFixed(2)}</TableCell>{" "}
              <TableCell className="text-right space-x-2 w-px whitespace-nowrap" style={{ width: "1%" }}>
                <EditFluidConsumption
                  children={
                    <Button type="button" size="icon" variant="secondary">
                      <FilePenIcon className="size-4" />
                    </Button>
                  }
                  data={item}
                />
                <Button type="button" size="icon" variant="secondary" className="text-destructive focus:text-destructive">
                  <Trash2 className="size-4" />
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
                  <Button type="button" size="icon" variant="secondary" className="text-destructive focus:text-destructive">
                    <Trash2 className="size-4" />
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
              <TableHead className="text-right w-px whitespace-nowrap" style={{ width: "1%" }}>Actions</TableHead>
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
                <TableCell className="text-right space-x-2 w-px whitespace-nowrap" style={{ width: "1%" }}>
                  <EditAccidents
                    children={
                      <Button type="button" size="icon" variant="secondary">
                        <FilePenIcon className="size-4" />
                      </Button>
                    }
                    data={item}
                  />

                  <Button type="button" size="icon" variant="secondary" className="text-destructive focus:text-destructive">
                    <Trash2 className="size-4" />
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
              <TableHead className="text-right w-px whitespace-nowrap" style={{ width: "1%" }}>Actions</TableHead>
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
                <TableCell className="text-right space-x-2 w-px whitespace-nowrap" style={{ width: "1%" }}>
                  <UpdateFuelTransactionForm
                    children={
                      <Button type="button" size="icon" variant="secondary">
                        <FilePenIcon className="size-4" />
                      </Button>
                    }
                    data={item}
                  />

                  <Button type="button" size="icon" variant="secondary" className="text-destructive focus:text-destructive">
                    <Trash2 className="size-4" />
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
              <TableHead className="text-right w-px whitespace-nowrap" style={{ width: "1%" }}>Actions</TableHead>
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
                <TableCell className="text-right space-x-2 w-px whitespace-nowrap" style={{ width: "1%" }}>
                  <EditGeneralExpense
                    children={
                      <Button type="button" size="icon" variant="secondary">
                        <FilePenIcon className="size-4" />
                      </Button>
                    }
                    data={item}
                    onEdit={(item) => {
                      console.log("Edited data:", item);
                    }}
                  />

                  <Button type="button" size="icon" variant="secondary" className="text-destructive focus:text-destructive">
                    <Trash2 className="size-4" />
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
              <TableHead className="text-right w-px whitespace-nowrap" style={{ width: "1%" }}>Actions</TableHead>
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
                <TableCell className="text-right space-x-2 w-px whitespace-nowrap" style={{ width: "1%" }}>
                  <EditInspectionForm
                    children={
                      <Button type="button" size="icon" variant="secondary">
                        <FilePenIcon className="size-4" />
                      </Button>
                    }
                    data={item}
                  // onEdit={(fuel) => {
                  //   // Handle edit logic
                  //   console.log("Edited data:", fuel);
                  // }}
                  />
                  <Button type="button" size="icon" variant="secondary" className="text-destructive focus:text-destructive">
                    <Trash2 className="size-4" />
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
  name: string;
  id: TabKey;
  content: React.ReactNode;
};

const tabItems: TabItem[] = [
  {
    name: "Maintenance",
    id: "maintenance",
    content: <MaintenanceHistoryComponent />,
  },
  {
    name: "Inspections",
    id: "inspections",
    content: <InspectionTab />,
  },
  {
    name: "Expenses",
    id: "expenses",
    content: <ExpensesTab />,
  },
  {
    name: "Fuel",
    id: "fuel",
    content: <FuelTab />,
  },
  {
    name: "Assignments",
    id: "assignments",
    content: <AssignmentsTab />,
  },
  {
    name: "Fluids",
    id: "fluids",
    content: <FluidsTab />,
  },
  {
    name: "Accidents",
    id: "accidents",
    content: <AccidentsTab />,
  },
  {
    name: "Meter Log",
    id: "meter-log",
    content: <MeterLog />,
  },
  {
    name: "Meter Replacement",
    id: "meter-replacement",
    content: <MeterReplacementTab />,
  },
];

export function HistoryTabs({ defaultTab = "maintenance" }: Props) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full space-y-4">
      <TabsList className="flex flex-wrap justify-start gap-2">
        {tabItems.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabItems.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
