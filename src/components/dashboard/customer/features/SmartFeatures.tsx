import React, { useState } from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { FiSun, FiMoon, FiDollarSign, FiWhatsapp, FiCalendar, FiZap } from 'react-icons/fi';

const currencies = ['KES', 'USD', 'EUR'];

export default function SmartFeatures() {
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('KES');
  const [showAIResult, setShowAIResult] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState('');

  // Appointment scheduler (mock)
  const [appointment, setAppointment] = useState({ car: '', date: '', time: '' });
  const [apptSubmitted, setApptSubmitted] = useState(false);

  const handleApptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };
  const handleApptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApptSubmitted(true);
    setTimeout(() => setApptSubmitted(false), 2000);
  };

  // AI Car Recommender (mock)
  const handleAIRecommend = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAIResult(true);
    setAiResult('Recommended: BMW X5 (Luxury SUV, 2024)');
  };

  // Light/dark mode toggle (demo only)
  const toggleDarkMode = () => {
    setDarkMode(d => !d);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  // WhatsApp floating button
  const whatsappUrl = 'https://wa.me/254722827458?text=Hello%2C%20I%20need%20assistance%20from%20Justice%20Ultimate%20Automobiles.';

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg text-yellow-400">Smart Features</h1>
          <p className="text-blue-100 mt-2">Try our smart tools: dark mode, currency switch, WhatsApp, quick booking, and AI car recommender.</p>
        </div>
      </div>

      {/* Light/Dark Mode Toggle */}
      <Card className="bg-white/10 text-white">
        <CardContent className="p-6 flex items-center gap-4">
          <FiSun className="text-2xl text-yellow-400" />
          <span className="font-bold text-lg">Light/Dark Mode</span>
          <Button onClick={toggleDarkMode} className="ml-4 bg-yellow-400 text-blue-900 font-bold flex items-center gap-2">
            {darkMode ? <FiSun /> : <FiMoon />} {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </CardContent>
      </Card>

      {/* Currency Switch */}
      <Card className="bg-white/10 text-white">
        <CardContent className="p-6 flex items-center gap-4">
          <FiDollarSign className="text-2xl text-yellow-400" />
          <span className="font-bold text-lg">Currency</span>
          <select value={currency} onChange={e => setCurrency(e.target.value)} className="rounded px-3 py-2 text-black w-32 ml-4">
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </CardContent>
      </Card>

      {/* WhatsApp Floating Button */}
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="fixed bottom-8 right-8 z-50 bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-3 rounded-full shadow-lg text-lg flex items-center gap-2 animate-bounce">
        <FiWhatsapp className="text-2xl" /> WhatsApp
      </a>

      {/* Appointment Scheduler */}
      <Card className="bg-white/10 text-white">
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <FiCalendar className="text-2xl text-yellow-400" />
            <span className="font-bold text-lg">Quick Appointment Scheduler</span>
          </div>
          <form onSubmit={handleApptSubmit} className="flex flex-col md:flex-row gap-2 items-center">
            <input type="text" name="car" placeholder="Car Model" value={appointment.car} onChange={handleApptChange} className="rounded px-3 py-2 text-black" required />
            <input type="date" name="date" value={appointment.date} onChange={handleApptChange} className="rounded px-3 py-2 text-black" required />
            <input type="time" name="time" value={appointment.time} onChange={handleApptChange} className="rounded px-3 py-2 text-black" required />
            <Button type="submit" className="bg-yellow-400 text-blue-900 font-bold flex items-center gap-2"><FiCalendar /> Book</Button>
            {apptSubmitted && <div className="text-green-400 mt-2">Appointment booked!</div>}
          </form>
        </CardContent>
      </Card>

      {/* AI Car Recommender */}
      <Card className="bg-white/10 text-white">
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <FiZap className="text-2xl text-yellow-400" />
            <span className="font-bold text-lg">AI Car Recommender</span>
          </div>
          <form onSubmit={handleAIRecommend} className="flex flex-col md:flex-row gap-2 items-center">
            <input type="text" placeholder="Describe your needs (e.g. family SUV, fuel efficient)" value={aiInput} onChange={e => setAiInput(e.target.value)} className="rounded px-3 py-2 text-black w-80" required />
            <Button type="submit" className="bg-yellow-400 text-blue-900 font-bold flex items-center gap-2"><FiZap /> Recommend</Button>
          </form>
          {showAIResult && <div className="text-green-400 mt-2 font-bold">{aiResult}</div>}
        </CardContent>
      </Card>
    </div>
  );
} 