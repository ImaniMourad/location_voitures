'use client'

import React, { useState } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import Link from 'next/link'

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle password reset logic here
        console.log('Password reset requested for:', email)
    }

    return (
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-white text-center mb-6">Forgot Password</h1>
            <p className="text-gray-300 text-center mb-6">
                Enter your email address and we&#39;ll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-blue-100 text-gray-900 placeholder-gray-500 rounded-md"
                        required
                    />
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                    Send Reset Link
                </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-400">
                Remember your password?{' '}
                <Link href="/sign-in" className="text-white hover:underline">
                    Back to Login
                </Link>
            </div>
        </div>
    )
}

