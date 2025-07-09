// ✅ src/components/car/PurchaseOptions.tsx
import { Button } from "../ui/button";

export default function PurchaseOptions() {
  return (
    <div className="bg-blue-800/60 rounded-xl p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-yellow-200">Purchase Options</h3>
      <div className="flex flex-col gap-3">
        <Button className="bg-yellow-400 text-black hover:bg-yellow-300">Buy in Kenya (KES)</Button>
        <Button className="bg-green-400 text-black hover:bg-green-300">Buy International (USD)</Button>
        <Button variant="outline" className="text-white border-gray-400">Lease / Rent Vehicle</Button>
      </div>
    </div>
  );
}