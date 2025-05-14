import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Sun, Moon, Loader } from 'lucide-react';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Theme toggle function
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message immediately
    const userMessage = { user: input, bot: null };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);
    
    try {
      const res = await axios.post("http://localhost:5000/chat", { message: input });
      // Update the message with bot response
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === prev.length - 1 ? { ...msg, bot: res.data.reply } : msg
        )
      );
    } catch (error) {
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === prev.length - 1 ? { ...msg, bot: "Sorry, I'm having trouble connecting. Please try again later." } : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Get time for message timestamps
  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Greeting message based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Placeholder encouraging messages
  const placeholders = [
    "How are you feeling today?",
    "Share what's on your mind...",
    "I'm here to listen...",
    "What would you like to talk about?",
    "Tell me about your day..."
  ];

  const getRandomPlaceholder = () => {
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };

  return (
    <div className={`p-4 max-w-md mx-auto font-sans transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      {/* Header */}
      <div className={`flex justify-between items-center p-4 rounded-t-lg ${theme === "dark" ? "bg-gray-800" : "bg-blue-600 text-white"}`}>
        <div className="flex items-center gap-2">
          <MessageCircle size={24} />
          <h1 className="text-lg font-semibold">Wellness Companion</h1>
        </div>
        <button 
          onClick={toggleTheme} 
          className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-700 text-yellow-300" : "bg-blue-500 text-white"}`}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Chat container */}
      <div 
        ref={chatContainerRef}
        className={`h-96 overflow-y-auto p-4 rounded-b-lg shadow-lg mb-4 transition-colors duration-300 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border border-gray-200"}`}
      >
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className={`text-center p-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            <div className="mb-3">
              <MessageCircle className="mx-auto" size={40} />
            </div>
            <h2 className="text-xl font-medium mb-2">{getGreeting()}!</h2>
            <p className="mb-4">I'm your wellness companion. How can I support you today?</p>
            <div className={`text-sm p-2 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-blue-50"}`}>
              Feel free to share your thoughts or ask questions. This is a safe space.
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((m, i) => (
          <div key={i} className="mb-4">
            {/* User message */}
            <div className="flex justify-end mb-2">
              <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${theme === "dark" ? "bg-blue-700" : "bg-blue-500 text-white"}`}>
                <p>{m.user}</p>
                <div className={`text-xs text-right mt-1 ${theme === "dark" ? "text-blue-300" : "text-blue-100"}`}>
                  {getTime()}
                </div>
              </div>
            </div>
            
            {/* Bot message */}
            {m.bot !== null ? (
              <div className="flex justify-start">
                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                  <p>{m.bot}</p>
                  <div className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    {getTime()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div className={`p-4 rounded-lg flex items-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className={`p-4 rounded-lg flex items-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
              <Loader size={20} className="animate-spin mr-2" />
              <span>Processing your message...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className={`flex gap-2 p-2 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white border border-gray-200"} shadow-lg`}>
        <input
          className={`flex-grow px-4 py-3 rounded-lg focus:outline-none transition-colors duration-300 ${
            theme === "dark" 
              ? "bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-600" 
              : "bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-400"
          }`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder={getRandomPlaceholder()}
        />
        <button
          className={`p-3 rounded-lg flex items-center justify-center transition-all duration-300 ${
            input.trim() 
              ? (theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600") 
              : (theme === "dark" ? "bg-gray-700 cursor-not-allowed" : "bg-gray-300 cursor-not-allowed")
          } text-white`}
          onClick={sendMessage}
          disabled={!input.trim()}
        >
          <Send size={20} />
        </button>
      </div>

      {/* Supportive message */}
      <div className={`text-center mt-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        Remember, you're not alone. I'm here whenever you need support.
      </div>
    </div>
  );
}

export default ChatBox;