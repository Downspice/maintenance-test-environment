export interface WorkOrderTask {
  id: string
  name: string
  assignee: string
  status: "pending" | "in-progress" | "completed"
  dueDate?: string
}

export interface WorkOrder {
  id: string
  number: string
  equipment: {
    id: string
    name: string
    model: string
  }
  assignees: Array<{
    id: string
    name: string
    type: "employee" | "vendor"
  }>
  scheduledDate: string
  status: "open" | "closed"
  progress: {
    completed: number
    total: number
  }
  tasks: WorkOrderTask[]
  priority: "low" | "normal" | "high" | "urgent"
  createdDate: string
  dueDate?: string
  description?: string
}


export interface Employee  {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  location: string;
  tech: string;
  email: string | null;
  login: string;
  login_type: string;
  last_active_at: string | null;
  last_active_at_sort: string | null;
  labor_rate: number;
  status: string;
  DT_RowId?: string;
  DT_RowData?: {
    remote: boolean;
    url: string;
  };
};
// Mock data for work orders
export const mockWorkOrders: WorkOrder[] = [
  {
    id: "WO-2024-001",
    number: "WO-2024-001",
    equipment: {
      id: "1311827",
      name: "AC-001-07 Class 8",
      model: "Freightliner Cascadia",
    },
    assignees: [
      { id: "user-1", name: "John Smith", type: "employee" },
      { id: "vendor-1", name: "ABC Repair Co.", type: "vendor" },
    ],
    scheduledDate: "2024-01-20",
    status: "open",
    progress: {
      completed: 2,
      total: 4,
    },
    tasks: [
      {
        id: "task-1",
        name: "Oil Change",
        assignee: "John Smith",
        status: "completed",
        dueDate: "2024-01-20",
      },
      {
        id: "task-2",
        name: "Brake Inspection",
        assignee: "John Smith",
        status: "completed",
        dueDate: "2024-01-20",
      },
      {
        id: "task-3",
        name: "Tire Rotation",
        assignee: "ABC Repair Co.",
        status: "in-progress",
        dueDate: "2024-01-21",
      },
      {
        id: "task-4",
        name: "Engine Diagnostic",
        assignee: "ABC Repair Co.",
        status: "pending",
        dueDate: "2024-01-22",
      },
    ],
    priority: "high",
    createdDate: "2024-01-15",
    dueDate: "2024-01-25",
    description: "Routine maintenance and inspection",
  },
  {
    id: "WO-2024-002",
    number: "WO-2024-002",
    equipment: {
      id: "1311828",
      name: "EX-002-15 Excavator",
      model: "CAT 320D",
    },
    assignees: [{ id: "user-2", name: "Jane Doe", type: "employee" }],
    scheduledDate: "2024-01-18",
    status: "closed",
    progress: {
      completed: 3,
      total: 3,
    },
    tasks: [
      {
        id: "task-5",
        name: "Hydraulic Fluid Check",
        assignee: "Jane Doe",
        status: "completed",
        dueDate: "2024-01-18",
      },
      {
        id: "task-6",
        name: "Track Inspection",
        assignee: "Jane Doe",
        status: "completed",
        dueDate: "2024-01-18",
      },
      {
        id: "task-7",
        name: "Grease Fittings",
        assignee: "Jane Doe",
        status: "completed",
        dueDate: "2024-01-18",
      },
    ],
    priority: "normal",
    createdDate: "2024-01-10",
    dueDate: "2024-01-20",
    description: "Weekly maintenance check",
  },
  {
    id: "WO-2024-003",
    number: "WO-2024-003",
    equipment: {
      id: "1311829",
      name: "GEN-003-05 Generator",
      model: "Cummins C150D6",
    },
    assignees: [
      { id: "vendor-2", name: "Power Systems Inc.", type: "vendor" },
      { id: "user-3", name: "Mike Johnson", type: "employee" },
    ],
    scheduledDate: "2024-01-25",
    status: "open",
    progress: {
      completed: 0,
      total: 5,
    },
    tasks: [
      {
        id: "task-8",
        name: "Fuel System Check",
        assignee: "Power Systems Inc.",
        status: "pending",
        dueDate: "2024-01-25",
      },
      {
        id: "task-9",
        name: "Battery Test",
        assignee: "Mike Johnson",
        status: "pending",
        dueDate: "2024-01-25",
      },
      {
        id: "task-10",
        name: "Cooling System Inspection",
        assignee: "Power Systems Inc.",
        status: "pending",
        dueDate: "2024-01-26",
      },
      {
        id: "task-11",
        name: "Load Bank Test",
        assignee: "Power Systems Inc.",
        status: "pending",
        dueDate: "2024-01-27",
      },
      {
        id: "task-12",
        name: "Control Panel Check",
        assignee: "Mike Johnson",
        status: "pending",
        dueDate: "2024-01-27",
      },
    ],
    priority: "urgent",
    createdDate: "2024-01-12",
    dueDate: "2024-01-30",
    description: "Emergency generator maintenance",
  },
  {
    id: "WO-2024-004",
    number: "WO-2024-004",
    equipment: {
      id: "1311830",
      name: "TR-004-12 Trailer",
      model: "Great Dane 53ft",
    },
    assignees: [{ id: "user-4", name: "Sarah Wilson", type: "employee" }],
    scheduledDate: "2024-01-22",
    status: "open",
    progress: {
      completed: 1,
      total: 2,
    },
    tasks: [
      {
        id: "task-13",
        name: "Brake Light Check",
        assignee: "Sarah Wilson",
        status: "completed",
        dueDate: "2024-01-22",
      },
      {
        id: "task-14",
        name: "Tire Pressure Check",
        assignee: "Sarah Wilson",
        status: "in-progress",
        dueDate: "2024-01-23",
      },
    ],
    priority: "low",
    createdDate: "2024-01-18",
    dueDate: "2024-01-25",
    description: "Pre-trip inspection",
  },
  {
    id: "WO-2024-005",
    number: "WO-2024-005",
    equipment: {
      id: "1311831",
      name: "FL-005-08 Forklift",
      model: "Toyota 8FGU25",
    },
    assignees: [{ id: "vendor-3", name: "Forklift Services LLC", type: "vendor" }],
    scheduledDate: "2024-01-19",
    status: "closed",
    progress: {
      completed: 4,
      total: 4,
    },
    tasks: [
      {
        id: "task-15",
        name: "Mast Inspection",
        assignee: "Forklift Services LLC",
        status: "completed",
        dueDate: "2024-01-19",
      },
      {
        id: "task-16",
        name: "Hydraulic Hose Check",
        assignee: "Forklift Services LLC",
        status: "completed",
        dueDate: "2024-01-19",
      },
      {
        id: "task-17",
        name: "Fork Alignment",
        assignee: "Forklift Services LLC",
        status: "completed",
        dueDate: "2024-01-19",
      },
      {
        id: "task-18",
        name: "Safety Systems Test",
        assignee: "Forklift Services LLC",
        status: "completed",
        dueDate: "2024-01-19",
      },
    ],
    priority: "normal",
    createdDate: "2024-01-14",
    dueDate: "2024-01-21",
    description: "Annual safety inspection",
  },
]
