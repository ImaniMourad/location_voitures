'use client';

import { useState } from "react";
import List from "@/components/List";
import { FormAdd } from "@/components/FormAdd";

const initialReservations = [
    { id: 1, clientName: "Jean Dupont", vehicleName: "Renault Clio", startDate: "2023-07-01", endDate: "2023-07-05", status: "Confirmée" },
    { id: 2, clientName: "Marie Martin", vehicleName: "Peugeot 3008", startDate: "2023-07-10", endDate: "2023-07-15", status: "En attente" },
    { id: 3, clientName: "Pierre Durand", vehicleName: "Citroën C3", startDate: "2023-07-20", endDate: "2023-07-25", status: "Terminée" },
    { id: 4, clientName: "Sophie Lefebvre", vehicleName: "BMW Série 5", startDate: "2023-08-01", endDate: "2023-08-07", status: "Annulée" },
];

export default function ReservationList() {
    const [reservations, setReservations] = useState(initialReservations);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState(null);

    const columns = [
        { header: "Client", accessor: "clientName" },
        { header: "Véhicule", accessor: "vehicleName" },
        { header: "Date de début", accessor: "startDate" },
        { header: "Date de fin", accessor: "endDate" },
        { header: "Statut", accessor: "status" },
    ];

    const handleAddReservation = (newReservation) => {
        const updatedReservations = [...reservations, { ...newReservation, id: reservations.length + 1 }];
        setReservations(updatedReservations);
    };

    const handleEditReservation = (updatedReservation) => {
        const updatedReservations = reservations.map((reservation) =>
            reservation.id === updatedReservation.id ? updatedReservation : reservation
        );
        setReservations(updatedReservations);
        setEditingReservation(null);
    };

    const handleDeleteReservation = (id) => {
        const updatedReservations = reservations.filter((reservation) => reservation.id !== id);
        setReservations(updatedReservations);
    };

    return (
        <div className="w-[90%] mx-auto">
            <h1 className="text-3xl font-extrabold text-white mb-7 ml-5 pt-7">Gestion des Réservations</h1>
            <List
                name="Réservation"
                columns={columns}
                rows={reservations}
                onEdit={setEditingReservation}
                onDelete={handleDeleteReservation}
                onAdd={() => setIsFormOpen(true)}
            />
            {isFormOpen && (
                <FormAdd
                    formTitle="Ajouter Réservation"
                    fields={[
                        { name: 'clientName', label: 'Client', type: 'text' },
                        { name: 'vehicleName', label: 'Véhicule', type: 'text' },
                        { name: 'startDate', label: 'Date de début', type: 'date' },
                        { name: 'endDate', label: 'Date de fin', type: 'date' },
                        { name: 'status', label: 'Statut', type: 'text' },
                    ]}
                    onSubmit={handleAddReservation}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
}
