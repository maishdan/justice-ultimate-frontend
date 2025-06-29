// File: src/pages/Terms.tsx

import { useState } from "react";
import { FaDownload, FaSearch, FaInfoCircle, FaGlobe, FaShieldAlt, FaFilePdf, FaLanguage } from "react-icons/fa";

const sections = [
  {
    title: "1. Introduction",
    content: `Welcome to Justice Ultimate Automobiles. By accessing or using this site, you agree to be bound by the following terms and conditions. These Terms apply to all users, customers, and dealers worldwide.`
  },
  {
    title: "2. Definitions",
    content: `"Company", "We", "Us" refer to Justice Ultimate Automobiles. "User", "Customer" means any person accessing the platform. "Vehicle" refers to any automobile listed. "Order", "Listing", "Dealer", etc., hold their usual meanings as per industry standards.`
  },
  {
    title: "3. Eligibility to Use the Site",
    content: `Users must be 18+ years old. Certain features may not be available in all countries. Dealers and individuals are both welcome, subject to verification.`
  },
  {
    title: "4. Vehicle Listings & Product Descriptions",
    content: `While we aim for accuracy, listings may occasionally contain errors or outdated information. Availability is not guaranteed.`
  },
  {
    title: "5. Pricing & Currency",
    content: `Prices are subject to change. VAT and applicable fees are included. For international users, currency conversion is indicative only.`
  },
  {
    title: "6. Ordering, Payments & Deposits",
    content: `We accept M-Pesa, bank transfer, cards, and crypto. Deposits are required for reservations. Refunds are subject to terms. Financing available.`
  },
  {
    title: "7. Delivery and Shipping",
    content: `We offer global shipping. Import/export duties and timelines vary. Insurance is recommended.`
  },
  {
    title: "8. Test Drives & In-Person Visits",
    content: `Bookings must be made in advance. ID and valid driver’s license are mandatory. Liability is limited.`
  },
  {
    title: "9. Warranties & Guarantees",
    content: `A 30-day limited engine warranty is standard unless stated. Extended warranties available via third-parties.`
  },
  {
    title: "10. Returns & Refunds Policy",
    content: `Refunds apply only to vehicles not delivered as described. All returns subject to verification.`
  },
  {
    title: "11. Disclaimers",
    content: `Used vehicles are sold as-is. History reports are offered where available. Third-party services are independent.`
  },
  {
    title: "12. Limitation of Liability",
    content: `We are not liable for indirect or consequential damages from use of the site.`
  },
  {
    title: "13. User Conduct",
    content: `Prohibited: spamming, impersonation, scraping, fraudulent behavior.`
  },
  {
    title: "14. Intellectual Property",
    content: `All content, logos, and photos are owned by Justice Ultimate Automobiles. Unauthorized use is prohibited.`
  },
  {
    title: "15. Third-Party Services",
    content: `We are not responsible for the terms of external financiers, shipping agents, or advertisers.`
  },
  {
    title: "16. Privacy & Data Use",
    content: `We value your privacy. Please review our Privacy Policy at /privacy-policy.`
  },
  {
    title: "17. Termination of Access",
    content: `We may restrict users for violating these Terms or for legal reasons.`
  },
  {
    title: "18. Governing Law & Dispute Resolution",
    content: `These Terms are governed by Kenyan law. Disputes shall be resolved through binding arbitration.`
  },
  {
    title: "19. Modifications to Terms",
    content: `We may revise these Terms at any time. Check this page regularly.`
  },
  {
    title: "20. Contact Information",
    content: `For legal questions, contact: legal@justiceultimate.com`
  },
];

export default function Terms() {
  const [search, setSearch] = useState("");

  const filtered = sections.filter(section =>
    section.title.toLowerCase().includes(search.toLowerCase()) ||
    section.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 mb-6 border-b pb-2 border-yellow-500">
          📜 Terms & Conditions
        </h1>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <FaSearch className="text-yellow-400" />
            <input
              type="text"
              placeholder="Search terms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 rounded text-black bg-blue-100 w-72"
            />
          </div>

          <button className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition">
            <FaFilePdf /> Download PDF
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-6">🕓 Last updated: June 19, 2025</p>

        <div className="space-y-8">
          {filtered.map((section, index) => (
            <div key={index} className="bg-blue-900 p-6 rounded-xl border border-yellow-400 shadow hover:shadow-yellow-400 transition duration-300">
              <h2 className="text-xl font-bold text-yellow-300 mb-2">
                <FaInfoCircle className="inline mr-2" />{section.title}
              </h2>
              <p className="text-gray-200 leading-relaxed">{section.content}</p>
              <details className="mt-3 text-sm text-gray-400">
                <summary className="cursor-pointer hover:text-yellow-400">What does this mean for me?</summary>
                <p className="mt-2">This clause ensures your rights are respected while outlining what you can expect from us and our services.</p>
              </details>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4 text-sm justify-center text-gray-300">
          <div className="flex items-center gap-2">
            <FaGlobe className="text-yellow-300" /> Multi-language Terms (Coming soon)
          </div>
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-yellow-300" /> GDPR + NTSA Compliant
          </div>
          <div className="flex items-center gap-2">
            <FaLanguage className="text-yellow-300" /> Translate Terms (Coming soon)
          </div>
        </div>
      </div>
    </div>
  );
}
