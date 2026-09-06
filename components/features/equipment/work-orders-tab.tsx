"use client";



import { Button } from "@/components/ui/button";
import {
  MinusSquare,
  PlusSquare,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";




import {
  ActualWorkOrderForm,
} from "@/components/forms/entities/work-order-form";
import EditWorkOrderForm from "@/app/(application)/work-orders/views/edit-work-order";

















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
        unit_cost: 50,
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
        unit_cost: 30,
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

export function WorkOrdersTab() {
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
