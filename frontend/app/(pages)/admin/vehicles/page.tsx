"use client";

import { useEffect, useState } from "react";
import List from "@/components/List";
import FormAdd from "./add/add-vehicle-form";
import FormEdit from "./edit/edit-vehicle-form";
import PageIllustration from "@/components/page-illustration";
import axios from "axios";

export default function VehicleList() {
  const [vehicles, setVehicles] = useState<Array<{
    licensePlate: string;
    brand: string;
    model: string;
    year: string;
    rentalPrice: number;
    type: string;
    status: string;
    horsePower: string;
    capacity: string;
    features: string[];
    pathImg: string;
  }>>([]);
  
  const [isFormAddOpen, setIsFormAddOpen] = useState(false);
  const [isFormEditOpen, setIsFormEditOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<{
    licensePlate: string;
    brand: string;
    model: string;
    year: string;
    rentalPrice: number;
    type: string;
    status: string;
    horsePower: string;
    capacity: string;
    features: string[];
    pathImg: string;
  } | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
        setVehicles(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchVehicles();
  }, []);

  const columns = [
    { header: "License Plate", accessor: "licensePlate" },
    { header: "Brand", accessor: "brand" },
    { header: "Model", accessor: "model" },
    { header: "Year", accessor: "year" },
    { header: "Price", accessor: "price" },
    { header: "Type", accessor: "type" },
    { header: "Status", accessor: "status" },
  ];

  const handleAddVehicle = (newVehicle: {
    brand: string;
    model: string;
    year: string;
    rentalPrice: number;
    type: string;
    status: string;
  }) => {
    console.log("New Vehicle:", newVehicle);
    const updatedVehicles = [
      ...vehicles,
      { ...newVehicle, licensePlate: `LP${vehicles.length + 1}`, status: "Available", horsePower: "N/A", capacity: "N/A", features: [], pathImg: "N/A" },
    ];
    setVehicles(updatedVehicles);
    setIsFormAddOpen(false);
  };

  const handleEditVehicle = (updatedVehicle: {
    licensePlate: string;
    brand: string;
    model: string;
    year: string;
    rentalPrice: number;
    type: string;
    status: string;
    horsePower: string;
    capacity: string;
    features: string[];
    pathImg: string;
  }) => {
    console.log("Updated Vehicle:", updatedVehicle);
    const updatedVehicles = vehicles.map((vehicle) =>
      vehicle.licensePlate === updatedVehicle.licensePlate ? updatedVehicle : vehicle
    );
    setVehicles(updatedVehicles);
    setIsFormEditOpen(false);
  };

  const handleDeleteVehicle = (licensePlate: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      return;
    }
    axios.delete(`${apiUrl}/vehicles/${licensePlate}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.filter((vehicle) => vehicle.licensePlate !== licensePlate)
      );
    })
    .catch((error) => console.error("Error deleting vehicle:", error));
  };

  const handleCancel = () => {
    setIsFormAddOpen(false);
    setIsFormEditOpen(false);
  };

  return (
    <div className="w-[90%] mx-auto">
      <PageIllustration />
      <h1 className="text-3xl font-extrabold text-white mb-7 ml-5 pt-7">
        Vehicle Management
      </h1>
      <List
        name="Vehicle"
        columns={columns}
        rows={vehicles}
        onEdit={(licensePlate) => {
          setEditingVehicle(
            vehicles.find((vehicle) => vehicle.licensePlate === licensePlate) || null
          );
          setIsFormEditOpen(true);
        }}
        onDelete={handleDeleteVehicle}
        onAdd={() => setIsFormAddOpen(true)}
      />
      {isFormAddOpen && (
        <FormAdd
          handleCancel={handleCancel}
          onAddVehicle={handleAddVehicle}
        />
      )}
      {isFormEditOpen && editingVehicle && (
        <FormEdit
          handleCancel={handleCancel}
          onEditVehicle={handleEditVehicle}
          vehicle={editingVehicle}
        />
      )}
    </div>
  );
}
