"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, ChevronDown, ChevronLeft, ChevronRight, FileText, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useSheet } from "@/lib/sheet-providers"
import WorkOrderForm from "@/components/forms/actualForms/work-order-form"
import ReceiptForm from "@/components/forms/actualForms/receipt-form"
import NotCompleteMessage from "@/app/(application)/messages/page"

// Define the data structure
interface InventoryItem {
  id: number
  partNumber: string
  name: string
  reorderPoint: number
  quantity: number
  vendors: string[]
  warehouse: string
  lastOrdered?: string
  price: number
  category: string
}

type SortField = keyof InventoryItem | null
type SortDirection = "asc" | "desc"

// Mock inventory data
const mockInventoryData: InventoryItem[] = [
  {
    id: 1,
    partNumber: "P-10045",
    name: "Air Filter Element",
    reorderPoint: 15,
    quantity: 23,
    vendors: ["AutoParts Inc", "FilterMaster"],
    warehouse: "Main",
    lastOrdered: "2025-04-15",
    price: 12.99,
    category: "Filters",
  },
  {
    id: 2,
    partNumber: "P-20078",
    name: "Brake Pad Set",
    reorderPoint: 10,
    quantity: 8,
    vendors: ["BrakeTech", "StopRight"],
    warehouse: "Main",
    lastOrdered: "2025-04-22",
    price: 45.5,
    category: "Brakes",
  },
  {
    id: 3,
    partNumber: "P-30112",
    name: "Oil Filter",
    reorderPoint: 20,
    quantity: 32,
    vendors: ["FilterMaster", "LubeSupply"],
    warehouse: "East",
    lastOrdered: "2025-04-10",
    price: 8.75,
    category: "Filters",
  },
  {
    id: 4,
    partNumber: "P-40256",
    name: "Spark Plug Set",
    reorderPoint: 12,
    quantity: 5,
    vendors: ["IgnitionPro", "SparkTech"],
    warehouse: "Main",
    lastOrdered: "2025-04-18",
    price: 24.99,
    category: "Ignition",
  },
  {
    id: 5,
    partNumber: "P-50389",
    name: "Wiper Blade Set",
    reorderPoint: 8,
    quantity: 14,
    vendors: ["VisibilityPlus", "AutoParts Inc"],
    warehouse: "West",
    lastOrdered: "2025-04-05",
    price: 18.5,
    category: "Exterior",
  },
  {
    id: 6,
    partNumber: "P-60471",
    name: "Cabin Air Filter",
    reorderPoint: 10,
    quantity: 7,
    vendors: ["FilterMaster", "CleanAir Co"],
    warehouse: "East",
    lastOrdered: "2025-04-20",
    price: 15.25,
    category: "Filters",
  },
  {
    id: 7,
    partNumber: "P-70583",
    name: "Alternator",
    reorderPoint: 5,
    quantity: 3,
    vendors: ["ElectroParts", "PowerGen"],
    warehouse: "Main",
    lastOrdered: "2025-04-12",
    price: 120.0,
    category: "Electrical",
  },
  {
    id: 8,
    partNumber: "P-80692",
    name: "Timing Belt Kit",
    reorderPoint: 4,
    quantity: 6,
    vendors: ["BeltMaster", "EnginePro"],
    warehouse: "Main",
    lastOrdered: "2025-04-08",
    price: 85.99,
    category: "Engine",
  },
  {
    id: 9,
    partNumber: "P-90754",
    name: "Fuel Pump Assembly",
    reorderPoint: 3,
    quantity: 2,
    vendors: ["FuelTech", "FlowMaster"],
    warehouse: "West",
    lastOrdered: "2025-04-25",
    price: 95.5,
    category: "Fuel System",
  },
  {
    id: 10,
    partNumber: "P-10867",
    name: "Radiator Coolant",
    reorderPoint: 15,
    quantity: 18,
    vendors: ["CoolFlow", "ThermalTech"],
    warehouse: "East",
    lastOrdered: "2025-04-17",
    price: 14.25,
    category: "Cooling",
  },
  {
    id: 11,
    partNumber: "P-20975",
    name: "Transmission Fluid",
    reorderPoint: 12,
    quantity: 9,
    vendors: ["LubeSupply", "TransTech"],
    warehouse: "Main",
    lastOrdered: "2025-04-14",
    price: 22.99,
    category: "Fluids",
  },
  {
    id: 12,
    partNumber: "P-31088",
    name: "Battery",
    reorderPoint: 8,
    quantity: 11,
    vendors: ["PowerCell", "ElectroParts"],
    warehouse: "Main",
    lastOrdered: "2025-04-19",
    price: 89.99,
    category: "Electrical",
  },
  {
    id: 13,
    partNumber: "P-41196",
    name: "Headlight Bulb Set",
    reorderPoint: 10,
    quantity: 15,
    vendors: ["LightBright", "VisibilityPlus"],
    warehouse: "West",
    lastOrdered: "2025-04-21",
    price: 28.5,
    category: "Lighting",
  },
  {
    id: 14,
    partNumber: "P-51209",
    name: "Wheel Bearing Kit",
    reorderPoint: 6,
    quantity: 4,
    vendors: ["WheelTech", "BearingPro"],
    warehouse: "East",
    lastOrdered: "2025-04-11",
    price: 42.75,
    category: "Suspension",
  },
  {
    id: 15,
    partNumber: "P-61317",
    name: "Oxygen Sensor",
    reorderPoint: 7,
    quantity: 9,
    vendors: ["SensorTech", "EmissionPro"],
    warehouse: "Main",
    lastOrdered: "2025-04-16",
    price: 55.25,
    category: "Emissions",
  },
]

