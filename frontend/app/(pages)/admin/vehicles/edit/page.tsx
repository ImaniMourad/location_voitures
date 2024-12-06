"use client";

import { useState, useEffect } from "react";

interface VehicleData {
  marque: string;
  model: string;
  annee: string;
  tarif_location: string;
  statut: string;
  type: string;
  image: File | null;
}

export default function EditVehicleForm() {
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    marque: "Audi",
    model: "A3",
    annee: "2022",
    tarif_location: "60",
    statut: "disponible",
    type: "Compacte",
    image: null as File | null
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      const id = "1";
      if (id) {
        try {
          const response = await fetch(`/api/vehicles/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch vehicle data");
          }
          const data: VehicleData = await response.json();
          setVehicleData(data);
        } catch (error) {
          console.error("Error fetching vehicle data:", error);
        }
      }
    };

    fetchInitialData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files) {
        setVehicleData((prev) => ({ ...prev, image: e.target.files[0] }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 text-slate-100 rounded-lg shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-semibold text-slate-100">Modifier un Véhicule</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {[
            { id: "marque", label: "Marque", type: "text", value: vehicleData.marque },
            { id: "model", label: "Modèle", type: "text", value: vehicleData.model },
            { id: "annee", label: "Année", type: "number", value: vehicleData.annee },
            { id: "tarif_location", label: "Tarif de location", type: "number", value: vehicleData.tarif_location },
            { id: "type", label: "Type", type: "text", value: vehicleData.type },
          ].map(({ id, label, type, value }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-slate-200 mb-1">
                {label}
              </label>
              <input
                id={id}
                name={id}
                type={type}
                value={value}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onChange={handleInputChange}
              />
            </div>
          ))}
          <div>
            <label htmlFor="statut" className="block text-sm font-medium text-slate-200 mb-1">
              Statut
            </label>
            <select
              id="statut"
              name="statut"
              value={vehicleData.statut}
              required
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onChange={handleInputChange}
            >
              <option value="">Sélectionnez un statut</option>
              <option value="disponible">Disponible</option>
              <option value="loue">Loué</option>
              <option value="maintenance">En maintenance</option>
            </select>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-slate-200 mb-1">
              Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              onChange={handleFileChange}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Modifier le véhicule
          </button>
        </form>
      </div>
    </div>
  );
}
