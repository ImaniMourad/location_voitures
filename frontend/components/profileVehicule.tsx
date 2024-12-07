import Image from "next/image";
import { Car, Fuel, Gauge, Cog, X } from 'lucide-react';

interface VehicleProfileProps {
  imageSrc: string;
  marque: string;
  modele: string;
  annee: number;
  tarifLocation: number;
  type: string;
  description: string;
  motorisation: string;
  transmission: string;
  options?: string[];
  dimensions: string;
  consommation: number;
  to: string;
  onCancel: () => void;
}

export default function VehicleProfile({
  imageSrc,
  marque,
  modele,
  annee,
  tarifLocation,
  type,
  description,
  motorisation,
  transmission,
  options,
  dimensions,
  consommation,
  to,
  onCancel,
}: VehicleProfileProps) {
  return (
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
            src={imageSrc}
            width={400}
            height={300}
            alt={`${marque} ${modele}`}
          />
        </div>

        <div className="md:w-1/2 space-y-4">
          {/* Titre */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{`${marque} ${modele}`}</h1>
            <p className="text-indigo-300 text-lg italic">{type} - Année {annee}</p>
          </div>

          {/* Tarif */}
          <div className="bg-indigo-600 px-6 py-4 rounded-xl shadow-md inline-block">
            <p className="text-2xl font-semibold">
              Tarif: {tarifLocation} €<span className="text-base font-normal">/jour</span>
            </p>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p className="text-gray-300 leading-relaxed">{description}</p>
          </div>

          {/* Spécifications */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Car className="w-6 h-6 text-indigo-400" />
              <div>
                <h3 className="font-semibold">Motorisation</h3>
                <p className="text-gray-300">{motorisation}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Cog className="w-6 h-6 text-indigo-400" />
              <div>
                <h3 className="font-semibold">Transmission</h3>
                <p className="text-gray-300">{transmission}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Fuel className="w-6 h-6 text-indigo-400" />
              <div>
                <h3 className="font-semibold">Consommation</h3>
                <p className="text-gray-300">{consommation} L/100km</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Gauge className="w-6 h-6 text-indigo-400" />
              <div>
                <h3 className="font-semibold">Dimensions</h3>
                <p className="text-gray-300">{dimensions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      {options && options.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Options</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {options.map((option, index) => (
              <li key={index} className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">{option}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bouton de réservation */}
      <div className="mt-6 text-center">
        <a
          href={to}
          className="inline-block px-8 py-4 bg-indigo-600 rounded-full text-white text-lg font-semibold shadow-lg hover:bg-indigo-700 transition-colors duration-300 ease-in-out"
        >
       Reserve this vehicle
        </a>
      </div>
    </div>
  );
}

