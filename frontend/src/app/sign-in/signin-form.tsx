"use client";

import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Link from "next/link";

export default function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempted with:", { email, password });
  };

  return (
    <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Se connecter</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-blue-100 text-gray-900 placeholder-gray-500 rounded-md"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="mot de passe"
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
            Mot de passe oublié?
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Se connecter
        </Button>
      </form>
      <div className="mt-8 flex items-center">
        <hr className="flex-grow border-t border-gray-600" />
        <span className="px-4 text-sm text-gray-400">
          Ou connectez-vous avec vos réseaux sociaux
        </span>
        <hr className="flex-grow border-t border-gray-600" />
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        <Button
          variant="outline"
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Facebook
        </Button>
        <Button
          variant="outline"
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Google
        </Button>
      </div>
      <div className="mt-6 text-center text-sm text-gray-400">
        Vous n&apos;avez pas de compte?{" "}
        <Link href="/sign-up" className="text-white hover:underline">
          S&apos;inscrire
        </Link>
      </div>
    </div>
  );
}
