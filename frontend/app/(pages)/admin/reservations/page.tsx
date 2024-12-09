'use client';

import { useState } from "react";
import List from "@/components/List";
import FormAdd from "./add/add-form-reservation";
import FormEdit from "./edit/edit-form-reservation";


type Reservation = {
    id: number;
    client: string;
    vehicle: string;
    startDate: string;
    endDate: string;
    status: string;
};

const initialReservations = [
    { id: 1, client: "Jean Dupont", vehicle: "Renault Clio", startDate: "2023-07-01", endDate: "2023-07-05", status: "Pending" },
    { id: 2, client: "Marie Martin", vehicle: "Peugeot 3008", startDate: "2023-07-10", endDate: "2023-07-15", status: "Confirmed" },
    { id: 3, client: "Pierre Durand", vehicle: "Citroën C3", startDate: "2023-07-20", endDate: "2023-07-25", status: "Cancelled" },
    { id: 4, client: "Sophie Lefebvre", vehicle: "BMW Série 5", startDate: "2023-08-01", endDate: "2023-08-07", status: "Pending" },
];

export default function ReservationList() {
    const [reservations, setReservations] = useState(initialReservations);
    const [isFormAddOpen, setIsFormAddOpen] = useState(false);
    const [isFormEditOpen, setIsFormEditOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

    const columns = [
        { header: "Client", accessor: "client" },
        { header: "Vehicle", accessor: "vehicle" },
        { header: "Start Date", accessor: "startDate" },
        { header: "End Date", accessor: "endDate" },
        { header: "Statut", accessor: "status" },
    ];

    const handleAddReservation = (newReservation: any) => {
        const updatedReservations = [...reservations, { ...newReservation, id: reservations.length + 1 }];
        setReservations(updatedReservations);
        setIsFormAddOpen(false);
    };

    const handleEditReservation = (updatedReservation: Reservation) => {
        const updatedReservations = reservations.map((reservation) =>
            reservation.id === updatedReservation.id ? updatedReservation : reservation
        );
        setReservations(updatedReservations);
        setEditingReservation(null);
        setIsFormEditOpen(false);
    };

    const handleDeleteReservation = (id: number) => {
        const updatedReservations = reservations.filter((reservation) => reservation.id !== id);
        setReservations(updatedReservations);
    };

    const handleCancel = () => {
        setEditingReservation(null);
        setIsFormAddOpen(false);
        setIsFormEditOpen(false);
    };

    return (
        <div className="w-[90%] mx-auto">
            <h1 className="text-3xl font-extrabold text-white mb-7 ml-5 pt-7">Gestion des Réservations</h1>
            <List
                name="Reservation"
                columns={columns}
                rows={reservations}
                onEdit={(reservationId: number) => {
                    const reservationToEdit = reservations.find((r) => r.id === reservationId );
                    if (reservationToEdit) {
                        setEditingReservation(reservationToEdit);
                        console.log(reservationToEdit);
                        setIsFormEditOpen(true);
                    }
                }}
                onDelete={handleDeleteReservation}
                onAdd={() => setIsFormAddOpen(true)}
            />
            {isFormAddOpen && (
                <FormAdd handleAddReservation={handleAddReservation} handleCancel={handleCancel} />
            )}
            {isFormEditOpen && editingReservation && (
                <FormEdit reservation={editingReservation} handleUpdateReservation={handleEditReservation} handleCancel={handleCancel} />
            )}
        </div>
    );
}
