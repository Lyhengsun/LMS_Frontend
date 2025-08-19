"use client"

import { AuthLayout } from "@/components/layout/auth-layout"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/custom/form-field"
import { PasswordField } from "@/components/ui/custom/password-field"
import { RoleSelect } from "@/components/ui/custom/role-select"
import { GraduationCap, UserPlus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"

export default function RegisterPageComponent() {
     const router = useRouter()
  const [registerData, setRegisterData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [validationErrors, setValidationErrors] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const validateForm = () => {
    const errors = {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      phone: "",
      password: "",
      confirmPassword: "",
    }

    if (!registerData.firstName.trim()) {
      errors.firstName = "First name is required"
    }

    if (!registerData.lastName.trim()) {
      errors.lastName = "Last name is required"
    }

    if (!registerData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      errors.email = "Email is invalid"
    }

    if (!registerData.role) {
      errors.role = "Please select a role"
    }

    if (!registerData.password) {
      errors.password = "Password is required"
    } else if (registerData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (!registerData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setValidationErrors(errors)
    return Object.values(errors).every((error) => error === "")
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Store registration data in sessionStorage for OTP page
      sessionStorage.setItem("registrationData", JSON.stringify(registerData))
      // Navigate to OTP verification page
      router.push("/verify-otp")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setRegisterData({ ...registerData, [field]: value })
    // Clear validation error when user starts typing
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors({ ...validationErrors, [field]: "" })
    }
  }

  return (
    <AuthLayout
      title="Register"
      subtitle="Join EduPlatform"
      description="Create your account to get started"
      icon={<GraduationCap className="w-6 h-6 text-white" />}
      footer={
        <div className="text-center">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <Link href="/">
            <Button variant="outline" className="mt-2 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </Link>
        </div>
      }
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="firstName"
            label="First Name"
            placeholder="First name"
            value={registerData.firstName}
            onChange={(value) => handleInputChange("firstName", value)}
            error={validationErrors.firstName}
            required
          />
          <FormField
            id="lastName"
            label="Last Name"
            placeholder="Last name"
            value={registerData.lastName}
            onChange={(value) => handleInputChange("lastName", value)}
            error={validationErrors.lastName}
            required
          />
        </div>

        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={registerData.email}
          onChange={(value) => handleInputChange("email", value)}
          error={validationErrors.email}
          required
        />

        <RoleSelect
          value={registerData.role}
          onChange={(value) => handleInputChange("role", value)}
          error={validationErrors.role}
          required
        />

        <FormField
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          value={registerData.phone}
          onChange={(value) => handleInputChange("phone", value)}
          error={validationErrors.phone}
        />

        <PasswordField
          id="password"
          label="Password"
          placeholder="Enter your password"
          value={registerData.password}
          onChange={(value) => handleInputChange("password", value)}
          error={validationErrors.password}
          required
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={registerData.confirmPassword}
          onChange={(value) => handleInputChange("confirmPassword", value)}
          error={validationErrors.confirmPassword}
          required
        />

        <Button type="submit" className="w-full" style={{ backgroundColor: "#8B5CF6" }}>
          <UserPlus className="w-4 h-4 mr-2" />
          Create Account
        </Button>
      </form>
    </AuthLayout>
  )
}
