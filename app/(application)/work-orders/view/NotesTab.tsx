import { NotesInterface } from "@/lib/WorkOrder/workOrder-data";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddNotes from "../forms/add-notes";
 
export default function NotesTab({
  notes,
  onUpdateNotes,
}: {
  notes: NotesInterface[];
  onUpdateNotes: (updated: NotesInterface[]) => void;
}) {
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
    if (confirm("Are you sure you want to delete this note?")) {
      const updatedNotes = [...notes];
      console.log("Deleted note:", notes[index].notes);
      updatedNotes.splice(index, 1);
      onUpdateNotes(updatedNotes);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Notes</h3>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <button
              className="flex items-center gap-2 border px-3 py-1 rounded text-sm hover:bg-muted"
              onClick={() => {
                setEditingIndex(null);
                setEditingNote(null);
              }}
            >
              <Plus className="w-4 h-4" /> Add Note
            </button>
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
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-2">Date Created</th>
              <th className="p-2">Created By</th>
              <th className="p-2">Note</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">
                  {new Date(note.createdAt).toLocaleString()}
                </td>
                <td className="p-2">{note.createdBy}</td>
                <td className="p-2">{note.notes}</td>
                <td className="p-2 text-right space-x-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
