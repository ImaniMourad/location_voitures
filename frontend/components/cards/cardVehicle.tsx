"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Car, Fuel, Cog, Check, ActivitySquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badger";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/context";
import Spinner from "@/components/ui/spinner";
import { emitReservationUpdate } from "../event";
import PayPalButton from "@/app/componentsPayPal/PayPalButton";
import { jwtDecode } from "jwt-decode";

interface VehicleData {
  licensePlate: string;
  brand: string;
  model: string;
  year: string;
  type: string;
  status: string;
  price: number;
  horsePower: string;
  capacity: string;
  features: string[];
  pathImg: string;
}

interface JWTPayload {
  cin: string;
  sub: string;
}

type VehicleDetailsCardProps = {
  licensePlate: string;
};

export default function VehicleDetailsCard({
  licensePlate,
}: VehicleDetailsCardProps) {
  const { isDarkMode } = useTheme();
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        return;
      }
      const decodedToken = jwtDecode<JWTPayload>(token);
      const cin = decodedToken.cin || decodedToken.sub;
      if (licensePlate) {
        try {
          const response = await axios.get(
            `${apiUrl}/vehicle/${licensePlate}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = response.data;
          data.features = data.features ? data.features.split(",") : [];
          setVehicleData(data);
          setLoading(false);

          const urlParams = new URLSearchParams(window.location.search);
          const startDate = urlParams.get("startDate");
          const endDate = urlParams.get("endDate");
          if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil(
              (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
            );
            setTotalPrice(days * data.price);
          }

          const isPaid = await isPayedReservation(licensePlate, cin);
          if (isPaid) {
            setReservationSuccess(true);
          }
        } catch (error) {
          console.error("Error fetching vehicle data:", error);
          setLoading(false);
        }
      }
    };

    fetchVehicle();
  }, [licensePlate]);

  const isPayedReservation = async (licensePlate: string, cin: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      return false;
    }
    try {
      const response = await axios.get(
        `${apiUrl}/client/reservation/${licensePlate}/${cin}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setReservationId(data.id);
      console.log("Reservation data:", data);
      return data.isReserving;
    } catch (error) {
      console.error("Error fetching reservation data:", error);
      return false;
    }
  };

  if (loading) {
    return (
      <Card
        className={`w-full max-w-md shadow-2xl ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <CardContent className="flex items-center justify-center h-48">
          <Spinner />
        </CardContent>
      </Card>
    );
  }

  if (!vehicleData) {
    return (
      <Card
        className={`w-full max-w-md shadow-2xl ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <CardContent className="p-4">
          <div className="text-center">Vehicle not found</div>
        </CardContent>
      </Card>
    );
  }

  const handleCancelReservation = (id: number) => {
    const token = localStorage.getItem("jwtToken");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!token) {
      return;
    }
    axios
      .put(
        `${apiUrl}/reservation/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setReservationSuccess(false);
      })
      .catch((error) => {
        console.error("Error canceling reservation:", error);
      });
  };

  const handleOnClickReserve = (id: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const startDate = urlParams.get("startDate") || undefined;
    const endDate = urlParams.get("endDate") || undefined;
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      return;
    }
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const clientId = decodedToken.sub;
    axios
      .post(
        `http://localhost:8081/client/reservation`,
        {
          vehicleId: id,
          clientCIN: clientId,
          startDate: startDate,
          endDate: endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setReservationSuccess(true);
        // Emit the event after successful reservation
        emitReservationUpdate();
      })
      .catch((error) => {
        console.error("Error making reservation:", error);
      });
  };

  return (
    <Card
      className={`w-full max-w-md shadow-2xl border ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
      onClick={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <CardContent className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={`http://localhost:8081/uploads/${vehicleData.pathImg}`}
            fill
            alt={`${vehicleData.brand} ${vehicleData.model}`}
            className="object-cover rounded-t-lg"
            style={{ borderRadius: "11px" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge
            variant="default"
            className={`absolute top-3 right-3 ${
              isDarkMode ? "bg-blue-600" : "bg-blue-500"
            } px-3 py-1`}
          >
            {vehicleData.price.toFixed(2)} MAD/jour
          </Badge>
          <div className="absolute bottom-3 left-3 right-3">
            <h1 className="text-xl font-bold text-white mb-1">
              {vehicleData.brand} {vehicleData.model}
            </h1>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {vehicleData.year}
              </Badge>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                icon: Car,
                label: "Power",
                value: `${vehicleData.horsePower} HP`,
              },
              {
                icon: Cog,
                label: "Capacity",
                value: `${vehicleData.capacity} seats`,
              },
              { icon: Fuel, label: "Type", value: vehicleData.type },
            ].map((spec, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <spec.icon
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-blue-400" : "text-blue-500"
                  } mb-1`}
                />
                <span
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {spec.label}
                </span>
                <span
                  className={`font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
          {totalPrice !== null && (
            <div className="text-center font-semibold text-lg">
              Total Price: {totalPrice.toFixed(2)} MAD
            </div>
          )}
          {reservationSuccess ? (
            <div className="flex flex-row space-x-4 mt-4">
              <div className="mt-4 cursor-pointer">
                  {reservationId !== null && totalPrice !== null && (
                    <PayPalButton idReservation={reservationId} price={totalPrice} />
                  )}
              </div>
              <div className="mt-4 cursor-pointer">
                <button
                  onClick={() => reservationId !== null && handleCancelReservation(reservationId)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <Button
              className={`w-full text-sm bg-blue-500 hover:bg-blue-600
              `}
              onClick={() => handleOnClickReserve(vehicleData.licensePlate)}
              disabled={reservationSuccess}
            >
              Réserver
            </Button>
          )}
          {expanded &&
            vehicleData.features &&
            vehicleData.features.length > 0 && (
              <>
                <Separator className={isDarkMode ? "bg-gray-700" : ""} />
                <div>
                  <h3
                    className={`text-base font-semibold mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Features
                  </h3>
                  <div className="grid grid-cols-2 gap-1">
                    {vehicleData.features.map((feature, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-1 text-xs ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <Check
                          className={
                            isDarkMode ? "text-blue-400" : "text-blue-500"
                          }
                        />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
