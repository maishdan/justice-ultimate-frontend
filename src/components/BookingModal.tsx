// src/components/BookingModal.tsx

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import type { FC } from "react";
import type { Car } from "../types/Car";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  car: Car;
}

const BookingModal: FC<BookingModalProps> = ({ open, onClose, car }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleBooking = () => {
    toast.success(`Booking request sent for ${car.name}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="some-class">
            <DialogTitle>
              <span className="text-yellow-400 text-lg font-bold">Book {car.name}</span>
            </DialogTitle>
            <p className="text-sm text-gray-400">
              Fill in your details and we’ll contact you shortly.
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Textarea
            placeholder="Any specific requests?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button
            onClick={handleBooking}
            className="w-full bg-yellow-400 text-black hover:bg-yellow-300"
          >
            Submit Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
