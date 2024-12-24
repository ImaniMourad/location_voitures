"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import CustomerProfile from "@/components/profileClient";
import { jwtDecode } from "jwt-decode";

interface Customer {
  cin: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

// Define the JWT token structure
interface JWTPayload {
  cin?: string;
  sub?: string;  // Common JWT claim that might contain the CIN
  // Add other possible fields from your JWT token
}

export default function ProfilePage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomerData() {
      try {
        // Get JWT token from localStorage
        const jwtToken = localStorage.getItem("jwtToken");
        if (!jwtToken) {
          setError("Not authenticated. Please login again.");
          return;
        }

        // Decode the token and handle potential errors
        let cin: string;
        try {
          const decodedToken = jwtDecode<JWTPayload>(jwtToken);
          
          // Check different possible locations of CIN in the token
          cin = decodedToken.cin || decodedToken.sub || '';
          
          if (!cin) {
            throw new Error("CIN not found in token");
          }
          
          console.log("CIN from JWT token:", cin);
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
          setError("Invalid authentication token");
          return;
        }

        // Fetch customer data
        const response = await fetch(`http://localhost:8081/User/${cin}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Use the full JWT token here, not just the CIN
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Customer = await response.json();
        setCustomer(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setError("Failed to load profile data");
      }
    }

    fetchCustomerData();
  }, []);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!customer) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <CustomerProfile
        customer={customer}
        setIsEditFormVisible={setIsEditFormVisible}
      />
      {isEditFormVisible && <div>Edit form goes here</div>}
    </div>
  );
}