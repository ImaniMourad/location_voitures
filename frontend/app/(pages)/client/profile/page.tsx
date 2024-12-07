"use client";
import { useState } from "react";
import CustomerProfile from "@/components/profileClient";
import EditProfile from "../../../../components/edit-profile";

export default function ProfilePage() {
  const customerData = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Casablanca, Morocco",
    membership: "Premium",
    photo: "/images/default-avatar.png",
  };

  const [isEditFormVisible, setIsEditFormVisible] = useState(false);

  return (
    <div>
      {!isEditFormVisible ? (
        <CustomerProfile customer={customerData} setIsEditFormVisible={setIsEditFormVisible} />
      ) : (
        <EditProfile setIsEditFormVisible={setIsEditFormVisible} />
      )}
    </div>
  );
}
