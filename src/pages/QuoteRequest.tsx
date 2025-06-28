import React, { useState, useEffect } from "react";
import carData from "../data/cars.json";

interface Car {
  id: number;
  name: string;
  priceKES: number;
}

const QuoteRequest: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    setCars(carData as Car[]);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "selectedCar") {
      const car = cars.find(c => c.id === parseInt(value));
      setSelectedCar(car || null);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Quote request submitted:", {
      ...form,
      selectedCar: selectedCar?.name,
      estimatedPrice: selectedCar?.priceKES,
    });
    alert("Quote request submitted! We'll contact you soon.");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Request a Car Quote</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select a Car</label>
          <select
            name="selectedCar"
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            required
          >
            <option value="">-- Choose a car --</option>
            {cars.map(car => (
              <option key={car.id} value={car.id}>
                {car.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCar && (
          <div className="bg-gray-100 p-4 rounded-md shadow-inner">
            <p className="text-gray-600">💰 <strong>Estimated Price:</strong> <span className="text-green-600 font-semibold">
              KSh {selectedCar.priceKES.toLocaleString()}
            </span></p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            placeholder="e.g. Daniel Maina"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            placeholder="e.g. maishdan4940@gmail.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            placeholder="e.g. 0790 293 895"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Request Quote
        </button>
      </form>
    </div>
  );
};

export default QuoteRequest;
