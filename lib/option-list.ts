export const vendorTypeOptions = [
  { id: "8", name: "All Vendors" },
  { id: "7", name: "Dealer" },
  { id: "6", name: "Fuel" },
  { id: "5", name: "Insurance" },
  { id: "4", name: "Loan/Lease" },
  { id: "3", name: "Maintenance" },
  { id: "2", name: "Rentals" },
  { id: "1", name: "Wholesale" },
];

export const reportTypeOptionsList = [
  { id: "Accident History", name: "Accident History" },
  { id: "Assignment History", name: "Assignment History" },
  { id: "Assignment Ticket", name: "Assignment Ticket" },
  { id: "Common Part", name: "Common Part" },
];

export const reportFrequencyTypeOptionsList = [
  { id: "Daily", name: "Daily" },
  { id: "Monthly", name: "Monthly" },
  { id: "Quarterly", name: "Quarterly" },
  { id: "Annually", name: "Annually" },
];

export const dateIntervalOptionsList = [
  { id: "This Month", name: "This Month" },
  { id: "Last Month", name: "Last Month" },
  { id: "This Quarter", name: "This Quarter" },
  { id: "Last Quarter", name: "Last Quarter" },
  { id: "This year", name: "This year" },
  { id: "Last year", name: "Last year" },
  { id: "All", name: "All" },
];
export const dateFieldTypeOptionsList = [
  { id: "Accident.Date", name: "Accident.Date" },
  { id: "None", name: "None" },
];

export const reportCategoryTypeOptionsList = [
  { id: "Presses (Drilling)", name: "Presses (Drilling)" },
  {
    id: "Presses (Production Equipment)",
    name: "Presses (Production Equipment)",
  },
  { id: "Pumps", name: "Pumps (Production Equipment)" }, 
];

export const iconsOptionList = [
  { id: "8", name: "Globe" },
  { id: "7", name: "Wrench" },
  { id: "6", name: "Screw" },
];

export const inventoryAdjustmentType = [
  { id: "Receipt", name: "Receipt" },
  { id: "Issued", name: "Issued" },
];
export const rateDurationOptions = [
  { id: "8", name: "day" },
  { id: "7", name: "hour" },
  { id: "6", name: "week" },
];

export const stateProvinceOptions = [
  { id: "8", name: "Chicago" },
  { id: "7", name: "Texan" },
  { id: "6", name: "Albany" },
  { id: "5", name: "New york" },
  { id: "4", name: "Virginia" },
];
export const equipmentOptionsList = [
  { id: "8", name: "Fire Extinguisher" },
  { id: "7", name: "Car" },
  { id: "6", name: "Suit" },
];

export const conditionOptionsList = [
  { id: "7", name: "Excellent" },
  { id: "8", name: " Good" },
  { id: "6", name: "Poor" },
];

export const destinationOptionsList = [
  { id: "7", name: "Abuja" },
  { id: "8", name: " Milwaukee" },
  { id: "6", name: "Milan" },
];

export const locationOptionsList = [
  { id: "1", name: "All locations" },
  { id: "2", name: "General Equipments" },
  { id: "3", name: "Plants" },
  { id: "4", name: "Production Equipments" },
];

export const dateFilterOptionsList = [
  { id: "today", name: "Today" },
  { id: "yesterday", name: "Yesterday" },
  { id: "last_7_days", name: "Last 7 Days" },
  { id: "last_30_days", name: "Last 30 Days" },
  { id: "this_week", name: "This Week" },
  { id: "last_week", name: "Last Week" },
  { id: "this_month", name: "This Month" },
  { id: "last_month", name: "Last Month" },
  { id: "this_quarter", name: "This Quarter" },
  { id: "last_quarter", name: "Last Quarter" },
  { id: "this_year", name: "This Year" },
  { id: "last_year", name: "Last Year" },
  { id: "custom", name: "Custom Range" },
  { id: "all_dates", name: "All Dates" },
];

export const termsOptionsList = [
  { id: "1", name: "COD" },
  { id: "2", name: "Cash" },
  { id: "3", name: "NET 30" },
  { id: "4", name: "Prepaid" },
];

export const renewalOptionsList = [
  { id: "1", name: " Hazardous Materials" },
  { id: "2", name: "Pesticide Applicator" },
  { id: "3", name: "Safety Materials" },
];

export const makeOptionsList = [
  { id: "1", name: "Azure" },
  { id: "2", name: "Test 2" },
  { id: "3", name: "NET 30" },
  { id: "4", name: "Prepaid" },
];

export const carModelOptionsList = [
  { id: "1", name: "Toyota Corolla" },
  { id: "2", name: "Honda Civic" },
  { id: "3", name: "Ford Mustang" },
  { id: "4", name: "Tesla Model 3" },
  { id: "5", name: "Chevrolet Silverado" },
  { id: "6", name: "BMW 3 Series" },
  { id: "7", name: "Audi A4" },
];

export const carTypeOptionsList = [
  { id: "1", name: "Sedan" },
  { id: "2", name: "SUV" },
  { id: "3", name: "Hatchback" },
  { id: "4", name: "Coupe" },
  { id: "5", name: "Convertible" },
  { id: "6", name: "Wagon" },
  { id: "7", name: "Pickup Truck" },
  { id: "8", name: "Van" },
  { id: "9", name: "Crossover" },
  { id: "10", name: "Electric" },
];

export const jobSiteOptionsList = [
  { id: "1", name: "Head Office" },
  { id: "2", name: "New Branch" },
];

export const equipmentCheckboxOptions: CheckboxOption[] = [
  {
    id: "attachments",
    name: "Attachments",
    description: "Include relevant files and documents",
  },
  {
    id: "expenses",
    name: "Expenses",
    description: "Track all associated costs",
  },
  {
    id: "images",
    name: "Images",
    description: "Add visual references or photos",
  },
  {
    id: "insurance",
    name: "Insurance",
    description: "Details about coverage and providers",
  },
  {
    id: "loans",
    name: "Loans",
    description: "Information about loan agreements",
  },
  {
    id: "notes",
    name: "Notes",
    description: "Add any additional notes or comments",
  },
  {
    id: "purchase",
    name: "Purchase",
    description: "Purchase information and details",
  },
  {
    id: "specifications",
    name: "Specifications",
    description: "Technical or functional specifications",
  },
  {
    id: "warranty",
    name: "Warranty",
    description: "Warranty terms and conditions",
  },
];

export const EmployeeCheckboxOptions: CheckboxOption[] = [
  {
    id: "attachments",
    name: "MAintenance", 
  },
  {
    id: "expenses",
    name: "Renewals", 
  },
  {
    id: "images",
    name: "Work Orders", 
  },]
export const monthOptionList = [
  { id: "01", name: "January" },
  { id: "02", name: "February" },
  { id: "03", name: "March" },
  { id: "04", name: "April" },
  { id: "05", name: "May" },
  { id: "06", name: "June" },
  { id: "07", name: "July" },
  { id: "08", name: "August" },
  { id: "09", name: "September" },
  { id: "10", name: "October" },
  { id: "11", name: "November" },
  { id: "12", name: "December" },
];

export const pmScheduleOptionList = [
  { id: "drill Press", name: "Drill Press" },
  { id: "Ac Units", name: "Ac Units" },
  { id: "Generator", name: "Generator" },
]