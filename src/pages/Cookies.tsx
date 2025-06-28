import { useState } from "react";
import { Link } from "react-router-dom";
import { FaGlobe, FaDownload, FaQuestionCircle } from "react-icons/fa";

export default function Cookies() {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    // You can also trigger actual cookie saving here
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-950 to-black text-white">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-400 glow">🍪 Cookie Policy</h1>
          <p className="text-gray-300 mt-2 italic">
            Last updated: June 19, 2025
          </p>
        </div>

        <div className="bg-blue-900 p-6 rounded-xl shadow shadow-yellow-500">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-4">🔐 Cookie Disclosure</h2>
          <p>
            This website uses cookies to ensure the best user experience, analyze traffic,
            and personalize content for users of Justice Ultimate Automobiles.
          </p>
        </div>

        <div className="bg-blue-900 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-4">🍪 What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device. They help us remember your preferences,
            usage, and browsing behavior to optimize your experience.
          </p>
        </div>

        <div className="bg-blue-900 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-4">🛠️ Types of Cookies We Use</h2>
          <table className="w-full text-sm text-left text-gray-200">
            <thead className="text-xs uppercase bg-blue-800 text-yellow-300">
              <tr>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-yellow-500">
                <td className="px-4 py-2">Essential Cookies</td>
                <td className="px-4 py-2">Enable core functionality like login, navigation, and security.</td>
              </tr>
              <tr className="border-t border-yellow-500">
                <td className="px-4 py-2">Performance Cookies</td>
                <td className="px-4 py-2">Analyze how users interact with the site (Google Analytics).</td>
              </tr>
              <tr className="border-t border-yellow-500">
                <td className="px-4 py-2">Functional Cookies</td>
                <td className="px-4 py-2">Remember settings like region or language.</td>
              </tr>
              <tr className="border-t border-yellow-500">
                <td className="px-4 py-2">Advertising Cookies</td>
                <td className="px-4 py-2">Used for personalized advertising (Facebook Pixel, Google Ads).</td>
              </tr>
              <tr className="border-t border-yellow-500">
                <td className="px-4 py-2">Third-Party Cookies</td>
                <td className="px-4 py-2">Cookies from YouTube, Maps, WhatsApp integrations, etc.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-900 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-4">🎛️ Manage Your Preferences</h2>
          <div className="flex flex-wrap gap-4">
            <button onClick={handleAccept} className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-black font-bold transition shadow hover:shadow-green-400">
              ✅ Accept All
            </button>
            <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-black font-bold transition shadow hover:shadow-red-400">
              ❌ Reject All
            </button>
            <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded text-black font-bold transition shadow hover:shadow-yellow-300">
              ⚙️ Customize Settings
            </button>
          </div>
          {accepted && <p className="mt-2 text-green-300">You have accepted all cookie categories.</p>}
        </div>

        <div className="bg-blue-900 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-4">💼 Data Ethics Promise</h2>
          <p>
            We never sell your data. Cookies help us enhance your car buying experience
            and deliver more relevant content.
          </p>
        </div>

        <div className="flex gap-6 flex-wrap justify-center mt-10">
          <Link to="/privacy" className="hover:underline text-yellow-400 hover:text-yellow-300 transition">Privacy Policy</Link>
          <Link to="/terms" className="hover:underline text-yellow-400 hover:text-yellow-300 transition">Terms & Conditions</Link>
          <a href="#" className="hover:underline text-yellow-400 hover:text-yellow-300 transition">Do Not Sell My Info</a>
        </div>

        <div className="mt-6 text-sm text-center text-gray-400">
          <p>Powered by Justice Ultimate Automobiles | Trusted Worldwide</p>
          <p>Last updated: June 19, 2025</p>
        </div>
      </div>
    </div>
  );
}
