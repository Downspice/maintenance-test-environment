"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AddNoteSchema, AddNoteInterface } from "@/lib/domains/work-order/workOrder-data";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AddNoteProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onAdd: (data: AddNoteInterface) => void;
    data?: AddNoteInterface | null;
}

export default function AddNote({ open, setOpen, onAdd, data }: AddNoteProps) {
    const form = useForm<AddNoteInterface>({
        resolver: zodResolver(AddNoteSchema),
        defaultValues: data || {
            note: "",
            created_by: "",
            date: "",
        },
    });

    // Reset form when dialog opens/closes or data changes
    React.useEffect(() => {
        if (data) {
            form.reset(data);
        } else {
            form.reset({
                note: "",
                created_by: "",
                date: "",
            });
        }
    }, [data, open, form]);

    function handleSubmit(values: AddNoteInterface) {
        onAdd(values);
        form.reset();
    }

    const handleCancel = () => {
        form.reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{data ? "Edit Note" : "Add Note"}</DialogTitle>
                    <DialogDescription>
                        {data ? "Update the note below." : "Add a new note for this unit."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="note">Note</Label>
                            <Textarea
                                id="note"
                                placeholder="Enter your note here..."
                                className="min-h-[120px]"
                                {...form.register("note")}
                            />
                            {form.formState.errors.note && (
                                <p className="text-sm text-red-600">
                                    {form.formState.errors.note.message}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {data ? "Update Note" : "Add Note"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
