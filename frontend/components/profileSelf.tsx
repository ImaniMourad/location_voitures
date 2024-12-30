"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badger";
import { useTheme } from "@/context/context";

interface Customer {
  cin: string;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  password?: string;
}

type AlertType = {
  visible: boolean;
  message: string;
  type_alert: "" | "success" | "error";
};

export default function CustomerProfile({
  customer,
  setCustomer,
  handleEditClick,
  setShowProfile,
}: {
  customer: Customer;
  setCustomer: any;
  handleEditClick: any;
  setShowProfile: any;
}) {
  const [error, setError] = useState<string | null>(null);
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();
  const [isAlertVisible, setIsAlertVisible] = useState<AlertType>({
    visible: false,
    message: "",
    type_alert: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedCustomer) {
      setEditedCustomer({ ...editedCustomer, [name]: value });
    }
  };

  const handleSaveChanges = async () => {
    if (!editedCustomer) return;

    try {
      const jwtToken = localStorage.getItem("jwtToken");
      if (!jwtToken) {
        setError("Not authenticated. Please login again.");
        return;
      }

      const response = await fetch(
        `http://localhost:8081/User/${editedCustomer.cin}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(editedCustomer),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedCustomer = await response.json();
      setCustomer(updatedCustomer);
      setIsAlertVisible({
        visible: true,
        message: "Profile updated successfully",
        type_alert: "success",
      });
      setTimeout(() => {
        setIsAlertVisible({ visible: false, message: "", type_alert: "" });
      }, 2500);
    } catch (error) {
      console.error("Error saving changes:", error);
      setError("Failed to save changes");
      setIsAlertVisible({
        visible: true,
        message: "Failed to update profile",
        type_alert: "error",
      });
      setTimeout(() => {
        setIsAlertVisible({ visible: false, message: "", type_alert: "" });
      }, 2500);
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!customer) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <section className="bg-gray-800 rounded-lg shadow-lg">
      <div>
        <div className="flex items-center justify-center">
          <Card
            ref={cardRef}
            className={`w-full max-w-md shadow-2xl ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <CardContent className="">
              <div className="flex flex-col items-center pt-6">
                <div
                  className={`w-20 h-20 rounded-full overflow-hidden mb-4 border-2 ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <Image
                    src="/images/default-avatar.png"
                    width={80}
                    height={80}
                    alt={`${customer.firstName} ${customer.lastName}`}
                    className="object-cover"
                  />
                </div>

                <div className="text-center mb-6">
                  <h1
                    className={`text-xl font-bold mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {customer.firstName} {customer.lastName}
                  </h1>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      isDarkMode
                        ? "border-gray-700 text-gray-300"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {customer.cin}
                  </Badge>
                </div>

                <div
                  className={`w-full space-y-4 p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
                      }`}
                    >
                      <Mail
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-blue-400" : "text-blue-500"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {customer.email}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        isDarkMode ? "bg-green-900/30" : "bg-green-100"
                      }`}
                    >
                      <Phone
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-green-400" : "text-green-500"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {customer.phoneNumber}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        isDarkMode ? "bg-purple-900/30" : "bg-purple-100"
                      }`}
                    >
                      <MapPin
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-purple-400" : "text-purple-500"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {customer.address}
                    </span>
                  </div>
                </div>
                <button
                  className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-500 transition mt-6"
                  onClick={() => {
                    handleEditClick();
                  }}
                >
                  Edit Profile
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {isAlertVisible.visible && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-md ${
            isAlertVisible.type_alert === "success"
              ? "bg-green-500"
              : "bg-red-500"
          } text-white`}
        >
          {isAlertVisible.message}
        </div>
      )}
    </section>
  );
}
