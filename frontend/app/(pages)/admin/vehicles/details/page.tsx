'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Car, Fuel, Cog, X, Check, ActivitySquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badger';
import { Separator } from "@/components/ui/separator";
import { useTheme } from '@/context/context';
import Spinner from '@/components/ui/spinner';

interface VehicleData {
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
}

type VehicleDetailsProps = {
  licensePlate: string;
  handleCancel: () => void;
};

export default function VehicleDetails({ licensePlate, handleCancel }: VehicleDetailsProps) {
  const { isDarkMode } = useTheme();
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return isDarkMode ? 'bg-green-600' : 'bg-green-500';
      case 'rented':
        return isDarkMode ? 'bg-red-600' : 'bg-red-500';
      case 'maintenance':
        return isDarkMode ? 'bg-yellow-600' : 'bg-yellow-500';
      default:
        return isDarkMode ? 'bg-gray-600' : 'bg-gray-500';
    }
  };

  useEffect(() => {
    if (licensePlate) {
      axios
        .get(`http://localhost:8081/vehicle/${licensePlate}`)
        .then((response) => {
          const data = response.data;
          data.features = data.features ? data.features.split(',') : [];
          setVehicleData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching vehicle data:', error);
          setLoading(false);
        });
    }
  }, [licensePlate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        handleCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleCancel]);

  if (loading) {
    return (
     <div>
        <Spinner />
     </div>
    );
  }

  if (!vehicleData) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="text-white text-lg">Vehicle not found</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card 
        ref={cardRef} 
        className={`w-full max-w-lg shadow-2xl ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        <CardContent className="p-0">
          {/* Header Image Section */}
          <div className="relative h-64 w-full">
            <Image
              src={`http://localhost:8081/uploads/${vehicleData.pathImg}`}
              fill
              alt={`${vehicleData.brand} ${vehicleData.model}`}
              className="object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Price Badge */}
            <Badge 
              variant="default" 
              className={`absolute top-4 right-4 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} px-4 py-1`}
            >
              {vehicleData.price.toFixed(2)} €/jour
            </Badge>

            {/* Status Badge */}
            <Badge 
              variant="default" 
              className={`absolute top-4 left-4 ${getStatusColor(vehicleData.status)} px-4 py-1`}
            >
              {vehicleData.status}
            </Badge>

            {/* Vehicle Name Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-2xl font-bold text-white mb-1">
                {vehicleData.brand} {vehicleData.model}
              </h1>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {vehicleData.year}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {vehicleData.licensePlate}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-6">
            {/* Status Section */}
            <div className={`flex items-center gap-3 p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <ActivitySquare className={`w-6 h-6 ${getStatusColor(vehicleData.status)} text-white p-1 rounded`} />
              <div>
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Status</span>
                <p className={`font-semibold capitalize ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{vehicleData.status}</p>
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Car, label: 'Power', value: `${vehicleData.horsePower} HP` },
                { icon: Cog, label: 'Capacity', value: `${vehicleData.capacity} seats` },
                { icon: Fuel, label: 'Type', value: vehicleData.type }
              ].map((spec, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                  }`}
                >
                  <spec.icon className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mb-2`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {spec.label}
                  </span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Features Section */}
            {vehicleData.features && vehicleData.features.length > 0 && (
              <>
                <Separator className={isDarkMode ? 'bg-gray-700' : ''} />
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {vehicleData.features.map((feature, index) => (
                      <div 
                        key={index}
                        className={`flex items-center gap-2 text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        <Check className={isDarkMode ? 'text-blue-400' : 'text-blue-500'} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}