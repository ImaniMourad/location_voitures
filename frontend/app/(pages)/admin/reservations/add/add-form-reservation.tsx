"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/cards/card-profile";

interface Reservation {
  client: string;
  vehicle: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface AdminFormProps {
  handleAddReservation: (newReservation: Reservation) => void;
  handleCancel: () => void;
}

const cars = [
  { id: 1, name: "Renault Clio" },
  { id: 2, name: "Peugeot 3008" },
  { id: 3, name: "Citroën C3" },
  { id: 4, name: "BMW Série 5" },
];

const clients = [
  { id: 1, name: "Jean Dupont" },
  { id: 2, name: "Marie Martin" },
  { id: 3, name: "Pierre Durand" },
  { id: 4, name: "Sophie Lefebvre" },
];

export default function AdminForm({
  handleAddReservation,
  handleCancel,
}: AdminFormProps) {
  const [reservation, setReservation] = useState<Reservation>({
    client: "",
    vehicle: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  const [filteredClients, setFilteredClients] = useState(clients);
  const [filteredCars, setFilteredCars] = useState(cars);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setReservation((prevReservation) => ({ ...prevReservation, [id]: value }));

    if (id === "client") {
      setFilteredClients(
        clients.filter((client) =>
          client.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else if (id === "vehicle") {
      setFilteredCars(
        cars.filter((car) =>
          car.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg bg-slate-900 text-slate-100 border border-slate-800">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-2xl text-slate-100">
              Add Reservation
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
          <div className="space-y-2">
            <label
              htmlFor="client"
              className="block text-sm font-medium text-slate-200"
            >
              Client
            </label>
            <select
              id="client"
              value={reservation.client}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select client</option>
              {filteredClients.map((client) => (
                <option key={client.id} value={client.name}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="vehicle"
              className="block text-sm font-medium text-slate-200"
            >
              Vehicle
            </label>
            <select
              id="vehicle"
              value={reservation.vehicle}
              required
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select vehicle</option>
              {filteredCars.map((car) => (
                <option key={car.id} value={car.name}>
                  {car.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-slate-200"
            >
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              required
              value={reservation.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-slate-200"
            >
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              required
              value={reservation.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-slate-200"
            >
              Status
            </label>
            <select
              id="status"
              value={reservation.status}
              required
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              onClick={() => handleAddReservation(reservation)}
            >
              Save
            </button>
            <button
              className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
