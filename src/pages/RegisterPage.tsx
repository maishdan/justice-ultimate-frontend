import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [idNumber, setIdNumber] = useState("");
  const [kraPin, setKraPin] = useState("");
  const [ntsaPhone, setNtsaPhone] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="ID Number"
            className="p-3 bg-gray-800 rounded"
            required
          />
          <input
            type="text"
            value={kraPin}
            onChange={(e) => setKraPin(e.target.value)}
            placeholder="KRA PIN"
            className="p-3 bg-gray-800 rounded"
            required
          />
          <input
            type="text"
            value={ntsaPhone}
            onChange={(e) => setNtsaPhone(e.target.value)}
            placeholder="NTSA Phone Number"
            className="p-3 bg-gray-800 rounded"
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <select
            className="bg-gray-800 p-2 rounded"
            value={selectedCountry.code}
            onChange={(e) =>
              setSelectedCountry(
                countries.find((c) => c.code === e.target.value) || countries[0]
              )
            }
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} ({country.dial})
              </option>
            ))}
          </select>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            className="p-3 bg-gray-800 rounded w-full"
            minLength={10}
            maxLength={20}
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

      {/* Toast container */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
}
