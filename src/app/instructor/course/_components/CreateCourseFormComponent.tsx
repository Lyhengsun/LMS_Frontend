"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { createCourseAction } from "@/src/action/courseAction";
import { uploadImageAction } from "@/src/action/fileAction";
import CustomFormField from "@/src/app/_components/CustomFormField";
import CustomSelectFormField from "@/src/app/_components/CustomSelectFormField";
import { createCourseSchema } from "@/src/lib/zod/courseSchema";
import Category from "@/src/type/Category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const CreateCourseFormComponent = ({
  categories,
  onOpenChange = (condition: boolean) => {},
}: {
  categories: Category[];
  onOpenChange?: Function;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<String | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Define allowed file extensions
  const allowedExtensions = [".png", ".svg", ".jpg", ".jpeg", ".gif"];
  const allowedMimeTypes = [
    "image/png",
    "image/svg+xml",
    "image/jpeg",
    "image/jpg",
    "image/gif",
  ];

  // Helper function to validate file type
  const isValidFileType = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf("."));

    // Check both extension and MIME type for better validation
    const hasValidExtension = allowedExtensions.includes(fileExtension);
    const hasValidMimeType = allowedMimeTypes.includes(file.type);

    return hasValidExtension && hasValidMimeType;
  };

  // Effect to create and revoke object URL for image preview
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    let objectUrl = null;
    if (file && file.type.startsWith("image/")) {
      objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
      setFile(null);
      toast.error("Invalid image file");
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]); // Re-run effect when 'file' changes

  const form = useForm<z.infer<typeof createCourseSchema>>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      courseName: "",
      courseDescription: "",
    },
  });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];

      // Validate file type before setting
      if (isValidFileType(droppedFile)) {
        setFile(droppedFile);
      } else {
        toast.error(
          `Invalid file type. Please select a file with one of these extensions: ${allowedExtensions.join(
            ", "
          )}`
        );
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (values: z.infer<typeof createCourseSchema>) => {
    console.log("values : ", values);

    let uploadedImageName: string | null = null;
    if (file) {
      const imageRes = await uploadImageAction(file);
      if (imageRes.success) {
        uploadedImageName = imageRes.data?.fileName!;
      }
    }

    const res = await createCourseAction(values, uploadedImageName);
    if (res.success) {
      form.reset();
      setFile(null);
      toast.success("Created Course Successfully");
      onOpenChange(false);
    } else {
      toast.error("Failed to create a new course");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="border-2 rounded-3xl border-[#088395]/50 ">
          <Label htmlFor="file-upload" className="group">
            <div
              className={`relative w-full border-2 border-[#088395]/50 m-4 border-dashed rounded-3xl flex flex-col items-center justify-center min-h-[200px] overflow-clip ${
                isDragging ? "border-red-400 bg-gray-50" : "border-[#088395]/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {previewUrl != null ? (
                <Image
                  src={previewUrl as string}
                  alt={"new image"}
                  fill // Use fill to make the image cover the parent div
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Adjust sizes based on your layout
                  className="object-cover rounded-t-lg"
                />
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center mb-4 group-hover:bg-gray-500 group-hover:border-gray-500 transition-colors">
                    <Plus className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Choose a file or drag & drop it here
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    JPEG and PNG formats, up to 50MB
                  </p>
                </div>
              )}
            </div>
          </Label>
          {file && (
            <div className="p-3 bg-transparent rounded-lg">
              <p className="text-sm text-center">
                Selected file: <span className="font-medium">{file.name}</span>{" "}
                ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            </div>
          )}
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
          />
        </div>

        <CustomFormField
          control={form.control}
          fieldName="courseName"
          label="Name of the Course"
          placeholder="Course Name"
        />

        <CustomFormField
          control={form.control}
          fieldName="courseDescription"
          label="Description"
          placeholder="Description"
        />

        <div className="grid grid-cols-2 gap-x-4">
          <CustomSelectFormField
            control={form.control}
            fieldName="courseCategoryId"
            label="Category"
            placeholder="Select a category"
            options={categories.map((c) => {
              return { label: c.name, value: c.id.toString() };
            })}
          />

          <CustomSelectFormField
            control={form.control}
            fieldName="level"
            label="Difficulty Level"
            placeholder="Pick a difficulty"
            options={[
              { label: "Beginner", value: "BEGINNER" },
              { label: "Intermediate", value: "INTERMEDIATE" },
              { label: "Advance", value: "ADVANCE" },
            ]}
          />

          {/* <CustomFormField
            control={form.control}
            fieldName="maxPoints"
            inputType="number"
            label="Max Points"
            placeholder="Max Points"
          /> */}
        </div>

        <div className="w-full flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCourseFormComponent;
