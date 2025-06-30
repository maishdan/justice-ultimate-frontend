// ChatBotWidget.tsx — Fully upgraded with JusticeAI + RAG + OpenAI fallback
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { BsFillChatDotsFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { searchKnowledgeBase } from "../../ai/ragEngine";

const logAIQuery = (message: string) => {
  const logs = JSON.parse(localStorage.getItem("justiceAI_logs") || "[]");
  logs.push({ message, time: new Date().toISOString() });
  localStorage.setItem("justiceAI_logs", JSON.stringify(logs));
};

const defaultBotIntro = `Hi! I'm JusticeAI 🤖, your smart assistant for Justice Ultimate Automobiles.\n\nYou can ask me things like:\n1. What cars do you sell?\n2. How to book a test drive?\n3. Do you ship internationally?\n4. What are your financing options?\n\nJust type your question, or reply with a number!`;

export default function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: "bot", text: defaultBotIntro }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const normalizedInput = input.trim().toLowerCase();
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    logAIQuery(input);

    let reply = "";

    // Beginner support: greeting or numbered menu
    if (["hi", "hello", "hey", ".", "?", ""].includes(normalizedInput)) {
      reply = defaultBotIntro;
    } else if (["1", "2", "3", "4"].includes(normalizedInput)) {
      const answers: { [key: string]: string } = {
        "1": "🚗 We sell SUVs, sedans, pickups, electric cars & more. Browse all cars in our catalogue.",
        "2": "🛣️ To book a test drive, visit the 'Book Test Drive' page or call 0722827458.",
        "3": "🌍 Yes! We ship cars to over 50 countries with full customs assistance.",
        "4": "💰 We offer flexible financing via banks, SACCOs & 'Lipa Pole Pole'. Apply online!",
      };
      reply = answers[normalizedInput];
    } else {
      // 🔍 Search Knowledge Base First
      const kbAnswer = searchKnowledgeBase(input);
      if (kbAnswer) {
        reply = kbAnswer;
      } else {
        // 🌐 Fallback to OpenAI
        try {
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: input }],
            }),
          });

          const data = await response.json();
          reply =
            data.choices?.[0]?.message?.content ||
            "🤖 Sorry, I didn’t get that. Try asking about car prices, financing, or delivery.";
        } catch (error) {
          console.error("OpenAI error:", error);
          reply = "⚠️ Server issue. Please try again later.";
        }
      }
    }

    setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    setInput("");
    setLoading(false);
  };

  const handleVoiceInput = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: `📷 Uploaded image: ${file.name}` },
        {
          sender: "bot",
          text: "📸 Image received! We'll soon support searching for similar cars from photos.",
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <motion.div
          className="w-80 bg-white text-black dark:bg-gray-900 dark:text-white rounded shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-blue-700 text-white p-3 font-bold flex justify-between items-center">
            Ask JusticeAI
            <button onClick={() => setIsOpen(false)} className="text-white text-sm">✕</button>
          </div>

          <div className="p-3 max-h-60 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm mb-2 p-2 rounded max-w-[75%] ${
                  msg.sender === "bot" ? "bg-blue-100 dark:bg-gray-700" : "bg-yellow-100 ml-auto text-right"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-xs text-gray-500">JusticeAI is typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center border-t border-gray-200 dark:border-gray-600">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 p-2 text-sm bg-white dark:bg-gray-800 text-black dark:text-white outline-none"
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="imgUpload" />
            <label htmlFor="imgUpload" className="cursor-pointer px-2">📷</label>
            <button onClick={handleVoiceInput} className="text-lg px-2">🎤</button>
            <button onClick={handleSend} className="p-2 bg-yellow-300 text-sm">Send</button>
          </div>
        </motion.div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-yellow-400 p-3 rounded-full shadow-md hover:bg-blue-700 text-white"
      >
        <BsFillChatDotsFill size={20} />
      </button>
    </div>
  );
}
