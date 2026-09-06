"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewVendor from "@/components/forms/entities/new-vendor-form";

interface TriggerVariant {
    variant?: "icon" | "default";
}

export default function VendorFormWrapper({ variant }: TriggerVariant) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant={variant === "icon" ? "ghost" : "default"}>
                    {variant === "icon" ? (
                        <Plus />
                    ) : (
                        <>
                            <Plus />
                            Create Vendor
                        </>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-3/4">
                <SheetHeader>
                    <SheetTitle>Create Vendor</SheetTitle>
                    <SheetDescription>
                        Fill out the form below to create a new Vendor.
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
                    <NewVendor />
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
