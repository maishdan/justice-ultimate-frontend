import React from 'react';

const appointments = [
  {
    date: '2025-06-22',
    time: '10:00 AM',
    location: 'Nairobi Showroom',
    type: 'Test Drive',
    car: 'Toyota Land Cruiser',
  },
  {
    date: '2025-06-25',
    time: '2:30 PM',
    location: 'Kisumu Branch',
    type: 'Service',
    car: 'Mazda CX-5',
  },
];

export default function UpcomingAppointments() {
  return (
    <div className="bg-green-900/70 rounded-xl p-6 shadow-lg hover:shadow-2xl transition duration-300">
      <h3 className="text-2xl font-bold mb-4 text-white">📅 Upcoming Appointments</h3>
      <ul className="space-y-4">
        {appointments.map((appt, idx) => (
          <li
            key={idx}
            className="bg-green-800/80 p-4 rounded-lg text-white hover:scale-[1.02] transition duration-300"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">{appt.car}</span>
              <span className="text-sm bg-green-600 px-2 py-1 rounded">{appt.type}</span>
            </div>
            <div className="text-sm mt-1">📍 {appt.location}</div>
            <div className="text-sm">📅 {appt.date} | ⏰ {appt.time}</div>
            <button className="mt-2 text-sm underline hover:text-green-300 transition">Add to Calendar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
