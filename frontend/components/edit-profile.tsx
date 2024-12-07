"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./cards/card-profile"

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  membership: string;
  photo: string;
  password: string;
}

export default function AdminForm({setIsEditFormVisible }: { setIsEditFormVisible: (value: boolean) => void }) {
  const [user, setUser] = useState<User>({
    id: 1,
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Casablanca, Morocco",
    membership: "Premium",
    photo: "/images/default-avatar.png",
    password: "password",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [id]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUser((prevUser) => ({
        ...prevUser,
        photo: URL.createObjectURL(file),
      }));
    }
  };

  const togglePasswordVisibility = () => {
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 z-50 fixed inset-0">
      <Card className="w-full max-w-lg bg-slate-900 text-slate-100 border border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-100">
            Edit Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-slate-200"
              >
                First Name
              </label>
              <input
                id="firstname"
                value={user.firstname}
                onChange={handleChange}
                placeholder="Enter your first name"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-slate-200"
              >
                Last Name
              </label>
              <input
                id="lastname"
                value={user.lastname}
                onChange={handleChange}
                placeholder="Enter your last name"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2 flex-1">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-slate-200"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={user.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-slate-200"
            >
              Address
            </label>
            <input
              id="address"
              value={user.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-200"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                onClick={togglePasswordVisibility}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="photo"
              className="block text-sm font-medium text-slate-200"
            >
              Photo
            </label>
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              onChange={handleImageChange}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              onClick={() => console.log("Save Changes", user)}
            >
              Save Changes
            </button>
            <button
              className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              onClick={() => setIsEditFormVisible(false)}
            >
              Cancel
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
