"use client";

import { useState } from "react";
import axios from "axios";
import Spinner from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

interface FormAddProps {
  handleCancel: () => void;
  onAddVehicle: (vehicleData: any) => void;
  onErrorMessage: (message: string) => void;
}

export default function FormAdd({ handleCancel, onAddVehicle , onErrorMessage}: FormAddProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [vehicleData, setVehicleData] = useState({
    licensePlate: "",
    brand: "",
    model: "",
    year: 0,
    price: 0,
    status: "AVAILABLE",
    type: "",
    image: null as File | null,
    horsepower: 0,
    capacity: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVehicleData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("licensePlate", vehicleData.licensePlate);
    formData.append("brand", vehicleData.brand);
    formData.append("model", vehicleData.model);
    formData.append("year", vehicleData.year.toString());
    formData.append("type", vehicleData.type);
    formData.append("status", vehicleData.status);
    formData.append("price", vehicleData.price.toString());
    formData.append("horsePower", vehicleData.horsepower.toString());
    formData.append("capacity", vehicleData.capacity.toString());
    formData.append("image", vehicleData.image!);

    console.log(vehicleData);

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
        console.log("Vehicle added successfully");
        onAddVehicle(vehicleData);
        handleCancel();
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        onErrorMessage(error.response.data);
        handleCancel();
      } else {
        console.error("Error adding vehicle:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg bg-slate-900 text-slate-100 rounded-lg shadow-xl animate-fade-in-up">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-100">Add Vehicle</h2>
          <button
            onClick={handleCancel}
            className="text-slate-500 hover:text-slate-100 text-[2em] "
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="licensePlate"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                License Plate
              </label>
              <input
                id="licensePlate"
                name="licensePlate"
                type="text"
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Model
              </label>
              <input
                id="model"
                name="model"
                type="text"
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Brand
              </label>
              <input
                id="brand"
                name="brand"
                type="text"
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Year
              </label>
              <input
                id="year"
                name="year"
                type="number"
                min={1900}
                max={3000}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="Price"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Price
              </label>
              <input
                id="Price"
                name="price"
                type="number"
                min={0}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onChange={handleInputChange}
              >
                <option value="AVAILABLE" selected>
                  Available
                </option>
                <option value="RESERVED">Reserved</option>
                <option value="IN_MAINTENANCE">In Maintenance</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Type
              </label>
              <input
                id="type"
                name="type"
                type="text"
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="horsepower"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Horsepower
              </label>
              <input
                id="horsepower"
                name="horsepower"
                type="number"
                min={0}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Capacity
              </label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                min={0}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Image
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? <Spinner /> : "Add Vehicle"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
