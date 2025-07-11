// src/components/FinanceCalculator.tsx
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Input } from "../components/ui/input";
import { useState } from "react";

const FinanceCalculator = () => {
  const [amount, setAmount] = useState(1000000);
  const [interest, setInterest] = useState(10);
  const [years, setYears] = useState(3);

  const monthlyRate = interest / 100 / 12;
  const numPayments = years * 12;
  const monthlyPayment =
    (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));

  return (
    <Card className="p-4 mt-4 rounded-2xl shadow-lg bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-center">Finance Estimator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="font-medium">Loan Amount (KES)</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-1"
          />
          <Slider
            min={500000}
            max={10000000}
            step={50000}
            value={[amount]}
            onValueChange={(val: number[]) => setAmount(val[0])}
          />
        </div>
        <div>
          <label className="font-medium">Interest Rate (%)</label>
          <Input
            type="number"
            value={interest}
            onChange={(e) => setInterest(Number(e.target.value))}
            className="mt-1"
          />
          <Slider
            min={1}
            max={30}
            step={0.1}
            value={[interest]}
            onValueChange={(val: number[]) => setInterest(val[0])}
          />
        </div>
        <div>
          <label className="font-medium">Loan Term (Years)</label>
          <Input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-1"
          />
          <Slider
            min={1}
            max={10}
            step={1}
            value={[years]}
            onValueChange={(val: number[]) => setYears(val[0])}
          />
        </div>
        <div className="text-xl font-semibold text-center">
          Estimated Monthly Payment:{" "}
          <span className="text-green-600">KES {monthlyPayment.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
export default FinanceCalculator;