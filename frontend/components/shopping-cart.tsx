"use client"

import { useState } from 'react'
import { ShoppingCart as ShoppingCartIcon, X, Plus, Minus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "./ui/separator"

interface Reservation {
  id: string
  vehicleName: string
  startDate: string
  endDate: string
  price: number
  quantity: number
}

export function ShoppingCart() {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: '1',
      vehicleName: 'Economy Car',
      startDate: '2024-01-01',
      endDate: '2024-01-05',
      price: 50,
      quantity: 1
    },
    {
      id: '2',
      vehicleName: 'Luxury SUV',
      startDate: '2024-02-15',
      endDate: '2024-02-20',
      price: 120,
      quantity: 1
    }
  ])

  const updateQuantity = (id: string, newQuantity: number) => {
    setReservations(reservations.map(reservation => 
      reservation.id === id ? { ...reservation, quantity: Math.max(0, newQuantity) } : reservation
    ).filter(reservation => reservation.quantity > 0))
  }

  const totalItems = reservations.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = reservations.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCartIcon className="h-5 w-5 text-slate-50" />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Reservations</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-10rem)] py-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="flex items-center space-x-4 py-4">
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold">{reservation.vehicleName}</h3>
                <p className="text-sm text-gray-500">
                  {reservation.startDate} to {reservation.endDate}
                </p>
                <p className="text-sm font-medium">${reservation.price.toFixed(2)} per day</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(reservation.id, reservation.quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span>{reservation.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(reservation.id, reservation.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
        <Separator className="my-4" />
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Total</span>
            <span className="font-semibold">${totalPrice.toFixed(2)}</span>
          </div>
          <Button className="w-full">Checkout</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

