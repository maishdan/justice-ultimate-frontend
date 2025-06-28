import { useState } from "react";

const DealerApplication = () => {
  const [form, setForm] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    phone: "",
    location: "",
    message: "",
  });

  const [files, setFiles] = useState<{ cert: File | null; id: File | null }>({
    cert: null,
    id: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: fileList } = e.target;
    setFiles({ ...files, [name]: fileList ? fileList[0] : null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form, files);
    alert("Application submitted successfully!");
    // TODO: Send data to backend using axios or fetch
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition duration-300">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          Become a Dealer / Partner
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            name="ownerName"
            placeholder="Owner's Full Name"
            value={form.ownerName}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            name="location"
            placeholder="Business Location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <textarea
            name="message"
            placeholder="Brief about your business..."
            value={form.message}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            rows={4}
          ></textarea>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Business Certificate (PDF/JPG)</label>
              <input
                type="file"
                name="cert"
                accept=".pdf,.jpg,.png"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Owner’s ID (PDF/JPG)</label>
              <input
                type="file"
                name="id"
                accept=".pdf,.jpg,.png"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition duration-300"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default DealerApplication;
