import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ChatBotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi! I'm JusticeAI. Ask me anything about our cars or shipping.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: input }],
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I didn't understand that.";

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error contacting JusticeAI server. Try again later.' }]);
    }

    setInput('');
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <motion.div
          className="w-80 bg-white rounded shadow-lg text-black overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-blue-700 text-white p-3 font-bold">Ask JusticeAI</div>
          <div className="p-3 max-h-60 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm mb-2 p-2 rounded ${
                  msg.sender === 'bot' ? 'bg-blue-100 text-left' : 'bg-yellow-100 text-right'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-xs text-gray-500">JusticeAI is typing...</div>}
          </div>
          <div className="flex border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 p-2 text-sm outline-none"
            />
            <button onClick={handleSend} className="p-2 bg-yellow-300 text-sm">Send</button>
          </div>
        </motion.div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="bg-yellow-400 p-3 rounded-full shadow-md hover:bg-blue-700 text-white"
      >
        💬
      </button>
    </div>
  );
}
