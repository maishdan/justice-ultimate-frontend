import React, { useState } from 'react';

const languages = ['English', 'Swahili', 'French', 'German', 'Arabic'];
const currencies = ['KES', 'USD', 'EUR', 'GBP', 'AED'];

export default function LanguageCurrencySwitcher() {
  const [selectedLang, setLang] = useState('English');
  const [selectedCurrency, setCurrency] = useState('KES');

  return (
    <div className="bg-green-900/70 p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
      <h3 className="text-2xl font-bold text-white mb-4">🌐 Language & Currency</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-green-200">Select Language:</label>
          <select
            value={selectedLang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full p-2 rounded bg-green-800 text-white border border-green-700"
          >
            {languages.map((lang, idx) => (
              <option key={idx} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-green-200">Select Currency:</label>
          <select
            value={selectedCurrency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-2 rounded bg-green-800 text-white border border-green-700"
          >
            {currencies.map((cur, idx) => (
              <option key={idx} value={cur}>{cur}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="text-sm text-green-100 mt-3">
        Selected: <strong>{selectedLang}</strong> / <strong>{selectedCurrency}</strong>
      </div>
    </div>
  );
}
