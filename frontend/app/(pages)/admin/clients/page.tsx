"use client";

import { useState, useMemo, useEffect } from "react";
import List from "@/components/List";
import FormAdd from "./add/add-form-client";
import FormEdit from "./edit/edit-form-client";
import axios from "axios";
import Alert from "@/components/ui/alert";


type Client = {
  id: string;
  cin: string;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  password?: string;
};


type AlertType = {
  visible: boolean;
  message: string;
  type_alert: "" | "success" | "error";
};



export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isFormAddOpen, setIsFormAddOpen] = useState(false);
  const [isFormEditOpen, setIsFormEditOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [isAlertVisible, setIsAlertVisible] = useState<AlertType>({
      visible: false,
      message: "",
      type_alert: "",
    });

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          return;
        }
        const response = await axios.get(`${apiUrl}/clients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        response.data.forEach((client: any) => {
          client.id = client.cin;
        });
        setClients(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchClients();
  }, []);

  // Memoize columns to avoid re-creation on each render
  const columns = useMemo(
    () => [
      { header: "CIN", accessor: "cin" },
      { header: "Lastname", accessor: "lastName" },
      { header: "Firstname", accessor: "firstName" },
      { header: "Email", accessor: "email" },
      { header: "Phone", accessor: "phoneNumber" },
    ],
    []
  );

  // Add a new client
  const handleAddClient = (newClient: Omit<Client, "id">) => {
    setIsAlertVisible({
      visible: true,
      message: "Client added successfully",
      type_alert: "success",
    });

    setClients((prev) => [...prev, { ...newClient, id: newClient.cin }]);

    setIsFormAddOpen(false);
    setTimeout(() => {
      setIsAlertVisible({ visible: false, message: "", type_alert: "" });
    }, 2500);
  };

  // Edit an existing client
  const handleEditClient = (updatedClient: Client) => {
    setIsAlertVisible({
      visible: true,
      message: "Client updated successfully",
      type_alert: "success",
    });
    console.log(updatedClient);
    console.log(clients);
    setClients((prev) =>
      prev.map((client) =>
        client.cin === updatedClient.cin ? updatedClient : client
      )
    );
    setIsFormEditOpen(false);
    setEditingClient(null);
    setTimeout(() => {
      setIsAlertVisible({ visible: false, message: "", type_alert: "" });
    }, 2500);
  };

  // Delete a client
  const handleDeleteClient = (id: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
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
          Client Management
        </h1>
        <List
          name="Client"
          columns={columns}
          rows={clients}
          onEdit={(id) => {
            const client = clients.find((client) => client.id === id);
            if (client) {
              setEditingClient(client);
              setIsFormEditOpen(true);
            }
          }}
          onDelete={handleDeleteClient}
          onAdd={() => setIsFormAddOpen(true)}
          to="/admin/clients"
        />
        {isFormAddOpen && (
          <FormAdd
            handleAddClient={handleAddClient}
            handleCancel={() => setIsFormAddOpen(false)}
            onErrorMessage={handleErrorMessage}

          />
        )}
        {isFormEditOpen && editingClient && (
          <FormEdit
            clientData={editingClient}
            handleUpdateClient={handleEditClient}
            handleCancel={() => setIsFormEditOpen(false)}
            onErrorMessage={handleErrorMessage}
          />
        )}
      </div>
      </>
  );
}

