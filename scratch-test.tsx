import React from "react";
import { useForm, Control, FieldPath, FieldValues } from "react-hook-form";
import { z } from "zod";

interface BaseFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
}

interface GenericObject {
  id: string;
  name: string;
}

interface ComboboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFieldProps<TFieldValues, TName> {
  options: GenericObject[];
}

function ComboboxFieldWrapper<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ComboboxFieldProps<TFieldValues, TName>) {
  return null;
}

// Test with concrete schema
const MySchema = z.object({
  customer_id: z.string(),
  item_name: z.string(),
});

type MySchemaType = z.infer<typeof MySchema>;

function TestComponent() {
  const form = useForm<MySchemaType>();

  return (
    <>
      {/* 1. Inferred automatically from control and name */}
      <ComboboxFieldWrapper
        control={form.control}
        name="customer_id"
        options={[]}
      />

      {/* 2. Explicit generic type passed */}
      <ComboboxFieldWrapper<MySchemaType>
        control={form.control}
        name="customer_id"
        options={[]}
      />
    </>
  );
}
