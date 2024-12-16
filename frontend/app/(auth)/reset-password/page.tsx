"use client";
import axios from "axios";
import { useState } from "react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log("API URL:",`${apiUrl}/send-email`);
      const response = await axios.post(`${apiUrl}/send-email`, { email });

      if (response.status !== 200) {
        throw new Error("Failed to reset password");
      }

      console.log("Password reset email sent successfully:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Reset Your Password
            </h1>
          </div>
          <form className="mx-auto max-w-[400px]" onSubmit={handleSubmit}>
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
                className="form-input w-full"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="btn w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
