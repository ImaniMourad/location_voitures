'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import VehicleDetailsCard from "@/components/cards/cardVehicle";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Card as UICard, CardContent } from "@/components/ui/card";
import * as Slider from '@radix-ui/react-slider';
import PageIllustration from "@/components/page-illustration";



export default function Page() {
    interface LocationState {
        startDate?: string;
        endDate?: string;
    }

    const router = useRouter();
    const [queryParams, setQueryParams] = useState<LocationState>({
        startDate: undefined,
        endDate: undefined,
    });

    const [vehicles, setVehicles] = useState<Array<{
        licensePlate: string;
        id: string;
        brand: string;
        model: string;
        year: number;
        price: number;
        type: string;
        pathImg: string;
    }>>([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredVehicles, setFilteredVehicles] = useState(vehicles);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [maxPrice, setMaxPrice] = useState(1000);
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const startDate = urlParams.get("startDate") || undefined;
        const endDate = urlParams.get("endDate") || undefined;

        setQueryParams({ startDate, endDate });
    }, []);

    const fetchVehicles = useCallback(async () => {
        if (!queryParams.startDate || !queryParams.endDate) return;

        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                console.error("No token found");
                return;
            }
            const response = await axios.get(`${apiUrl}/vehicles/available`, {
                params: {
                    startDate: queryParams.startDate,
                    endDate: queryParams.endDate,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Vehicles fetched:", response.data);
            const vehiclesData = response.data.map((vehicle: { licensePlate: any; }) => ({
                ...vehicle,
                id: vehicle.licensePlate,
            }));
            setVehicles(vehiclesData);
            setFilteredVehicles(vehiclesData);

            // Set initial max price based on the highest vehicle price
            const highestPrice = Math.max(...vehiclesData.map((v: { price: any; }) => v.price));
            setMaxPrice(highestPrice);
            setPriceRange([0, highestPrice]);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        }
    }, [queryParams, apiUrl, setVehicles, setMaxPrice, setPriceRange]);

    useEffect(() => {
        fetchVehicles(); // Initial fetch

    }, [fetchVehicles]);

    useEffect(() => {
        const searchTerms = searchQuery
            .toLowerCase()
            .split(" ")
            .map((term) => term.trim());

        const filtered = vehicles.filter((vehicle) => {
            const isPriceInRange = vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];

            const isSearchMatch = searchTerms.every((term) =>
                Object.values(vehicle).some(
                    (value) => value && value.toString().toLowerCase().includes(term)
                )
            );

            return isPriceInRange && isSearchMatch;
        });

        setFilteredVehicles(filtered);
    }, [searchQuery, vehicles, priceRange]);

    const handlePriceChange = (newValue: number[]) => {
        setPriceRange([newValue[0], newValue[1]]);
    };

    return (
        <section className="pt-10">
            <PageIllustration />
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="pb-12 md:pb-20">
                    <UICard className="mb-8 bg-gray-900/50 backdrop-blur-sm border-gray-800">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                                {/* Search Bar - prend 40% de l'espace */}
                                <div className="relative w-full md:w-2/5">
                                    <Input
                                        type="text"
                                        placeholder="Search by brand, model, type..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                                    />
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                </div>

                                {/* Price Range Section - prend 60% de l'espace */}
                                <div className="flex items-center gap-4 w-full md:w-3/5">
                                    <span className="text-sm text-gray-400 whitespace-nowrap">
                                        Price:
                                    </span>
                                    <div className="flex-grow px-2">
                                        <Slider.Root
                                            className="relative flex items-center select-none touch-none w-full h-5"
                                            value={[priceRange[0], priceRange[1]]}
                                            max={maxPrice}
                                            step={10}
                                            onValueChange={(newValue) => setPriceRange([newValue[0], newValue[1]])}
                                        >
                                            <Slider.Track className="bg-gray-700 relative grow rounded-full h-2">
                                                <Slider.Range className="absolute bg-indigo-500 rounded-full h-full" />
                                            </Slider.Track>
                                            <Slider.Thumb
                                                className="block w-5 h-5 bg-white rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                aria-label="Min price"
                                            />
                                            <Slider.Thumb
                                                className="block w-5 h-5 bg-white rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                aria-label="Max price"
                                            />
                                        </Slider.Root>
                                    </div>
                                    <span className="text-sm text-gray-400 whitespace-nowrap min-w-[100px]">
                                        {priceRange[0]} - {priceRange[1]} MAD
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </UICard>

                    {/* Results Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVehicles.map((vehicle) => (
                            <VehicleDetailsCard
                                key={vehicle.id}
                                licensePlate={vehicle.licensePlate}
                            />
                        ))}
                    </div>

                    {filteredVehicles.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">
                                No vehicles found matching your criteria
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}