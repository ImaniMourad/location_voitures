'use client';

import { useState } from "react";
import List from "@/components/List";
import { FormAdd } from "@/components/FormAdd";

const initialClients = [
    { id: 1, nom: "Dupont", prenom: "Jean", email: "jean.dupont@email.com", telephone: "0123456789" },
    { id: 2, nom: "Martin", prenom: "Marie", email: "marie.martin@email.com", telephone: "0987654321" },
    { id: 3, nom: "Dubois", prenom: "Pierre", email: "pierre.dubois@email.com", telephone: "0654321987" },
    { id: 4, nom: "Lefebvre", prenom: "Sophie", email: "sophie.lefebvre@email.com", telephone: "0321654987" },
];

export default function list() {
    const [clients, setClients] = useState(initialClients);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    const columns = [
        { header: "Nom", accessor: "nom" },
        { header: "Prénom", accessor: "prenom" },
        { header: "Email", accessor: "email" },
        { header: "Téléphone", accessor: "telephone" },
    ];

    const handleAddClient = (newClient) => {
        const updatedClients = [...clients, { ...newClient, id: clients.length + 1 }];
        setClients(updatedClients);
    };

    const handleEditClient = (updatedClient) => {
        const updatedClients = clients.map((client) =>
            client.id === updatedClient.id ? updatedClient : client
        );
        setClients(updatedClients);
        setEditingClient(null);
    };

    const handleDeleteClient = (id) => {
        const updatedClients = clients.filter((client) => client.id !== id);
        setClients(updatedClients);
    };

    return (
        <div className="w-[90%] mx-auto">
            <h1 className="text-3xl font-extrabold text-white mb-7 ml-5 pt-7">Gestion des Clients</h1>
            <List
                name="Client"
                columns={columns}
                rows={clients}
                onEdit={setEditingClient}
                onDelete={handleDeleteClient}
                onAdd={() => setIsFormOpen(true)}
            />
            {isFormOpen && (
                <FormAdd
                    formTitle="Ajouter Client"
                    fields={[
                        { name: 'nom', label: 'Nom', type: 'text' },
                        { name: 'prenom', label: 'Prénom', type: 'text' },
                        { name: 'email', label: 'Email', type: 'email' },
                        { name: 'telephone', label: 'Téléphone', type: 'tel' },
                    ]}
                    onSubmit={handleAddClient}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
}
