'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  length?: number
  onComplete?: (code: string) => void
  className?: string
}

export default function OTPInput({
  length = 6,
  onComplete,
  className,
}: OTPInputProps) {
  const [code, setCode] = useState<string[]>(new Array(length).fill(''))
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const processInput = (e: React.ChangeEvent<HTMLInputElement>, slot: number) => {
    const num = e.target.value
    if (/[^0-9]/.test(num)) return
    const newCode = [...code]
    newCode[slot] = num
    setCode(newCode)
    if (slot !== length - 1 && num) {
      inputs.current[slot + 1]?.focus()
    }
  }

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, slot: number) => {
    if (e.key === 'Backspace' && !code[slot] && slot !== 0) {
      const newCode = [...code]
      newCode[slot - 1] = ''
      setCode(newCode)
      inputs.current[slot - 1]?.focus()
    }
  }

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  return (
  <div className={cn("flex flex-col space-y-4", className)}>
    <div className="text-sm text-gray-300">
      Enter the 6-digit code sent to your email
    </div>
    <div className="flex justify-center gap-2">
      {code.map((num, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={num}
          autoComplete="one-time-code"
          onChange={(e) => processInput(e, idx)}
          onKeyUp={(e) => onKeyUp(e, idx)}
          ref={(ref) => inputs.current[idx] = ref}
          className={cn(
            "h-12 w-12 rounded-lg border text-center text-2xl font-semibold",
            "bg-gray-800/50 border-gray-700 text-white",
            "focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none",
            "transition-all duration-200"
          )}
        />
      ))}
    </div>
    <button
      onClick={() => onComplete?.(code.join(''))}
      disabled={!code.every(num => num !== '')}
      className={cn(
        "w-full px-4 py-2 text-sm font-medium rounded-lg",
        "bg-purple-600 text-white",
        "hover:bg-purple-700",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-colors duration-200"
      )}
    >
      Verify Code
    </button>
  </div>
)
}

