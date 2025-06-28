// src/components/dashboard/widgets/AddOnStore.tsx
import React from "react";

const addOns = [
  { name: "Car Cover", price: "KES 2,000" },
  { name: "Floor Mats", price: "KES 1,500" },
  { name: "Phone Mount", price: "KES 800" },
  { name: "First Aid Kit", price: "KES 1,200" },
  { name: "Emergency Road Kit", price: "KES 2,500" },
];

export default function AddOnStore() {
  return (
    <div className="bg-green-900/60 p-6 rounded-lg shadow-lg transition-all hover:shadow-green-400/60 hover:scale-105 duration-300">
      <h3 className="text-xl font-bold mb-3 text-yellow-300">🛍 Add-On Store</h3>
      <ul className="space-y-3">
        {addOns.map((item, index) => (
          <li key={index} className="flex justify-between items-center bg-green-800/70 p-3 rounded hover:bg-green-700/90 transition duration-200">
            <span className="text-white">{item.name}</span>
            <span className="text-blue-300">{item.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
