export type EmailHistoryType = {
  date: string; // ISO string format e.g. "2025-07-17T10:32:00Z"
  recipient: string; // Name of the recipient
  email: string; // Email address of the recipient
  subject: string; // Subject line of the message
  body: string; // Body content of the message
};

export const EmailHistoryData: EmailHistoryType[] = [
  {
    date: "2025-07-17T10:32:00Z",
    recipient: "John Doe",
    email: "john.doe@example.com",
    subject: "Upcoming Maintenance Notification",
    body: "Dear John, this is a reminder that your scheduled maintenance for Compressor A is due on July 20, 2025. Please ensure access is available.",
  },
  {
    date: "2025-07-16T08:15:00Z",
    recipient: "Jane Smith",
    email: "jane.smith@example.com",
    subject: "Parts Replacement Confirmation",
    body: "Hi Jane, the replacement parts for Unit 12 have been successfully installed. Let us know if any further support is needed.",
  },
  {
    date: "2025-07-15T14:45:00Z",
    recipient: "Maintenance Team",
    email: "maintenance@company.com",
    subject: "Urgent Repair Required",
    body: "The AC Unit in Building 3 is overheating. Please prioritize this task for inspection and possible repair.",
  },
  {
    date: "2025-07-14T17:05:00Z",
    recipient: "Alex Johnson",
    email: "alex.johnson@example.com",
    subject: "Weekly Maintenance Summary",
    body: "Hi Alex, attached is the weekly summary of completed and pending maintenance tasks for your review.",
  },
  {
    date: "2025-07-13T12:00:00Z",
    recipient: "Warehouse Team",
    email: "warehouse@company.com",
    subject: "Low Inventory Alert",
    body: "Inventory for filter part #P-1001 is below threshold. Please reorder immediately to avoid supply disruption.",
  },
];
