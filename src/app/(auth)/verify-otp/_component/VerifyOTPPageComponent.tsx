"use client";

import { AuthFormLayoutComponent } from "@/src/app/(auth)/_components/AuthFormLayoutComponent";
import { Button } from "@/components/ui/button";
import { AlertCircle, Shield, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { RegisterData } from "@/src/type/AuthData";
import {
  registerAction,
  resendOTPAction,
  verifyOTPAction,
} from "@/src/action/authAction";

const FormSchema = z.object({
  pin: z
    .string()
    .min(6, {
      message: "OTP must be 6 digits.",
    })
    .regex(/^\d+$/, "OTP must be digits"),
});

export default function VerifyOTPPageComponent() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });
  const router = useRouter();
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const [registrationData, setRegistrationData] = useState<RegisterData | null>(
    null
  );

  useEffect(() => {
    const dataString = sessionStorage.getItem("registrationData");

    if (dataString != null) {
      setRegistrationData(JSON.parse(dataString) as unknown as RegisterData);
    } else {
      router.back();
    }
    // Start resend cooldown
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values", {
      description: registrationData?.email + " " + data,
    });
    console.log(data);

    const res = await verifyOTPAction(registrationData?.email!, data.pin);

    if (res.success) {
      toast.success(
        "Verify OTP Successfully! Please wait for admin approval to use the account"
      );
      form.reset();
      router.push("/login");
    } else {
      toast.error("Verification Failed");
    }
  }

  const handleResendOTP = async () => {
    const res = await resendOTPAction(registrationData?.email!);
    if (!res.success) {
      toast.error("Failed to resend OTP code", {
        description: "Something went wrong",
      });
    }
    if (resendCooldown > 0) return;

    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!registrationData) {
    return null; // Will redirect in useEffect
  }

  return (
    <AuthFormLayoutComponent
      title="Verify"
      subtitle="Verify Your Email"
      description={
        <>
          We've sent a 6-digit code to
          <br />
          <span className="font-medium text-foreground">
            {registrationData?.email}
          </span>
        </>
      }
      icon={<Shield className="w-6 h-6 text-white" />}
      footer={
        <div className="text-center space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <Button
              variant="outline"
              onClick={handleResendOTP}
              disabled={resendCooldown > 0}
              className="text-sm"
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend Code"}
            </Button>
          </div>

          <div>
            <Link href="/register">
              <Button variant="ghost" className="text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Registration
              </Button>
            </Link>
          </div>
        </div>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6 flex-col items-center flex"
        >
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </AuthFormLayoutComponent>
  );
}
