"use client"

import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { AlertCircle } from "lucide-react"
import React from "react"

interface OTPInputProps {
  value: string[]
  onChange: (otp: string[]) => void
  error?: string
  length?: number
}

export function OTPInput({ value, onChange, error, length = 6 }: OTPInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  const handleOtpChange = (index: number, inputValue: string) => {
    if (inputValue.length > 1) return // Only allow single digit

    const newOtp = [...value]
    newOtp[index] = inputValue
    onChange(newOtp)

    // Auto-focus next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, length)
    const newOtp = [...value]

    for (let i = 0; i < pastedData.length && i < length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i]
      }
    }

    onChange(newOtp)
  }

  return (
    <div className="space-y-2">
      <Label className="text-center block">Enter {length}-digit code</Label>
      <div className="flex justify-center gap-2">
        {Array.from({ length }).map((_, index) => (
          <Input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`w-12 h-12 text-center text-lg font-semibold ${error ? "border-red-500" : ""}`}
            required
          />
        ))}
      </div>
      {error && (
        <div className="flex items-center justify-center text-red-500 text-sm mt-2">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  )
}
