"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Wrench,
  FileText,
  Plus,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  CalendarArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

// Sample data
const equipmentList = [
  { id: "1", name: "Excavator CAT-320" },
  { id: "2", name: "Bulldozer D6T" },
  { id: "3", name: "Crane RT540E" },
  { id: "4", name: "Loader 950M" },
];

const jobSites = [
  { id: "1", name: "Construction Site A" },
  { id: "2", name: "Highway Project B" },
  { id: "3", name: "Building Complex C" },
  { id: "4", name: "Bridge Construction D" },
];

const sampleEvents = {
  "equipment-due": [
    {
      date: 15,
      type: "maintenance",
      equipment: "Excavator CAT-320",
      equipmentNumber: "EQ-001",
      description: "Scheduled maintenance",
      priority: "high",
      tasks: [
        { id: "1", name: "Check hydraulic fluid levels", completed: false },
        { id: "2", name: "Inspect tracks for wear", completed: false },
        { id: "3", name: "Test engine performance", completed: true },
        { id: "4", name: "Lubricate moving parts", completed: false },
      ],
    },
    {
      date: 22,
      type: "repair",
      equipment: "Bulldozer D6T",
      equipmentNumber: "EQ-002",
      description: "Hydraulic system repair",
      priority: "urgent",
      tasks: [
        { id: "5", name: "Replace hydraulic seals", completed: false },
        { id: "6", name: "Test hydraulic pressure", completed: false },
        { id: "7", name: "Check for leaks", completed: false },
      ],
    },
  ],
  "work-orders": [
    {
      date: 10,
      type: "work-order",
      equipment: "Crane RT540E",
      equipmentNumber: "WO-001",
      description: "Cable replacement work order",
      priority: "medium",
      status: "open",
      tasks: [
        { id: "8", name: "Order replacement cables", completed: true },
        { id: "9", name: "Schedule downtime", completed: false },
        { id: "10", name: "Replace cables", completed: false },
      ],
    },
    {
      date: 25,
      type: "work-order",
      equipment: "Loader 950M",
      equipmentNumber: "WO-002",
      description: "Engine overhaul",
      priority: "high",
      status: "in-progress",
      tasks: [
        { id: "11", name: "Remove engine", completed: true },
        { id: "12", name: "Inspect components", completed: true },
        { id: "13", name: "Replace worn parts", completed: false },
      ],
    },
  ],
  history: [
    {
      date: 5,
      type: "completed",
      equipment: "Excavator CAT-320",
      equipmentNumber: "HIS-001",
      description: "Completed maintenance check",
      priority: "medium",
      completedDate: "2024-01-05",
      tasks: [
        { id: "14", name: "Oil change", completed: true },
        { id: "15", name: "Filter replacement", completed: true },
      ],
    },
    {
      date: 18,
      type: "completed",
      equipment: "Bulldozer D6T",
      equipmentNumber: "HIS-002",
      description: "Track adjustment completed",
      priority: "low",
      completedDate: "2024-01-18",
      tasks: [
        { id: "16", name: "Adjust track tension", completed: true },
        { id: "17", name: "Lubricate track pins", completed: true },
      ],
    },
  ],
  fuel: [
    {
      date: 12,
      type: "fuel",
      equipment: "Crane RT540E",
      equipmentNumber: "FUEL-001",
      description: "Fuel refill - 150 gallons",
      priority: "low",
      gallons: 150,
      tasks: [
        { id: "18", name: "Check fuel quality", completed: true },
        { id: "19", name: "Record fuel consumption", completed: false },
      ],
    },
    {
      date: 20,
      type: "fuel",
      equipment: "Loader 950M",
      equipmentNumber: "FUEL-002",
      description: "Fuel refill - 200 gallons",
      priority: "low",
      gallons: 200,
      tasks: [
        { id: "20", name: "Check fuel filters", completed: false },
        { id: "21", name: "Update fuel log", completed: false },
      ],
    },
  ],
  assignments: [
    {
      date: 8,
      type: "assignment",
      equipment: "Excavator CAT-320",
      equipmentNumber: "ASG-001",
      description: "Assigned to Site A - Foundation work",
      priority: "high",
      jobSite: "Construction Site A",
      operator: "John Smith",
      tasks: [
        { id: "22", name: "Transport to site", completed: true },
        { id: "23", name: "Set up work area", completed: false },
        { id: "24", name: "Begin excavation", completed: false },
      ],
    },
    {
      date: 16,
      type: "assignment",
      equipment: "Bulldozer D6T",
      equipmentNumber: "ASG-002",
      description: "Assigned to Highway Project B",
      priority: "medium",
      jobSite: "Highway Project B",
      operator: "Mike Johnson",
      tasks: [
        { id: "25", name: "Site preparation", completed: false },
        { id: "26", name: "Grade roadway", completed: false },
      ],
    },
  ],
};

