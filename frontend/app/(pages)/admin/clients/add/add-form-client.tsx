"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Client {
  cin: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
}

interface AdminFormProps {
  handleAddClient: (newClient: any) => void;
  handleCancel: () => void;
  onErrorMessage: (message: string) => void;
}

export default function AddClientForm({
  handleCancel,
  handleAddClient,
  onErrorMessage,
}: AdminFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [client, setClient] = useState<Client>({
    cin: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setClient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("You need to be signed in to perform this action.");
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

      console.log(client);
      const response = await axios.post(
        `${apiUrl}/client`,
        client, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        handleAddClient(response.data);
      }
    } catch (error: any) {
      onErrorMessage(error.response.data || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 overflow-y-auto ml-0 z-40">
      <Card className="w-full max-w-lg bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-2xl font-bold text-white">
            Add Client
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white"
            onClick={handleCancel}
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cin" className="text-white">
                CIN
              </Label>
              <Input
                id="cin"
                name="cin"
                placeholder="Enter the CIN"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                onChange={handleInputChange}
                value={client.cin}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Enter the first name"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  onChange={handleInputChange}
                  value={client.firstName}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Enter the last name"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  onChange={handleInputChange}
                  value={client.lastName}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter the email"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  onChange={handleInputChange}
                  value={client.email}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white">
                  phoneNumber
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter the phoneNumber"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  onChange={handleInputChange}
                  value={client.phoneNumber}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-white">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                placeholder="Enter the address"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                onChange={handleInputChange}
                value={client.address}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="secondary"
                className="bg-slate-700 text-white hover:bg-slate-600"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
