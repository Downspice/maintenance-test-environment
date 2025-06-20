"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Printer, Calendar, Users, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { mockWorkOrders, type WorkOrderTask } from "@/lib/work-orders-data"
import { generateWorkOrdersPDF } from "@/lib/pdf-utils"
import { toast } from "@/components/ui/sonner-toast"

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "closed":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "text-gray-600"
    case "normal":
      return "text-blue-600"
    case "high":
      return "text-orange-600"
    case "urgent":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

const getTaskStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-3 w-3 text-green-600" />
    case "in-progress":
      return <Clock className="h-3 w-3 text-blue-600" />
    case "pending":
      return <AlertTriangle className="h-3 w-3 text-orange-600" />
    default:
      return <Clock className="h-3 w-3 text-gray-600" />
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const TaskTooltipContent = ({ tasks }: { tasks: WorkOrderTask[] }) => (
  <div className="space-y-2 max-w-xs">
    <div className="font-semibold text-sm">Tasks ({tasks.length})</div>
    {tasks.map((task) => (
      <div key={task.id} className="flex items-center gap-2 text-xs">
        {getTaskStatusIcon(task.status)}
        <div className="flex-1">
          <div className="font-medium">{task.name}</div>
          <div className="text-muted-foreground">
            Assigned to: {task.assignee}
            {task.dueDate && ` • Due: ${formatDate(task.dueDate)}`}
          </div>
        </div>
      </div>
    ))}
  </div>
)

export default function WorkOrdersTable() {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const router = useRouter()

  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  const toggleAllRows = () => {
    if (selectedRows.size === mockWorkOrders.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(mockWorkOrders.map((row) => row.id)))
    }
  }

  const handleRowClick = (workOrderId: string, event: React.MouseEvent) => {
    // Don't navigate if clicking on checkbox or other interactive elements
    if ((event.target as HTMLElement).closest('input[type="checkbox"]')) {
      return
    }
    router.push(`/work-order/${workOrderId}`)
  }

  const handlePrintPDF = () => {
    const selectedWorkOrders = mockWorkOrders.filter((wo) => selectedRows.has(wo.id))

    if (selectedWorkOrders.length === 0) {
      toast.warning({
        title: "No Work Orders Selected",
        description: "Please select at least one work order to print.",
      })
      return
    }

    try {
      generateWorkOrdersPDF(selectedWorkOrders)
      toast.success({
        title: "PDF Generated",
        description: `Generated PDF report for ${selectedWorkOrders.length} work order(s).`,
      })
    } catch (error) {
      toast.error({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF. Please try again.",
      })
    }
  }

  const getProgressColor = (completed: number, total: number) => {
    const percentage = (completed / total) * 100
    if (percentage === 100) return "bg-green-500"
    if (percentage >= 50) return "bg-blue-500"
    if (percentage > 0) return "bg-orange-500"
    return "bg-gray-300"
  }

  return (
    <TooltipProvider>
      <div className="w-full space-y-4">
        {/* Header with selection info and actions */}
        {selectedRows.size > 0 && (
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">{selectedRows.size} work order(s) selected</span>
            </div>
            <Button onClick={handlePrintPDF} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Printer className="mr-2 h-4 w-4" />
              Print to PDF
            </Button>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.size === mockWorkOrders.length && mockWorkOrders.length > 0}
                    onCheckedChange={toggleAllRows}
                    aria-label="Select all work orders"
                  />
                </TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Assignees</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWorkOrders.map((workOrder) => {
                const progressPercentage = (workOrder.progress.completed / workOrder.progress.total) * 100

                return (
                  <TableRow
                    key={workOrder.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={(e) => handleRowClick(workOrder.id, e)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(workOrder.id)}
                        onCheckedChange={() => toggleRowSelection(workOrder.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select work order ${workOrder.number}`}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{workOrder.number}</div>
                        {/* <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className={getPriorityColor(workOrder.priority)}>
                            {workOrder.priority.toUpperCase()}
                          </span>
                        </div> */}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{workOrder.equipment.name}</div>
                        <div className="text-sm text-muted-foreground">{workOrder.equipment.model}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        {workOrder.assignees.map((assignee, index) => (
                          <div key={assignee.id} className="flex items-center gap-1 text-sm">
                            {assignee.type === "employee" ? (
                              <Users className="h-3 w-3 text-green-600" />
                            ) : (
                              <Users className="h-3 w-3 text-purple-600" />
                            )}
                            <span className={assignee.type === "employee" ? "text-green-700" : "text-purple-700"}>
                              {assignee.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {formatDate(workOrder.scheduledDate)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge className={`text-xs ${getStatusColor(workOrder.status)}`}>
                        {workOrder.status.toUpperCase()}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="space-y-1 cursor-help">
                            <div className="flex items-center gap-2">
                              <Progress value={progressPercentage} className="w-20 h-2" />
                              <span className="text-xs text-muted-foreground">
                                {workOrder.progress.completed}/{workOrder.progress.total}
                              </span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-sm">
                          <TaskTooltipContent tasks={workOrder.tasks} />
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Summary info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>Showing {mockWorkOrders.length} work orders</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Open ({mockWorkOrders.filter((wo) => wo.status === "open").length})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Closed ({mockWorkOrders.filter((wo) => wo.status === "closed").length})</span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
