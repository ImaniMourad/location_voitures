'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { User, Mail, Phone, MapPin, X } from 'lucide-react';

interface Customer {
  cin: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

type CustomerProfileProps = {
  cin: string;
  handleCancel: () => void;
};

export default function CustomerProfile({ cin, handleCancel }: CustomerProfileProps) {
  const [customerData, setCustomerData] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cin) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error('Not authenticated');
        setLoading(false);
        return;
      }

      axios
        .get(`${apiUrl}/User/${cin}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCustomerData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching customer data:', error);
          setLoading(false);
        });
    }
  }, [cin]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!customerData) {
    return <p>Customer not found</p>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-2xl text-gray-100 max-w-4xl mx-auto relative">
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
          aria-label="Cancel and close"
        >
          <X className="w-6 h-6 text-gray-300" />
        </button>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Main Image */}
          <div className="md:w-1/3">
            <Image
              className="w-full h-auto rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"
              src="/images/default-avatar.png"
              width={300}
              height={300}
              alt={`${customerData.firstName} ${customerData.lastName}`}
            />
          </div>

          <div className="md:w-2/3 space-y-4">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{`${customerData.firstName} ${customerData.lastName}`}</h1>
              <p className="text-indigo-300 text-lg italic">
                CIN: {customerData.cin}
              </p>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-indigo-400" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-300">{customerData.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-indigo-400" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-300">{customerData.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="w-6 h-6 text-indigo-400" />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-300">{customerData.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

