import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, Car, CreditCard, X } from 'lucide-react';
import { useTheme } from '@/context/context';
import Spinner from '@/components/ui/spinner';
import PayPalButton from '@/app/componentsPayPal/PayPalButton';

interface ReservationData {
  startDate: string;
  endDate: string;
  clientCIN: string; 
  clientName: string;
  vehicleId: string;
  vehicleBrand: string;
  vehicleModel: string;
  totalPrice: number;
  paidAt : string | null;
}

export default function ReservationDetails({ 
  reservationId, 
  handleCancel 
}: { 
  reservationId: number; 
  handleCancel: () => void;
}) {
  const { isDarkMode } = useTheme();
  const [data, setData] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const fetchReservation = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;
        const response = await fetch(`${apiUrl}/reservation/${reservationId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const reservation = await response.json();
        setData(reservation);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReservation();
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only handle clicks on the container background, not the card or its contents
      if (containerRef.current === event.target) {
        handleCancel();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleCancel]);

  if (loading) return <div className="flex justify-center"><Spinner /></div>;

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card ref={cardRef} className={`w-full max-w-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <CardContent className="p-4 relative">
          <button
            onClick={handleCancel}
            className="absolute right-4 top-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1"
          >
            <X size={20} className="text-gray-500" />
          </button>
          <div className="space-y-4">
            {/* Dates */}
            <div className="flex items-start gap-2 bg-blue-50/50 dark:bg-blue-950/50 p-3 rounded-lg">
              <Calendar size={18} className="mt-1 text-blue-500" />
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">From</div>
                  <div className="font-medium">{data?.startDate}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">To</div>
                  <div className="font-medium">{data?.endDate}</div>
                </div>
              </div>
            </div>

            {/* Client */}
            <div className="flex items-start gap-2 bg-purple-50/50 dark:bg-purple-950/50 p-3 rounded-lg">
              <User size={18} className="mt-1 text-purple-500" />
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">CIN</div>
                  <div className="font-medium">{data?.clientCIN}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Name</div>
                  <div className="font-medium">{data?.clientName}</div>
                </div>
              </div>
            </div>

            {/* Vehicle */}
            <div className="flex items-start gap-2 bg-green-50/50 dark:bg-green-950/50 p-3 rounded-lg">
              <Car size={18} className="mt-1 text-green-500" />
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">License</div>
                    <div className="font-medium">{data?.vehicleId}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Brand</div>
                    <div className="font-medium">{data?.vehicleBrand}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Model</div>
                  <div className="font-medium">{data?.vehicleModel}</div>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between bg-yellow-50/50 dark:bg-yellow-950/50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-yellow-600" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Amount</span>
              </div>
              <span className="font-bold text-lg">{data?.totalPrice} MAD</span>
            </div>
          </div>
          {data?.paidAt === null && (
          <div className="mt-4 cursor-pointer">
            <PayPalButton idReservation={reservationId} price={data?.totalPrice || 0} />
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}