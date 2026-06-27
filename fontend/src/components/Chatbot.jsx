import React, { useState, useRef, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { MessageSquare, X, Send, Sparkles, MessageCircle } from 'lucide-react';

function Chatbot() {
  const { backendUrl } = useContext(ShopContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello, I am Aria, your personal L'Arôme fragrance concierge. Describe a mood, note, or famous perfume you love, and I will recommend matching signatures from our luxury collection!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e, customText = '') => {
    if (e) e.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const userMessage = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const chatHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await axios.post(`${backendUrl}/api/ai/chat`, { messages: chatHistory });
      if (response.data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "I apologize, but I am having trouble connecting to the scent database right now. Please try again." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Forgive me, my communication link is experiencing issues. Please verify the backend server is running." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    handleSend(null, suggestion);
  };

  return (
    <div className='fixed bottom-5 right-5 z-50 font-sans'>
      
      {/* Floating Chat Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className='bg-black text-white p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 hover:bg-[#c5a880] transition-all duration-300 flex items-center justify-center cursor-pointer border border-[#c5a880]/30 group'
          title="Consult Scent Concierge"
        >
          <MessageCircle className='w-6 h-6 group-hover:rotate-12 transition-transform duration-300' />
          <span className='absolute right-14 bg-black border border-[#c5a880]/30 text-white font-semibold text-[10px] uppercase tracking-widest px-3 py-1 rounded shadow-md hidden group-hover:inline-block whitespace-nowrap prata-regular'>
            Consult Aria
          </span>
        </button>
      )}

      {/* Chat Drawer Widget */}
      {isOpen && (
        <div className='w-[350px] sm:w-[380px] h-[500px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in'>
          
          {/* Header */}
          <div className='bg-black text-white p-4 flex justify-between items-center border-b border-[#c5a880]/30'>
            <div className='flex items-center gap-2'>
              <div className='w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse'></div>
              <div>
                <h4 className='font-bold text-sm prata-regular tracking-wide flex items-center gap-1'>
                  Aria <Sparkles className='w-3 h-3 text-[#c5a880] fill-[#c5a880]' />
                </h4>
                <p className='text-[9px] text-gray-400 uppercase font-semibold'>Fragrance Concierge</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className='text-gray-400 hover:text-white p-1 cursor-pointer transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Messages Area */}
          <div className='flex-grow overflow-y-auto p-4 bg-[#faf9f6]/40 flex flex-col gap-3'>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-[80%] rounded-lg p-3 text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-black text-white self-end rounded-tr-none' 
                    : 'bg-white border text-gray-700 self-start rounded-tl-none border-gray-150'
                }`}
              >
                {/* Formatted response text */}
                <p className='whitespace-pre-line'>{msg.content}</p>
              </div>
            ))}
            
            {loading && (
              <div className='bg-white border text-gray-700 self-start rounded-lg rounded-tl-none p-3 text-xs border-gray-150 flex items-center gap-1.5'>
                <span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></span>
                <span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></span>
                <span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions (renders only when user has just started or logs are short) */}
          {messages.length <= 2 && !loading && (
            <div className='px-4 pb-2 bg-white flex flex-wrap gap-1.5 text-[9px] font-semibold text-gray-500'>
              <button onClick={() => handleSuggestion("Similar to Dior Sauvage")} className='border px-2.5 py-1 rounded bg-[#faf9f6] hover:bg-gray-100 transition-colors cursor-pointer'>
                Dior Sauvage?
              </button>
              <button onClick={() => handleSuggestion("Similar to Creed Aventus")} className='border px-2.5 py-1 rounded bg-[#faf9f6] hover:bg-gray-100 transition-colors cursor-pointer'>
                Creed Aventus?
              </button>
              <button onClick={() => handleSuggestion("Recommend a fresh summer perfume")} className='border px-2.5 py-1 rounded bg-[#faf9f6] hover:bg-gray-100 transition-colors cursor-pointer'>
                Fresh Summer Scents
              </button>
              <button onClick={() => handleSuggestion("What is Oud Imperial like?")} className='border px-2.5 py-1 rounded bg-[#faf9f6] hover:bg-gray-100 transition-colors cursor-pointer'>
                Oud Imperial
              </button>
            </div>
          )}

          {/* Input Box */}
          <form onSubmit={(e) => handleSend(e)} className='border-t p-3 bg-white flex gap-2 items-center'>
            <input 
              type="text" 
              placeholder="Ask Aria about scents..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='flex-grow border border-gray-200 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-[#c5a880] bg-gray-50/50'
            />
            <button 
              type="submit" 
              className='bg-black hover:bg-[#c5a880] text-white p-2 rounded-full shadow hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center'
            >
              <Send className='w-3.5 h-3.5' />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}

export default Chatbot;
