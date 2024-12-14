"use client"; // Add this directive at the top of the file

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Checkbox from "@/components/ui/checkBox";
import SuccessAlert from "@/components/ui/successAlert";
import axios from "axios";

export default function RegisterForm() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(true);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      cin: formData.get("cin"),
      firstName: formData.get("first-name"),
      lastName: formData.get("last-name"),
      phoneNumber: formData.get("phone"),
      address: formData.get("address"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      console.log("Registering user:", data);
      const response = await axios.post("http://localhost:8080/register", data);
      if (response.status === 201) {
        setIsAlertVisible(true);
        setTimeout(() => {
          setIsAlertVisible(false);
          // Redirect to sign-in page
          router.push("/signin");
        }, 2500);
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  }

  return (
    <>
      {/* Success alert */}
      {isAlertVisible && <SuccessAlert message="Account created successfully" />}
      {/* ---- */}
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto px-4 sm:px-6 w-full max-w-[600px]"
      >
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Create an Account
            </h1>
          </div>
          {/* Contact form */}
          <div className="mx-auto max-w-[800px] space-y-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-1 block text-sm font-medium text-indigo-200/65"
                  htmlFor="cin"
                >
                  CIN<span className="text-red-500">*</span>
                </label>
                <input
                  id="cin"
                  name="cin"
                  type="text"
                  className="form-input"
                  placeholder="Your CIN"
                  required
                  style={{ width: `calc(100% - 0.5rem)` }}
                  minLength={6}
                  pattern="[A-Za-z0-9]{6,}"
                  title="CIN must be at least 6 characters long and contain only letters and numbers"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-1 block text-sm font-medium text-indigo-200/65"
                  htmlFor="first-name"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  className="form-input w-full"
                  placeholder="Your first name"
                  required
                  maxLength={50}
                  pattern="[A-Za-z-]+"
                  title="First name must contain only letters and hyphens"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-1 block text-sm font-medium text-indigo-200/65"
                  htmlFor="last-name"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  className="form-input w-full"
                  placeholder="Your last name"
                  required
                  maxLength={50}
                  pattern="[A-Za-z]+"
                  title="Last name must contain only letters"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-1 block text-sm font-medium text-indigo-200/65"
                  htmlFor="phone"
                >
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  className="form-input w-full"
                  placeholder="Your phone number"
                  required
                  pattern="^(\+?\d{1,4})?\s?\(?\d{1,4}\)?[\s\-]?\d{1,4}[\s\-]?\d{1,4}$"
                  title="Phone number must be at least 10 digits and can start with an optional country code"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-1 block text-sm font-medium text-indigo-200/65"
                  htmlFor="address"
                >
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="form-input w-full"
                  placeholder="Your address"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-1 block text-sm font-medium text-indigo-200/65"
                  htmlFor="email"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input w-full"
                  placeholder="Your email address"
                  required
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  className="block text-sm font-medium text-indigo-200/65 mb-1"
                  htmlFor="password"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-input w-full"
                  placeholder="Password (minimum 8 characters)"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label
                className="text-sm font-medium text-indigo-200/65"
                htmlFor="terms"
              >
                I am at least 18 years old
              </label>
            </div>
            <div className="mt-6 space-y-5">
              <button
                type="submit"
                className="btn w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]"
                disabled={!isChecked}
                style={{ color: isChecked ? "white" : "gray" }}
              >
                Sign Up
              </button>
              <div className="flex items-center gap-3 text-center text-sm italic text-gray-600 before:h-px before:flex-1 before:bg-gradient-to-r before:from-transparent before:via-gray-400/25 after:h-px after:flex-1 after:bg-gradient-to-r after:from-transparent after:via-gray-400/25">
                or
              </div>
              <button className="btn relative w-full bg-gradient-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%]">
                Sign Up with Google
              </button>
            </div>
            {/* Bottom link */}
            <div className="mt-6 text-center text-sm text-indigo-200/65">
              Already have an account?{" "}
              <Link className="font-medium text-indigo-500" href="/signin">
                Sign In
              </Link>
            </div>
          </div>
          {/* ---- */}
        </div>
      </form>
    </>
  );
}
