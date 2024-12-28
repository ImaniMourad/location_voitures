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
import axios from "axios";

interface Reservation {
  id: number;
  clientId: string;
  vehicleId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  paid_at: string;
  price: string;
}

interface Client {
  cin: string;
  firstName: string;
  lastName: string;
}

interface Vehicle {
  licensePlate: string;
  model: string;
  brand: string;
  year: string;
  price: number;
}

interface ReservationFormProps {
  handleAddReservation: (newReservation: Reservation) => void;
  handleCancel: () => void;
  onErrorMessage: (message: string) => void;
}

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
    price: "00.00",
  });

  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setReservation((prevReservation) => ({ ...prevReservation, [id]: value }));
  };

  // useEffect to fetch clients and vehicles
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("API URL is not configured.");
    }

    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          return;
        }

        const response = await axios.get(`${apiUrl}/clients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("-------clients----------");
        console.log(response.data);
        setFilteredClients(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          return;
        }

        const response = await axios.get(`${apiUrl}/vehicles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("-------vehicles----------");
        console.log(response.data);
        setFilteredVehicles(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClients();
    fetchVehicles();
  }, []);

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

      console.log("-------reservation----------");
      console.log(reservation)

      // const response = await axios.post(
      //   `${apiUrl}/reservation`,
      //   reservation,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      // if (response.status === 201) {
      //   handleAddReservation(response.data);
      // }
    } catch (error: any) {
      onErrorMessage(error.response?.data || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateTotal = () => {
    // calculate nbr des jours bewteen start and end date si je depasse 24h je dois payer un jour de plus
    const startDate = new Date(reservation.startDate + "T" + reservation.startTime);
    const endDate = new Date(reservation.endDate + "T" + reservation.endTime);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffDays);
    // get vehicle price
    const vehicle = filteredVehicles.find(
      (vehicle) => vehicle.licensePlate === reservation.vehicleId
    );


    if (vehicle) {
      const price = vehicle.price * diffDays;
      setReservation((prevReservation) => ({
        ...prevReservation,
        price: price.toFixed(2),
      }));
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
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="clientId"
                className="block text-sm font-medium text-slate-200"
              >
                Client
              </label>
              <input
                id="clientId"
                list="clients"
                required
                value={reservation.clientId}
                onChange={handleChange}
                className="w-full px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Select client"
              />
              <datalist id="clients">
                {filteredClients.map((client) => (
                  <option key={client.cin} value={client.cin}>
                    {client.firstName + " " + client.lastName}
                  </option>
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="vehicleId"
                className="block text-sm font-medium text-slate-200"
              >
                Vehicle
              </label>
              <input
                id="vehicleId"
                list="vehicles"
                required
                value={reservation.vehicleId}
                onChange={handleChange}
                className="w-full px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Select vehicle"
              />
              <datalist id="vehicles">
                {filteredVehicles.map((vehicle) => (
                  <option key={vehicle.licensePlate} value={vehicle.licensePlate}>
                    {vehicle.licensePlate + "/" + vehicle.brand + "-" + vehicle.model + "-" + vehicle.year}
                  </option>
                ))}
              </datalist>
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
            <div className="space-y-2">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-slate-200"
              >
                Price
              </label>
              <div className="flex space-x-2">
                <input
                  id="price"
                  type="text"
                  value={reservation.price}
                  disabled
                  className="w-full px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Button
                  type="button"
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={handleCalculateTotal}
                >
                  Calculate Total
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="secondary"
                className="bg-slate-700 text-slate-200 hover:bg-slate-800"
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
