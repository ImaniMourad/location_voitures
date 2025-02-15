import Image from "next/image";
import { Car, Fuel, Gauge, Cog, X } from "lucide-react";

interface VehicleProfileProps {
  licensePlate: string;
  brand: string;
  model: string;
  year: string;
  type: string;
  status: string;
  price: number;
  horsePower: string;
  capacity: string;
  features: string[];
  pathImg: string;
  onCancel: () => void;
}

export default function VehicleProfile({
  licensePlate,
  brand,
  model,
  year,
  type,
  status,
  price,
  horsePower,
  capacity,
  features,
  pathImg,
  onCancel,
}: VehicleProfileProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-2xl text-gray-100 max-w-5xl mx-auto relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
          aria-label="Annuler et fermer"
        >
          <X className="w-6 h-6 text-gray-300" />
        </button>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image principale */}
          <div className="md:w-1/2">
            <Image
              className="w-full h-auto rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"
              src={pathImg}
              width={400}
              height={300}
              alt={`${brand} ${model}`}
            />
          </div>

          <div className="md:w-1/2 space-y-4">
            {/* Titre */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{`${brand} ${model}`}</h1>
              <p className="text-indigo-300 text-lg italic">
                {type} - Année {year}
              </p>
            </div>

            {/* Tarif */}
            <div className="bg-indigo-600 px-6 py-4 rounded-xl shadow-md inline-block">
              <p className="text-2xl font-semibold">
                Tarif: {price.toFixed(2)} €
                <span className="text-base font-normal">/jour</span>
              </p>
            </div>

            {/* Status */}
            <div>
              <h2 className="text-xl font-bold mb-2">Status</h2>
              <p className="text-gray-300 leading-relaxed">{status}</p>
            </div>

            {/* Spécifications */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Car className="w-6 h-6 text-indigo-400" />
                <div>
                  <h3 className="font-semibold">Horse Power</h3>
                  <p className="text-gray-300">{horsePower} HP</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Cog className="w-6 h-6 text-indigo-400" />
                <div>
                  <h3 className="font-semibold">Capacity</h3>
                  <p className="text-gray-300">{capacity} seats</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Fuel className="w-6 h-6 text-indigo-400" />
                <div>
                  <h3 className="font-semibold">License Plate</h3>
                  <p className="text-gray-300">{licensePlate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        {features && features.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Features</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bouton of reservation */}
        <div className="mt-6 text-center">
          <button
            className="inline-block px-8 py-4 bg-indigo-600 rounded-full text-white text-lg font-semibold shadow-lg hover:bg-indigo-700 transition-colors duration-300 ease-in-out"
            onClick={() => {
              // Add reservation logic here
              console.log(
                `Reserving vehicle with license plate: ${licensePlate}`
              );
            }}
          >
            Reserve this vehicle
          </button>
        </div>
      </div>
    </div>
  );
}
