import React, { useState } from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { FiMessageCircle, FiPhone, FiMail, FiSend, FiHelpCircle, FiWhatsapp } from 'react-icons/fi';

export default function SupportCenter() {
  const [ticket, setTicket] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTicket({ ...ticket, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg text-yellow-400">Support Center</h1>
          <p className="text-blue-100 mt-2">Get help via live chat, WhatsApp, support ticket, or call support.</p>
        </div>
      </div>

      {/* Live Chat Placeholder */}
      <Card className="bg-white/10 text-white">
        <CardContent className="p-6 flex flex-col gap-4 items-center">
          <FiMessageCircle className="text-3xl text-yellow-400" />
          <div className="font-bold text-lg">Live Chat (Coming Soon)</div>
          <div className="text-xs text-blue-100">Chat with our support team in real time.</div>
        </CardContent>
      </Card>

      {/* WhatsApp Button */}
      <div className="flex justify-center">
        <a href="https://wa.me/254722827458?text=Hello%2C%20I%20need%20assistance%20from%20Justice%20Ultimate%20Automobiles." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-3 rounded-full shadow-lg text-lg">
          <FiWhatsapp className="text-2xl" /> WhatsApp Support
        </a>
      </div>

      {/* Support Ticket Form */}
      <Card className="bg-white/10 text-white">
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <FiHelpCircle className="text-2xl text-yellow-400" />
            <span className="font-bold text-lg">Submit a Support Ticket</span>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input type="text" name="name" placeholder="Your Name" value={ticket.name} onChange={handleChange} className="rounded px-3 py-2 text-black" required />
            <input type="email" name="email" placeholder="Your Email" value={ticket.email} onChange={handleChange} className="rounded px-3 py-2 text-black" required />
            <textarea name="message" placeholder="How can we help you?" value={ticket.message} onChange={handleChange} className="rounded px-3 py-2 text-black" rows={3} required />
            <Button type="submit" className="bg-yellow-400 text-blue-900 font-bold flex items-center gap-2"><FiSend /> Submit</Button>
            {submitted && <div className="text-green-400 mt-2">Ticket submitted! Our team will contact you soon.</div>}
          </form>
        </CardContent>
      </Card>

      {/* Call Support Info */}
      <Card className="bg-white/10 text-white">
        <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-center">
          <FiPhone className="text-3xl text-yellow-400" />
          <div className="flex-1">
            <div className="font-bold text-lg">Call Support</div>
            <div className="text-xs text-blue-100">Phone: <a href="tel:+254722827458" className="underline hover:text-yellow-400">+254 722 827 458</a></div>
            <div className="text-xs text-blue-100">Email: <a href="mailto:info@justiceauto.com" className="underline hover:text-yellow-400">info@justiceauto.com</a></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 