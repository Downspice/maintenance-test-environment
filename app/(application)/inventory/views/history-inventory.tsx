"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PurchasesHistory,
  StockAdjustmentHistory,
  UsageHistory,
} from "@/lib/domains/inventory/inventory-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function HistoryTable() {
  // Here you would typically send the data to your API

  return (
    <div className="w-full">
      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="Stock Adjustments">Stock Adjustments</TabsTrigger>
          <TabsTrigger value="Usage">Usage</TabsTrigger>
          <TabsTrigger value="Purchases">Purchases</TabsTrigger>
        </TabsList>
        <TabsContent value="Stock Adjustments">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Qty Remain</TableHead>
                <TableHead>Qty Received</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Receipt Type</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {StockAdjustmentHistory.map((entry, idx) => (
                <TableRow key={idx}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.qtyRemain}</TableCell>
                  <TableCell>{entry.qtyReceived}</TableCell>
                  <TableCell>{entry.unit}</TableCell>
                  <TableCell>{entry.receiptType}</TableCell>
                  <TableCell>{entry.vendor}</TableCell>
                  <TableCell>{entry.warehouse}</TableCell>
                  <TableCell>{entry.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="Usage">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Cost Centre</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {UsageHistory.map((entry, idx) => (
                <TableRow key={idx}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.source}</TableCell>
                  <TableCell>{entry.equipment}</TableCell>
                  <TableCell>{entry.used}</TableCell>
                  <TableCell>{entry.cost}</TableCell>
                  <TableCell>{entry.total}</TableCell>
                  <TableCell>{entry.costCentre}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="Purchases">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Received</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Received To</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PurchasesHistory.map((entry, idx) => (
                <TableRow key={idx}>
                  <TableCell>{entry.dateReceived}</TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>{entry.vendor}</TableCell>
                  <TableCell>{entry.receivedTo}</TableCell>
                  <TableCell>{entry.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
