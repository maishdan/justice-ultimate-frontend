import { useState } from 'react';
import {
  FaFacebook,
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    type: 'General Inquiry',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(form);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <h2 className="text-4xl font-bold border-b border-white pb-2">Contact Us</h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" placeholder="Full Name" required className="w-full p-3 rounded bg-blue-100 text-black" onChange={handleChange} />
            <input name="email" placeholder="Email Address" required type="email" className="w-full p-3 rounded bg-blue-100 text-black" onChange={handleChange} />
            <input name="phone" placeholder="Phone Number" type="tel" className="w-full p-3 rounded bg-blue-100 text-black" onChange={handleChange} />
            <select name="type" className="w-full p-3 rounded bg-blue-100 text-black" onChange={handleChange}>
              <option>General Inquiry</option>
              <option>Sales</option>
              <option>Support</option>
              <option>Partnership</option>
            </select>
            <input name="subject" placeholder="Subject" required className="w-full p-3 rounded bg-blue-100 text-black" onChange={handleChange} />
            <textarea name="message" placeholder="Message" required rows={4} className="w-full p-3 rounded bg-blue-100 text-black" onChange={handleChange}></textarea>
            <input type="file" className="w-full p-3 rounded bg-white text-black" />
            <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded shadow-md hover:drop-shadow-[0_0_10px_#facc15]">
              Send Message
            </button>
            {submitted && <p className="text-green-300 mt-2">✅ Message sent successfully!</p>}
          </form>

          {/* Info Panel */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold">Departments</h3>
              <ul className="space-y-1 text-sm">
                <li>📩 Sales: sales@justiceultimate.com</li>
                <li>💁 Customer Support: support@justiceultimate.com</li>
                <li>🔧 Service & Repairs: service@justiceultimate.com</li>
                <li>🔩 Parts Department: parts@justiceultimate.com</li>
                <li>🏢 Corporate: corporate@justiceultimate.com</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold">Office Hours</h3>
              <p>⏰ Nairobi (EAT): 8AM – 6PM, Mon–Sat</p>
              <p>⏰ London (GMT): 7AM – 5PM, Mon–Fri</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold">Global Offices</h3>
              <p>📍 Headquarters: Nairobi, Kenya</p>
              <p>🌐 Branches: USA · UK · Germany · South Africa · UAE</p>
              <a
  href="https://maps.app.goo.gl/8zb3pfQhgKdX2hJf8"
  target="_blank"
  rel="noopener noreferrer"
  className="underline text-yellow-400 hover:text-yellow-300"
>
  Get Directions
</a>

            </div>

            <div>
              <h3 className="text-xl font-bold">Emergency Contacts</h3>
              <p>📞 24/7 Hotline: +254 700 123 456</p>
              <p>🚨 Roadside Assistance: +254 722 999 999</p>
              <p>📋 Insurance Claims: claims@justiceultimate.com</p>
            </div>

            <div className="text-xl pt-4 flex gap-4">
              <a href="https://wa.me/254790293895" target="_blank" className="text-green-400 hover:scale-110 hover:drop-shadow-[0_0_10px_#22c55e]">
                <FaWhatsapp />
              </a>
              <a href="https://facebook.com/justiceultimate" target="_blank" className="text-blue-500 hover:scale-110 hover:drop-shadow-[0_0_10px_#3b82f6]">
                <FaFacebook />
              </a>
              <a href="https://twitter.com/justiceultimate" target="_blank" className="text-sky-400 hover:scale-110 hover:drop-shadow-[0_0_10px_#0ea5e9]">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com/company/justiceultimate" target="_blank" className="text-blue-700 hover:scale-110 hover:drop-shadow-[0_0_10px_#1d4ed8]">
                <FaLinkedin />
              </a>
              <a href="https://youtube.com/@justiceultimate" target="_blank" className="text-red-600 hover:scale-110 hover:drop-shadow-[0_0_10px_#dc2626]">
                <FaYoutube />
              </a>
            </div>

<div className="mt-4">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8455589247724!2d36.803848773973975!3d-1.2652404356014013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17cf83d20673%3A0xe0e7e1768510ea56!2sJUSTICE%20ULTIMATE%20AUTOMOBILES!5e0!3m2!1sen!2ske!4v1750376623397!5m2!1sen!2ske"
    width="100%"
    height="450"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />
</div>

            <div className="mt-4">
              <iframe
                width="100%"
                height="200"
                src="https://www.youtube.com/embed/example"
                title="How to Reach Us"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="mt-6">
              <a href="/vehicle-catalogue" className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mr-2 shadow-md hover:drop-shadow-[0_0_10px_#22c55e]">
                🚘 View Cars for Sale
              </a>
              <a href="/book-test-drive" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mr-2 shadow-md hover:drop-shadow-[0_0_10px_#3b82f6]">
                📝 Book a Test Drive
              </a>
              <a href="/finance-application" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded shadow-md hover:drop-shadow-[0_0_10px_#facc15]">
                💳 Apply for Financing
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
