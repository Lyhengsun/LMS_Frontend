"use client"

import { ForgotPasswordDialog } from "@/components/forgot-password-dialog"
import { AuthLayout } from "@/components/layout/auth-layout"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FormField } from "@/components/ui/custom/form-field"
import { PasswordField } from "@/components/ui/custom/password-field"
import { GraduationCap, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import React from "react"

const LoginPageComponent = () => {
  const [loginData, setLoginData] = React.useState({ email: "", password: "" })
  const [rememberMe, setRememberMe] = React.useState(false)
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = React.useState(false)
  const [validationErrors, setValidationErrors] = React.useState({
    email: "",
    password: "",
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
  }

  const handleInputChange = (field: string, value: string) => {
    setLoginData({ ...loginData, [field]: value })
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors({ ...validationErrors, [field]: "" })
    }
  }

  return (
    <>
      <AuthLayout
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
        <form onSubmit={handleLogin} className="space-y-4">
          <FormField
            id="email"
            label="Email or Username"
            type="email"
            placeholder="Email or Username"
            value={loginData.email}
            onChange={(value) => handleInputChange("email", value)}
            error={validationErrors.email}
            required
          />

          <PasswordField
            id="password"
            label="Password"
            placeholder="Password"
            value={loginData.password}
            onChange={(value) => handleInputChange("password", value)}
            error={validationErrors.password}
            required
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
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

          <Button type="submit" className="w-full" style={{ backgroundColor: "#8B5CF6" }}>
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </form>
      </AuthLayout>

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen} />
    </>
  )
}

export default LoginPageComponent
