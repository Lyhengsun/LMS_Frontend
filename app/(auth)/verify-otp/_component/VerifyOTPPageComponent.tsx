"use client"

import { AuthLayout } from "@/components/layout/auth-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OTPInput } from "@/components/ui/custom/otp-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Shield, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"

export default function VerifyOTPPageComponent() {
      const router = useRouter()
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""])
  const [error, setError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [resendCooldown, setResendCooldown] = React.useState(0)
  const [registrationData, setRegistrationData] = React.useState<any>(null)

  React.useEffect(() => {
    // Get registration data from sessionStorage
    const data = sessionStorage.getItem("registrationData")
    if (data) {
      setRegistrationData(JSON.parse(data))
    } else {
      // If no registration data, redirect to register page
      router.push("/register")
    }

    // Start resend cooldown
    setResendCooldown(60)
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [router])

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    const otpString = otp.join("")
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For demo purposes, accept any 6-digit code
      console.log("Registration completed:", registrationData)
      console.log("OTP verified:", otpString)

      // Clear registration data
      sessionStorage.removeItem("registrationData")

      // Redirect to success page or login
      alert("Registration successful! Please login with your credentials.")
      router.push("/")
    } catch (error) {
      setError("Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return

    setResendCooldown(60)
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Simulate resend API call
    console.log("Resending OTP to:", registrationData?.email)
    alert("OTP has been resent to your email!")
  }

  if (!registrationData) {
    return null // Will redirect in useEffect
  }

  return (
    <AuthLayout
      title="Verify"
      subtitle="Verify Your Email"
      description={
        <>
          We've sent a 6-digit code to
          <br />
          <span className="font-medium text-foreground">{registrationData?.email}</span>
        </>
      }
      icon={<Shield className="w-6 h-6 text-white" />}
      footer={
        <div className="text-center space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
            <Button variant="outline" onClick={handleResendOTP} disabled={resendCooldown > 0} className="text-sm">
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
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

          <div>
            <p className="text-xs text-gray-500">
              <strong>Demo:</strong> Enter any 6-digit code to continue
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleVerifyOTP} className="space-y-6">
        <OTPInput
          value={otp}
          onChange={(newOtp) => {
            setOtp(newOtp)
            setError("")
          }}
          error={error}
        />

        <Button type="submit" className="w-full" style={{ backgroundColor: "#8B5CF6" }} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Verify Code
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}
