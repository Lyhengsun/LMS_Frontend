"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { Control, FieldValues } from "react-hook-form";

const CustomTextFormField = ({
  control,
  fieldName,
  label,
  placeholder,
  description = null,
  disabled = false,
}: {
  control: Control<any, any, any>;
  fieldName: string;
  label: string;
  placeholder: string;
  description?: string | null;
  disabled?: boolean;
}) => {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              disabled={disabled}
              placeholder={placeholder}
              rows={3}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomTextFormField;
