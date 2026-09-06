import { NotesInterface } from "@/lib/domains/work-order/workOrder-data";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddNotes from "@/components/forms/entities/work-order/add-notes";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/lib/shared/confirm-dialog";
import { toast } from "sonner";

export default function NotesTab({
  notes,
  onUpdateNotes,
}: {
  notes: NotesInterface[];
  onUpdateNotes: (updated: NotesInterface[]) => void;
}) {
  const confirmDialog = useConfirmDialog();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<NotesInterface | null>(null);

  const handleSave = (note: NotesInterface) => {
    const updatedNotes = [...notes];

    if (editingIndex !== null) {
      updatedNotes[editingIndex] = note;
    } else {
      updatedNotes.push(note);
    }

    onUpdateNotes(updatedNotes);
    setEditingIndex(null);
    setEditingNote(null);
    setOpenDialog(false);
  };

  const handleDelete = (index: number) => {
    (async () => {
      const ok = await confirmDialog({
        title: "Delete note?",
        description: "Are you sure you want to delete this note?",
        confirmText: "Delete",
      })
      if (ok) {
        const updatedNotes = [...notes];
        updatedNotes.splice(index, 1);
        onUpdateNotes(updatedNotes);
        toast.success("Note deleted")
      }
    })()
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Notes</h3>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button variant="secondary" onClick={() => {
                setEditingIndex(null);
                setEditingNote(null);
              }}
            >
              <Plus className="w-4 h-4" /> Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <AddNotes
              initialValues={editingNote ?? undefined}
              onSave={handleSave}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md overflow-auto">
        <Table className="w-full  ">
          <TableHeader className=" text-left">
            <TableRow>
              <TableHead className="p-2">Date Created</TableHead>
              <TableHead className="p-2">Created By</TableHead>
              <TableHead className="p-2">Note</TableHead>
              <TableHead className="p-2 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes.map((note, index) => (
              <TableRow key={index} className="border-t">
                <TableCell className="p-2">
                  {new Date(note.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="p-2">{note.createdBy}</TableCell>
                <TableCell className="p-2">{note.notes}</TableCell>
                <TableCell className="p-2 text-right space-x-2">
                  <button
                    className="text-muted-foreground hover:text-primary"
                    onClick={() => {
                      setEditingIndex(index);
                      setEditingNote(note);
                      setOpenDialog(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
