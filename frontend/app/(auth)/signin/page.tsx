"use client";

import { useState, FormEvent, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Spinner from "@/components/ui/spinner";
import Alert from "@/components/ui/alert";
import { jwtDecode } from "jwt-decode";
import router from "next/router";


interface FormData {
  email: string;
  password: string;
}






export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState({
    visible: false,
    message: "",
    type_alert: "" as "" | "success" | "error",
  });

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      const decoded = jwtDecode(jwtToken);
      const userType = (decoded as { user_type: string }).user_type;
      if (userType === "Client") {
        router.push("/client");
      } else if (userType === "Admin") {
        router.push("/admin/statistics");
      }
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const data: FormData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await axios.post(`${apiUrl}/login`, { email, password });


      const token = response.data;

      if (!token) throw new Error("Token not found in response headers");

      // Sauvegarder le token
      localStorage.setItem("jwtToken", token);
      const decoded = jwtDecode(token);
      const userType = (decoded as { user_type: string }).user_type;
      if (userType === "Client") {
        router.push("/client");
      } else if (userType === "Admin") {
        router.push("/admin/statistics");
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setIsAlertVisible({
        visible: true,
        message: "Login failed. Please try again.",
        type_alert: "error",
      });
      setTimeout(() => {
        setIsAlertVisible({ visible: false, message: "", type_alert: "" });
      }, 2500);
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}
      {isAlertVisible.visible && (
        <Alert
          message={isAlertVisible.message}
          type_alert={isAlertVisible.type_alert} />
      )}
      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="py-12 md:py-20">
            {/* Section header */}
            <div className="pb-12 text-center">
              <h1 className="text-3xl font-semibold text-transparent md:text-4xl bg-gradient-to-r from-gray-200 via-indigo-200 to-gray-50 bg-clip-text">
                Welcome back
              </h1>
            </div>
            {/* Contact form */}
            <form onSubmit={handleSubmit} className="mx-auto max-w-[400px]">
              <div className="space-y-5">
                <div>
                  <label
                    className="mb-1 block text-sm font-medium text-indigo-200/65"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="form-input w-full"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-indigo-200/65"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="form-input w-full"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-right">
                  <Link
                    className="text-sm text-gray-600 hover:underline hover:text-blue-500"
                    href="/reset-password"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-6 space-y-5">
                <button
                  type="submit"
                  className="btn w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign in
                </button>
                <div className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    className="text-indigo-500 hover:underline"
                    href="/signup"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
