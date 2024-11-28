"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Link from "next/link";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempted with:", { username, password });
  };

  return (
    <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-blue-100 text-gray-900 placeholder-gray-500 rounded-md"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-blue-100 text-gray-900 placeholder-gray-500 rounded-md"
          />
        </div>
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-300 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign in
        </Button>
      </form>
      <div className="mt-8 flex items-center">
        <hr className="flex-grow border-t border-gray-600" />
        <span className="px-4 text-sm text-gray-400">
          Login with social accounts
        </span>
        <hr className="flex-grow border-t border-gray-600" />
      </div>
      <div className="mt-6 text-center text-sm text-gray-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-white hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
