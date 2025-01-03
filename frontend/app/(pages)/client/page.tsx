"use client";
import PageIllustration from "@/components/page-illustration";
import { useState } from "react";

export default function ReservationForm() {
  const [formData, setFormData] = useState({
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
  });

  const handleChange = (e: { target: { id: any; value: any; }; }) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const departureDatetime = new Date(`${formData.departureDate}T${formData.departureTime}:00`);
    const arrivalDatetime = new Date(`${formData.arrivalDate}T${formData.arrivalTime}:00`);

    const formattedDeparture = departureDatetime.toISOString().slice(0, 19).replace('T', ' ');
    const formattedArrival = arrivalDatetime.toISOString().slice(0, 19).replace('T', ' ');
    
    window.location.href = `http://localhost:3000/client/vehicles?departureDateTime=${encodeURIComponent(formattedDeparture)}&arrivalDateTime=${encodeURIComponent(formattedArrival)}`;

    console.log({
      departureDateTime: formattedDeparture,
      arrivalDateTime: formattedArrival
    });
  };

  return (
    <>
    <PageIllustration />
    <br /><br /><br /><br /><br />
      <div className="text-center">
        <div className="inline-flex items-center gap-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
          <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
            Our Services
          </span>
        </div>
        <br />
        <br />
        <h1 className="text-center animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-5xl font-semibold text-transparent md:text-2xl">
          Reserve your car right now
        </h1>
      </div>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="mx-auto max-w-6xl relative">
          <div className="absolute inset-0 bg-gray-900 animate-pulse opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 opacity-90"></div>
          <div className="relative z-10 p-6 rounded-lg backdrop-blur-sm bg-gray-900/80 shadow-xl border border-gray-800">
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div className="transform transition duration-200 hover:scale-[1.01]">
                <label htmlFor="departureDate" className="block mb-2 text-sm font-medium text-gray-200">
                  Departure date
                </label>
                <input
                  type="date"
                  id="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 hover:bg-gray-600 transition-colors duration-200"
                  required
                />
              </div>
              <div className="transform transition duration-200 hover:scale-[1.01]">
                <label htmlFor="departureTime" className="block mb-2 text-sm font-medium text-gray-200">
                  Departure time
                </label>
                <input
                  type="time"
                  id="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 hover:bg-gray-600 transition-colors duration-200"
                  required
                />
              </div>
              <div className="transform transition duration-200 hover:scale-[1.01]">
                <label htmlFor="arrivalDate" className="block mb-2 text-sm font-medium text-gray-200">
                  Arrival date
                </label>
                <input
                  type="date"
                  id="arrivalDate"
                  value={formData.arrivalDate}
                  onChange={handleChange}
                  className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 hover:bg-gray-600 transition-colors duration-200"
                  required
                />
              </div>
              <div className="transform transition duration-200 hover:scale-[1.01]">
                <label htmlFor="arrivalTime" className="block mb-2 text-sm font-medium text-gray-200">
                  Arrival time
                </label>
                <input
                  type="time"
                  id="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 hover:bg-gray-600 transition-colors duration-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition-all duration-200 hover:scale-[1.02] hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search reservations
            </button>
          </div>
        </div>
      </form>
    </>
  );
}