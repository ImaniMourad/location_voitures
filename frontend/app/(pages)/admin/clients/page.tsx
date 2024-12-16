"use client";

import { useState, useMemo } from "react";
import List from "@/components/List";
import FormAdd from "./add/add-form-client";
import FormEdit from "./edit/edit-form-client";


type Client = {
  id: number;
  lastname: string;
  firstname: string;
  email: string;
  phone: string;
};

const initialClients: Client[] = [
  {
    id: 1,
    lastname: "Dupont",
    firstname: "Jean",
    email: "jean.dupont@email.com",
    phone: "0123456789",
  },
  {
    id: 2,
    lastname: "Martin",
    firstname: "Marie",
    email: "marie.martin@email.com",
    phone: "0987654321",
  },
  {
    id: 3,
    lastname: "Dubois",
    firstname: "Pierre",
    email: "pierre.dubois@email.com",
    phone: "0654321987",
  },
  {
    id: 4,
    lastname: "Lefebvre",
    firstname: "Sophie",
    email: "sophie.lefebvre@email.com",
    phone: "0321654987",
  },
];

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [isFormAddOpen, setIsFormAddOpen] = useState(false);
  const [isFormEditOpen, setIsFormEditOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Memoize columns to avoid re-creation on each render
  const columns = useMemo(
    () => [
      { header: "Lastname", accessor: "lastname" },
      { header: "Firstname", accessor: "firstname" },
      { header: "Email", accessor: "email" },
      { header: "Phone", accessor: "phone" },
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
