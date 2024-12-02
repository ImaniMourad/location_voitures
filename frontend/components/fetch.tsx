"use client";
import { useState } from "react";
import { Checkbox } from "@headlessui/react";

export default function fetch() {
  const [formData, setFormData] = useState({
    nom: "",
    adresse: "",
    dateLocation: "",
    voiture: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Vous pouvez ajouter ici la logique pour envoyer les données à votre backend
  };

  return (
    <form>
  <div
    className="mx-auto max-w-6xl px-4 sm:px-6 bg-gray-900"
    style={{
      borderRadius: "10px",
      paddingTop: "20px",
      paddingBottom: "20px",
    }}
  >
    <div className="grid gap-6 mb-6 md:grid-cols-2">
      <div>
        <label
          htmlFor="departure_city"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Departure city
        </label>
        <select
          id="departure_city"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        >
          <option value="">Select a city</option>
          <option value="Casablanca">Casablanca</option>
          <option value="Rabat">Rabat</option>
          <option value="Fes">Fes</option>
          <option value="Marrakech">Marrakech</option>
          <option value="Tangier">Tangier</option>
          <option value="Agadir">Agadir</option>
          <option value="Meknes">Meknes</option>
          <option value="Oujda">Oujda</option>
          <option value="Kenitra">Kenitra</option>
          <option value="Tetouan">Tetouan</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="age_verification"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
            <br />
        </label>
        <input
          type="checkbox"
          id="age_verification"
          className="text-gray-900 dark:text-white w-4 h-4 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600"
          name="age"
          style={{ marginLeft: "10rem", marginRight: "1rem" }}
          required
        />
        <label htmlFor="age_verification" className="text-sm dark:text-white">I am at least 21 years old</label>
          
      </div>
      <div>
        <label
          htmlFor="departure_date"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Departure date
        </label>
        <input
          type="date"
          id="departure_date"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>
      <div>
        <label
          htmlFor="departure_time"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Departure time
        </label>
        <input
          type="time"
          id="departure_time"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>
      <div>
        <label
          htmlFor="arrival_date"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Arrival date
        </label>
        <input
          type="date"
          id="arrival_date"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>
      <div>
        <label
          htmlFor="arrival_time"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Arrival time
        </label>
        <input
          type="time"
          id="arrival_time"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>
    </div>

    <button
      type="submit"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      Search reservations
    </button>
  </div>
</form>

  );
}
