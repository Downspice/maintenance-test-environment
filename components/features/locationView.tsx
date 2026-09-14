"use client";

import { locationData } from "@/lib/domains/location/location-data";
import HierarchicalTaxTable from "./locationTable";
import { toast } from "sonner";
import { useSheet } from "@/lib/providers/sheet-providers";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewLocation from "../forms/entities/new-location-form";
import NewCategory from "../forms/entities/new-category";

export default function LocationView() {
  const { openSheet } = useSheet();
  const createLocation = () => {
    console.log("In the function");
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
    console.log("In the function");
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
    toast.success(`Edit ${type} with ID: ${id}`, {
      description: `This would open an edit form for the ${type}.`,
    });
  };

  const handleDelete = (
    type: "company" | "location" | "category",
    id: string
  ) => {
    toast.error(`Delete ${type} with ID: ${id}`, {
      description: `This would confirm deletion of the ${type}.`,
    });
  };

  const handleAddLocation = (companyId: string) => {
    createLocation();
    // toast.info(`Add new location to company: ${companyId}`, {
    //   description: "This would open a form to create a new location.",
    // });
  };

  const handleAddCategory = (locationId: string) => {
    // toast.info(`Add new category to location: ${locationId}`, {
    //   description: "This would open a form to create a new category.",
    // });
    createCategory();
  };

  return (
    <>
      <span>
        Identify your company locations to help you organize
        equipment,employees, work orders and more.<br></br> This provides you
        the ability to filter by locations on various screens and within your
        reports.Indicate tax rates per location for accurate costing if desired.
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
