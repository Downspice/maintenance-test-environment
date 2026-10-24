"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VendorInterface } from "@/lib/domains/vendor/vendor-data";

export default function ViewVendor({
  children,
  data,
}: {
  children: React.ReactNode;
  data: VendorInterface;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-3/4 ">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between">
              <div>Davis Plumbing</div>
              <div>
                <Button>Edit</Button>
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <div className="grid grid-cols-6 gap-1">
            <div className="col-span-1 font-semibold">Contact</div>
            <div className="col-span-5">{data.contact}</div>
            <div className="col-span-1 font-semibold">Home</div>
            <div className="col-span-5">{data.phone_one}</div>
            <div className="col-span-1 font-semibold">Address</div>
            <div className="col-span-5">{data.address1}</div>
            <div className="col-span-1 font-semibold">City</div>
            <div className="col-span-5">{data.city}</div>
            <div className="col-span-1 font-semibold">State/Prov</div>
            <div className="col-span-5">{data.state_prov}</div>
            <div className="col-span-1 font-semibold">Postal Code</div>
            <div className="col-span-5">{data.postal_code}</div>
            <div className="col-span-1 font-semibold">Type</div>
            <div className="col-span-5">{data.type}</div>
            <div className="col-span-1 font-semibold">Payment Terms</div>
            <div className="col-span-5">{data.term}</div>
            <div className="col-span-1 font-semibold">Status</div>
            <div className="col-span-5">Active</div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
