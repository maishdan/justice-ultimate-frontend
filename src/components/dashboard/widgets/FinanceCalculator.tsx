// src/components/dashboard/widgets/FinanceCalculator.tsx
import React, { useState } from "react";

export default function FinanceCalculator() {
  const [price, setPrice] = useState(0);
  const [down, setDown] = useState(0);
  const [months, setMonths] = useState(12);
  const interestRate = 0.12;

  const loan = price - down;
  const monthly = ((loan * (1 + interestRate)) / months).toFixed(2);

  return (
    <div className="bg-green-900/60 p-6 rounded-lg shadow-lg hover:shadow-yellow-400/60 hover:scale-105 duration-300 transition-all">
      <h3 className="text-xl font-bold mb-4 text-yellow-300">🧠 Finance Calculator</h3>
      <div className="space-y-3">
        <input
          type="number"
          placeholder="Car Price (KES)"
          className="w-full p-2 rounded bg-green-800/80 text-white"
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Down Payment (KES)"
          className="w-full p-2 rounded bg-green-800/80 text-white"
          onChange={(e) => setDown(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Loan Duration (Months)"
          className="w-full p-2 rounded bg-green-800/80 text-white"
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
        />
        <p className="text-blue-300 font-semibold">Estimated Monthly: KES {monthly}</p>
      </div>
    </div>
  );
}
