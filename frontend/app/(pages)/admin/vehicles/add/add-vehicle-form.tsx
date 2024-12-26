"use client"

import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileSelect } from "@/components/ui/file-select"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'
import Spinner from '@/components/ui/spinner'

interface FormAddProps {
  handleCancel: () => void;
  onAddVehicle: (vehicleData: any) => void;
  onErrorMessage: (message: string) => void;
}


export default function AddVehicleForm({ handleCancel, onAddVehicle, onErrorMessage }: FormAddProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [vehicleData, setVehicleData] = useState({
    licensePlate: "",
    brand: "",
    model: "",
    year: 0,
    price: 0,
    status: "AVAILABLE",
    features: "",
    type: "",
    image: null as File | null,
    horsepower: 0,
    capacity: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    console.log(name, value, type);
    setVehicleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("licensePlate", vehicleData.licensePlate);
    formData.append("brand", vehicleData.brand);
    formData.append("model", vehicleData.model);
    formData.append("year", vehicleData.year.toString());
    formData.append("type", vehicleData.type);
    formData.append("status", vehicleData.status);
    formData.append("features", vehicleData.features);
    formData.append("price", vehicleData.price.toString());
    formData.append("horsePower", vehicleData.horsepower.toString());
    formData.append("capacity", vehicleData.capacity.toString());
    formData.append("image", vehicleData.image!);

    console.log(vehicleData);

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("No token found");
      setLoading(false);
      router.push("/signin");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await axios.post(`${apiUrl}/vehicles`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        console.log("Vehicle added successfully");
        onAddVehicle(vehicleData);
        handleCancel();
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        onErrorMessage(error.response.data);
        handleCancel();
      } else {
        console.error("Error adding vehicle:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {/* { loading && <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50">} */}
    {loading && <Spinner />}
    <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 overflow-y-auto ml-0 md:ml-64 z-50">
      <div className="bg-slate-900 rounded-xl w-full max-w-4xl my-4 p-6 space-y-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Add Vehicle</h2>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={handleCancel}>
            <X className="h-15 w-15" />
          </Button>
        </div>

        {/* Form */}
        <form className="space-y-6 overflow-y-auto" onSubmit={handleSubmit}>
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-200">License Plate</label>
              <Input 
                className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:ring-slate-400 focus:border-slate-400" 
                placeholder="Enter license plate"
                onChange={handleInputChange}
                value={vehicleData.licensePlate}
                required
                name='licensePlate'
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-200">Model</label>
              <Input 
                className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:ring-slate-400 focus:border-slate-400" 
                placeholder="Enter model"
                onChange={handleInputChange}
                value={vehicleData.model}
                required
                name='model'
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-200">Brand</label>
              <Input 
                className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:ring-slate-400 focus:border-slate-400" 
                placeholder="Enter brand"
                onChange={handleInputChange}
                value={vehicleData.brand}
                required
                name='brand'
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-200">Year</label>
              <Input 
                type="number" 
                defaultValue="1900"
                className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:ring-slate-400 focus:border-slate-400" 
                placeholder="Enter year"
                onChange={handleInputChange}
                value={vehicleData.year}
                required
                name='year'
                min="1900"
                max="3000"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-200">Price</label>
              <Input 
                type="number"
                className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:ring-slate-400 focus:border-slate-400" 
                placeholder="Enter price"
                onChange={handleInputChange}
                value={vehicleData.price}
                required
                name='price'
                min="1"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-200">Status</label>
              <Select defaultValue={vehicleData.status} onValueChange={(value) => setVehicleData((prev) => ({ ...prev, status: value }))} required name='status'>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100 focus:ring-slate-400 focus:border-slate-400">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="AVAILABLE" className="text-slate-100 focus:bg-slate-700">Available</SelectItem>
                  <SelectItem value="RESERVED" className="text-slate-100 focus:bg-slate-700">Reserved</SelectItem>
                  <SelectItem value="IN_MAINTENANCE" className="text-slate-100 focus:bg-slate-700">In Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-200">Type</label>
              <Input 
                className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:ring-slate-400 focus:border-slate-400" 
                placeholder="Enter type"
                onChange={handleInputChange}
                value={vehicleData.type}
                name='type'
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-200">Horsepower</label>
              <Input 
                type="number"
                className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:ring-slate-400 focus:border-slate-400" 
                placeholder="Enter horsepower"
                onChange={handleInputChange}
                value={vehicleData.horsepower}
                name='horsepower'
                min="0"
              />
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-200">Capacity</label>
              <Input 
                type="number"
                className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:ring-slate-400 focus:border-slate-400" 
                placeholder="Enter capacity"
                onChange={handleInputChange}
                value={vehicleData.capacity}
                name='capacity'
                min="0"
              />
            </div>
            <div className="space-y-1 md:col-span-3">
              <label className="text-sm font-medium text-slate-200">Features</label>
              <Textarea 
                className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:ring-slate-400 focus:border-slate-400 min-h-[60px]" 
                placeholder="Enter vehicle features"
                onChange={handleInputChange}
                value={vehicleData.features}
                name='features'
              />
            </div>
          </div>

          {/* Image Upload */}
          <FileSelect 
            label="Image"
            accept="image/*"
            buttonText="Choose a file"
            noFileText="No file chosen"
            className="text-slate-200"
            onFileSelect={(file) => setVehicleData((prev) => ({ ...prev, image: file }))}
            value={vehicleData.image}
            name='image'
          />

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-2 pt-4">
            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
              Add Vehicle
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
    </>

  )
}

