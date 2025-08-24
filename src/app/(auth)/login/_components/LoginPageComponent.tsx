"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ForgotPasswordDialog } from "@/src/components/forgot-password-dialog";
import { AuthFormLayoutComponent } from "@/src/app/(auth)/_components/AuthFormLayoutComponent";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { PasswordField } from "@/src/components/ui/custom/password-field";
import { loginSchema } from "@/src/lib/zod/authSchema";
import { GraduationCap, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import CustomFormField from "@/src/app/_components/CustomFormField";
import { loginAction } from "@/src/action/authAction";
import { useRouter } from "next/navigation";

const LoginPageComponent = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [rememberMe, setRememberMe] = React.useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = React.useState(false);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const res = await loginAction({
      email: values.email,
      password: values.password,
    });

    if (res?.success) {
            console.log(res);
      router.push("/");
      form.reset();
    }
  }

  console.log("render");

  return (
    <>
      <AuthFormLayoutComponent
        title="Login"
        subtitle="Welcome to EduPlatform"
        description="Sign in to your account to continue"
        icon={<GraduationCap className="w-6 h-6 text-white" />}
        footer={
          <>
            <div className="text-center">
              <p className="text-sm text-gray-600">Don't have an account?</p>
              <Link href="/register">
                <Button variant="outline" className="mt-2 bg-transparent">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                <strong>Demo Credentials:</strong>
                <br />
                Student: student@test.com / password
                <br />
                Instructor: instructor@test.com / password
                <br />
                Admin: admin@test.com / password
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-sm text-purple-600 hover:text-purple-800 underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                style={{ backgroundColor: "#8B5CF6" }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </form>
          </Form>
        </>
      </AuthFormLayoutComponent>

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        open={isForgotPasswordOpen}
        onOpenChange={setIsForgotPasswordOpen}
      />
    </>
  );
};

export default LoginPageComponent;
