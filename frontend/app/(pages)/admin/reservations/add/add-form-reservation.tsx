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
import { DateTime } from "luxon";
import generatePDF from './generateDocument/invoice-document';



interface Reservation {
  id?: string;
  startTime: any;
  endTime: any;
  clientCIN: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  deletedAt: string;
  paidAt: string;
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
  handleAddReservation: (newReservation: any) => void;
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
    startTime: "",
    endTime: "",
    clientCIN: "",
    vehicleId: "",
    startDate: "",
    endDate: "",
    deletedAt: "",
    paidAt: "",
    price: "00.00",
  });

  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [inputsDisabled, setInputsDisabled] = useState(true);

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

    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    // Combine date and time for startDate and endDate
    const startDateTime = DateTime.fromISO(
      `${reservation.startDate}T${reservation.startTime}`
    ).toLocal().toFormat("yyyy-MM-dd'T'HH:mm:ss");
    const endDateTime = DateTime.fromISO(
      `${reservation.endDate}T${reservation.endTime}`
    ).toLocal().toFormat("yyyy-MM-dd'T'HH:mm:ss");
    const paidAt = DateTime.now().toLocal().toFormat("yyyy-MM-dd'T'HH:mm:ss");
  
    // Validate data
    if (
      !reservation.clientCIN ||
      !reservation.vehicleId ||
      !reservation.startDate ||
      !reservation.startTime ||
      !reservation.endDate ||
      !reservation.endTime
    ) {
      onErrorMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }
  
    // Validate startDate and endDate
    const today = DateTime.now().startOf("day");
    const startDate = DateTime.fromISO(reservation.startDate);
    const endDate = DateTime.fromISO(reservation.endDate);
  
    if (startDate < today || endDate < today) {
      onErrorMessage("Start Date and End Date must be greater than or equal to today's date.");
      setLoading(false);
      return;
    }
  
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("You must be logged in to perform this action.");
      }
  
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }
  
      const response = await axios.post(
        `${apiUrl}/reservation`,
        {
          clientCIN: reservation.clientCIN,
          vehicleId: reservation.vehicleId,
          startDate: startDateTime,
          endDate: endDateTime,
          paidAt: paidAt,
          deletedAt: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("API response:", response.data);
      handleAddReservation({
        client: `${filteredClients.find((client) => client.cin === reservation.clientCIN)?.firstName} ${filteredClients.find((client) => client.cin === reservation.clientCIN)?.lastName}`,
        id: response.data.id,
        vehicle: response.data.vehicle,
        startDate: response.data.startDate,
        endDate: response.data.endDate,
      });
  
      // Generate and download the PDF
      const fakeReservationData = {
        id: response.data.id, // Use the actual ID from the API response
        client: `${filteredClients.find((client) => client.cin === reservation.clientCIN)?.firstName} ${filteredClients.find((client) => client.cin === reservation.clientCIN)?.lastName}`,
        vehicle: `${filteredVehicles.find((vehicle) => vehicle.licensePlate === reservation.vehicleId)?.brand} ${filteredVehicles.find((vehicle) => vehicle.licensePlate === reservation.vehicleId)?.model} ${filteredVehicles.find((vehicle) => vehicle.licensePlate === reservation.vehicleId)?.year}`,
        startDate: startDateTime,
        endDate: endDateTime,
        price: reservation.price
      };

      await generatePDF();

    } catch (error) {
      console.log("Error during submission:", error);
      onErrorMessage("Failed to add reservation.");
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateTotal = () => {
    // calculate nbr des jours bewteen start and end date si je depasse 24h je dois payer un jour de plus
    const startDate = DateTime.fromISO(
      reservation.startDate + "T" + reservation.startTime
    );
    const endDate = DateTime.fromISO(
      reservation.endDate + "T" + reservation.endTime
    );
    const diffDays = endDate.diff(startDate, "days").days;
    console.log(diffDays);
    // get vehicle price
    const vehicle = filteredVehicles.find(
      (vehicle) => vehicle.licensePlate === reservation.vehicleId
    );

    if (vehicle) {
      const price = vehicle.price * diffDays || 0;
      setReservation((prevReservation) => ({
        ...prevReservation,
        price: price.toFixed(2),
      }));
    }
  };

  const getAvailableVehicles = async (startDate: string, endDate: string) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("You must be logged in to perform this action.");
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

      console.log("Fetching available vehicles...");
      console.log("startDate:", startDate);
      const response = await axios.get(`${apiUrl}/vehicles/available`, {
        params: {
          startDate,
          endDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching available vehicles:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchAvailableVehicles = async () => {
      if (
        reservation.startDate &&
        reservation.startTime &&
        reservation.endDate &&
        reservation.endTime
      ) {
        try {
          const startDateTime = DateTime.fromISO(
            `${reservation.startDate}T${reservation.startTime}`
          ).toLocal().toFormat("yyyy-MM-dd'T'HH:mm:ss");
          const endDateTime = DateTime.fromISO(
            `${reservation.endDate}T${reservation.endTime}`
          ).toLocal().toFormat("yyyy-MM-dd'T'HH:mm:ss");

          const availableVehicles = await getAvailableVehicles(
            startDateTime,
            endDateTime
          );
          setFilteredVehicles(availableVehicles);
          setReservation((prevReservation) => ({ ...prevReservation, vehicleId: "" }));
          setInputsDisabled(false); // Enable inputs after fetching vehicles
        } catch (error) {
          onErrorMessage("Failed to fetch available vehicles.");
        }
      }
    };

    fetchAvailableVehicles();
  }, [reservation.startDate, reservation.startTime, reservation.endDate, reservation.endTime]);

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
                htmlFor="clientCIN"
                className="block text-sm font-medium text-slate-200"
              >
                Client
              </label>
              <input
                id="clientCIN"
                list="clients"
                required
                value={reservation.clientCIN}
                onChange={handleChange}
                className="w-full px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Select client"
              />
              <datalist id="clients">
                {filteredClients
                  .filter((client) => client.cin !== reservation.clientCIN)
                  .map((client) => (
                    <option key={client.cin} value={client.cin}>
                      {client.firstName + " " + client.lastName}
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
                disabled={inputsDisabled}
              />
                <datalist id="vehicles">
                {filteredVehicles.map((vehicle) => (
                  <option
                  key={vehicle.licensePlate}
                  value={vehicle.licensePlate}
                  >
                  {vehicle.licensePlate +
                  "/" +
                  vehicle.brand +
                  "-" +
                  vehicle.model +
                  "-" +
                  vehicle.year}
                  </option>
                ))}
                </datalist>
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
