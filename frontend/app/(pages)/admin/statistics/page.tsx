"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useTheme } from "@/context/context";
import axios from "axios";

// Sample data - in a real application, this would come from your backend
const monthlyIncome = [
  { month: "Jan", income: 4000 },
  { month: "Feb", income: 3000 },
  { month: "Mar", income: 5000 },
  { month: "Apr", income: 4500 },
  { month: "May", income: 6000 },
  { month: "Jun", income: 7000 },
  { month: "Jul", income: 8000 },
  { month: "Aug", income: 9000 },
  { month: "Sep", income: 10000 },
  { month: "Oct", income: 11000 },
  { month: "Nov", income: 12000 },
  { month: "Dec", income: 13000 },
];

const vehicleRotation = [
  { month: "Jan", days: 2.5 },
  { month: "Feb", days: 2.8 },
  { month: "Mar", days: 2.3 },
  { month: "Apr", days: 2.0 },
  { month: "May", days: 1.8 },
  { month: "Jun", days: 1.5 },
  { month: "Jul", days: 1.7 },
  { month: "Aug", days: 1.6 },
  { month: "Sep", days: 1.9 },
  { month: "Oct", days: 2.0 },
  { month: "Nov", days: 1.8 },
  { month: "Dec", days: 1.5 },
];

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AdminStatisticsPage() {
  const { isDarkMode } = useTheme();
  const [totaleIcome, setTotalIncome] = useState(0);
  const [reservations, setReservations] = useState(0);
  const [availableVehicles, setAvailableVehicles] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [vehicleRotation, setVehicleRotation] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      return;
    }
    const fetchTotaleIcome = async () => {
      try {
        const response = await axios.get(`${apiUrl}/statistics/totalIncome`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTotalIncome(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchReservations = async () => {
      try {
        const response = await axios.get(`${apiUrl}/statistics/reservations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReservations(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchActiveVehicles = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/statistics/availableVehicles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAvailableVehicles(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchOccupancyRate = async () => {
      try {
        const response = await axios.get(`${apiUrl}/statistics/occupancyRate`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        response.data = response.data.toFixed(2);
        setOccupancyRate(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchMonthlyIncome = async () => {
      try {
        const response = await axios.get(`${apiUrl}/statistics/monthlyIncome`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        response.data = convertData(response.data, "income");
        setMonthlyIncome(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchVehicleRotation = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/statistics/vehicleRotation`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        response.data = convertData(response.data, "days");
        console.log("response.data", response.data);
        setVehicleRotation(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTotaleIcome();
    fetchReservations();
    fetchActiveVehicles();
    fetchOccupancyRate();
    fetchMonthlyIncome();
    fetchVehicleRotation();
  }, []);

  const convertData = (data: any, valueKey: string) => {
    data = data.map((item: { month: number; [key: string]: any }) => {
      return {
        month: monthNames[item.month - 1],
        [valueKey]: item[valueKey],
      };
    });
    const months = data.map((item: { month: string }) => item.month);
    for (let i = 0; i < 12; i++) {
      if (!months.includes(monthNames[i])) {
        data.push({ month: monthNames[i], [valueKey]: 0 });
      }
    }

    data.sort((a: { month: string }, b: { month: string }) => {
      return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
    });

    return data;
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-[#030712]" : "bg-gray-300"
      } py-12 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-7xl mx-auto">
        <h1
          className={`text-3xl font-extrabold ${
            isDarkMode ? "text-white" : "text-black"
          } mb-10`}
        >
          Statistics
        </h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card
            className={`${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totaleIcome} MAD</div>
            </CardContent>
          </Card>
          <Card
            className={`${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{reservations}</div>
            </CardContent>
          </Card>
          <Card
            className={`${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableVehicles}</div>
            </CardContent>
          </Card>
          <Card
            className={`${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Occupancy Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
            </CardContent>
          </Card>
          <Card
            className={`col-span-2 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Monthly Income (MAD)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyIncome}>
                    <XAxis
                      dataKey="month"
                      stroke="#aaaaaa"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#aaaaaa"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#404040",
                        borderRadius: "4px",
                        border: "none",
                        color: "#ffffff",
                      }}
                    />
                    <Bar
                      dataKey="income"
                      fill="#7D3DCB"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`col-span-2 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Average vehicle turnover time (days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vehicleRotation}>
                    <XAxis
                      dataKey="month"
                      stroke="#aaaaaa"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#aaaaaa"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value} j`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#404040",
                        borderRadius: "4px",
                        border: "none",
                        color: "#ffffff",
                      }}
                    />
                    <Bar dataKey="days" fill="#FFB74D" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
