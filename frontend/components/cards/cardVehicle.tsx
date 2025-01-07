'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Car, Fuel, Cog, Check, ActivitySquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badger';
import { Separator } from "@/components/ui/separator";
import { Button } from '@/components/ui/button';
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

type VehicleDetailsCardProps = {
    licensePlate: string;
};


export default function VehicleDetailsCard({ licensePlate }: VehicleDetailsCardProps) {
    const { isDarkMode } = useTheme();
    const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);

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

    if (loading) {
        return (
            <Card className={`w-full max-w-md shadow-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <CardContent className="flex items-center justify-center h-48">
                    <Spinner />
                </CardContent>
            </Card>
        );
    }

    if (!vehicleData) {
        return (
            <Card className={`w-full max-w-md shadow-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <CardContent className="p-4">
                    <div className="text-center">Vehicle not found</div>
                </CardContent>
            </Card>
        );
    }

    const handleOnClickReserve = () => {
        // prendre la date de début et la date de fin depuis link de la page
        const urlParams = new URLSearchParams(window.location.search);
        const startDate = urlParams.get("startDate") || undefined;
        const endDate = urlParams.get("endDate") || undefined;
        // envoyer les dates de début et de fin et id de véhicule et id client depuis tokenjwt et envoyer en backend
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            return;
        }
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const clientId = decodedToken.sub;
        axios.post(`http://localhost:8081/reservations`, {
            startDate: startDate,
            endDate: endDate,
            vehicleId: vehicleData.licensePlate,
            clientId: clientId
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error('Error reserving vehicle:', error);
        });
    }

    return (
        <Card 
            className={`w-full max-w-md shadow-2xl border ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
            }`}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            <CardContent className="p-0">
            {/* Header Image Section */}
            <div className="relative h-48 w-full">
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
            className={`absolute top-3 right-3 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} px-3 py-1`}
            >
            {vehicleData.price.toFixed(2)} MAD/jour
            </Badge>

            {/* Vehicle Name Overlay */}
            <div className="absolute bottom-3 left-3 right-3">
            <h1 className="text-xl font-bold text-white mb-1">
                {vehicleData.brand} {vehicleData.model}
            </h1>
            <div className="flex gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                {vehicleData.year}
                </Badge>
            </div>
            </div>
            </div>

            {/* Details Section */}
            <div className="p-4 space-y-4">
            {/* Specifications Grid */}
            <div className="grid grid-cols-3 gap-2">
            {[
                { icon: Car, label: 'Power', value: `${vehicleData.horsePower} HP` },
                { icon: Cog, label: 'Capacity', value: `${vehicleData.capacity} seats` },
                { icon: Fuel, label: 'Type', value: vehicleData.type }
            ].map((spec, index) => (
                <div
                key={index}
                className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}
                >
                <spec.icon className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mb-1`} />
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {spec.label}
                </span>
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {spec.value}
                </span>
                </div>
            ))}
            </div>

            {/* Features Section */}
            {expanded && vehicleData.features && vehicleData.features.length > 0 && (
            <>
                <Separator className={isDarkMode ? 'bg-gray-700' : ''} />
                <div>
                <h3 className={`text-base font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Features</h3>
                <div className="grid grid-cols-2 gap-1">
                {vehicleData.features.map((feature, index) => (
                <div 
                    key={index}
                    className={`flex items-center gap-1 text-xs ${
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

            <Button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-sm" 
                onClick={handleOnClickReserve}
            >
                Réserver
            </Button>
            </div>
            </CardContent>
        </Card>
    );
}
