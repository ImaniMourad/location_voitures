"use client";

import { useEffect, useState } from "react";
import List from "@/components/List";
import FormAdd from "./add/add-vehicle-form";
import FormEdit from "./edit/edit-vehicle-form";
import PageIllustration from "@/components/page-illustration";
import axios from "axios";


export default function VehicleList() {
  const [vehicles, setVehicles] = useState<Array<{
    id: number;
    brand: string;
    model: string;
    year: number;
    rentalPrice: number;
    type: string;
    status: string;
  }>>([]);
  const [isFormAddOpen, setIsFormAddOpen] = useState(false);
  const [isFormEditOpen, setIsFormEditOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<{
    id: number;
    brand: string;
    model: string;
    year: number;
    rentalPrice: number;
    type: string;
    status: string;
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
    { header: "Number", accessor: "licensePlate" },
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
    year: number;
    rentalPrice: number;
    type: string;
    status: string;
  }) => {
    console.log("New Vehicle:", newVehicle);
    const updatedVehicles = [
      ...vehicles,
      { ...newVehicle, id: vehicles.length + 1, status: "Available" },
    ];
    setVehicles(updatedVehicles);
    setIsFormAddOpen(false);
  };
  const handleEditVehicle = (updatedVehicle: {
    id: number;
    brand: string;
    model: string;
    year: number;
    rentalPrice: number;
    type: string;
    status: string;
  }) => {
    console.log("Updated Vehicle:", updatedVehicle);
    const updatedVehicles = vehicles.map((vehicle) =>
      vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
    );
    setVehicles(updatedVehicles);
    setIsFormEditOpen(false);
  };

  const handleDeleteVehicle = (id: number) => {
    const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== id);
    setVehicles(updatedVehicles);
  };

  const handleCancel = () => {
    setIsFormAddOpen(false);
    setIsFormEditOpen(false);
  };

  return (
    <>
      
      <div className="w-[90%] mx-auto">
        <PageIllustration />
        <h1 className="text-3xl font-extrabold text-white mb-7 ml-5 pt-7">
          Vehicle Management
        </h1>
        <List
          name="Vehicle"
          columns={columns}
          rows={vehicles}
          onEdit={(id) => {
            setEditingVehicle(
              vehicles.find((vehicle) => vehicle.id === id) || null
            );
            console.log("Editing Vehicle:", editingVehicle);
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
        {isFormEditOpen && (
          <FormEdit
            handleCancel={handleCancel}
            onEditVehicle={handleEditVehicle}
            vehicle={editingVehicle}
          />
        )}
      </div>
    </>
  );
}
