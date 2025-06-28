import { useState } from "react";
import { FaFileDownload, FaLock, FaLanguage, FaInfoCircle, FaSearch, FaChartPie, FaRobot } from "react-icons/fa";

export default function PrivacyPolicy() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-yellow-400 border-b border-yellow-400 pb-2">
            🔐 Privacy Policy
          </h1>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300">
              <FaFileDownload /> Download PDF
            </button>
            <button className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300">
              <FaLanguage /> Language
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search policy..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 w-full md:w-96 text-black bg-blue-100 rounded shadow"
        />

        <div className="space-y-10">
          <section id="introduction">
            <h2 className="text-2xl text-yellow-300 font-bold">1. Introduction</h2>
            <p>
              Justice Ultimate Automobiles ("we", "our", "us") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, and safeguard your
              personal data in accordance with international standards (GDPR, CCPA, Kenya DPA).
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-yellow-300 font-bold">2. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Personal details: name, email, phone, address</li>
              <li>Driving license, ID numbers</li>
              <li>Payment and financial details</li>
              <li>Vehicle data: VIN, trade-in history</li>
              <li>Location, browser/device info</li>
              <li>Uploaded images/documents</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-yellow-300 font-bold">3. How We Collect It</h2>
            <p>Through forms, email, calls, cookies, analytics, and verified partners.</p>
          </section>

          <section>
            <h2 className="text-2xl text-yellow-300 font-bold">4. Use of Information</h2>
            <p>
              We use your data to process transactions, provide services, comply with laws, and
              improve customer experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-yellow-300 font-bold">5. Data Security</h2>
            <p>
              Your data is protected by SSL encryption, secure servers, staff restrictions,
              backups, and regular vulnerability scans.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-yellow-300 font-bold">6. Sharing of Information</h2>
            <p>
              We only share your data with trusted logistics, finance, and government agencies
              when necessary — never sold to marketers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-yellow-300 font-bold">7. International Transfers</h2>
            <p>
              We comply with international data laws for cross-border transfers, including EU
              GDPR and Kenya Data Protection Act.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-yellow-300 font-bold">8. Legal Basis</h2>
            <p>We rely on consent, legal obligations, contracts, and legitimate interest.</p>
          </section>

          <section>
            <h2 className="text-2xl text-yellow-300 font-bold">9. Your Rights</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Access, correction, deletion, objection</li>
              <li>Restrict processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-yellow-300 font-bold">10. Cookies</h2>
            <p>
              We use cookies for analytics and ads. You can manage your preferences anytime via
              our Cookie Settings panel.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-yellow-300 font-bold">11. Data Retention</h2>
            <p>We retain your data as required by law or up to 7 years for service history.</p>
          </section>

          <section>
            <h2 className="text-2xl text-yellow-300 font-bold">12. Children</h2>
            <p>We do not knowingly collect data from children under 18 years old.</p>
          </section>

          <section>
            <h2 className="text-2xl text-yellow-300 font-bold">13. Updates</h2>
            <p>This policy was last updated on June 19, 2025. We may revise this policy anytime.</p>
          </section>

          <section>
            <h2 className="text-2xl text-yellow-300 font-bold">14. Contact</h2>
            <p>
              Email: <a href="mailto:privacy@justiceultimate.com" className="underline hover:text-yellow-400">privacy@justiceultimate.com</a><br />
              Call: +254 790 293 895
            </p>
          </section>

          <hr className="border-yellow-400" />

          {/* GENIUS FEATURES */}
          <div className="space-y-6">
            <h2 className="text-2xl text-yellow-300 font-bold">🚀 Next-Gen Privacy Features</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><FaLock className="inline mr-2" /> Your Data Dashboard: View, download, or delete your data</li>
              <li><FaRobot className="inline mr-2" /> AI Privacy Assistant: Ask our chatbot about any clause</li>
              <li><FaChartPie className="inline mr-2" /> Visual Data Summary: See what we collect in a snapshot</li>
              <li><FaLanguage className="inline mr-2" /> Multi-language Policy: Read in English, Swahili, Arabic, etc.</li>
              <li><FaInfoCircle className="inline mr-2" /> Glossary Popups: Hover over terms for quick definitions</li>
              <li><FaSearch className="inline mr-2" /> Consent Logs: See what you consented to and when</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
