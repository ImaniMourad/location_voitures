'use client';

import { useState } from "react";
import List from "@/components/List";
import { FormAdd } from "@/components/FormAdd";

const initialReservations = [
    { id: 1, clientName: "Jean Dupont", vehicleName: "Renault Clio", startDate: "2023-07-01", endDate: "2023-07-05" },
    { id: 2, clientName: "Marie Martin", vehicleName: "Peugeot 3008", startDate: "2023-07-10", endDate: "2023-07-15" },
    { id: 3, clientName: "Pierre Durand", vehicleName: "Citroën C3", startDate: "2023-07-20", endDate: "2023-07-25" },
    { id: 4, clientName: "Sophie Lefebvre", vehicleName: "BMW Série 5", startDate: "2023-08-01", endDate: "2023-08-07" },
];

export default function ReservationList() {
    const [reservations, setReservations] = useState(initialReservations);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState(null);

    const columns = [
        { header: "Client", accessor: "clientName" },
        { header: "Vehicle", accessor: "vehicleName" },
        { header: "Date de début", accessor: "startDate" },
        { header: "Date de fin", accessor: "endDate" },
    ];

    return (
        <div className="w-[90%] mx-auto">
            <h1 className="text-3xl font-extrabold text-white mb-7 ml-5 pt-7">Gestion des Archives</h1>
            <List
                name="Réservation"
                columns={columns}
                rows={reservations}
            />
        </div>
    );
}
