"use client"

import React, { useState } from 'react'
import { Edit, Trash2, Info, Plus, Check, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

interface Warehouse {
  id: string
  name: string
  location: string
  status: 'active' | 'inactive'
}

interface Contact {
  id: string
  name: string
  email: string
  type: 'employee' | 'customer' | 'vendor'
}

interface NotificationContact {
  id: string
  name: string
  email: string
}

const WarehouseSetup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('warehouses')
  const [currentView, setCurrentView] = useState<'list' | 'selection'>('list')
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null)
  const [activeSelectionTab, setActiveSelectionTab] = useState<'employees' | 'customers' | 'vendors'>('employees')
  const [selectedContacts, setSelectedContacts] = useState<{ [key: string]: string[] }>({
    employees: [],
    customers: [],
    vendors: []
  })

  // Sample data
  const warehouses: Warehouse[] = [
    { id: '1', name: 'Main Distribution Center', location: 'New York, NY', status: 'active' },
    { id: '2', name: 'West Coast Hub', location: 'Los Angeles, CA', status: 'active' },
    { id: '3', name: 'Midwest Facility', location: 'Chicago, IL', status: 'inactive' },
    { id: '4', name: 'Southeast Center', location: 'Atlanta, GA', status: 'active' },
    { id: '5', name: 'Northeast Branch', location: 'Boston, MA', status: 'active' },
    { id: '6', name: 'Pacific Northwest', location: 'Seattle, WA', status: 'active' },
    { id: '7', name: 'Texas Operations', location: 'Dallas, TX', status: 'inactive' },
    { id: '8', name: 'Florida Hub', location: 'Miami, FL', status: 'active' },
  ]

  const notificationContacts: NotificationContact[] = [
    { id: '1', name: 'John Smith', email: 'john.smith@company.com' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
    { id: '3', name: 'Mike Davis', email: 'mike.davis@company.com' },
    { id: '4', name: 'Emily Brown', email: 'emily.brown@company.com' },
  ]

  const allContacts: Contact[] = [
    { id: '1', name: 'Alice Wilson', email: 'alice.wilson@company.com', type: 'employee' },
    { id: '2', name: 'Bob Chen', email: 'bob.chen@company.com', type: 'employee' },
    { id: '3', name: 'Carol Martinez', email: 'carol.martinez@company.com', type: 'employee' },
    { id: '4', name: 'David Lee', email: 'david.lee@company.com', type: 'employee' },
    { id: '5', name: 'Emma Taylor', email: 'emma.taylor@customer.com', type: 'customer' },
    { id: '6', name: 'Frank Miller', email: 'frank.miller@customer.com', type: 'customer' },
    { id: '7', name: 'Grace Anderson', email: 'grace.anderson@customer.com', type: 'customer' },
    { id: '8', name: 'Henry Garcia', email: 'henry.garcia@customer.com', type: 'customer' },
    { id: '9', name: 'Ivy Thompson', email: 'ivy.thompson@vendor.com', type: 'vendor' },
    { id: '10', name: 'Jack Wilson', email: 'jack.wilson@vendor.com', type: 'vendor' },
    { id: '11', name: 'Kate Rodriguez', email: 'kate.rodriguez@vendor.com', type: 'vendor' },
    { id: '12', name: 'Leo Martinez', email: 'leo.martinez@vendor.com', type: 'vendor' },
  ]

  const handleWarehouseClick = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse)
    setActiveTab(`notifications-${warehouse.id}`)
  }

  const handleNewContactClick = () => {
    setCurrentView('selection')
    setSelectedContacts({ employees: [], customers: [], vendors: [] })
  }

  const handleContactSelection = (contactId: string, type: 'employees' | 'customers' | 'vendors') => {
    setSelectedContacts(prev => ({
      ...prev,
      [type]: prev[type].includes(contactId)
        ? prev[type].filter(id => id !== contactId)
        : [...prev[type], contactId]
    }))
  }

  const handleConfirmSelection = () => {
    // Here you would typically save the selected contacts
    console.log('Selected contacts:', selectedContacts)
    setCurrentView('list')
    setSelectedContacts({ employees: [], customers: [], vendors: [] })
  }

  const handleCancelSelection = () => {
    setCurrentView('list')
    setSelectedContacts({ employees: [], customers: [], vendors: [] })
  }

  const handleDeleteContact = (contactId: string) => {
    console.log('Delete contact:', contactId)
  }

  const handleEditWarehouse = (warehouseId: string) => {
    console.log('Edit warehouse:', warehouseId)
  }

  const handleDeleteWarehouse = (warehouseId: string) => {
    console.log('Delete warehouse:', warehouseId)
  }

  const renderWarehouseList = () => (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Warehouses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto space-y-2">
          {warehouses.map((warehouse) => (
            <div
              key={warehouse.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
              onClick={() => handleWarehouseClick(warehouse)}
            >
              <div className="flex-1">
                <h3 className="font-medium">{warehouse.name}</h3>
                <p className="text-sm text-muted-foreground">{warehouse.location}</p>
                <div className="mt-2">
                  <Badge variant={warehouse.status === 'active' ? 'default' : 'secondary'}>
                    {warehouse.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditWarehouse(warehouse.id)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteWarehouse(warehouse.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const renderNotificationView = () => {
    if (currentView === 'selection') {
      return (
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Select Contacts</CardTitle>
              <Button variant="ghost" size="icon" onClick={handleCancelSelection}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeSelectionTab} onValueChange={(value) => setActiveSelectionTab(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="employees">Employees</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="vendors">Vendors</TabsTrigger>
              </TabsList>
              
              {(['employees', 'customers', 'vendors'] as const).map((type) => (
                <TabsContent key={type} value={type} className="mt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium capitalize">{type}</h3>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add {type.slice(0, -1)}
                      </Button>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allContacts
                          .filter(contact => contact.type === type.slice(0, -1))
                          .map((contact) => (
                            <TableRow key={contact.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedContacts[type].includes(contact.id)}
                                  onCheckedChange={() => handleContactSelection(contact.id, type)}
                                />
                              </TableCell>
                              <TableCell>{contact.name}</TableCell>
                              <TableCell>{contact.email}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={handleCancelSelection}>
                Cancel
              </Button>
              <Button onClick={handleConfirmSelection}>
                <Check className="h-4 w-4 mr-2" />
                OK
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-500" />
            <div>
              <CardTitle>Email Notifications - {selectedWarehouse?.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                This list is the contacts you will like notified
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notificationContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-6">
            <Button onClick={handleNewContactClick}>
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <> 
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          {selectedWarehouse && (
            <TabsTrigger value={`notifications-${selectedWarehouse.id}`}>
              Email Notifications - {selectedWarehouse.name}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="warehouses" className="mt-6">
          {renderWarehouseList()}
        </TabsContent>

        {selectedWarehouse && (
          <TabsContent value={`notifications-${selectedWarehouse.id}`} className="mt-6">
            {renderNotificationView()}
          </TabsContent>
        )}
      </Tabs>
    </>
  )
}

export default WarehouseSetup