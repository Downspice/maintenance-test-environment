"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AddNoteSchema, AddNoteInterface } from "@/lib/domains/work-order/workOrder-data";
import { Modal } from "@/components/ui/modal";
import TextareaWrapper from "@/components/forms/fields/TextareaWrapper";

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
        <Modal
            open={open}
            onOpenChange={setOpen}
            title={data ? "Edit Note" : "Add Note"}
            description={data ? "Update the note below." : "Add a new note for this unit."}
            size="md"
            closeable={true}
            renderActions={
                <Button form="add-note-form" type="submit" variant="primary">
                    {data ? "Update Note" : "Add Note"}
                </Button>
            }
        >
            <Form {...form}>
                <form id="add-note-form" onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-1">
                    <TextareaWrapper
                        control={form.control}
                        name="note"
                        label="Note"
                        placeholder="Enter your note here..."
                        rows={4}
                    />
                </form>
            </Form>
        </Modal>
    );
}
