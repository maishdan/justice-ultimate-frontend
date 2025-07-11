// src/components/ContactBar.tsx
import { Phone, Mail, MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "../components/ui/button";

export const ContactBar = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 bg-white p-3 rounded-2xl shadow-xl border">
      <a href="tel:+254722827458">
        <Button variant="outline" className="w-full flex items-center gap-2">
          <Phone className="w-4 h-4" /> Call
        </Button>
      </a>
      <a href="sms:+254722827458">
        <Button variant="outline" className="w-full flex items-center gap-2">
          <MessageCircle className="w-4 h-4" /> SMS
        </Button>
      </a>
      <a href="mailto:info@justiceultimate.com">
        <Button variant="outline" className="w-full flex items-center gap-2">
          <Mail className="w-4 h-4" /> Email
        </Button>
      </a>
      <a
        href={`https://wa.me/254722827458?text=${encodeURIComponent("Hi, I'm interested in a car on your website!")}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outline" className="w-full flex items-center gap-2 text-green-600">
         <FaWhatsapp className="w-6 h-6 text-green-500" /> WhatsApp
        </Button>
      </a>
    </div>
  );
};
