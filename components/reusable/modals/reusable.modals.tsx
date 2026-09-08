import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";

export function ModalDemo() {
  return (
    <Modal
      trigger={<Button variant="secondary">Open Modal</Button>}
      title="Edit profile"
      description="Make changes to your profile here. Click save when you're done."
      closeable={true}
      renderActions={
        <Button variant="primary" type="submit">
          Save changes
        </Button>
      }
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="modal-name" className="text-right">
            Name
          </Label>
          <Input
            id="modal-name"
            defaultValue="Pedro Duarte"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="modal-username" className="text-right">
            Username
          </Label>
          <Input
            id="modal-username"
            defaultValue="@peduarte"
            className="col-span-3"
          />
        </div>
      </div>
    </Modal>
  );
}

export function ConfirmationModalDemo() {
  return (
    <DeleteConfirmationModal
      trigger={<Button variant="destructive">Delete workspace</Button>}
      title="Delete workspace"
      description="Are you sure you want to delete the following workspace?"
      item={{
        name: "Acme",
        description: "4 Pipelines, 21 tests, 173 commits",
        action: {
          label: "Go to Home",
          onClick: () => console.log("Navigate to home"),
        },
      }}
      switchLabel="Confirm permanent deletion"
      switchDescription="Toggle switch to authorize deletion of this workspace."
      confirmText="Yes, Delete Workspace"
      cancelText="Cancel"
      onDelete={async () => {
        // Simulate deletion logic
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Workspace deleted successfully");
      }}
    />
  );
}

export { DeleteConfirmationModal };
export type {
  DeleteConfirmationModalProps,
  DeleteConfirmationItem,
} from "./delete-confirmation-modal";
