"use client";

type AlertType = {
  visible: boolean;
  message: string;
  type_alert: "" | "success" | "error";
};

import { useEffect, useState } from "react";
import List from "@/components/List";
import FormAdd from "./add/add-vehicle-form";
import FormEdit from "./edit/edit-vehicle-form";
import PageIllustration from "@/components/page-illustration";
import axios from "axios";
import Alert from "@/components/ui/alert";

export default function VehicleList() {
  const [isAlertVisible, setIsAlertVisible] = useState<AlertType>({
    visible: false,
    message: "",
    type_alert: "",
  });
  const [vehicles, setVehicles] = useState<
    Array<{
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
    }>
  >([]);

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
      console.log("New Vehicle:", newVehicle);
      setIsAlertVisible({
        visible: true,
        message: "Vehicle added successfully.",
        type_alert: "success",
      });
      const updatedVehicles = [
        ...vehicles,
        {
          ...newVehicle,
        },
      ];
      setVehicles(updatedVehicles);
      setIsFormAddOpen(false);
      setTimeout(() => {
        setIsAlertVisible({ visible: false, message: "", type_alert: "" });
      }, 2500);
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
      vehicle.licensePlate === updatedVehicle.licensePlate
        ? updatedVehicle
        : vehicle
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
    axios
      .delete(`${apiUrl}/vehicles/${licensePlate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setVehicles((prevVehicles) =>
          prevVehicles.filter(
            (vehicle) => vehicle.licensePlate !== licensePlate
          )
        );
      })
      .catch((error) => console.error("Error deleting vehicle:", error));
  };

  const handleCancel = () => {
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
        <div className="absolute top-0 left-0 w-full z-50">
          <Alert
            message={isAlertVisible.message}
            type_alert={isAlertVisible.type_alert}
          />
        </div>
      )}
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
            console.log("Editing vehicle with license plate:", licensePlate);
            setEditingVehicle(
              vehicles.find(
                (vehicle) => vehicle.licensePlate === licensePlate
              ) || null
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
            onErrorMessage={handleErrorMessage}
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
    </>
  );
}
