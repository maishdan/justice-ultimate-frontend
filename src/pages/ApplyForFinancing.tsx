import React, { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';

export default function ApplyForFinancing() {
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    country: '',
    idDocument: '',
    email: '',
    phone: '',
    altPhone: '',
    address: '',
    language: 'English',
    businessType: '',
    carInterest: '',
    loanAmount: '',
    repaymentPeriod: '',
    downPayment: '',
    currency: 'KES',
    cryptoWallet: '',
    employer: '',
    jobTitle: '',
    monthlyIncome: '',
    employmentType: '',
    incomeSources: '',
    financialStatement: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-blue-600">Apply for Vehicle Financing</h1>
      <p className="text-lg text-gray-700 mb-6">Drive your dream car globally. Flexible plans, instant support, crypto-friendly, and AI-powered pre-approval!</p>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded shadow-lg">
        {/* Personal Info */}
        <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required className="input" />
        <input type="date" name="dob" placeholder="Date of Birth" value={form.dob} onChange={handleChange} required className="input" />

        <select name="country" value={form.country} onChange={handleChange} required className="input">
          <option value="">Select Country</option>
          <option value="Kenya">Kenya</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          <option value="India">India</option>
          <option value="Nigeria">Nigeria</option>
          <option value="UAE">UAE</option>
        </select>

        <input type="text" name="idDocument" placeholder="ID/Passport Number" value={form.idDocument} onChange={handleChange} required className="input" />

        <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required className="input" />
        <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required className="input" />
        <input type="tel" name="altPhone" placeholder="Alternate Phone Number" value={form.altPhone} onChange={handleChange} className="input" />

        <input type="text" name="address" placeholder="Physical Address" value={form.address} onChange={handleChange} required className="input" />
        <input type="text" name="language" placeholder="Preferred Language" value={form.language} onChange={handleChange} className="input" />

        {/* Business Type */}
        <select name="businessType" value={form.businessType} onChange={handleChange} required className="input">
          <option value="">Business Type</option>
          <option>Individual</option>
          <option>SME</option>
          <option>Corporate</option>
          <option>NGO</option>
          <option>Diaspora Kenyan</option>
        </select>

        {/* Loan & Vehicle Info */}
        <input type="text" name="carInterest" placeholder="Car Interested In" value={form.carInterest} onChange={handleChange} className="input" />
        <input type="number" name="loanAmount" placeholder="Loan Amount" value={form.loanAmount} onChange={handleChange} required className="input" />
        <input type="text" name="repaymentPeriod" placeholder="Repayment Period (e.g., 36 months)" value={form.repaymentPeriod} onChange={handleChange} className="input" />
        <input type="text" name="downPayment" placeholder="Down Payment (Ksh, %, Crypto)" value={form.downPayment} onChange={handleChange} className="input" />

        <select name="currency" value={form.currency} onChange={handleChange} className="input">
          <option value="KES">KES</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
          <option value="USDT">USDT</option>
        </select>

        <input type="text" name="cryptoWallet" placeholder="Crypto Wallet Address (optional)" value={form.cryptoWallet} onChange={handleChange} className="input" />

        {/* Employment Info */}
        <input type="text" name="employer" placeholder="Employer / Business Name" value={form.employer} onChange={handleChange} className="input" />
        <input type="text" name="jobTitle" placeholder="Job Title / Position" value={form.jobTitle} onChange={handleChange} className="input" />
        <input type="text" name="monthlyIncome" placeholder="Monthly Income" value={form.monthlyIncome} onChange={handleChange} className="input" />
        <input type="text" name="employmentType" placeholder="Employment Type (Contract, Self, etc.)" value={form.employmentType} onChange={handleChange} className="input" />
        <input type="text" name="incomeSources" placeholder="Other Income Sources (if any)" value={form.incomeSources} onChange={handleChange} className="input" />

        {/* Uploads */}
        <div className="col-span-2 border-dashed border-2 border-gray-400 p-4 rounded flex flex-col items-center justify-center text-gray-600">
          <FaCloudUploadAlt size={50} />
          <p className="text-center">Upload Documents (ID, Payslip, Bank Statement, Proof of Address)</p>
          <input type="file" className="mt-2" multiple />
        </div>

        {/* Submit */}
        <button type="submit" className="col-span-2 bg-blue-600 text-white py-3 rounded hover:bg-blue-700">Submit Application</button>
      </form>

      <p className="text-center mt-6 text-sm text-gray-600">Secured by HTTPS • Powered by Justice AI International • Verified by CBK & DPA Kenya</p>
    </div>
  );
}
