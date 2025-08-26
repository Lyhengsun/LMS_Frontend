import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Shield,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ForgotPasswordDialog = ({
  open,
  onOpenChange,
}: ForgotPasswordDialogProps) => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Timer for OTP expiration
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (otpExpiry && step === "otp") {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const expiry = otpExpiry.getTime();
        const difference = expiry - now;

        if (difference > 0) {
          setTimeLeft(Math.ceil(difference / 1000));
        } else {
          setTimeLeft(0);
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpExpiry, step]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Check if email exists in system
    const demoEmails = [
      "student@test.com",
      "instructor@test.com",
      "admin@test.com",
    ];
    const approvedUsers = JSON.parse(
      localStorage.getItem("approvedUsers") || "[]"
    );
    const userExists =
      demoEmails.includes(email.toLowerCase()) ||
      approvedUsers.some(
        (user: any) => user.email.toLowerCase() === email.toLowerCase()
      );

    if (!userExists) {
      toast.error("Email not found", {
        description: "This email address is not registered in our system.",
      });
      setIsLoading(false);
      return;
    }

    // Generate a random 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    // Set OTP expiry to 5 minutes from now
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 5);
    setOtpExpiry(expiry);

    // Simulate sending OTP email
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast("OTP Sent", {
      description: `OTP verification code sent to ${email}. Demo OTP: ${newOtp} (Valid for 5 minutes)`,
    });

    setStep("otp");
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if OTP is expired
    if (otpExpiry && new Date() > otpExpiry) {
      toast.error("OTP Expired", {
        description: "The OTP has expired. Please request a new one.",
      });
      setStep("email");
      setOtp("");
      setGeneratedOtp("");
      setOtpExpiry(null);
      return;
    }

    if (!otp || otp.length !== 6) {
      toast.error("Invalid OTP", {
        description: "Please enter a valid 6-digit OTP code.",
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (otp === generatedOtp) {
      toast.success("OTP Verified", {
        description:
          "OTP verified successfully. You can now reset your password.",
      });
      setStep("reset");
    } else {
      toast.error("Invalid OTP", {
        description: "The OTP code you entered is incorrect. Please try again.",
      });
    }

    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Missing Information", {
        description: "Please fill in both password fields.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast("Passwords Don't Match", {
        description:
          "New password and confirm password don't match. Please try again.",
      });
      return;
    }

    if (password.length < 6) {
      toast("Password Too Short", {
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update password in approved users if exists
    const approvedUsers = JSON.parse(
      localStorage.getItem("approvedUsers") || "[]"
    );
    const userIndex = approvedUsers.findIndex(
      (user: any) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (userIndex !== -1) {
      approvedUsers[userIndex].password = password;
      localStorage.setItem("approvedUsers", JSON.stringify(approvedUsers));
    }

    toast("Password Reset Successful", {
      description:
        "Your password has been updated successfully. You can now login with your new password.",
    });

    // Reset form and close dialog
    setStep("email");
    setEmail("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setGeneratedOtp("");
    setOtpExpiry(null);
    setTimeLeft(0);
    setIsLoading(false);
    onOpenChange(false);
  };

  const handleResendOtp = async () => {
    setIsLoading(true);

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    // Reset expiry time
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 5);
    setOtpExpiry(expiry);

    // Clear current OTP input
    setOtp("");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast("New OTP Sent", {
      description: `New OTP sent to ${email}. Demo OTP: ${newOtp} (Valid for 5 minutes)`,
    });

    setIsLoading(false);
  };

  const goBack = () => {
    if (step === "otp") {
      setStep("email");
      setOtp("");
      setGeneratedOtp("");
      setOtpExpiry(null);
    }
    if (step === "reset") setStep("otp");
  };

  const resetDialog = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setGeneratedOtp("");
    setOtpExpiry(null);
    setTimeLeft(0);
  };

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      resetDialog();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {step !== "email" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="mr-2 p-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            {step === "email" && "Forgot Password"}
            {step === "otp" && "Verify OTP"}
            {step === "reset" && "Reset Password"}
          </DialogTitle>
          <DialogDescription>
            {step === "email" &&
              "Enter your email address to receive an OTP for password reset."}
            {step === "otp" && "Enter the 6-digit OTP code sent to your email."}
            {step === "reset" && "Enter your new password below."}
          </DialogDescription>
        </DialogHeader>

        {step === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP Code</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Timer Display */}
              <div className="flex items-center justify-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span
                  className={timeLeft > 0 ? "text-gray-600" : "text-red-500"}
                >
                  {timeLeft > 0
                    ? `Expires in ${formatTime(timeLeft)}`
                    : "OTP Expired"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || timeLeft === 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendOtp}
                disabled={isLoading || timeLeft > 240} // Allow resend only when less than 4 minutes left
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend OTP"
                )}
              </Button>
            </div>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Update Password
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
