'use client'

import { useState } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import Link from 'next/link'

export default function SignupForm() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle sign up logic here
        console.log('Sign up attempted with:', { username, email, password, confirmPassword })
    }

    return (
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-white text-center mb-6">Sign Up</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-blue-100 text-gray-900 placeholder-gray-500 rounded-md"
                        required
                    />
                </div>
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
                <div>
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-blue-100 text-gray-900 placeholder-gray-500 rounded-md"
                        required
                    />
                </div>
                <div>
                    <Input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-blue-100 text-gray-900 placeholder-gray-500 rounded-md"
                        required
                    />
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                    Sign Up
                </Button>
            </form>
            <div className="mt-8 flex items-center">
                <hr className="flex-grow border-t border-gray-600" />
                <span className="px-4 text-sm text-gray-400">Or sign up with</span>
                <hr className="flex-grow border-t border-gray-600" />
            </div>
            <div className="mt-6 flex justify-center space-x-4">
                <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-700">
                    Facebook
                </Button>
                <Button variant="outline" className="bg-red-600 text-white hover:bg-red-700">
                    Google
                </Button>
            </div>
            <div className="mt-6 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link href="/sign-in" className="text-white hover:underline">
                    Log in
                </Link>
            </div>
        </div>
    )
}

