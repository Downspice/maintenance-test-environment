export const maintenanceItems= [
    {
      "quantity": 5,
      "item_name": "Air Filter",
      "description": "Replacement air filters for HVAC system",
      "unit_cost": 15.00,
      "amount": 75.00
    },
    {
      "quantity": 2,
      "item_name": "Fluorescent Light Tubes",
      "description": "T8 4-foot light tubes for office lighting",
      "unit_cost": 8.50,
      "amount": 17.00
    },
    {
      "quantity": 1,
      "item_name": "Thermostat",
      "description": "Digital programmable thermostat",
      "unit_cost": 65.00,
      "amount": 65.00
    },
    {
      "quantity": 10,
      "item_name": "HVAC Screws",
      "description": "Set of screws for securing HVAC panels",
      "unit_cost": 0.50,
      "amount": 5.00
    },
    {
      "quantity": 3,
      "item_name": "Pipe Insulation",
      "description": "Foam insulation for copper pipes",
      "unit_cost": 12.00,
      "amount": 36.00
    }
  ]

export const payments = [
    {
      "id": "PMT001",
      "date_received": "2025-06-15",
      "amount": 250.00,
      "payment_type": "credit card",
      "check_number": null,
      "name_on_card": "Alice Johnson",
      "transaction_notes": "Monthly maintenance fee - June"
    },
    {
      "id": "PMT002",
      "date_received": "2025-06-18",
      "amount": 500.00,
      "payment_type": "cheque",
      "check_number": "CHK987654",
      "name_on_card": null,
      "transaction_notes": "Quarterly payment"
    },
    {
      "id": "PMT003",
      "date_received": "2025-06-20",
      "amount": 125.00,
      "payment_type": "electronic",
      "check_number": null,
      "name_on_card": null,
      "transaction_notes": "Online payment via bank transfer"
    },
    {
      "id": "PMT004",
      "date_received": "2025-07-01",
      "amount": 300.00,
      "payment_type": "credit card",
      "check_number": null,
      "name_on_card": "Michael Smith",
      "transaction_notes": "Maintenance for July"
    },
    {
      "id": "PMT005",
      "date_received": "2025-07-03",
      "amount": 200.00,
      "payment_type": "cheque",
      "check_number": "CHK123456",
      "name_on_card": null,
      "transaction_notes": "Partial payment"
    }
  ]
 
export const discountTypesOptions=[
    {value:"percent",label:"Percentage"},
    {value:"amount", label:"Amount"},
]