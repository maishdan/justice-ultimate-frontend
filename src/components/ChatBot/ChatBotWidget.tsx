// ChatBotWidget.tsx — Fully upgraded with JusticeAI + RAG + OpenAI fallback + Route Navigation
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { BsFillChatDotsFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { searchKnowledgeBase } from "../../ai/ragEngine";
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

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
      return `🤖 **Welcome to JusticeAI!**\n\n👋 As an Admin, I can help you navigate and manage the system:\n• Type "dashboard" to go to admin dashboard\n• Type "users" to manage users\n• Type "analytics" to view reports\n• Say "take me to [page]" for instant navigation\n\nWhat would you like to do today?`;
    case "staff":
      return `🤖 **Welcome to JusticeAI!**\n\n👋 As Staff, I can guide you through your daily tasks:\n• Type "dashboard" to access your workspace\n• Type "inventory" to check vehicle inventory\n• Type "customers" to manage customer support\n• Say "navigate to [page]" for quick access\n\nHow can I assist you today?`;
    case "mechanic":
      return `🤖 **Welcome to JusticeAI!**\n\n🔧 As a Mechanic, I can help you access your tools:\n• Type "dashboard" for your work assignments\n• Type "vehicles" to see assigned vehicles\n• Type "maintenance" for service logs\n• Say "go to [page]" for instant navigation\n\nWhat do you need help with?`;
    case "customer":
      return `🤖 **Welcome to JusticeAI!**\n\n🚗 As a Customer, I can help you explore our services:\n• Type "cars" or "catalogue" to browse vehicles\n• Type "booking" to book a test drive\n• Type "dashboard" for your account\n• Say "show me [page]" for quick navigation\n\nWhat interests you today?`;
    case "guest":
    default:
      return `🤖 **Welcome to JusticeAI!**\n\n👋 I'm your AI assistant at Justice Ultimate Automobiles!\n\n🚗 **Quick Navigation:**\n• Type "cars" or "catalogue" to browse vehicles\n• Type "videos" to see our showcase\n• Type "contact" to reach our team\n• Type "services" to explore our offerings\n• Say "take me to [page]" for instant navigation\n\nI can guide you anywhere on our platform. What would you like to explore?`;
  }
};

// Route navigation mapping
const routeMap: { [key: string]: string } = {
  'home': '/',
  'catalogue': '/vehicle-catalogue',
  'catalog': '/vehicle-catalogue',
  'cars': '/vehicle-catalogue',
  'vehicles': '/vehicle-catalogue',
  'videos': '/videos',
  'services': '/services',
  'about': '/about',
  'contact': '/contact',
  'news': '/news',
  'stories': '/success-stories',
  'login': '/login',
  'register': '/register',
  'dashboard': '/secure-customer-dashboard',
  'admin': '/secure-admin-dashboard',
  'staff': '/secure-staff-dashboard',
  'mechanic': '/secure-mechanic-dashboard',
  'customer': '/secure-customer-dashboard',
  'booking': '/book-test-drive',
  'test drive': '/book-test-drive',
  'financing': '/apply-financing',
  'profile': '/profile',
  'rentals': '/rentals'
};

const parseNavigationIntent = (input: string): string | null => {
  const lowerInput = input.toLowerCase();
  
  // Direct navigation patterns
  const navigationPatterns = [
    /(?:go to|navigate to|take me to|show me|open) (\w+)/i,
    /(?:visit|access|view) (\w+)/i,
    /^(\w+)$/i // Single word commands
  ];

  for (const pattern of navigationPatterns) {
    const match = lowerInput.match(pattern);
    if (match) {
      const page = match[1].toLowerCase();
      if (routeMap[page]) {
        return routeMap[page];
      }
    }
  }

  // Check for direct matches
  if (routeMap[lowerInput]) {
    return routeMap[lowerInput];
  }

  return null;
};

