"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"

interface AuthLayoutProps {
  title: string
  subtitle: string
  description: string | ReactNode
  icon: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export function AuthFormLayoutComponent({ title, subtitle, description, icon, children, footer }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
      }}
    >
      <div className="w-full max-w-5xl flex items-center justify-center">
        {/* Left side - Title */}
        <div className="hidden lg:flex flex-col items-start justify-center flex-1 text-white mr-16">
          <h1 className="text-6xl font-bold mb-4">
            Education
            <br />
            Platform
            <br />
            <span className="text-yellow-400">{title}</span>
          </h1>
        </div>

        {/* Right side - Form Card */}
        <div className="w-full max-w-md">
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  {icon}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">{subtitle}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              {children}
              {footer && <div className="mt-6">{footer}</div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
