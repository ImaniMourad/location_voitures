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
import generatePDF from "../add/generateDocument/invoice-document";
import generateContract from "../add/generateDocument/contract-document";
import Spinner from "@/components/ui/spinner";

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

type ReservationFormProps = {
  reservationId: string;
  handleUpdateReservation: (updatedReservation: any) => void;
  handleCancel: () => void;
  onErrorMessage: (message: string) => void;
};

export default function ReservationForm({
  reservationId,
  handleUpdateReservation,
  handleCancel,
  onErrorMessage,
}: ReservationFormProps) {
  const [isCalculated, setIsCalculated] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [inputsDisabled, setInputsDisabled] = useState(true);
  const [reservation, setReservation] = useState<any>(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("You must be logged in to perform this action.");
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error("API URL is not configured.");
        }

        const response = await axios.get(`${apiUrl}/reservation/${reservationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedReservation = response.data;
        console.log("fetchedReservation");  
        console.log(fetchedReservation);
        setReservation({
          id: fetchedReservation.id,
          startTime: DateTime.fromISO(fetchedReservation.startTime).toFormat("HH:mm"),
          endTime: DateTime.fromISO(fetchedReservation.endTime).toFormat("HH:mm"),
          clientCIN: fetchedReservation.clientCIN,
          vehicleId: fetchedReservation.vehicleId,
          startDate: DateTime.fromISO(fetchedReservation.startDate).toFormat("yyyy-MM-dd"),
          endDate: DateTime.fromISO(fetchedReservation.endDate).toFormat("yyyy-MM-dd"),
          deletedAt: "",
          paidAt: "",
          totalPrice: fetchedReservation.totalPrice,
        });
      } catch (error) {
        console.error("Error fetching reservation:", error);
        onErrorMessage("Failed to fetch reservation.");
      }
    };

    fetchReservation();
  }, [reservationId]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    const today = DateTime.now();
    const todayDate = today.toISODate();
    const currentTime = today.toISOTime();
  
    // Helper functions
    const isDateBeforeToday = (date: string) => date < todayDate;
    const isTimeBeforeNow = (time: string) => time < currentTime;
  
    // Validations
    switch (id) {
      case "startDate":
        if (isDateBeforeToday(value)) {
          onErrorMessage("Start Date must be greater than or equal to today's date.");
          return;
        }
        if (reservation.endDate && reservation.endDate < value) {
          onErrorMessage("End Date must be greater than Start Date.");
          return;
        }
        break;
  
      case "endDate":
        if (isDateBeforeToday(value)) {
          onErrorMessage("End Date must be greater than or equal to today's date.");
          return;
        }
        if (value < reservation.startDate) {
          onErrorMessage("End Date must be greater than Start Date.");
          return;
        }
        break;
  
      case "startTime":
        if (reservation.startDate === todayDate && isTimeBeforeNow(value)) {
          onErrorMessage("Start Time must be greater than or equal to current time.");
          return;
        }
        if (
          reservation.endDate === reservation.startDate &&
          reservation.endTime &&
          value > reservation.endTime
        ) {
          onErrorMessage("Start Time must be less than End Time.");
          return;
        }
        setReservation((prevReservation: any) => ({
          ...prevReservation,
          startTime: value,
          endTime: value,
        }));
        return;
  
      case "endTime":
        if (reservation.startDate === todayDate && isTimeBeforeNow(value)) {
          onErrorMessage("End Time must be greater than or equal to current time.");
          return;
        }
        if (reservation.endDate === todayDate && isTimeBeforeNow(value)) {
          onErrorMessage("End Time must be greater than or equal to current time.");
          return;
        }
        if (
          reservation.endDate === reservation.startDate &&
          value < reservation.startTime
        ) {
          onErrorMessage("End Time must be greater than Start Time.");
          return;
        }
        setReservation((prevReservation: any) => ({
          ...prevReservation,
          endTime: value,
          startTime: value,
        }));
        return;
  
      default:
        break;
      }

  
    // Update reservation state for other fields
    setReservation((prevReservation: any) => ({
      ...prevReservation,
      [id]: value,
    }));
  };

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
        setFilteredClients(response.data);
      } catch (error) {
        console.error(error);
        onErrorMessage("Failed to fetch clients.");
      }
    };

    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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

      const response = await axios.put(
        `${apiUrl}/reservation/${reservation.id}`,
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

      handleUpdateReservation({
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
        totalPrice: parseFloat(reservation.totalPrice),
      });

      // Generate and download the PDF invoice
      //object json to pass to generatePDF
      const vehicle = filteredVehicles.find(
        (vehicle) => vehicle.licensePlate === reservation.vehicleId
      );

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

      const contractData = {
        companyName: "LocApp Pro",
        contractNumber: response.data.invoice.id,
        creationDate: formatDate(response.data.reservation.paidAt),
        rentalPeriod: {
          start: formatDate(response.data.reservation.startDate),
          end: formatDate(response.data.reservation.endDate),
        },
        client: {
          name: `${response.data.client.firstName} ${response.data.client.lastName}`,
          address: response.data.client.address,
          phone: response.data.client.phoneNumber,
          email: response.data.client.email,
        },
        vehicle: {
          plateNumber: vehicle ? vehicle.licensePlate : "Unknown",
          brand: vehicle ? vehicle.brand : "Unknown",
          model: vehicle ? vehicle.model : "Unknown",
          year: vehicle ? vehicle.year : "Unknown",
        },
        financialDetails: {
          pricePerDay: vehicle ? vehicle.price : 0,
          totalDays: reservation.diffDays,
          totalAmount: parseFloat(reservation.totalPrice),
          deposit: parseFloat(reservation.totalPrice) * 0.2,
        },
      };

      await generatePDF({ invoiceData });
      await generateContract({ contractData });
    } catch (error) {
      console.log("Error during submission:", error);
      onErrorMessage("Failed to update reservation.");
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateTotal = () => {
    if (
      !reservation.clientCIN ||
      !filteredClients.find((client) => client.cin === reservation.clientCIN)
    ) {
      onErrorMessage("Please select a valid client.");
      return;
    }

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

    setReservation((prevReservation: any) => ({
      ...prevReservation,
      diffDays: diffDays,
      totalPrice: price.toFixed(2),
    }));
  };

  useEffect(() => {
    if (reservation && reservation.diffDays > 0 && reservation.totalPrice !== "00.00") {
      setIsCalculated(false);
    }
  }, [reservation?.diffDays, reservation?.totalPrice]);

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

      const response = await axios.get(`${apiUrl}/vehicles/available/${reservationId}`, {
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
      onErrorMessage("Failed to fetch available vehicles.");
    }
  };

  useEffect(() => {
    const fetchAvailableVehicles = async () => {
      if (
        reservation?.startDate &&
        reservation?.startTime &&
        reservation?.endDate &&
        reservation?.endTime
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
          setReservation((prevReservation: any) => ({
            ...prevReservation,
            vehicleId: reservation.vehicleId,
          }));
          setInputsDisabled(false);
        } catch (error) {
          onErrorMessage("Failed to fetch available vehicles.");
          return;
        }
      }
    };

    fetchAvailableVehicles();
  }, [
    reservation?.startDate,
    reservation?.startTime,
    reservation?.endDate,
    reservation?.endTime,
  ]);

  if (!reservation) {
    return <Spinner />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg bg-slate-900 text-slate-100 border border-slate-800">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-2xl text-slate-100">
              Edit Reservation
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
                {filteredVehicles && filteredVehicles.length > 0 && (
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
                )}
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
