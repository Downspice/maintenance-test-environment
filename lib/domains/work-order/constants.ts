export const priorityOptions = [
  { id: "LOW", name: "LOW" },
  { id: "NORMAL", name: "NORMAL" },
  { id: "HIGH", name: "HIGH" },
  { id: "URGENT", name: "URGENT" },
] as const;

export type PriorityOption = (typeof priorityOptions)[number];
