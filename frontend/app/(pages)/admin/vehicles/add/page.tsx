"use client";

import { useState } from "react";

interface FormAddProps {
  setIsFormOpen: (isOpen: boolean) => void;
}

export default function FormAdd({ setIsFormOpen }: FormAddProps) {
  const [vehicleData, setVehicleData] = useState({
    brand: "",
    model: "",
    year: "",
    rental_rate: "",
    status: "",
    type: "",
    image: null as File | null,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Vehicle Data:", vehicleData);
    // Here, you would add the logic to send the data to the server
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg bg-slate-900 text-slate-100 rounded-lg shadow-xl animate-fade-in-up">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-100">
            Add a Vehicle
          </h2>
          <button
            onClick={() => setIsFormOpen(false)}
            className="text-slate-400 hover:text-slate-100"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <div className="grid grid-cols-2 gap-4">
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
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="rental_rate"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Rental Rate
              </label>
              <input
                id="rental_rate"
                name="rental_rate"
                type="number"
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
                <option value="">Select a status</option>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">In Maintenance</option>
              </select>
            </div>
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
          </div>
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
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Add Vehicle
            </button>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
