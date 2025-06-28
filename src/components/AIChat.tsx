import { useState } from "react";
import { MessageSquare, Send, X } from "lucide-react";

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: { sender: "user" | "bot"; text: string } = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, newMessage]);

    // Simulated AI response
    const botReply: { sender: "user" | "bot"; text: string } = { sender: "bot", text: "🤖 I'm thinking... (AI coming soon)" };
    setTimeout(() => {
      setMessages((prev) => [...prev, botReply]);
    }, 1000);

    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition duration-300"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white shadow-2xl rounded-lg overflow-hidden animate-fadeInUp z-50 border">
          <div className="bg-green-600 text-white text-center py-3 font-bold">
            AI Assistant
          </div>
          <div className="h-60 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-green-100 self-end ml-auto text-right"
                    : "bg-white border self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex items-center border-t p-2">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow p-2 rounded border focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;

