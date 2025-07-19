export const vendorTypeOptions = [
  { value: "8", label: "All Vendors" },
  { value: "7", label: "Dealer" },
  { value: "6", label: "Fuel" },
  { value: "5", label: "Insurance" },
  { value: "4", label: "Loan/Lease" },
  { value: "3", label: "Maintenance" },
  { value: "2", label: "Rentals" },
  { value: "1", label: "Wholesale" },
];

export const reportTypeOptionsList = [
  { value: "Accident History", label: "Accident History" },
  { value: "Assignment History", label: "Assignment History" },
  { value: "Assignment Ticket", label: "Assignment Ticket" },
  { value: "Common Part", label: "Common Part" },
];

export const reportFrequencyTypeOptionsList = [
  { value: "Daily", label: "Daily" },
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly" },
  { value: "Annually", label: "Annually" },
];

export const dateIntervalOptionsList = [
  { value: "This Month", label: "This Month" },
  { value: "Last Month", label: "Last Month" },
  { value: "This Quarter", label: "This Quarter" },
  { value: "Last Quarter", label: "Last Quarter" },
  { value: "This year", label: "This year" },
  { value: "Last year", label: "Last year" },
  { value: "All", label: "All" },
];
export const dateFieldTypeOptionsList = [
  { value: "Accident.Date", label: "Accident.Date" },
  { value: "None", label: "None" },
];

export const reportCategoryTypeOptionsList = [
  { value: "Presses (Drilling)", label: "Presses (Drilling)" },
  {
    value: "Presses (Production Equipment)",
    label: "Presses (Production Equipment)",
  },
  { value: "Pumps", label: "Pumps (Production Equipment)" }, 
];

export const iconsOptionList = [
  { value: "8", label: "Globe" },
  { value: "7", label: "Wrench" },
  { value: "6", label: "Screw" },
];

export const inventoryAdjustmentType = [
  { value: "Receipt", label: "Receipt" },
  { value: "Issued", label: "Issued" },
];
export const rateDurationOptions = [
  { value: "8", label: "day" },
  { value: "7", label: "hour" },
  { value: "6", label: "week" },
];

export const stateProvinceOptions = [
  { value: "8", label: "Chicago" },
  { value: "7", label: "Texan" },
  { value: "6", label: "Albany" },
  { value: "5", label: "New york" },
  { value: "4", label: "Virginia" },
];
export const equipmentOptionsList = [
  { value: "8", label: "Fire Extinguisher" },
  { value: "7", label: "Car" },
  { value: "6", label: "Suit" },
];

export const conditionOptionsList = [
  { value: "7", label: "Excellent" },
  { value: "8", label: " Good" },
  { value: "6", label: "Poor" },
];

export const destinationOptionsList = [
  { value: "7", label: "Abuja" },
  { value: "8", label: " Milwaukee" },
  { value: "6", label: "Milan" },
];

export const locationOptionsList = [
  { value: "1", label: "All locations" },
  { value: "2", label: "General Equipments" },
  { value: "3", label: "Plants" },
  { value: "4", label: "Production Equipments" },
];

export const dateFilterOptionsList = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last_7_days", label: "Last 7 Days" },
  { value: "last_30_days", label: "Last 30 Days" },
  { value: "this_week", label: "This Week" },
  { value: "last_week", label: "Last Week" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_quarter", label: "This Quarter" },
  { value: "last_quarter", label: "Last Quarter" },
  { value: "this_year", label: "This Year" },
  { value: "last_year", label: "Last Year" },
  { value: "custom", label: "Custom Range" },
  { value: "all_dates", label: "All Dates" },
];

export const termsOptionsList = [
  { value: "1", label: "COD" },
  { value: "2", label: "Cash" },
  { value: "3", label: "NET 30" },
  { value: "4", label: "Prepaid" },
];

export const renewalOptionsList = [
  { value: "1", label: " Hazardous Materials" },
  { value: "2", label: "Pesticide Applicator" },
  { value: "3", label: "Safety Materials" },
];

export const makeOptionsList = [
  { value: "1", label: "Azure" },
  { value: "2", label: "Test 2" },
  { value: "3", label: "NET 30" },
  { value: "4", label: "Prepaid" },
];

export const carModelOptionsList = [
  { value: "1", label: "Toyota Corolla" },
  { value: "2", label: "Honda Civic" },
  { value: "3", label: "Ford Mustang" },
  { value: "4", label: "Tesla Model 3" },
  { value: "5", label: "Chevrolet Silverado" },
  { value: "6", label: "BMW 3 Series" },
  { value: "7", label: "Audi A4" },
];

export const carTypeOptionsList = [
  { value: "1", label: "Sedan" },
  { value: "2", label: "SUV" },
  { value: "3", label: "Hatchback" },
  { value: "4", label: "Coupe" },
  { value: "5", label: "Convertible" },
  { value: "6", label: "Wagon" },
  { value: "7", label: "Pickup Truck" },
  { value: "8", label: "Van" },
  { value: "9", label: "Crossover" },
  { value: "10", label: "Electric" },
];

export const jobSiteOptionsList = [
  { value: "1", label: "Head Office" },
  { value: "2", label: "New Branch" },
];

export const equipmentCheckboxOptions: CheckboxOption[] = [
  {
    id: "attachments",
    label: "Attachments",
    description: "Include relevant files and documents",
  },
  {
    id: "expenses",
    label: "Expenses",
    description: "Track all associated costs",
  },
  {
    id: "images",
    label: "Images",
    description: "Add visual references or photos",
  },
  {
    id: "insurance",
    label: "Insurance",
    description: "Details about coverage and providers",
  },
  {
    id: "loans",
    label: "Loans",
    description: "Information about loan agreements",
  },
  {
    id: "notes",
    label: "Notes",
    description: "Add any additional notes or comments",
  },
  {
    id: "purchase",
    label: "Purchase",
    description: "Purchase information and details",
  },
  {
    id: "specifications",
    label: "Specifications",
    description: "Technical or functional specifications",
  },
  {
    id: "warranty",
    label: "Warranty",
    description: "Warranty terms and conditions",
  },
];

export const EmployeeCheckboxOptions: CheckboxOption[] = [
  {
    id: "attachments",
    label: "MAintenance", 
  },
  {
    id: "expenses",
    label: "Renewals", 
  },
  {
    id: "images",
    label: "Work Orders", 
  },]
export const monthOptionList = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];
