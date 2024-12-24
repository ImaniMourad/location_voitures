'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import VehicleProfile from "@/components/profileVehicule";
import axios from "axios";

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

export default function VehiclePage() {
  const router = useRouter();
  const params = useParams();
  const licensePlate = params.licensePlate as string;
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (licensePlate) {
      axios
        .get(`http://localhost:8081/vehicle/${licensePlate}`)
        .then((response) => {
          setVehicleData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching vehicle data:", error);
          setLoading(false);
        });
    }
  }, [licensePlate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!vehicleData) {
    return <p>Vehicle not found</p>;
  }

  return (
    <>
    <br /><br />
    <VehicleProfile
      licensePlate={vehicleData.licensePlate}
      brand={vehicleData.brand}
      model={vehicleData.model}
      year={vehicleData.year}
      type={vehicleData.type}
      status={vehicleData.status}
      price={vehicleData.price}
      horsePower={vehicleData.horsePower}
      capacity={vehicleData.capacity}
      features={vehicleData.features}
      pathImg={vehicleData.pathImg}
      onCancel={() => router.push("/admin/vehicles")}
    /></>
  );
}

