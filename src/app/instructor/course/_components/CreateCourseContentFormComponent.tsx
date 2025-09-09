"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { createCourseContentAction } from "@/src/action/courseAction";
import { uploadVideoAction } from "@/src/action/fileAction";
import CustomFormField from "@/src/app/_components/CustomFormField";
import { createCourseContentSchema } from "@/src/lib/zod/courseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Plus, VideoIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const CreateCourseContentFormComponent = ({
  courseId,
  courseContentIndex,
  onOpenChange = (condition: boolean) => {},
  isSubmitting,
  setIsSubmitting,
}: {
  courseId: number;
  courseContentIndex: number;
  onOpenChange?: Function;
  isSubmitting: boolean;
  setIsSubmitting: Function;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<String | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<z.infer<typeof createCourseContentSchema>>({
    resolver: zodResolver(createCourseContentSchema),
    defaultValues: {
      courseContentName: "",
      durationMinutes: "1",
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
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFileError(null);
    }
  };

  const onSubmit = async (
    values: z.infer<typeof createCourseContentSchema>
  ) => {
    console.log("values : ", values);

    if (file) {
      const { success, data: videoFileName } = await uploadVideoAction(file);
      if (success) {
        const courseContentRes = await createCourseContentAction(
          values,
          courseContentIndex,
          videoFileName!,
          courseId
        );
        if (courseContentRes.success) {
          toast.success("Uploaded new lesson successfully");
          form.reset();
          setFile(null);
          onOpenChange(false);
        } else {
          toast.error("Failed to upload the new lesson");
        }
      } else {
        toast.error("Failed to upload video");
      }
    } else {
      setFile(null);
      setFileError("Video is required");
    }
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          setIsSubmitting(true);
          await onSubmit(values);
        })}
        className="space-y-4"
      >
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
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center mb-4 group-hover:bg-gray-500 group-hover:border-gray-500 transition-colors">
                  {file ? (
                    <VideoIcon className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                  ) : (
                    <Plus className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                  )}
                </div>
                {file ? (
                  <p className="text-sm text-gray-600 mb-1">
                    Selected file:{" "}
                    <span className="font-medium">{file.name}</span> (
                    {(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 mb-1">
                    Choose a file or drag & drop it here
                  </p>
                )}
              </div>
            </div>
          </Label>
          {fileError && (
            <div className="p-3 bg-transparent rounded-lg">
              <p className="text-sm text-center text-red-400">{fileError}</p>
            </div>
          )}
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
        </div>

        <CustomFormField
          control={form.control}
          fieldName="courseContentName"
          label="New lesson name"
          placeholder="Lesson name"
          disabled={isSubmitting}
        />

        <CustomFormField
          control={form.control}
          inputType="number"
          fieldName="durationMinutes"
          label="Lesson duration in Minutes"
          placeholder="Lesson duration"
          disabled={isSubmitting}
        />

        <div className="w-full flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCourseContentFormComponent;
