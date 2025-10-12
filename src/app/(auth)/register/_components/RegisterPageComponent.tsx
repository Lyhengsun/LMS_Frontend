"use client";

import { AuthFormLayoutComponent } from "@/src/app/(auth)/_components/AuthFormLayoutComponent";
import { Button } from "@/components/ui/button";
import { GraduationCap, UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/src/lib/zod/authSchema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/src/app/_components/CustomFormField";
import CustomSelectFormField from "@/src/app/_components/CustomSelectFormField";
import { registerAction } from "@/src/action/authAction";
import { toast } from "sonner";

export default function RegisterPageComponent() {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      roleId: "3",
    },
  });

  const onSubmitRegister = async (values: z.infer<typeof registerSchema>) => {
    console.log(values);
    const res = await registerAction(values);
    if (res.success) {
      toast.success("Register Successfully");
      sessionStorage.setItem("registrationData", JSON.stringify(values));
      form.reset();
      router.push("/verify-otp");
    } else {
      toast.error("Registration Failed");
    }
  };

  console.log(form.formState.errors);

  return (
    <AuthFormLayoutComponent
      title="Register"
      subtitle="Join LMS"
      description="Create your account to get started"
      icon={<GraduationCap className="w-6 h-6 text-white" />}
      footer={
        <div className="text-center">
          <p className="text-sm text-gray-600 space-x-2">
            <span>Already have an account?</span>
            <Link
              href="/login"
              className="text-blue-400 underline hover:text-blue-300"
            >
              Sign in here
            </Link>
          </p>
        </div>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitRegister)}
          className="space-y-4"
        >
          <CustomFormField
            control={form.control}
            fieldName="fullName"
            label="Fullname"
            placeholder="Fullname"
          />

          <CustomFormField
            control={form.control}
            fieldName="email"
            label="Email"
            placeholder="Email"
          />

          <CustomFormField
            control={form.control}
            fieldName={"password"}
            label={"Password"}
            placeholder={"Password"}
            inputType="password"
          />

          <CustomFormField
            control={form.control}
            fieldName="phoneNumber"
            label="Phone Number"
            placeholder="Phone Number"
          />

          <CustomSelectFormField
            control={form.control}
            fieldName="roleId"
            label="Selected Role"
            placeholder="Pick a Role"
            options={[
              { label: "INSTRUCTOR", value: "2" },
              { label: "STUDENT", value: "3" },
            ]}
          />

          <Button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-300 active:bg-cyan-300"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create Account
          </Button>
        </form>
      </Form>
    </AuthFormLayoutComponent>
  );
}
