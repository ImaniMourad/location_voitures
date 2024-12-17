"use client";

import axios from "axios";
import { use, useState } from "react";
import Spinner from "@/components/ui/spinner";
import OTPInput from "@/components/otp-input";
import NewPasswordInput from "@/components/new-password-input";
import Alert from "@/components/ui/alert";
import { useRouter } from "next/navigation";

type AlertType = {
  visible: boolean;
  message: string;
  type_alert: "" | "success" | "error";
};

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAlertVisible, setIsAlertVisible] = useState<AlertType>({
    visible: false,
    message: "",
    type_alert: "",
  });
  const [step, setStep] = useState<"otp" | "new-password" | "">("");

  // Envoi de l'OTP
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setIsAlertVisible({ visible: false, message: "", type_alert: "" });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(`${apiUrl}/send-otp`, null, {
        params: { email },
      });

      if (response.status === 200) {
        setIsAlertVisible({
          visible: true,
          message: "OTP has been sent to your email.",
          type_alert: "success",
        });
        setStep("otp");
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setIsAlertVisible({
          visible: true,
          message: "Email not found.",
          type_alert: "error",
        });
      } else {
        setIsAlertVisible({
          visible: true,
          message:
            error.response?.data?.message || "Error sending OTP to your email.",
          type_alert: "error",
        });
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setIsAlertVisible({ visible: false, message: "", type_alert: "" });
      }, 2500);
    }
  };

  // Vérification de l'OTP
  const handleOTPComplete = (code: string) => {
    const verifyOTP = async () => {
      setIsLoading(true);
      setIsAlertVisible({ visible: false, message: "", type_alert: "" });

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.post(`${apiUrl}/verify-otp`, null, {
          params: { email, otp: code },
        });

        if (response.status === 200) {
          setStep("new-password");
          setIsAlertVisible({
            visible: true,
            message: "OTP verified successfully. Enter your new password.",
            type_alert: "success",
          });
        }
      } catch (error: any) {
        setIsAlertVisible({
          visible: true,
          message:
            error.response?.data?.message ||
            "Error verifying OTP. Please try again.",
          type_alert: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyOTP();
  };

  // Réinitialisation du mot de passe
  const handlePasswordReset = (newPassword: string) => {
    const resetPassword = async () => {
      setIsLoading(true);
      setIsAlertVisible({ visible: false, message: "", type_alert: "" });

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.post(`${apiUrl}/reset-password`, null, {
          params: { email, password : newPassword },
        });

        if (response.status === 200) {
          setIsAlertVisible({
            visible: true,
            message: "Password reset successfully.",
            type_alert: "success",
          });
        }
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } catch (error: any) {
        setIsAlertVisible({
          visible: true,
          message:
            error.response?.data?.message ||
            "Error resetting password. Please try again.",
          type_alert: "error",
        });
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          setIsAlertVisible({ visible: false, message: "", type_alert: "" });
        }, 2500);
      }
    };

    resetPassword();
  };

  return (
    <>
      {isAlertVisible.visible && (
        <Alert
          type_alert={isAlertVisible.type_alert}
          message={isAlertVisible.message}
          onClose={() =>
            setIsAlertVisible({ visible: false, message: "", type_alert: "" })
          }
        />
      )}
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Spinner />
          </div>
        )}

        <div className="w-full max-w-md space-y-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-800/30 to-blue-800/30 opacity-50 blur-3xl"></div>
            <div className="relative">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white">
                  Reset Your Password
                </h1>
                <p className="mt-2 text-sm text-gray-300">
                  {step === "otp"
                    ? "we have sent an OTP to your email. Please enter the OTP to verify your email."
                    : step === "new-password"
                    ? "Enter your new password."
                    : "Enter your email to reset your password."}
                </p>
              </div>

              {step === "otp" ? (
                <OTPInput
                  length={6}
                  onComplete={handleOTPComplete}
                  className="mt-8"
                />
              ) : step === "new-password" ? (
                <NewPasswordInput
                  onSubmit={handlePasswordReset}
                  className="mt-8"
                />
              ) : (
                <section>
                  <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="py-2 md:py-2">
                      <form
                        className="mx-auto max-w-[400px]"
                        onSubmit={handleSubmit}
                      >
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
                            required
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
