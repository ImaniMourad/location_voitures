import { useState, useEffect } from 'react'
import { ShoppingCart, Calendar, Clock, CreditCard, Car, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { jwtDecode } from "jwt-decode"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RESERVATION_UPDATED_EVENT } from './event' 


interface Reservation {
  id: number
  vehicleName: string
  startDate: string
  endDate: string
  paidAt: string | null
  name: string
}

interface JWTPayload {
  cin: string
  sub: string
}

interface ReservationDropdownProps {
  handleClickedReservation: (id: number) => void
}

export function ReservationDropdown({handleClickedReservation }: ReservationDropdownProps) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all')
  const [showContent, setShowContent] = useState(true)

  const handleErrorMessage = (message: string) => {
    setError(message)
    setLoading(false)
  }

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const jwtToken = localStorage.getItem("jwtToken")
        if (!jwtToken) {
          handleErrorMessage("Not authenticated. Please login again.")
          return
        }
    
        const decodedToken = jwtDecode<JWTPayload>(jwtToken)
        const cin = decodedToken.cin || decodedToken.sub
        if (!cin) throw new Error("CIN not found in token")

        const response = await fetch(`http://localhost:8081/reservations/client/${cin}`, {
          headers: { 'Authorization': `Bearer ${jwtToken}` }
        })

        if (!response.ok) throw new Error('Failed to fetch reservations')

        const data = await response.json()
        data.forEach((reservation: any) => {
          reservation.id = Number(reservation.id) // Convert id to number
        })

        setReservations(data)
      } catch (err) {
        handleErrorMessage(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    window.addEventListener(RESERVATION_UPDATED_EVENT, fetchReservations);

    return () => {
      window.removeEventListener(RESERVATION_UPDATED_EVENT, fetchReservations);
      fetchReservations(); 
    };
  }, []);

  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'paid') return reservation.paidAt
    if (filter === 'pending') return !reservation.paidAt
    return true
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const days = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / 
      (1000 * 60 * 60 * 24)
    )
    return `${days} day${days > 1 ? 's' : ''}`
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative hover:bg-slate-800/50 transition-colors duration-200"
        >
          <ShoppingCart className="h-5 w-5 text-slate-50" />
          {reservations.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white ring-2 ring-black animate-in zoom-in">
              {reservations.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      {showContent && (
      <DropdownMenuContent 
        className="w-[330px] p-0 bg-slate-900/95 border-slate-800 text-slate-50 shadow-xl z-10"
        align="end"
      >
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Your Reservations</h3>
            <span className="text-sm text-slate-400">
              {filteredReservations.length} {filteredReservations.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <Tabs defaultValue="all" className="w-full" onValueChange={(v) => setFilter(v as any)}>
            <TabsList className="grid w-full grid-cols-3 bg-slate-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">All</TabsTrigger>
              <TabsTrigger value="paid" className="data-[state=active]:bg-slate-700">Paid</TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-slate-700">Pending</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <ScrollArea className="h-[500px]">
          {loading && (
            <div className="p-6 text-center text-slate-400">
              Loading reservations...
            </div>
          )}
          
          {error && (
            <div className="p-6 text-center text-red-400 bg-red-950/20">
              {error}
            </div>
          )}
          
          {!loading && !error && filteredReservations.length === 0 && (
            <div className="p-6 text-center text-slate-400">
              No {filter !== 'all' ? filter : ''} reservations found
            </div>
          )}
          
          {!loading && !error && filteredReservations.map((reservation) => (
            <div 
              key={reservation.id} 
              className="p-4 hover:bg-slate-800/50 transition-colors duration-200 cursor-pointer"
              onClick={() => handleClickedReservation(reservation.id)
                
              }
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Car className="h-6 w-6 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-lg text-slate-50">
                          {reservation.name}
                        </h4>
                      </div>
                    </div>
                    <div 
                      className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                        reservation.paidAt 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}
                    >
                      <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                      {reservation.paidAt ? 'Paid' : 'Pending'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-300">
                      <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                      <span>
                        {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-slate-300">
                      <Clock className="h-4 w-4 mr-2 text-slate-400" />
                      <span>{calculateDuration(reservation.startDate, reservation.endDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="mt-4 bg-slate-800" />
            </div>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}

export default ReservationDropdown