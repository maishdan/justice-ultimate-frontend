// components/FloatingContactBar.tsx

import type { FC } from "react";
import { PhoneCall, Mail, MessageCircle, Send } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "../lib/utils"

interface FloatingContactBarProps {
  className?: string
}

export const FloatingContactBar: FC<FloatingContactBarProps> = ({ className }) => {
  const phone = "+254712345678"
  const whatsappMessage = encodeURIComponent("Hi Justice Ultimate Automobiles, I'm interested in a car.")
  const email = "sales@justiceautos.com"

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "fixed z-50 bottom-6 right-6 flex flex-col gap-3 items-end",
        className
      )}
    >
      <a
        href={`tel:${phone}`}
        className="bg-primary hover:bg-primary/90 text-white rounded-full p-3 shadow-lg"
        title="Call Now"
      >
        <PhoneCall className="h-5 w-5" />
      </a>
      <a
        href={`https://wa.me/${phone.replace("+254722827458", "")}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg"
        title="WhatsApp"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
      <a
        href={`sms:${phone}`}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg"
        title="Send SMS"
      >
        <Send className="h-5 w-5" />
      </a>
      <a
        href={`mailto:${email}`}
        className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-3 shadow-lg"
        title="Email Us"
      >
        <Mail className="h-5 w-5" />
      </a>
    </motion.div>
  )
}

