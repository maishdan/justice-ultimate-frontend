// ChatBotWidget.tsx — Fully upgraded with JusticeAI + RAG + OpenAI fallback
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { BsFillChatDotsFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { searchKnowledgeBase } from "../../ai/ragEngine";
import { useLanguage } from '../../context/LanguageContext';

const logAIQuery = (message: string) => {
  const logs = JSON.parse(localStorage.getItem("justiceAI_logs") || "[]");
  logs.push({ message, time: new Date().toISOString() });
  localStorage.setItem("justiceAI_logs", JSON.stringify(logs));
};

const getUserRole = () => {
  return (
    localStorage.getItem("userRole") ||
    sessionStorage.getItem("userRole") ||
    (localStorage.getItem("token") ? "customer" : "guest")
  );
};

const getRoleIntro = (role: string, t: (k: string) => string) => {
  switch (role) {
    case "admin":
      return `${t('welcome')}\n\n👋 As an Admin, you can manage users, view analytics, configure system settings, and oversee all departments.\nType 'help' for a full admin guide or ask about any feature.`;
    case "staff":
      return `${t('welcome')}\n\n👋 As Staff, you can manage inventory, handle customer support, and view your tasks. Type 'help' for a staff tutorial or ask about your daily tasks.`;
    case "mechanic":
      return `${t('welcome')}\n\n🔧 As a Mechanic, you can view assigned vehicles, update service status, and access maintenance logs. Type 'help' for a mechanic guide or ask about your schedule.`;
    case "customer":
      return `${t('welcome')}\n\n🚗 As a Customer, you can view your vehicles, book services, track orders, and access support. Type 'help' for a customer tutorial or ask about any feature.`;
    case "guest":
    default:
      return `${t('welcome')}\n\n👋 You can browse our catalogue, view offers, and contact us. Type 'help' for a quick tour or ask any question!`;
  }
};

export default function ChatBotWidget() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: "bot", text: "" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [role, setRole] = useState(getUserRole());

  useEffect(() => {
    setRole(getUserRole());
    setMessages([{ sender: "bot", text: getRoleIntro(getUserRole(), t) }]);
  }, [isOpen, language]);

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

    // Onboarding, help, and tutorials
    if (["hi", "hello", "hey", ".", "?", "", "help", "tutorial", "guide", "onboarding"].includes(normalizedInput)) {
      reply = getRoleIntro(role, t) +
        `\n\n${t('systemGuide')}:\n- ${t('roleBasedHelp')}\n- ${t('tutorials')}\n- ${t('documentation')}\n\n${t('customerService')}:\n- ${t('support')}\n- ${t('afterSales')}\n- ${t('warranty')}\n- ${t('maintenance')}`;
    } else if (["1", "2", "3", "4"].includes(normalizedInput)) {
      const answers: { [key: string]: string } = {
        "1": t('carsManagement'),
        "2": t('bookTestDrive') || "Book Test Drive",
        "3": t('shipping') || "Shipping & Delivery",
        "4": t('financing') || "Financing Options",
      };
      reply = answers[normalizedInput];
    } else if (normalizedInput.includes("feature") || normalizedInput.includes("how to")) {
      reply = `${t('systemGuide')}:\n- ${t('roleBasedHelp')}\n- ${t('tutorials')}\n- ${t('documentation')}`;
    } else {
      // 🔍 Search Knowledge Base First
      // TODO: Extend searchKnowledgeBase to support language and role if needed
      const kbAnswer = searchKnowledgeBase(input);
      if (kbAnswer) {
        reply = kbAnswer;
      } else {
        // 🌐 Fallback to OpenAI (multilingual)
        try {
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                { role: "system", content: `You are JusticeAI, a multilingual assistant for Justice Ultimate Automobiles. Answer in ${language}. The user role is ${role}.` },
                { role: "user", content: input },
              ],
            }),
          });

          const data = await response.json();
          reply =
            data.choices?.[0]?.message?.content ||
            t('support') + ": " + t('help');
        } catch (error) {
          console.error("OpenAI error:", error);
          reply = t('support') + ": " + t('help');
        }
      }
    }

    setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    setInput("");
    setLoading(false);
  };

  const handleVoiceInput = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = language === 'CN' ? 'zh-CN' : language === 'FR' ? 'fr-FR' : 'en-US';
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
          text: t('support') + ": " + t('help'),
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed bottom-24 right-6 z-[2147483000]">
      {isOpen && (
        <motion.div
          className="w-80 bg-white text-black dark:bg-gray-900 dark:text-white rounded shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-blue-700 text-white p-3 font-bold flex justify-between items-center">
            JusticeAI
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
              placeholder={t('help') + "..."}
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
        className="bg-yellow-400 p-3 rounded-full shadow-md hover:bg-blue-700 text-white z-[2147483001]"
        aria-label="Open JusticeAI Chat"
      >
        <BsFillChatDotsFill size={20} />
      </button>
    </div>
  );
}
