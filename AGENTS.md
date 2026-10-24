# Drawer Component & Form Guidelines

This document outlines the standard architecture, visual appearance, and implementation patterns for all drawer components and drawer-hosted entity forms in this project, based on the reference standard in [VendorFormWrapper](file:///Users/spice/things/maintenance-test-environment/components/forms/fields/vendor-form-wrapper.tsx) and [NewVendorForm](file:///Users/spice/things/maintenance-test-environment/components/forms/entities/new-vendor-form.tsx).

---

## 1. Drawer Architecture & Wrapper Pattern

Every entity that can be created or edited via a drawer must have a dedicated wrapper component (e.g. `[Entity]FormWrapper.tsx`) in `components/forms/fields/`.

### Standard Implementation Template

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import New[Entity]Form from "@/components/forms/entities/new-[entity]-form";

interface TriggerVariant {
  variant?: "icon" | "default";
}

export default function [Entity]FormWrapper({ variant }: TriggerVariant) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      trigger={
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
              Create [Entity]
            </>
          )}
        </Button>
      }
      title="Create [Entity]"
      description="Fill out the form below to create a new [Entity]."
      closeable={true}
      renderActions={
        <Button form="new-[entity]-form" type="submit" variant="primary">
          Save [Entity]
        </Button>
      }
      className="w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none"
    >
      <ScrollArea className="h-[calc(100vh-160px)] pr-4">
        <New[Entity]Form
          formId="new-[entity]-form"
          hideSubmitButton
          onSuccess={() => setOpen(false)}
        />
      </ScrollArea>
    </Drawer>
  );
}
```

---

## 2. Drawer Dimensions & Sizing Rules

1. **Standard Entity Drawers** (Vendors, Employees, Customers, Inventory, Equipment, etc.):
   - Use:
     ```tsx
     className =
       "w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none";
     ```
   - Always include `sm:max-w-none lg:max-w-none` to override Radix Sheet max-width constraints.

2. **Complex Document Drawers** (Purchase Orders, Invoices):
   - When entities contain complex line-item tables, multi-column financial totals, and wide tabs, cover the full screen:
     ```tsx
     className = "inset-0 w-full max-w-none sm:max-w-none lg:max-w-none";
     ```

3. **Page "New" Action Buttons (`openSheet`)**:
   - When calling `openSheet` from page views, match the exact same `className`:
     ```tsx
     openSheet({
       title: "Create [Entity]",
       description: "Fill out the form below to create a new [Entity].",
       className: "w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none",
       content: <New[Entity]Form formId="new-[entity]-form" hideSubmitButton onSuccess={closeSheet} />,
       renderActions: (
         <Button form="new-[entity]-form" type="submit" variant="primary">
           Save [Entity]
         </Button>
       ),
     });
     ```

---

## 3. Form Scroll & Header Actions Pattern

- **External Submit Button**:
  - The submit button is passed to `renderActions` on the `Drawer` / `Sheet` component:
    `<Button form="[formId]" type="submit" variant="primary">Save [Entity]</Button>`
  - The form component must accept `formId` (defaulting to the entity form ID) and apply it to `<form id={formId}>`.
  - The form component must accept `hideSubmitButton?: boolean` and omit its internal submit button when rendered inside a drawer.
- **Scroll Container**:
  - Form content must be wrapped in `<ScrollArea className="h-[calc(100vh-160px)] pr-4">`.
  - This prevents page scrollbars, avoids clipping fixed headers/footers, and gives a sleek padded viewport.

---

## 4. Internal Form Structure (Reference: Create Vendor)

Entity forms rendered inside drawers must follow the Create Vendor layout pattern:

### 1. Tabs Organization (Optional)

Tabs are **optional and not enforced** for all drawers. Many forms (e.g. Record Payment, simple entity forms, focused dialogs) should be rendered directly without tabs. Use tabs only when an entity has multiple large, distinct categories (e.g. General, Contact, Attachments, Notes).

- **Forms with Tabs**:

```tsx
<Tabs defaultValue="general" className="w-full">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="contact">Contact</TabsTrigger>
    <TabsTrigger value="others">Others</TabsTrigger>
    <TabsTrigger value="attachment">Attachments</TabsTrigger>
  </TabsList>
  <TabsContent value="general">
    <div className="flex flex-col gap-1">{/* Fields */}</div>
  </TabsContent>
  ...
</Tabs>
```

- **Forms without Tabs** (e.g. Record Payment, Quick Add forms):
  Directly render fields inside `<div className="flex flex-col gap-1">` (with optional `<FormSubheader />` or `<Fieldset />` dividers where appropriate):

```tsx
<div className="flex flex-col gap-1">{/* Fields rendered directly */}</div>
```

### 2. Vertical Field Spacing & Grid Columns

- Each vertical group uses `<div className="flex flex-col gap-1">` (tight, consistent spacing).
- Multi-column rows use `<div className="grid grid-cols-2 gap-x-4 gap-y-1">`.
- Section dividers use `<FormSubheader header={"Section Name"} />`.

### 3. Field Wrappers & Label Alignment

- All fields must use the standardized field wrappers:
  - `InputWrapper`
  - `SelectWrapper`
  - `DatePickerWrapper`
  - `ComboboxFieldWrapper` / `ChoiceListComboboxWrapper`
  - `TextareaWrapper`
- **Label Alignment**:
  - Horizontal fixed width (`w-[10rem] flex items-center justify-end text-right shrink-0`).
  - Right-aligned close to the input element.
- **Required Fields**:
  - Dynamic red text (`text-red-500`) when the field is empty.
  - No asterisks (`*`) in labels.

### 4. Custom Fields Behavior

- Custom fields must behave like `CustomFieldRow`:
  - Directly render `CustomFieldsWrapper` with `maxFields={2}` (or `CustomFieldRow`).
  - In-place editable labels with pencil icon toggle.
  - Mapped to array indexes `${name}.${index}.name` and `${name}.${index}.value`.
  - No bulky cards or nested empty states.

---

## 5. Navigation & Trigger Integration

- **Quick Add (`+`) in Navigation Menus**:
  - Quick-add buttons rendered in the side navigation must be independent sibling elements outside `<Link href="...">`.
  - Event propagation must be stopped:
    ```tsx
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
    onPointerDown={(e) => {
      e.stopPropagation();
    }}
    ```
  - This ensures clicking the quick-add button opens the drawer immediately without triggering route navigation.
