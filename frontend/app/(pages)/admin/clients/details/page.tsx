"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import Image from "next/image"
import { Mail, Phone, MapPin, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badger"
import { useTheme } from "@/context/context"
import Spinner from "@/components/ui/spinner"
import { useRouter, useSearchParams } from "next/navigation"

interface Customer {
  cin: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  address: string
}

export default function CustomerProfile() {
  const { isDarkMode } = useTheme()
  const [customerData, setCustomerData] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const cardRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const cin = searchParams.get("cin")

  useEffect(() => {
    if (cin) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        console.error("Not authenticated")
        setLoading(false)
        return
      }

      axios
        .get(`${apiUrl}/User/${cin}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCustomerData(response.data)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching customer data:", error)
          setLoading(false)
        })
    }
  }, [cin])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        handleCancel()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCancel = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!customerData) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="text-white text-lg">Customer not found</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card
        ref={cardRef}
        className={`border-blue-600 w-full max-w-md shadow-2xl ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      >
        <CardContent className="p-4">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 ${
              isDarkMode
                ? "text-gray-400 hover:text-white hover:bg-gray-800"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
            onClick={handleCancel}
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="flex flex-col items-center pt-6">
            {/* Profile Image */}
            <div
              className={`w-20 h-20 rounded-full overflow-hidden mb-4 border-2 ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <Image
                src="/images/default-avatar.png"
                width={80}
                height={80}
                alt={`${customerData.firstName} ${customerData.lastName}`}
                className="object-cover"
              />
            </div>

            {/* Customer Information */}
            <div className="text-center mb-6">
              <h1 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {customerData.firstName} {customerData.lastName}
              </h1>
              <Badge
                variant="outline"
                className={`text-xs ${isDarkMode ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-600"}`}
              >
                {customerData.cin}
              </Badge>
            </div>

            {/* Contact Information */}
            <div className={`w-full space-y-4 p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${isDarkMode ? "bg-blue-900/30" : "bg-blue-100"}`}>
                  <Mail className={`w-4 h-4 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                </div>
                <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {customerData.email}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${isDarkMode ? "bg-green-900/30" : "bg-green-100"}`}>
                  <Phone className={`w-4 h-4 ${isDarkMode ? "text-green-400" : "text-green-500"}`} />
                </div>
                <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {customerData.phoneNumber}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${isDarkMode ? "bg-purple-900/30" : "bg-purple-100"}`}>
                  <MapPin className={`w-4 h-4 ${isDarkMode ? "text-purple-400" : "text-purple-500"}`} />
                </div>
                <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {customerData.address}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
