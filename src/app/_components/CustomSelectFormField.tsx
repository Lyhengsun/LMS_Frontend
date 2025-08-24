"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Control, FieldValues } from "react-hook-form";

const CustomSelectFormField = ({
  control,
  fieldName,
  label,
  placeholder,
  description = null,
  options,
}: {
  control: Control<FieldValues, any, FieldValues>;
  fieldName: string;
  label: string;
  placeholder: string;
  description: string | null;
  options: Array<{ label: string; value: string }>;
}) => {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((o) => (
                <SelectItem value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
};

export default CustomSelectFormField;

// source to use this
// https://ui.shadcn.com/docs/components/select#form
