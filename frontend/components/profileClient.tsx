"use client";
import Image from "next/image";

interface Customer {
  id: number;
  photo?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  membership?: string;
}

export default function CustomerProfile({ customer  , setIsEditFormVisible }: { customer: Customer; setIsEditFormVisible: (value: boolean) => void }) {

  function handleEditProfile(id: number) {
    console.log("Edit profile clicked", id);
    setIsEditFormVisible(true);
  }

  return (
    <section className="max-w-md mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center gap-4">
        <Image
          className="rounded-full"
          src={customer.photo || "/images/default-avatar.png"}
          alt={`${customer.name} photo`}
          width={60}
          height={60}
        />
        <div>
          <h2 className="text-xl font-semibold text-indigo-300">{customer.name}</h2>
          <p className="text-gray-400">{customer.email}</p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-200">Details</h3>
        <ul className="mt-2 space-y-2 text-gray-400">
          <li>
            <span className="font-medium text-gray-300">Phone:</span> {customer.phone || "N/A"}
          </li>
          <li>
            <span className="font-medium text-gray-300">Address:</span> {customer.address || "N/A"}
          </li>
          <li>
            <span className="font-medium text-gray-300">Membership:</span>{" "}
            {customer.membership || "Standard"}
          </li>
        </ul>
      </div>
      <div className="mt-6">
        <button className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-500 transition" onClick={() => handleEditProfile(customer.id)}>
          Edit Profile
        </button>
      </div>
    </section>
  );
}
