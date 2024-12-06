'use client';

import { useState } from "react";
import List from "@/components/List";
// import { FormAdd } from "@/components/FormAdd";
import  FormAdd  from "./add/page";

const initialVehicles = [
    { id: 1, marque: "Renault", modele: "Clio", annee: 2022, tarifLocation: 45, type: "Citadine" },
    { id: 2, marque: "Peugeot", modele: "3008", annee: 2021, tarifLocation: 75, type: "SUV" },
    { id: 3, marque: "Citroën", modele: "C3", annee: 2023, tarifLocation: 50, type: "Compacte" },
    { id: 4, marque: "BMW", modele: "Série 5", annee: 2022, tarifLocation: 120, type: "Berline" },
];

export default function VehicleList() {
    const [vehicles, setVehicles] = useState(initialVehicles);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);

    const columns = [
        { header: "Marque", accessor: "marque" },
        { header: "Modèle", accessor: "modele" },
        { header: "Année", accessor: "annee" },
        { header: "Tarif de location", accessor: "tarifLocation" },
        { header: "Type", accessor: "type" },
    ];

    const handleAddVehicle = (newVehicle: any) => {
        const updatedVehicles = [...vehicles, { ...newVehicle, id: vehicles.length + 1 }];
        setVehicles(updatedVehicles);
    };

    const handleEditVehicle = (updatedVehicle: { id: number; marque: string; modele: string; annee: number; tarifLocation: number; type: string; }) => {
        const updatedVehicles = vehicles.map((vehicle) =>
            vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
        );
        setVehicles(updatedVehicles);
        setEditingVehicle(null);
    };

    const handleDeleteVehicle = (id: number) => {
        const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== id);
        setVehicles(updatedVehicles);
    };

    return (
        <div className="w-[90%] mx-auto">
            <h1 className="text-3xl font-extrabold text-white mb-7 ml-5 pt-7">Gestion des Véhicules</h1>
            <List
                name="Véhicule"
                columns={columns}
                rows={vehicles}
                onEdit={setEditingVehicle}
                onDelete={handleDeleteVehicle}
                onAdd={() => setIsFormOpen(true)}
            />
            {isFormOpen && (
                // <FormAdd
                //     formTitle="Ajouter Véhicule"
                //     fields={[
                //         { name: 'marque', label: 'Marque', type: 'text' },
                //         { name: 'modele', label: 'Modèle', type: 'text' },
                //         { name: 'annee', label: 'Année', type: 'number' },
                //         { name: 'tarifLocation', label: 'Tarif de location', type: 'number' },
                //         { name: 'type', label: 'Type', type: 'text' },
                //     ]}
                //     onSubmit={handleAddVehicle}
                //     onCancel={() => setIsFormOpen(false)}
                // />
                <FormAdd setIsFormOpen={setIsFormOpen} />
            )}
        </div>
    );
}
