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
import NewInventory from "@/components/forms/actualForms/new-inventory-form";

interface TriggerVariant {
    variant?: "icon" | "default";
}

export default function InventoryFormWrapper({ variant }: TriggerVariant) {
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
                            Create Inventory
                        </>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-3/4">
                <SheetHeader>
                    <SheetTitle>Create Inventory</SheetTitle>
                    <SheetDescription>
                        Fill out the form below to create a new Inventory.
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
                    <NewInventory />
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