export default function EquipmentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [hideRepeated, setHideRepeated] = useState("show");
  // const [hideSatisfied, setHideSatisfied] = useState("show");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [taskStates, setTaskStates] = useState({});
  const [taskDue, setTaskDue] = useState(false);
  const [activeTab, setActiveTab] = useState("equipment-due");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedJobSite, setSelectedJobSite] = useState("");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const shortMonthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  const goToFirstMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), 0, 1));
  };

  const goToLastMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), 11, 1));
  };

  const goToSpecificMonth = (year, month) => {
    setCurrentDate(new Date(year, month, 1));
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isPrevMonth: true,
        date: new Date(year, month - 1, prevMonthDays - i),
      });
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day: day,
        isCurrentMonth: true,
        isPrevMonth: false,
        date: new Date(year, month, day),
      });
    }

    // Add days from next month to fill the grid
    const remainingCells = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day: day,
        isCurrentMonth: false,
        isPrevMonth: false,
        date: new Date(year, month + 1, day),
      });
    }

    return days;
  };

  const getEventForDay = (day: number) => {
    const events = sampleEvents[activeTab] || [];
    return events.find((event) => event.date === day);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    const initialTaskStates = {};
    event.tasks.forEach((task) => {
      initialTaskStates[task.id] = task.completed;
    });
    setTaskStates(initialTaskStates);
    setPopoverOpen(true);
  };

  const handleTaskChange = (taskId, checked) => {
    setTaskStates((prev) => ({
      ...prev,
      [taskId]: checked,
    }));
  };

  const handleCheckAll = (checked) => {
    const newTaskStates = {};
    selectedEvent.tasks.forEach((task) => {
      newTaskStates[task.id] = checked;
    });
    setTaskStates(newTaskStates);
  };

  const areAllTasksChecked = () => {
    if (!selectedEvent) return false;
    return selectedEvent.tasks.every((task) => taskStates[task.id]);
  };

  const handleIssueWorkOrder = () => {
    console.log("Issuing work order for:", selectedEvent.equipment);
    console.log("Task states:", taskStates);
    console.log("Task due:", taskDue);
    setPopoverOpen(false);
  };

  const getThreeMonthsView = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    return [
      {
        year: currentMonth === 0 ? currentYear - 1 : currentYear,
        month: currentMonth === 0 ? 11 : currentMonth - 1,
        name: shortMonthNames[currentMonth === 0 ? 11 : currentMonth - 1],
        isCurrent: false,
      },
      {
        year: currentYear,
        month: currentMonth,
        name: shortMonthNames[currentMonth],
        isCurrent: true,
      },
      {
        year: currentMonth === 11 ? currentYear + 1 : currentYear,
        month: currentMonth === 11 ? 0 : currentMonth + 1,
        name: shortMonthNames[currentMonth === 11 ? 0 : currentMonth + 1],
        isCurrent: false,
      },
    ];
  };

  const renderTabControls = (tabName: string) => {
    const getButtonLabel = () => {
      switch (tabName) {
        case "work-orders":
          return "Issue Work Order";
        case "fuel":
          return "Add Fuel";
        case "assignments":
          return "Sign Out";
        default:
          return "Issue Work Order";
      }
    };

    const getButtonIcon = () => {
      switch (tabName) {
        case "fuel":
          return <Plus className="h-4 w-4" />;
        case "assignments":
          return <LogOut className="h-4 w-4" />;
        default:
          return <FileText className="h-4 w-4" />;
      }
    };

    return (
      <div className="space-y-4">
        {/* Action Buttons and Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 ">
          <div className="flex gap-2">
            <Button className="flex items-center gap-2">
              {getButtonIcon()}
              {getButtonLabel()}
            </Button>
            {tabName === "equipment-due" && (
              <Button variant="outline">Repair</Button>
            )}
            {tabName === "assignments" && (
              <Select
                value={selectedJobSite}
                onValueChange={setSelectedJobSite}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Job Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Job Sites</SelectItem>
                  {jobSites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="outstanding">Outstanding</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={goToFirstMonth}>
              <ChevronsLeft />
            </Button>
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight />
            </Button>
            <Button variant="outline" size="sm" onClick={goToLastMonth}>
              <ChevronsRight />
            </Button>
            <Button variant="outline" size="sm" onClick={goToCurrentMonth}>
              <CalendarArrowDown />
            </Button>
            {tabName === "equipment-due" && (
              <div className="flex gap-4">
                <Select value={hideRepeated} onValueChange={setHideRepeated}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="show">
                      Show Repeated Equipment
                    </SelectItem>
                    <SelectItem value="hide">
                      Show Equipment Satisfied by Work Order
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    return (
      <div className="flex gap-6">
        {/* Main Calendar */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "equipment-due" && "Equipment Schedule"}
                {activeTab === "work-orders" && "Work Orders Schedule"}
                {activeTab === "history" && "History Schedule"}
                {activeTab === "fuel" && "Fuel Schedule"}
                {activeTab === "assignments" && "Assignments Schedule"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center font-semibold text-sm text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth().map((dayObj, index) => {
                  const event = dayObj.isCurrentMonth
                    ? getEventForDay(dayObj.day)
                    : null;

                  return (
                    <div
                      key={index}
                      className={`
                        min-h-[80px] p-2 border rounded-lg relative
                        ${
                          dayObj.isCurrentMonth
                            ? "bg-background hover:bg-muted/50"
                            : "bg-muted/20 text-muted-foreground"
                        }
                        ${event ? "border-primary" : "border-border"}
                      `}
                    >
                      <div
                        className={`text-sm font-medium ${
                          !dayObj.isCurrentMonth ? "text-muted-foreground" : ""
                        }`}
                      >
                        {dayObj.day}
                      </div>
                      {event && (
                        <Popover
                          open={
                            popoverOpen && selectedEvent?.date === dayObj.day
                          }
                          onOpenChange={setPopoverOpen}
                        >
                          <PopoverTrigger asChild>
                            <div
                              className="mt-1 space-y-1 cursor-pointer"
                              onClick={() => handleEventClick(event)}
                            >
                              <Badge
                                variant="secondary"
                                className={`text-xs ${getPriorityColor(
                                  event.priority
                                )} text-white`}
                              >
                                {event.type}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {event.equipment}
                              </div>
                              <div className="text-xs">{event.description}</div>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-80" align="start">
                            {selectedEvent && (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium leading-none">
                                    {selectedEvent.equipmentNumber}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedEvent.equipment}
                                  </p>
                                  {selectedEvent.jobSite && (
                                    <p className="text-sm text-muted-foreground">
                                      Job Site: {selectedEvent.jobSite}
                                    </p>
                                  )}
                                  {selectedEvent.operator && (
                                    <p className="text-sm text-muted-foreground">
                                      Operator: {selectedEvent.operator}
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="check-all"
                                      checked={areAllTasksChecked()}
                                      onCheckedChange={handleCheckAll}
                                    />
                                    <label
                                      htmlFor="check-all"
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      Check all tasks
                                    </label>
                                  </div>

                                  <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {selectedEvent.tasks.map((task) => (
                                      <div
                                        key={task.id}
                                        className="flex items-center space-x-2"
                                      >
                                        <Checkbox
                                          id={task.id}
                                          checked={taskStates[task.id] || false}
                                          onCheckedChange={(checked) =>
                                            handleTaskChange(task.id, checked)
                                          }
                                        />
                                        <label
                                          htmlFor={task.id}
                                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                          {task.name}
                                        </label>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="task-due"
                                      checked={taskDue}
                                      onCheckedChange={setTaskDue}
                                    />
                                    <label
                                      htmlFor="task-due"
                                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      Task due
                                    </label>
                                  </div>

                                  <Button
                                    onClick={handleIssueWorkOrder}
                                    className="w-full"
                                  >
                                    Issue Work Order
                                  </Button>
                                </div>
                              </div>
                            )}
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Three Month Side Panel */}
        <div className="w-64">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {getThreeMonthsView().map((monthInfo, index) => (
                <Button
                  key={index}
                  variant={monthInfo.isCurrent ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() =>
                    goToSpecificMonth(monthInfo.year, monthInfo.month)
                  }
                >
                  {monthInfo.name} {monthInfo.year}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h1>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Equipment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Equipment</SelectItem>
            {equipmentList.map((equipment) => (
              <SelectItem key={equipment.id} value={equipment.id}>
                {equipment.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="equipment-due">Equipment Due</TabsTrigger>
          <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="fuel">Fuel</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="equipment-due" className="space-y-4">
          {/* Filter Dropdowns for Equipment Due */}

          {renderTabControls("equipment-due")}
          {renderCalendar()}
        </TabsContent>

        <TabsContent value="work-orders" className="space-y-4">
          {renderTabControls("work-orders")}
          {renderCalendar()}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {renderTabControls("history")}
          {renderCalendar()}
        </TabsContent>

        <TabsContent value="fuel" className="space-y-4">
          {renderTabControls("fuel")}
          {renderCalendar()}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          {renderTabControls("assignments")}
          {renderCalendar()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
