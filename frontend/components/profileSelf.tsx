'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { jwtDecode } from 'jwt-decode';

interface Customer {
  cin: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface JWTPayload {
  cin?: string;
  sub?: string;
}

export default function CustomerProfile() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    async function fetchCustomerData() {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
          setError('Not authenticated. Please login again.');
          return;
        }

        let cin: string;
        try {
          const decodedToken = jwtDecode<JWTPayload>(jwtToken);
          cin = decodedToken.cin || decodedToken.sub || '';
          if (!cin) {
            throw new Error('CIN not found in token');
          }
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
          setError('Invalid authentication token');
          return;
        }

        const response = await fetch(`http://localhost:8081/User/${cin}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Customer = await response.json();
        setCustomer(data);
        setEditedCustomer(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching customer data:', error);
        setError('Failed to load profile data');
      }
    }

    fetchCustomerData();
  }, []);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedCustomer(customer); // Reset edited data
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedCustomer) {
      setEditedCustomer({ ...editedCustomer, [name]: value });
    }
  };

  const handleSaveChanges = async () => {
    if (!editedCustomer) return;

    try {
      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        setError('Not authenticated. Please login again.');
        return;
      }

      const response = await fetch(`http://localhost:8081/User/${editedCustomer.cin}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(editedCustomer),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedCustomer = await response.json();
      setCustomer(updatedCustomer);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      setError('Failed to save changes');
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!customer) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <section className="max-w-md mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
      {isEditMode ? (
        <div>
          <h2 className="text-xl font-semibold text-indigo-300">Edit Profile</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-gray-300">First Name</label>
              <input
                name="firstName"
                value={editedCustomer?.firstName || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-300">Last Name</label>
              <input
                name="lastName"
                value={editedCustomer?.lastName || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-300">Email</label>
              <input
                name="email"
                value={editedCustomer?.email || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-300">Phone</label>
              <input
                name="phoneNumber"
                value={editedCustomer?.phoneNumber || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-300">Address</label>
              <input
                name="address"
                value={editedCustomer?.address || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleSaveChanges}
              className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-500"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-4">
            <Image
              className="rounded-full"
              src="/images/default-avatar.png"
              alt={`${customer.firstName} ${customer.lastName}`}
              width={60}
              height={60}
            />
            <div>
              <h2 className="text-xl font-semibold text-indigo-300">
                {customer.firstName} {customer.lastName}
              </h2>
              <p className="text-gray-400">{customer.email}</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-200">Details</h3>
            <ul className="mt-2 space-y-2 text-gray-400">
              <li>
                <span className="font-medium text-gray-300">Phone:</span>{' '}
                {customer.phoneNumber}
              </li>
              <li>
                <span className="font-medium text-gray-300">Address:</span>{' '}
                {customer.address}
              </li>
            </ul>
          </div>
          <div className="mt-6">
            <button
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-500 transition"
              onClick={handleEditClick}
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
