// 📁 File: src/components/dashboard/widgets/TradeInEvaluator.tsx

import React, { useState } from 'react';
import { CloudUpload, CarFront, Loader2 } from 'lucide-react';

export default function TradeInEvaluator() {
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate evaluation delay
    setTimeout(() => {
      setEstimate('$7,500 - $9,000');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-green-900/80 p-6 rounded-2xl shadow-xl hover:shadow-green-500/30 transition-all duration-300">
      <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <CarFront className="text-lime-400" /> Trade-In Evaluator
      </h3>
      <p className="mb-4 text-sm text-green-100">
        Upload images and enter specs of your car to get an estimated trade-in value.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(e.target.files)}
          className="block w-full text-sm text-green-100 file:bg-green-700 file:border-none file:rounded-lg file:px-4 file:py-2 hover:file:bg-green-600 cursor-pointer"
        />
        <button
          type="submit"
          disabled={loading || !images}
          className="bg-lime-500 text-white px-5 py-2 rounded-lg hover:bg-lime-600 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <CloudUpload />} Evaluate Now
        </button>
      </form>
      {estimate && (
        <div className="mt-4 bg-lime-100/10 border border-lime-300 text-lime-100 p-4 rounded-md">
          <p>Estimated Trade-In Value:</p>
          <p className="text-xl font-bold">{estimate}</p>
        </div>
      )}
    </div>
  );
}
