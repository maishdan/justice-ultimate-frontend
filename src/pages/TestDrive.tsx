import React, { useEffect, useState } from "react";
import carData from "../data/cars.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Car {
  id: number;
  name: string;
  priceKES: number;
}

const TestDrive: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    setCars(carData as Car[]);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "selectedCar") {
      const car = cars.find((c) => c.id === parseInt(value));
      setSelectedCar(car || null);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCar) {
      toast.error("Please select a car.");
      return;
    }

    console.log("Booking Request:", { ...form, car: selectedCar });
    toast.success("✅ Test drive booked successfully!");

    // Optional: Send to backend here
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white shadow-lg rounded-xl mt-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">🚗 Book a Test Drive</h1>

      <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Car</label>
          <select
            name="selectedCar"
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-lg"
            required
          >
            <option value="">-- Choose a car --</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-lg"
              placeholder="e.g. Daniel Maina"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-lg"
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
              className="w-full p-2 mt-1 border rounded-lg"
              placeholder="e.g. 0790 293 895"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-lg"
              required
            />
          </div>
        </div>

        {/* OTP Placeholder */}
        <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-700 border border-yellow-300">
          🔒 OTP verification will be sent to your number after booking.
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition"
        >
          Confirm Booking
        </button>
      </form>

      {/* Map Preview */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-2">📍 Nearest Dealership</h3>
        <iframe
          title="dealership-map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.182707073222!2d36.8131!3d-1.2864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10e965d7df9d%3A0x66045a840f116221!2sNairobi!5e0!3m2!1sen!2ske!4v1682675073141!5m2!1sen!2ske"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default TestDrive;
