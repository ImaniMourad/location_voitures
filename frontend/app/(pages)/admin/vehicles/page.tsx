"use client";

import { useState } from "react";
import List from "@/components/List";
import FormAdd from "./add/add-vehicle-form";
import FormEdit from "./edit/edit-vehicle-form";

const initialVehicles = [
  {
    id: 1,
    brand: "Renault",
    model: "Clio",
    year: 2022,
    rentalPrice: 45,
    type: "Citadine",
    status: "Available",
  },
  {
    id: 2,
    brand: "Peugeot",
    model: "3008",
    year: 2021,
    rentalPrice: 75,
    type: "SUV",
    status: "Available",
  },
  {
    id: 3,
    brand: "Citroën",
    model: "C3",
    year: 2023,
    rentalPrice: 50,
    type: "Compacte",
    status: "Available",
  },
  {
    id: 4,
    brand: "BMW",
    model: "Série 5",
    year: 2022,
    rentalPrice: 120,
    type: "Berline",
    status: "Available",
  },
];

export default function VehicleList() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [isFormAddOpen, setIsFormAddOpen] = useState(false);
  const [isFormEditOpen, setIsFormEditOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<{
    id: number;
    brand: string;
    model: string;
    year: number;
    rentalPrice: number;
    type: string;
  } | null>(null);

  const columns = [
    { header: "Brand", accessor: "brand" },
    { header: "Model", accessor: "model" },
    { header: "Year", accessor: "year" },
    { header: "Rental Price", accessor: "rentalPrice" },
    { header: "Type", accessor: "type" },
    { header: "Status", accessor: "status"} 
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
  const handleEditVehicle = (updatedVehicle: { id: number; brand: string; model: string; year: number; rentalPrice: number; type: string; status: string; }) => {
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
  }


  return (
    <div className="w-[90%] mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-7 ml-5 pt-7">
        Vehicle Management
      </h1>
      <List
        name="Vehicle"
        columns={columns}
        rows={vehicles}
        onEdit={(id) => {
          setEditingVehicle(vehicles.find((vehicle) => vehicle.id === id) || null);
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
      {isFormEditOpen && <FormEdit handleCancel={handleCancel} onEditVehicle={handleEditVehicle} vehicle={editingVehicle} />}
    </div>
  );
}
