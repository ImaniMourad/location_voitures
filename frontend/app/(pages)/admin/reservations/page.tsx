'use client';

import { useState, useEffect } from "react";
import List from "@/components/List";
import FormAdd from "./add/add-form-reservation";
import FormEdit from "./edit/edit-form-reservation";
import axios from "axios";

type Reservation = {
    id: number;
    client: string;
    vehicle: string;
    startDate: string;
    endDate: string;
};

export default function ReservationList() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isFormAddOpen, setIsFormAddOpen] = useState(false);
    const [isFormEditOpen, setIsFormEditOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    return;
                }
                const response = await axios.get(`${apiUrl}/reservations`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // afficher date de forme jj/mm/aaaa hh:mm sans seconds
                response.data.forEach((reservation: Reservation) => {
                    reservation.startDate = new Date(reservation.startDate).toLocaleString("fr-FR");
                    reservation.endDate = new Date(reservation.endDate).toLocaleString("fr-FR");
                });
                setReservations(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchReservations();
    }, []);

    const columns = [
        { header: "Client", accessor: "client" },
        { header: "Vehicle", accessor: "vehicle" },
        { header: "Start Date", accessor: "startDate" },
        { header: "End Date", accessor: "endDate" },
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
            <h1 className="text-3xl font-extrabold text-white mb-7 ml-5 pt-7">Reservations Management</h1>
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
