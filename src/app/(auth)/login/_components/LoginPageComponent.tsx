"use client";

import { Form } from "@/components/ui/form";
import { ForgotPasswordDialog } from "@/src/components/forgot-password-dialog";
import { AuthFormLayoutComponent } from "@/src/app/(auth)/_components/AuthFormLayoutComponent";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema } from "@/src/lib/zod/authSchema";
import { GraduationCap, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import CustomFormField from "@/src/app/_components/CustomFormField";
import { loginAction } from "@/src/action/authAction";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";

const LoginPageComponent = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const res = await loginAction({
      email: values.email,
      password: values.password,
    });

    if (res?.success) {
      toast.success("Login Success");
      router.push("/");
      form.reset();
    } else {
      toast.warning("Login Failed", {
        description:
          "Please make sure your account is verified and approved by the admin",
      });
    }
  }

  return (
    <>
      <AuthFormLayoutComponent
        title="Login"
        subtitle="Welcome to LMS"
        description="Sign in to your account to continue"
        icon={<GraduationCap className="w-6 h-6 text-white" />}
        footer={
          <>
            <div className="text-center">
              <p className="text-sm text-gray-600 space-x-2">
                <span>Don't have an account?</span>
                <Link
                  href="/register"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  Sign up now!
                </Link>
              </p>
            </div>
          </>
        }
      >
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <div className="flex items-center justify-between">
                <div
                onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-sm text-blue-400 hover:bg-transparent underline p-0 font-normal hover:text-blue-300 bg-transparent cursor-pointer"
                >
                  Forgot password?
                </div>

                <div className="flex items-center gap-2 cursor-pointer">
                  <Checkbox id="remember" className="cursor-pointer"/>
                  <Label htmlFor="remember" className="cursor-pointer text-gray-700">Remember me</Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                style={{ backgroundColor: "#0092c7" }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </form>
          </Form>
        </>
      </AuthFormLayoutComponent>

      <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
          <DialogContent>
            <DialogTitle>
              Forgot password
            </DialogTitle>
            <DialogDescription>
              Enter the email that you forgot the password for
            </DialogDescription>
            <Label htmlFor="forgot-email">Email</Label>
            <Input id="forgot-email" />
          </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginPageComponent;
