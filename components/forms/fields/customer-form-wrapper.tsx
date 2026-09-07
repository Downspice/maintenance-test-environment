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
import NewCustomer from "@/components/forms/entities/new-customer-form";

interface TriggerVariant {
    variant?: "icon" | "default";
}

export default function CustomerFormWrapper({ variant }: TriggerVariant) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant={variant === "icon" ? "ghost" : "primary"}
                    size={variant === "icon" ? "icon" : "md"}
                    className={variant === "icon" ? "size-6 p-0" : undefined}
                >
                    {variant === "icon" ? (
                        <Plus className="size-4" />
                    ) : (
                        <>
                            <Plus className="size-4 mr-2" />
                            Create Customer
                        </>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-3/4">
                <SheetHeader>
                    <SheetTitle>Create Customer</SheetTitle>
                    <SheetDescription>
                        Fill out the form below to create a new customer.
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
                    <NewCustomer />
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
