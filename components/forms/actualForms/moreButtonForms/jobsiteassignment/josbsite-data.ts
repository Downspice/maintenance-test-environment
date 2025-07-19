export const JobSiteData: EquipmentSchedule[]= [
  {
    equipment: "Compressor A",
    jobSite: "Plant 1",
    dateOut: "2025-07-20",
    dateIn: "2025-07-22",
    time: "08:00",
  },
  {
    equipment: "AC Unit 4",
    jobSite: "Building B",
    dateOut: "2025-07-18",
    dateIn: "2025-07-19",
    time: "10:30",
  },
  {
    equipment: "Drill Press X3",
    jobSite: "Workshop 7",
    dateOut: "2025-07-17",
    dateIn: "2025-07-21",
    time: "14:00",
  },
  {
    equipment: "Fire Extinguisher F2",
    jobSite: "Warehouse 2",
    dateOut: "2025-07-16",
    dateIn: "2025-07-16",
    time: "09:15",
  },
  {
    equipment: "Air Compressor Z9",
    jobSite: "Maintenance Bay",
    dateOut: "2025-07-15",
    dateIn: "2025-07-18",
    time: "07:45",
  },
];
export interface JobSiteInterface {
  equipment: string;
  jobSite: string;
  dateOut: string; // format: "YYYY-MM-DD"
  dateIn: string;  // format: "YYYY-MM-DD"
  time: string;    // format: "HH:mm" (24-hour) or "HH:mm AM/PM"
}