export default function ChatBotWidget() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
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

    // 🧭 Check for navigation intent first
    const navigationRoute = parseNavigationIntent(input);
    if (navigationRoute) {
      reply = `🚀 Navigating to ${input}... Taking you there now!`;
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setLoading(false);
      setInput("");
      
      // Navigate after a short delay for better UX
      setTimeout(() => {
        navigate(navigationRoute);
        setIsOpen(false); // Close chat after navigation
      }, 1500);
      return;
    }

    // Onboarding, help, and tutorials
    if (["hi", "hello", "hey", ".", "?", "", "help", "tutorial", "guide", "onboarding"].includes(normalizedInput)) {
      reply = getRoleIntro(role, t) +
        `\n\n🚀 **Navigation Commands:**\n• "cars" - Browse vehicle catalogue\n• "videos" - Watch our showcase\n• "contact" - Contact our team\n• "services" - Explore our services\n• "dashboard" - Access your dashboard\n\n💬 **Ask me anything about:**\n• Vehicle information\n• Booking services\n• Company policies\n• Technical support`;
    } else if (["1", "2", "3", "4"].includes(normalizedInput)) {
      const answers: { [key: string]: string } = {
        "1": "🚗 Vehicle Management - I can help you browse our catalogue, compare vehicles, and find the perfect car for you. Type 'cars' to explore!",
        "2": "📅 Book Test Drive - Ready to experience your dream car? Type 'booking' to schedule a test drive!",
        "3": "🚚 Shipping & Delivery - We offer worldwide delivery with real-time tracking. Contact our team for shipping details!",
        "4": "💰 Financing Options - Flexible payment plans available. Type 'financing' to explore your options!",
      };
      reply = answers[normalizedInput];
    } else if (normalizedInput.includes("feature") || normalizedInput.includes("how to")) {
      reply = `🎯 **Available Features:**\n\n🚗 **Vehicle Services:**\n• Browse catalogue: type "cars"\n• Book test drive: type "booking"\n• Check availability\n\n🔧 **Support Services:**\n• Contact team: type "contact"\n• View services: type "services"\n• Technical help\n\n📱 **Navigation:**\nJust tell me where you want to go! Examples:\n• "take me to videos"\n• "show me dashboard"\n• "go to contact"`;
    } else {
      // 🔍 Search Knowledge Base First
      const kbAnswer = searchKnowledgeBase(input);
      if (kbAnswer) {
        reply = `💡 ${kbAnswer}\n\n🚀 Need to go somewhere? Just say "take me to [page]" and I'll navigate you there!`;
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
                { role: "system", content: `You are JusticeAI, a helpful navigation and support assistant for Justice Ultimate Automobiles. Answer in ${language}. The user role is ${role}. Always offer to help with navigation by mentioning they can say "take me to [page]" for instant navigation. Keep responses concise and helpful.` },
                { role: "user", content: input },
              ],
            }),
          });

          const data = await response.json();
          reply =
            data.choices?.[0]?.message?.content ||
            `🤖 I'm here to help! Try asking about our vehicles, services, or say "take me to [page]" for navigation. Type "help" for more options.`;
        } catch (error) {
          console.error("OpenAI error:", error);
          reply = `🤖 I'm here to help! Try asking about our vehicles, services, or say "take me to [page]" for navigation. Type "help" for more options.`;
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
    <div className="fixed bottom-24 right-6 z-[999998]">
      {isOpen && (
        <motion.div
          className="w-80 glass-panel rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl overflow-hidden"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white p-4 font-bold flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <span>JusticeAI</span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-red-300 transition-colors text-lg">✕</button>
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
        className="group relative bg-gradient-to-r from-blue-600 to-green-500 p-4 rounded-full shadow-2xl hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 transform hover:scale-110 z-[999999]"
        aria-label="Open JusticeAI Chat"
      >
        {/* Static glow ring (no blinking) */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20"></div>
        
        {/* Chat Icon */}
        <BsFillChatDotsFill size={24} className="text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
        
        {/* AI Badge */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
      </button>
    </div>
  );
}
