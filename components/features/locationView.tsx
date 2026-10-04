"use client";

import { locationData } from "@/lib/domains/location/location-data";
import HierarchicalTaxTable from "./locationTable";
import { toast } from "sonner";
import { useSheet } from "@/lib/providers/sheet-providers";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewLocation from "../forms/entities/new-location-form";
import NewCategory from "../forms/entities/new-category";
import { useConfirmDialog } from "@/lib/shared/confirm-dialog";

function getItemLabel(
  type: "company" | "location" | "category",
  id: string
): string {
  if (type === "company") return locationData.company_name;
  if (type === "location") {
    return (
      locationData.locations.find((loc) => loc.id === id)?.location_name ?? id
    );
  }
  for (const loc of locationData.locations) {
    const cat = loc.categories.find((c) => c.id === id);
    if (cat) return cat.name;
  }
  return id;
}

export default function LocationView() {
  const confirmDialog = useConfirmDialog();
  const { openSheet } = useSheet();

  const createLocation = () => {
    openSheet({
      title: "Add New Location",
      description: "Fill out the form below to create a Location.",
      className: "w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none",
      content: (
        <ScrollArea className="h-[calc(100vh-160px)] pr-4">
          <NewLocation formId="new-location-form" hideSubmitButton />
        </ScrollArea>
      ),
      renderActions: (
        <Button form="new-location-form" type="submit" variant="primary">
          Save Location
        </Button>
      ),
    });
  };

  const createCategory = () => {
    openSheet({
      title: "Add New Category",
      description: "Fill out the form below to create a Category.",
      className: "w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none",
      content: (
        <ScrollArea className="h-[calc(100vh-160px)] pr-4">
          <NewCategory formId="new-category-form" hideSubmitButton />
        </ScrollArea>
      ),
      renderActions: (
        <Button form="new-category-form" type="submit" variant="primary">
          Save Category
        </Button>
      ),
    });
  };

  const handleEdit = (
    type: "company" | "location" | "category",
    id: string
  ) => {
    toast.success(`Updated ${getItemLabel(type, id)}`);
  };

  const handleDelete = (
    type: "company" | "location" | "category",
    id: string
  ) => {
    void (async () => {
      const name = getItemLabel(type, id);
      const typeLabel =
        type === "company"
          ? "company"
          : type === "location"
            ? "location"
            : "category";

      const ok = await confirmDialog({
        title: `Delete ${typeLabel}?`,
        description: `Are you sure you want to delete "${name}"? Related equipment and records may still reference this ${typeLabel}.`,
        confirmText: `Delete ${typeLabel}`,
        tone: "danger",
        item: { name },
      });

      if (!ok) return;
      toast.success(`Deleted "${name}"`);
    })();
  };

  const handleAddLocation = (_companyId: string) => {
    createLocation();
  };

  const handleAddCategory = (_locationId: string) => {
    createCategory();
  };

  return (
    <>
      <span>
        Identify your company locations to help you organize equipment,
        employees, work orders and more.
        <br />
        This provides you the ability to filter by locations on various screens
        and within your reports. Indicate tax rates per location for accurate
        costing if desired.
      </span>
      <div>
        <HierarchicalTaxTable
          data={locationData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddLocation={handleAddLocation}
          onAddCategory={handleAddCategory}
        />
      </div>
    </>
  );
}
