'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data - in a real application, this would come from your backend
const monthlyRevenue = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 4500 },
    { month: "May", revenue: 6000 },
    { month: "Jun", revenue: 7000 },
    { month: "Jul", revenue: 8000 },
    { month: "Aug", revenue: 9000 },
    { month: "Sep", revenue: 10000 },
    { month: "Oct", revenue: 11000 },
    { month: "Nov", revenue: 12000 },
    { month: "Dec", revenue: 13000 },
]

const reservationsByType = [
    { type: "Citadine", count: 120 },
    { type: "Berline", count: 80 },
    { type: "SUV", count: 60 },
    { type: "Utilitaire", count: 40 },
]

const occupancyRate = [
    { month: "Jan", rate: 75 },
    { month: "Feb", rate: 68 },
    { month: "Mar", rate: 80 },
    { month: "Apr", rate: 85 },
    { month: "May", rate: 90 },
    { month: "Jun", rate: 95 },
]

export default function AdminStatisticsPage() {
    return (
        <div className="min-h-screen bg-[#030712] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-white mb-10">Statistiques</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-gray-800 text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">29,500€</div>
                            <p className="text-xs text-gray-400">+20.1% par rapport au mois dernier</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800 text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+2350</div>
                            <p className="text-xs text-gray-400">+180.1% par rapport au mois dernier</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800 text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-gray-400">+2 par rapport au mois dernier</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800 text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Taux d'Occupation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">85%</div>
                            <p className="text-xs text-gray-400">+5% par rapport au mois dernier</p>
                        </CardContent>
                    </Card>
                    <Card className="col-span-4 bg-gray-800 text-white">
                        <CardHeader>
                            <CardTitle>Revenu Mensuel</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ChartContainer
                                config={{
                                    revenue: {
                                        label: "Revenu",
                                        color: "hsl(var(--chart-1))",
                                    },
                                }}
                                className="h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyRevenue}>
                                        <XAxis
                                            dataKey="month"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}€`}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent/>}/>
                                        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]}/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card className="col-span-2 bg-gray-800 text-white">
                        <CardHeader>
                            <CardTitle>Reservations by Vehicle Type</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ChartContainer
                                config={{
                                    count: {
                                        label: "Nombre de réservations",
                                        color: "hsl(var(--chart-2))",
                                    },
                                }}
                                className="h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={reservationsByType}>
                                        <XAxis
                                            dataKey="type"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent/>}/>
                                        <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]}/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card className="col-span-2 bg-gray-800 text-white">
                        <CardHeader>
                            <CardTitle>Taux d'Occupation Mensuel</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ChartContainer
                                config={{
                                    rate: {
                                        label: "Taux d'occupation",
                                        color: "hsl(var(--chart-3))",
                                    },
                                }}
                                className="h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={occupancyRate}>
                                        <XAxis
                                            dataKey="month"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}%`}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent/>}/>
                                        <Line type="monotone" dataKey="rate" stroke="var(--color-rate)"
                                              strokeWidth={2}/>
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}