'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'

interface NewPasswordInputProps {
  onSubmit: (password: string) => void
  className?: string
}

export default function NewPasswordInput({ onSubmit, className }: NewPasswordInputProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    setError('')
    onSubmit(password)
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col space-y-4", className)}>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-300">
          New Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(
              "w-full px-3 py-2 text-sm rounded-lg",
              "bg-gray-800/50 border border-gray-700 text-white",
              "focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none",
              "transition-all duration-200"
            )}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="confirm-password" className="text-sm font-medium text-gray-300">
          Confirm New Password
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={cn(
            "w-full px-3 py-2 text-sm rounded-lg",
            "bg-gray-800/50 border border-gray-700 text-white",
            "focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none",
            "transition-all duration-200"
          )}
          required
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        className={cn(
          "w-full px-4 py-2 text-sm font-medium rounded-lg",
          "bg-purple-600 text-white",
          "hover:bg-purple-700",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors duration-200"
        )}
      >
        Reset Password
      </button>
    </form>
  )
}