interface InventoryDataTableProps {
  realServer: boolean
}

export function InventoryDataTable({ realServer }: InventoryDataTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<InventoryItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const rowsPerPage = 8
  const { openSheet } = useSheet();
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const sortData = (data: InventoryItem[], field: SortField, direction: SortDirection): InventoryItem[] => {
    if (!field) return data

    return [...data].sort((a, b) => {
      const aValue = a[field]
      const bValue = b[field]

      // Handle different data types
      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue
      }

      // Handle arrays (like vendors)
      if (Array.isArray(aValue) && Array.isArray(bValue)) {
        const aString = aValue.join(",")
        const bString = bValue.join(",")
        return direction === "asc" ? aString.localeCompare(bString) : bString.localeCompare(aString)
      }

      return 0
    })
  }

  // Load data based on pagination
  useEffect(() => {
    if (realServer) {
      // Simulate server-side pagination and sorting
      fetchServerData(currentPage, rowsPerPage, sortField, sortDirection)
    } else {
      // Client-side pagination and sorting
      const sortedData = sortData(mockInventoryData, sortField, sortDirection)
      const startIndex = (currentPage - 1) * rowsPerPage
      const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage)
      setData(paginatedData)
      setTotalPages(Math.ceil(mockInventoryData.length / rowsPerPage))
    }
  }, [currentPage, realServer, sortField, sortDirection])

  // Simulate fetching data from server
  const fetchServerData = (page: number, limit: number, field: SortField = null, direction: SortDirection = "asc") => {
    console.log(`Fetching inventory page ${page} with limit ${limit}, sorting by ${field} ${direction}`)

    // Simulate API delay
    setTimeout(() => {
      const sortedData = sortData(mockInventoryData, field, direction)
      const startIndex = (page - 1) * limit
      const paginatedData = sortedData.slice(startIndex, startIndex + limit)
      setData(paginatedData)
      setTotalPages(Math.ceil(mockInventoryData.length / limit))
    }, 300)
  }

  // Toggle row selection
  const toggleRowSelection = (id: number) => {
    const newSelectedRows = new Set(selectedRows)
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id)
    } else {
      newSelectedRows.add(id)
    }
    setSelectedRows(newSelectedRows)
  }

  // Create new purchase order
  const createNewPO = () => {
    console.log("Creating new purchase order for part IDs:", Array.from(selectedRows))
    setSelectedRows(new Set()) // Clear selections after action
  }

  // Handle row actions
    const createReceipt = (item: InventoryItem) => {
      console.log("Creating new work order for:", item);
      openSheet({
        title: `Receipt: ${item.partNumber} ${item.name}`,
        description: "",
        content: (
          <NotCompleteMessage/>
        ),
      })
    }

  // Select all rows on current page
  const toggleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
    } else {
      const allIds = data.map((item) => item.id)
      setSelectedRows(new Set(allIds))
    }
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)

    if (realServer) {
      // This would trigger the server-side pagination callback
      fetchServerData(page, rowsPerPage, sortField, sortDirection)
    }
  }

  const handleSort = (field: SortField) => {
    // If clicking the same field, toggle direction
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // New field, set to ascending by default
      setSortField(field)
      setSortDirection("asc")
    }

    // Reset to first page when sorting changes
    setCurrentPage(1)
  }

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort(field)}>
      <div className="flex items-center justify-between">
        <span>{children}</span>
        {sortField === field && (
          <span className="ml-1">
            {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          </span>
        )}
      </div>
    </TableHead>
  )

  return (
    <div className="space-y-4 shadow-primary">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={data.length > 0 && selectedRows.size === data.length}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all rows"
                />
              </TableHead>
              <SortableHeader field="partNumber">Part #</SortableHeader>
              <SortableHeader field="name">Name</SortableHeader>
              <SortableHeader field="reorderPoint">Reorder Point</SortableHeader>
              <SortableHeader field="quantity">Quantity</SortableHeader>
              <SortableHeader field="vendors">Vendors</SortableHeader>
              <SortableHeader field="warehouse">Warehouse</SortableHeader>
              <TableHead className="text-right">
                {selectedRows.size > 0 ? (
                  <Button onClick={createNewPO} size="sm">
                    New PO ({selectedRows.size})
                  </Button>
                ) : (
                  "Actions"
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className={selectedRows.has(item.id) ? "bg-muted/50" : ""}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(item.id)}
                    onCheckedChange={() => toggleRowSelection(item.id)}
                    aria-label={`Select ${item.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.partNumber}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.reorderPoint}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {item.quantity <= item.reorderPoint ? (
                      <Badge variant="destructive" className="mr-2">
                        Low
                      </Badge>
                    ) : null}
                    {item.quantity}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {item.vendors.map((vendor, index) => (
                      <span key={index} className="text-sm">
                        {vendor}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{item.warehouse}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Actions
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => createReceipt(item)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Receipts
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRowAction("purchaseOrders", item)}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Purchase Orders
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>
        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  )
}
