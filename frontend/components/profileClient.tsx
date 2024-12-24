"use client";
import Image from "next/image";

interface Customer {
  cin: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export default function CustomerProfile({ customer, setIsEditFormVisible }: { customer: Customer; setIsEditFormVisible: (value: boolean) => void }) {

  function handleEditProfile(cin: string) {
    console.log("Edit profile clicked", cin);
    setIsEditFormVisible(true);
  }

  return (
    <section className="max-w-md mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center gap-4">
        <Image
          className="rounded-full"
          src="/images/default-avatar.png"
          alt={`${customer.firstName} ${customer.lastName} photo`}
          width={60}
          height={60}
        />
        <div>
          <h2 className="text-xl font-semibold text-indigo-300">{customer.firstName} {customer.lastName}</h2>
          <p className="text-gray-400">{customer.email}</p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-200">Details</h3>
        <ul className="mt-2 space-y-2 text-gray-400">
          <li>
            <span className="font-medium text-gray-300">Phone:</span> {customer.phoneNumber}
          </li>
          <li>
            <span className="font-medium text-gray-300">Address:</span> {customer.address}
          </li>
        </ul>
      </div>
      <div className="mt-6">
        <button className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-500 transition" onClick={() => handleEditProfile(customer.cin)}>
          Edit Profile
        </button>
      </div>
    </section>
  );
}
