'use client';

import { useState } from "react";
import List from "@/components/List";
import { FormAdd } from "@/components/FormAdd";

const initialReservations = [
    { id: 1, client: "Jean Dupont", vehicle: "Renault Clio", startDate: "2023-07-01", endDate: "2023-07-05" },
    { id: 2, client: "Marie Martin", vehicle: "Peugeot 3008", startDate: "2023-07-10", endDate: "2023-07-15" },
    { id: 3, client: "Pierre Durand", vehicle: "Citroën C3", startDate: "2023-07-20", endDate: "2023-07-25" },
    { id: 4, client: "Sophie Lefebvre", vehicle: "BMW Série 5", startDate: "2023-08-01", endDate: "2023-08-07" },
];

export default function ReservationList() {
    const [reservations, setReservations] = useState(initialReservations);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState(null);

    const columns = [
        { header: "Client", accessor: "client" },
        { header: "Vehicle", accessor: "vehicle" },
        { header: "Start Date", accessor: "startDate" },
        { header: "End Date", accessor: "endDate" },
    ];

    return (
        <div className="w-[90%] mx-auto">
            <h1 className="text-3xl font-extrabold text-white mb-7 ml-5 pt-7">Gestion des Archives</h1>
            <List
                name="Reservation"
                columns={columns}
                rows={reservations} onEdit={function (item: any): void {
                    throw new Error("Function not implemented.");
                } } onDelete={function (id: number): void {
                    throw new Error("Function not implemented.");
                } } onAdd={function (): void {
                    throw new Error("Function not implemented.");
                } }            />
        </div>
    );
}
