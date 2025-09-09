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
import React from "react";
import { Control, FieldValues } from "react-hook-form";
import CustomPasswordField from "./CustomPasswordField";

const CustomFormField = ({
  control,
  fieldName,
  label,
  inputType = "text",
  placeholder,
  description = null,
  disabled = false
}: {
  control: Control<any, any, any>;
  fieldName: string;
  label: string;
  inputType?: React.HTMLInputTypeAttribute;
  placeholder: string;
  description?: string | null;
  disabled?: boolean
}) => {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {inputType == "password" ? (
              <CustomPasswordField placeholder={placeholder} field={field} />
            ) : (
              <Input disabled={disabled} type={inputType} placeholder={placeholder} {...field} />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
