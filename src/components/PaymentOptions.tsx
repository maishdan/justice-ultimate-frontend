// src/components/PaymentOptions.tsx
import { useState } from "react";
import { Button } from "../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";

export const PaymentOptions = () => {
  const [region, setRegion] = useState<"kenya" | "international">("kenya");

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-4">Select Payment Region</h3>
      <RadioGroup value={region} onValueChange={(val) => setRegion(val as any)} className="mb-6">
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="kenya" id="kenya" />
          <label htmlFor="kenya" className="text-gray-800">🇰🇪 Kenya (M-PESA)</label>
        </div>
        <div className="flex items-center space-x-3 mt-2">
          <RadioGroupItem value="international" id="international" />
          <label htmlFor="international" className="text-gray-800">🌍 International (PayPal / Stripe)</label>
        </div>
      </RadioGroup>

      {region === "kenya" ? (
        <Button className="bg-green-500 w-full">Pay with M-PESA</Button>
      ) : (
        <div className="space-y-2">
          <Button variant="outline" className="w-full">Pay with PayPal</Button>
          <Button variant="outline" className="w-full">Pay with Stripe</Button>
        </div>
      )}
    </div>
  );
};
