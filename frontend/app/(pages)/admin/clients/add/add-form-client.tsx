"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/cards/card-profile";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Client {
  cin: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
}

interface AdminFormProps {
  handleAddClient: (newClient: any) => void;
  handleCancel: () => void;
  onErrorMessage: (message: string) => void;
}

export default function AdminForm({
  handleCancel,
  handleAddClient,
  onErrorMessage,
}: AdminFormProps) {

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [client, setClient] = useState<Client>({
    cin: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setClient((prevClient) => ({ ...prevClient, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("cin", client.cin);
    formData.append("firstname", client.firstname);
    formData.append("lastname", client.lastname);
    formData.append("email", client.email);
    formData.append("phone", client.phone);
    formData.append("address", client.address);

    console.log("formData", formData);

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("No token found");
      setLoading(false);
      router.push("/signin");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await axios.post(`${apiUrl}/vehicles`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        console.log("Client added successfully");
        handleAddClient(response.data);
        handleCancel();
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        onErrorMessage(error.response.data);
        handleCancel();
      } else {
        console.error("Error adding client:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg bg-slate-900 text-slate-100 border border-slate-800">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-2xl text-slate-100">
              Add Client
            </CardTitle>
            <button
              onClick={handleCancel}
              className="text-slate-500 hover:text-slate-100 text-[2em] "
            >
              ✕
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="cin"
                  className="block text-sm font-medium text-slate-200"
                >
                  CIN
                </label>
                <input
                  id="cin"
                  value={client.cin}
                  onChange={handleChange}
                  placeholder="Enter the CIN"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
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
                  value={client.firstname}
                  onChange={handleChange}
                  placeholder="Enter the first name"
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
                  value={client.lastname}
                  onChange={handleChange}
                  placeholder="Enter the last name"
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
                  value={client.email}
                  onChange={handleChange}
                  placeholder="Enter the email"
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
                  value={client.phone}
                  onChange={handleChange}
                  placeholder="Enter the phone number"
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
                value={client.address}
                onChange={handleChange}
                placeholder="Enter the address"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                Add Vehicle
              </Button>
              <Button
                variant="secondary"
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
