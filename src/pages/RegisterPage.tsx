import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import allCountries from '../data/allCountries';

const countries = [
  { code: "KE", name: "Kenya", dial: "+254" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "NG", name: "Nigeria", dial: "+234" },
];

export default function RegisterPage() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState(""); // Unused, but preserved if backend requires
  const [kraPin, setKraPin] = useState("");     // Unused, but preserved
  const [ntsaPhone, setNtsaPhone] = useState(""); // Unused, but preserved
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState(""); // ✅ FIXED: Added missing state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const finalPhoneNumber = phoneNumber.startsWith("0")
      ? phoneNumber
      : "0" + phoneNumber;

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        firstName,
        middleName,
        lastName,
        email,
        idNumber,
        kraPin,
        ntsaPhone,
        phoneNumber: finalPhoneNumber,
        password,
        address, // ✅ Added to request payload if backend expects it
      });

      toast.success("Registration successful. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Registration error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
      <form className="max-w-xl mx-auto space-y-4" onSubmit={handleRegister}>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="p-3 bg-gray-800 rounded"
            required
          />
          <input
            type="text"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            placeholder="Middle Name"
            className="p-3 bg-gray-800 rounded"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="p-3 bg-gray-800 rounded"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="p-3 bg-gray-800 rounded"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 ...city"
            className="p-3 bg-gray-800 text-white rounded"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-2 items-center">
  <select
    className="bg-gray-800 text-white p-2 rounded col-span-1"
    value={selectedCountry.code}
    onChange={(e) => {
      const country = allCountries.find(c => c.code === e.target.value);
      if (country) setSelectedCountry(country);
    }}
  >
    {allCountries.map((country) => (
      <option key={country.code} value={country.code}>
        {country.name} ({country.dial})
      </option>
    ))}
  </select>

  <input
    type="tel"
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
    placeholder={`${selectedCountry.dial}790293895`}
    className="p-3 bg-gray-800 text-white rounded col-span-2"
    required
  />
</div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-3 bg-gray-800 rounded w-full"
          required
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="p-3 bg-gray-800 rounded w-full"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold flex justify-center items-center"
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          )}
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
}
