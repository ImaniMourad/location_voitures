"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/cards/card-profile";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Reservation {
  id: number;
  clientId: string;
  vehicleId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  paid_at: string;
}

interface ReservationFormProps {
  handleAddReservation: (newReservation: Reservation) => void;
  handleCancel: () => void;
  onErrorMessage: (message: string) => void;
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

export default function ReservationForm({
  handleAddReservation,
  handleCancel,
  onErrorMessage,
}: ReservationFormProps) {
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<Reservation>({
    id: 0,
    clientId: "",
    vehicleId: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    paid_at: "",
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

  // use effect to get all cars and clients from the database
  useEffect(() => {}, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg bg-slate-900 text-slate-100 border border-slate-800">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-2xl text-slate-100">
              Add Reservation
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white"
              onClick={handleCancel}
            >
              <X className="h-5 w-5" />
            </Button>
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
            <Select
              onValueChange={(value) =>
                setReservation((prevReservation) => ({
                  ...prevReservation,
                  clientId: value,
                }))
              }
              required
              name="client"
            >
              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100 focus:ring-slate-400 focus:border-slate-400">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {filteredClients.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="vehicle"
              className="block text-sm font-medium text-slate-200"
            >
              Vehicle
            </label>
            <Select
              onValueChange={(value) =>
                setReservation((prevReservation) => ({
                  ...prevReservation,
                  vehicleId: value,
                }))
              }
              required
              name="vehicle"
            >
              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100 focus:ring-slate-400 focus:border-slate-400">
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {filteredCars.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                    {vehicle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-slate-200"
            >
              Start Date
            </label>
            <div className="flex space-x-2">
              <input
                id="startDate"
                type="date"
                required
                value={reservation.startDate}
                onChange={handleChange}
                className="w-1/2 px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <input
                id="startTime"
                type="time"
                required
                value={reservation.startTime}
                onChange={handleChange}
                className="w-1/2 px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-slate-200"
            >
              End Date
            </label>
            <div className="flex space-x-2">
              <input
                id="endDate"
                type="date"
                required
                value={reservation.endDate}
                onChange={handleChange}
                className="w-1/2 px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <input
                id="endTime"
                type="time"
                required
                value={reservation.endTime}
                onChange={handleChange}
                className="w-1/2 px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
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
      </Card>
    </div>
  );
}
