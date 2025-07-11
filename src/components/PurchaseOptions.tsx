// components/PurchaseOptions.tsx
import type { FC } from "react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Globe, Landmark, CreditCard, Wallet } from "lucide-react";
import type { Car } from "../types/Car";
import { motion } from "framer-motion";

interface PurchaseOptionsProps {
  car: Car;
}

export const PurchaseOptions: FC<PurchaseOptionsProps> = ({ car }) => {
  const [selectedOption, setSelectedOption] = useState<"kenya" | "international">("kenya");

  const priceKES = car.price.toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
  });

  const priceUSD = (car.price / 145).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <Card className="mt-6 shadow-md">
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex gap-4 justify-center mb-4">
            <Button
              variant={selectedOption === "kenya" ? "default" : "outline"}
              onClick={() => setSelectedOption("kenya")}
              className="flex items-center gap-2"
            >
              <Landmark className="h-4 w-4" />
              Buy in Kenya 🇰🇪
            </Button>
            <Button
              variant={selectedOption === "international" ? "default" : "outline"}
              onClick={() => setSelectedOption("international")}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              International 🌍
            </Button>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">
              {selectedOption === "kenya" ? "Kenyan Price" : "International Price"}
            </h3>
            <p className="text-3xl font-bold text-primary">
              {selectedOption === "kenya" ? priceKES : priceUSD}
            </p>
            <p className="text-sm text-muted-foreground">
              Includes taxes, clearance, and local support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Button className="w-full sm:w-auto" variant="default">
              <Wallet className="mr-2 h-4 w-4" />
              Finance Options
            </Button>
            <Button className="w-full sm:w-auto" variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Pay Now
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};
