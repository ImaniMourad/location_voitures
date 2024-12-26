"use client";

import { useState, useMemo, useEffect } from "react";
import List from "@/components/List";
import FormAdd from "./add/add-form-client";
import FormEdit from "./edit/edit-form-client";
import axios from "axios";


type Client = {
  id: number;
  cin: string;
  lastname: string;
  firstname: string;
  email: string;
  phone: string;
};

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isFormAddOpen, setIsFormAddOpen] = useState(false);
  const [isFormEditOpen, setIsFormEditOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

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
    setClients((prev) => [...prev, { ...newClient, id: prev.length + 1 }]);
    setIsFormAddOpen(false);
  };

  // Edit an existing client
  const handleEditClient = (updatedClient: Client) => {
    console.log(updatedClient);
    console.log(clients);
    setClients((prev) =>
      prev.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
    setIsFormEditOpen(false);
    setEditingClient(null);
  };

  // Delete a client
  const handleDeleteClient = (id: number) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
  };

  return (

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
          />
        )}
        {isFormEditOpen && editingClient && (
          <FormEdit
            client={editingClient}
            handleEditClient={handleEditClient}
            handleCancel={() => setIsFormEditOpen(false)}
          />
        )}
      </div>
  );
}
