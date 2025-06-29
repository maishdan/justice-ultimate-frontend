import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaCarSide, FaCalendarAlt, FaPhoneAlt, FaUserCheck, FaMapMarkedAlt, FaIdCard, FaGlobe, FaClock } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const locations = ["Nairobi", "Nyeri", "Mombasa", "Kisumu", "Nakuru", "Thika", "Karatina"];
const cars = ["Toyota Prado", "Mazda CX-5", "Subaru Forester", "Land Rover Discovery", "Mercedes Benz", "Nissan X-Trail"];

export default function BookTestDrive() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    idNumber: "",
    location: locations[0],
    car: cars[0],
    date: "",
    time: "",
    consent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.consent) {
      toast.error("Please agree to data usage policy.");
      return;
    }

    // Simulate backend API call
    toast.success("🚗 Test drive booked successfully!");
    console.log("Booking details:", form);
    setForm({
      name: "",
      phone: "",
      idNumber: "",
      location: locations[0],
      car: cars[0],
      date: "",
      time: "",
      consent: false,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-yellow-400 flex items-center gap-2 border-b border-yellow-500 pb-2">
          <FaCarSide /> Book a Test Drive
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-blue-900 p-6 rounded-xl shadow-lg border border-yellow-400">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <FaUserCheck className="text-yellow-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="p-2 w-full rounded bg-blue-100 text-black"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-yellow-400" />
              <input
                type="tel"
                name="phone"
                placeholder="+254712345678"
                value={form.phone}
                onChange={handleChange}
                className="p-2 w-full rounded bg-blue-100 text-black"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <FaIdCard className="text-yellow-400" />
              <input
                type="text"
                name="idNumber"
                placeholder="National ID / Passport"
                value={form.idNumber}
                onChange={handleChange}
                className="p-2 w-full rounded bg-blue-100 text-black"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <FaMapMarkedAlt className="text-yellow-400" />
              <select
                name="location"
                value={form.location}
                onChange={handleChange}
                className="p-2 w-full rounded bg-blue-100 text-black"
              >
                {locations.map((loc, i) => (
                  <option key={i} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <FaCarSide className="text-yellow-400" />
              <select
                name="car"
                value={form.car}
                onChange={handleChange}
                className="p-2 w-full rounded bg-blue-100 text-black"
              >
                {cars.map((car, i) => (
                  <option key={i} value={car}>{car}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-yellow-400" />
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="p-2 w-full rounded bg-blue-100 text-black"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <FaClock className="text-yellow-400" />
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="p-2 w-full rounded bg-blue-100 text-black"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="consent"
              checked={form.consent}
              onChange={handleChange}
              className="accent-yellow-400"
            />
            <span>
              I agree to the{" "}
              <a href="/privacy-policy" className="text-yellow-400 underline">
                data usage policy
              </a>{" "}
              and GDPR compliance.
            </span>
          </div>

          {/* CAPTCHA Placeholder */}
          <div className="mt-2 text-xs italic text-gray-400">
            [Anti-bot CAPTCHA or reCAPTCHA v3 integration recommended here]
          </div>

          <button
            type="submit"
            className="bg-yellow-400 text-black px-6 py-2 rounded font-bold hover:bg-yellow-500 transition duration-300"
          >
            🚘 Confirm Test Drive
          </button>
        </form>

        <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
}
