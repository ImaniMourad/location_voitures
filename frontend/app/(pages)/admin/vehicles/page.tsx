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
import VehicleDetails from "./details/page";
import PageIllustration from "@/components/page-illustration";
import axios from "axios";
import Alert from "@/components/ui/alert";
import { useTheme } from "@/context/context";

export default function VehicleList() {
  const { isDarkMode } = useTheme();
  const [isAlertVisible, setIsAlertVisible] = useState<AlertType>({
    visible: false,
    message: "",
    type_alert: "",
  });
  const [vehicles, setVehicles] = useState<
    Array<{
      id: string;
      brand: string;
      model: string;
      year: string;
      Price: number;
      type: string;
      status: string;
      horsePower: string;
      capacity: string;
      features: string;
      deleteAt: string;
      pathImg: string;
    }>
  >([]);

  const [isFormAddOpen, setIsFormAddOpen] = useState(false);
  const [isFormEditOpen, setIsFormEditOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<{
    id: string;
    brand: string;
    model: string;
    year: string;
    Price: number;
    type: string;
    status: string;
    horsePower: string;
    capacity: string;
    features: string;
    deleteAt: string;
    pathImg: string;
  } | null>(null);

  const [vehicleOpened, setVehicleOpened] = useState<string>("");

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
        response.data.forEach((vehicle: any) => {
          vehicle.id = vehicle.licensePlate;
        });
        setVehicles(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchVehicles();
  }, []);

  const columns = [
    { header: "License Plate", accessor: "id" },
    { header: "Brand", accessor: "brand" },
    { header: "Model", accessor: "model" },
    { header: "Year", accessor: "year" },
    { header: "Price", accessor: "price" },
    { header: "Type", accessor: "type" },
    { header: "Status", accessor: "status" },
  ];

  const handleAddVehicle = (newVehicle: {
    id: string;
    licensePlate: string;
    brand: string;
    model: string;
    year: string;
    Price: number;
    type: string;
    status: string;
    horsePower: string;
    capacity: string;
    features: string;
    deleteAt: string;
    pathImg: string;
  }) => {
    console.log("New Vehicle:", newVehicle);
    setIsAlertVisible({
      visible: true,
      message: "Vehicle added successfully.",
      type_alert: "success",
    });

    newVehicle.id = newVehicle.licensePlate;
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
    id: string;
    licensePlate: string;
    brand: string;
    model: string;
    year: string;
    Price: number;
    type: string;
    status: string;
    horsePower: string;
    capacity: string;
    features: string;
    deleteAt: string;
    pathImg: string;
  }) => {
    console.log("Updated Vehicle:", updatedVehicle);
    setIsAlertVisible({
      visible: true,
      message: "Vehicle updated successfully.",
      type_alert: "success",
    });

    updatedVehicle.id = updatedVehicle.licensePlate;
    const updatedVehicles = vehicles.map((vehicle) =>
      vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
    );
    setVehicles(updatedVehicles);
    setIsFormEditOpen(false);
    setTimeout(() => {
      setIsAlertVisible({ visible: false, message: "", type_alert: "" });
    }, 2500);
  };

  const handleDeleteVehicle = (id: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem("jwtToken");
    const currentDateTime = new Date().toISOString();
    if (!token) {
      return;
    }
    axios
      .put(`${apiUrl}/vehicle/${id}/archive`, currentDateTime, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setVehicles((prevVehicles) =>
          prevVehicles.map((vehicle) =>
            vehicle.id === id
              ? { ...vehicle, deletedAt: currentDateTime }
              : vehicle
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

  const handleClickedRow = (licensePlate: string) => {
    setVehicleOpened(licensePlate);
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
        <PageIllustration />
        <h1
          className={`text-3xl font-extrabold mb-7 ml-5 pt-7 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
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
            setIsFormEditOpen(true);
          }}
          onDelete={handleDeleteVehicle}
          onAdd={() => setIsFormAddOpen(true)}
          handleClickedRow={(id) => handleClickedRow(id)}
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
            vehicleId={editingVehicle.id}
            onErrorMessage={handleErrorMessage}
          />
        )}
        {vehicleOpened !== "" && (
          <VehicleDetails
            licensePlate={vehicleOpened}
            handleCancel={() => setVehicleOpened("")}
          />
        )}
      </div>
    </>
  );
}
