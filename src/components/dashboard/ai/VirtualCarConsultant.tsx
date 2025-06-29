// 📁 src/components/dashboard/ai/VirtualCarConsultant.tsx
import React, { useState } from 'react';

const VirtualCarConsultant = () => {
  const [answers, setAnswers] = useState({
    budget: '',
    passengers: '',
    terrain: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const recommendCar = () => {
    const { budget, passengers, terrain } = answers;
    if (budget === 'high' && terrain === 'offroad') return '🚙 Toyota Land Cruiser';
    if (budget === 'medium' && passengers === '4-5') return '🚗 Mazda CX-5';
    if (budget === 'low' && terrain === 'city') return '🚘 Toyota Vitz';
    return '🧠 We need more info to recommend.';
  };

  return (
    <div className="bg-zinc-900 text-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all">
      <h3 className="text-2xl font-bold mb-4">🤖 Smart Car Recommendation</h3>
      <p className="mb-3">Answer a few questions to find your perfect car:</p>
      <div className="space-y-3">
        <select
          name="budget"
          value={answers.budget}
          onChange={handleChange}
          className="w-full p-2 rounded bg-zinc-800"
        >
          <option value="">💰 Select Budget</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          name="passengers"
          value={answers.passengers}
          onChange={handleChange}
          className="w-full p-2 rounded bg-zinc-800"
        >
          <option value="">👨‍👩‍👧 Passengers</option>
          <option value="1-2">1-2</option>
          <option value="3-4">3-4</option>
          <option value="4-5">4-5</option>
          <option value="6+">6+</option>
        </select>

        <select
          name="terrain"
          value={answers.terrain}
          onChange={handleChange}
          className="w-full p-2 rounded bg-zinc-800"
        >
          <option value="">🌍 Preferred Terrain</option>
          <option value="city">City</option>
          <option value="offroad">Offroad</option>
          <option value="highway">Highway</option>
        </select>

        <div className="mt-4 p-4 bg-green-800 text-white rounded-lg">
          Recommended Car: <strong>{recommendCar()}</strong>
        </div>
      </div>
    </div>
  );
};

export default VirtualCarConsultant;
