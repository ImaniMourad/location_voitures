"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Checkbox from "@/components/ui/checkBox";
import Alert from "@/components/ui/alert";
import Spinner from "@/components/ui/spinner";
import axios from "axios";

interface FormData {
  cin: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  password: string;
}

const InputField = ({
  id,
  name,
  type,
  placeholder,
  required,
  pattern,
  title,
  maxLength,
  minLength,
}: {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
  pattern?: string;
  title?: string;
  maxLength?: number;
  minLength?: number;
}) => (
  <input
    id={id}
    name={name}
    type={type}
    className="form-input w-full"
    placeholder={placeholder}
    required={required}
    pattern={pattern}
    title={title}
    maxLength={maxLength}
    minLength={minLength}
  />
);

export default function RegisterForm() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState({
    visible: false,
    message: "",
    type_alert: "" as "" | "success" | "error",
  });

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: FormData = {
      cin: formData.get("cin") as string,
      firstName: formData.get("first-name") as string,
      lastName: formData.get("last-name") as string,
      phoneNumber: formData.get("phone") as string,
      address: formData.get("address") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      console.log("Registering user:", data);
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(`${apiUrl}/register`, data);
      if (response.status === 201) {
        setIsAlertVisible({
          visible: true,
          message: "Account created successfully",
          type_alert: "success",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        setIsLoading(false);
        setTimeout(() => {
          setIsAlertVisible({
            visible: false,
            message: "",
            type_alert: "",
          });
          router.push("/signin");
        }, 2500);
      }
    } catch (error) {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsAlertVisible({
        visible: true,
        message: "An error occurred. Invalid input data",
        type_alert: "error",
      });
      setTimeout(() => {
        setIsAlertVisible({
          visible: false,
          message: "An error occurred. Invalid input data",
          type_alert: "error",
        });
      }, 2500);
      console.error("Error registering user:", error);
    }
  }

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
          type_alert={isAlertVisible.type_alert}
          onClose={() =>
            setIsAlertVisible({ visible: false, message: "", type_alert: "" })
          }
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="mx-auto px-4 sm:px-6 w-full max-w-[600px]"
      >
        <div className="py-12 md:py-20">
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Create an Account
            </h1>
          </div>
          <div className="mx-auto max-w-[800px] space-y-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-1 block text-sm font-medium text-indigo-200/65"
                  htmlFor="cin"
                >
                  CIN<span className="text-red-500">*</span>
                </label>
                <InputField
                  id="cin"
                  name="cin"
                  type="text"
                  placeholder="Your CIN"
                  required
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
                <InputField
                  id="first-name"
                  name="first-name"
                  type="text"
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
                <InputField
                  id="last-name"
                  name="last-name"
                  type="text"
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
                <InputField
                  id="phone"
                  name="phone"
                  type="text"
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
                <InputField
                  id="address"
                  name="address"
                  type="text"
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
                <InputField
                  id="email"
                  name="email"
                  type="email"
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
                <InputField
                  id="password"
                  name="password"
                  type="password"
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
            <div className="mt-6 text-center text-sm text-indigo-200/65">
              Already have an account?{" "}
              <Link className="font-medium text-indigo-500" href="/signin">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
