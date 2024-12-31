"use client";

import { useState, useEffect } from "react";
import List from "@/components/List";
import FormAdd from "./add/add-form-reservation";
import FormEdit from "./edit/edit-form-reservation";
import axios from "axios";
import Alert from "@/components/ui/alert";

type Reservation = {
  id: number;
  clientId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  paid_at: string;
  client: string;
  vehicle: string;
};

type AlertType = {
  visible: boolean;
  message: string;
  type_alert: "" | "success" | "error";
};

export default function ReservationList() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isFormAddOpen, setIsFormAddOpen] = useState(false);
  const [isFormEditOpen, setIsFormEditOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<any | null>(null);
  const [isAlertVisible, setIsAlertVisible] = useState<AlertType>({
    visible: false,
    message: "",
    type_alert: "",
  });


  console.log(reservations);
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
          reservation.startDate = new Date(
            reservation.startDate
          ).toLocaleString("fr-FR");
          reservation.endDate = new Date(reservation.endDate).toLocaleString(
            "fr-FR"
          );
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
    setIsAlertVisible({
      visible: true,
      message: "Reservation added successfully",
      type_alert: "success",
    });
    newReservation.startDate = new Date(newReservation.startDate).toLocaleString(
      "fr-FR"
    );
    newReservation.endDate = new Date(newReservation.endDate).toLocaleString(
      "fr-FR"
    );

    const updatedReservations = [
      ...reservations,
      { ...newReservation },
    ];
    setReservations(updatedReservations);
    setIsFormAddOpen(false);
    setTimeout(() => {
      setIsAlertVisible({ visible: false, message: "", type_alert: "" });
    }, 2500);
  };

  const handleEditReservation = (updatedReservation: Reservation) => {
    setIsAlertVisible({
      visible: true,
      message: "Reservation updated successfully",
      type_alert: "success",
    });
    updatedReservation.startDate = new Date(
      updatedReservation.startDate
    ).toLocaleString("fr-FR");
    updatedReservation.endDate = new Date(
      updatedReservation.endDate
    ).toLocaleString("fr-FR");

    const updatedReservations = reservations.map((reservation) =>
      reservation.id === updatedReservation.id
        ? { ...updatedReservation }
        : reservation
    );
    setReservations(updatedReservations);
    setIsFormEditOpen(false);
    setTimeout(() => {
      setIsAlertVisible({ visible: false, message: "", type_alert: "" });
    }, 2500);
  };

  const handleDeleteReservation = (id: number) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem("jwtToken");
    const currentDateTime = new Date().toISOString();
    if (!token) {
      return;
    }
    axios
      .put(`${apiUrl}/reservations/${id}/archive`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation.id === id
              ? { ...reservation, deletedAt: currentDateTime }
              : reservation
          )
        );
      })
      .catch((error) => console.error("Error deleting reservation:", error));
  };

  const handleCancel = () => {
    setEditingReservation(null);
    setIsFormAddOpen(false);
    setIsFormEditOpen(false);
  };

  const handleErrorMessage = (message: string) => {
    setIsAlertVisible({
      visible: true,
      message: message,
      type_alert: "error",
    });
    setTimeout(() => {
      setIsAlertVisible({ visible: false, message: "", type_alert: "" });
    }, 2500);
  };

  return (
    <>

    {isAlertVisible.visible && (
      <div className="absolute top-0 left-0 w-full">
        <Alert
          message={isAlertVisible.message}
          type_alert={isAlertVisible.type_alert}
        />
      </div>
    )}
    <div className="w-[90%] mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-7 ml-5 pt-7">
        Reservations Management
      </h1>
      <List
          name="Reservation"
          columns={columns}
          rows={reservations}
          onEdit={(reservationId: number) => {
            const reservationToEdit = reservations.find(
              (r) => r.id === reservationId
            );
            if (reservationToEdit) {
              setEditingReservation(reservationToEdit);
              setIsFormEditOpen(true);
            }
          } }
          onDelete={handleDeleteReservation}
          onAdd={() => setIsFormAddOpen(true)} handleClickedRow={function (id: any): void {
            throw new Error("Function not implemented.");
          } }      />
      {isFormAddOpen && (
        <FormAdd
          handleAddReservation={handleAddReservation}
          handleCancel={handleCancel}
          onErrorMessage={handleErrorMessage}
        />
      )}
      {isFormEditOpen && editingReservation && (
        console.log(editingReservation),
       <FormEdit reservationId={editingReservation.id} handleUpdateReservation={handleEditReservation} handleCancel={handleCancel} onErrorMessage={handleErrorMessage} />
            )}
    </div>
    </>
  );
}
