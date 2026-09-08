import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Drawer } from "@/components/ui/drawer";

export function DrawerDemo() {
  return (
    <Drawer
      trigger={<Button variant="secondary">Open</Button>}
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
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input
            id="username"
            defaultValue="@peduarte"
            className="col-span-3"
          />
        </div>
      </div>
    </Drawer>
  );
}
