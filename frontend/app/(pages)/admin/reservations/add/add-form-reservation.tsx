"use client";

import { use, useEffect, useState } from "react";
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
import generatePDF from "./generateDocument/invoice-document";

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
  totalPrice: string;
  diffDays: number;
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
  const [isCalculated, setIsCalculated] = useState(true);
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
    totalPrice: "00.00",
    diffDays: 0,
  });

  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [inputsDisabled, setInputsDisabled] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setReservation((prevReservation) => {
      if (id === "startTime" || id === "endTime") {
        return { ...prevReservation, startTime: value, endTime: value };
      }
      return { ...prevReservation, [id]: value };
    });
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
    )
      .toLocal()
      .toFormat("yyyy-MM-dd'T'HH:mm:ss");
    const endDateTime = DateTime.fromISO(
      `${reservation.endDate}T${reservation.endTime}`
    )
      .toLocal()
      .toFormat("yyyy-MM-dd'T'HH:mm:ss");
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
      onErrorMessage(
        "Start Date and End Date must be greater than or equal to today's date."
      );
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
          total: parseFloat(reservation.totalPrice),
          paymentMethod: "Cash on delivery",
          paymentStatus: "Paid",
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
        client: `${
          filteredClients.find((client) => client.cin === reservation.clientCIN)
            ?.firstName
        } ${
          filteredClients.find((client) => client.cin === reservation.clientCIN)
            ?.lastName
        }`,
        id: response.data.reservation.id,
        vehicle: reservation.vehicleId,
        startDate: response.data.reservation.startDate,
        endDate: response.data.reservation.endDate,
      });

      // Generate and download the PDF invoice
      //object json to pass to generatePDF
      const vehicle = filteredVehicles.find(
        (vehicle) => vehicle.licensePlate === reservation.vehicleId
      );

      console.log("id invoice", response.data.invoice.id);

      const invoiceData = {
        id: response.data.invoice.id,
        date: formatDate(response.data.reservation.paidAt),
        client: {
          name:
            response.data.client.firstName +
            " " +
            response.data.client.lastName,
          email: response.data.client.email,
          address: response.data.client.address,
          phone: response.data.client.phoneNumber,
        },
        items: [
          {
            licensePlate: vehicle ? vehicle.licensePlate : "Unknown",
            price: parseFloat(vehicle ? vehicle.price.toString() : "0"),
            days: reservation.diffDays,
            total: parseFloat(reservation.totalPrice),
          },
        ],
        payment: {
          method: "Cash on delivery",
        },
        total: parseFloat(reservation.totalPrice),
      };

      await generatePDF({ invoiceData });
    } catch (error) {
      console.log("Error during submission:", error);
      onErrorMessage("Failed to add reservation.");
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateTotal = () => {
    // check if the client is selected and it is valid and exists in the list of clients
    if (
      !reservation.clientCIN ||
      !filteredClients.find((client) => client.cin === reservation.clientCIN)
    ) {
      onErrorMessage("Please select a valid client.");
      return;
    }

    // check if the vehicle is selected and it is valid and exists in the list of vehicles
    if (
      !reservation.vehicleId ||
      !filteredVehicles.find(
        (vehicle) => vehicle.licensePlate === reservation.vehicleId
      )
    ) {
      onErrorMessage("Please select a valid vehicle.");
      return;
    }

    const startDate = DateTime.fromISO(
      reservation.startDate + "T" + reservation.startTime
    );
    const endDate = DateTime.fromISO(
      reservation.endDate + "T" + reservation.endTime
    );

    const diffDays = endDate.diff(startDate, "days").days;
    const vehicle = filteredVehicles.find(
      (vehicle) => vehicle.licensePlate === reservation.vehicleId
    );

    const price = vehicle ? vehicle.price * diffDays : 0;

    setReservation((prevReservation) => ({
      ...prevReservation,
      diffDays: diffDays,
      totalPrice: price.toFixed(2),
    }));
  };

  useEffect(() => {
    if (reservation.diffDays > 0 && reservation.totalPrice !== "00.00") {
      setIsCalculated(false);
    }
  }, [reservation.diffDays, reservation.totalPrice]);

  // formatter date "2024-12-29T20:18:08" to Novembre 12, 2021
  const formatDate = (date: string) => {
    const formattedDate = DateTime.fromISO(date).toFormat("LLLL d, yyyy");
    return formattedDate;
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
          )
            .toLocal()
            .toFormat("yyyy-MM-dd'T'HH:mm:ss");
          const endDateTime = DateTime.fromISO(
            `${reservation.endDate}T${reservation.endTime}`
          )
            .toLocal()
            .toFormat("yyyy-MM-dd'T'HH:mm:ss");

          const availableVehicles = await getAvailableVehicles(
            startDateTime,
            endDateTime
          );
          setFilteredVehicles(availableVehicles);
          setReservation((prevReservation) => ({
            ...prevReservation,
            vehicleId: "",
          }));
          setInputsDisabled(false); // Enable inputs after fetching vehicles
        } catch (error) {
          onErrorMessage("Failed to fetch available vehicles.");
        }
      }
    };

    fetchAvailableVehicles();
  }, [
    reservation.startDate,
    reservation.startTime,
    reservation.endDate,
    reservation.endTime,
  ]);

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
                autoComplete="off"
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
                autoComplete="off"
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
                Total Price
              </label>
              <div className="flex space-x-2">
                <input
                  id="price"
                  type="text"
                  value={reservation.totalPrice}
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
              <Button
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                type="submit"
                disabled={isCalculated}
              >
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
