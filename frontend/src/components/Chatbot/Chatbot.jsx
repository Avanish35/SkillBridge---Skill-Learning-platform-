/**
 * Chatbot.jsx
 * Premium AI assistant with "Midnight Luminous" design.
 * Theme: Luminous Premium
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Message from './Message';
import { chatAPI } from '../../api/api';
import { 
  Bot, X, SendHorizonal, Trash2, 
  MessageSquare, Sparkles, Minus,
  Maximize2, Plus
} from 'lucide-react';
import BotLogo from './BotLogo';
import './Chatbot.css'; 

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatContext, setChatContext] = useState('none');

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('skillbot_messages');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        initWelcomeMsg();
      }
    } else {
      initWelcomeMsg();
    }
    
    const savedCtx = localStorage.getItem('skillbot_context');
    if (savedCtx) setChatContext(savedCtx);
  }, []);

  const initWelcomeMsg = () => {
    setMessages([{
      id: Date.now(),
      text: "Hi! I am SkillBot, your intelligence companion for the SkillBridge nexus. How may I assist your learning trajectory today? 😊",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: ["View Catalog", "Identity Sync", "Protocol Help"]
    }]);
  };

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('skillbot_messages', JSON.stringify(messages));
    }
    localStorage.setItem('skillbot_context', chatContext);
  }, [messages, chatContext]);

  const toggleChat = () => setIsOpen(!isOpen);

  const clearChat = () => {
    localStorage.removeItem('skillbot_messages');
    localStorage.removeItem('skillbot_context');
    setChatContext('none');
    initWelcomeMsg();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const getBotResponse = async (inputStr) => {
    try {
      const response = await chatAPI.sendMessage(inputStr);
      return {
        text: response.data.response,
        quickReplies: response.data.quickReplies || null,
        navigateTo: null,
        newContext: "none"
      };
    } catch (error) {
      console.error("Chat API Error:", error);
      return {
        text: "I'm having trouble connecting to the nexus grid right now. Synchronizing attempts failed.",
        quickReplies: ["Reconnect Protocol"],
        navigateTo: null,
        newContext: "none"
      };
    }
  };

  const processUserMessage = async (textToProcess) => {
    if (!textToProcess.trim()) return;

    const cleanedMessages = messages.map(m => 
      m.sender === 'bot' ? { ...m, quickReplies: [] } : m
    );

    const userMsg = {
      id: Date.now(),
      text: textToProcess,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...cleanedMessages, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const replyData = await getBotResponse(userMsg.text);
    
    const botMsg = {
      id: Date.now() + 1,
      text: replyData.text,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: replyData.quickReplies
    };
    
    setMessages(prev => [...prev, botMsg]);
    setChatContext(replyData.newContext);
    setIsTyping(false);

    if (replyData.navigateTo) {
      setTimeout(() => navigate(replyData.navigateTo), 1200);
    }
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    processUserMessage(inputValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage(e);
  };

  const handleQuickReply = (replyText) => {
    processUserMessage(replyText);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[900] flex flex-col items-end gap-4 pointer-events-none">
      
      {/* Bot Window */}
      {isOpen && (
        <div className="w-[400px] h-[600px] glass-card bg-white/95 dark:bg-slate-900/95 border-slate-200/50 dark:border-slate-800/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] rounded-[2.5rem] overflow-hidden flex flex-col animate-fade-up pointer-events-auto origin-bottom-right">
          
          {/* Header */}
          <div className="p-6 bg-gradient-to-br from-primary-600 to-indigo-700 relative overflow-hidden flex-shrink-0">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
             <div className="relative z-10 flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-xl group cursor-default transition-transform hover:scale-110 duration-500">
                       <BotLogo size={32} />
                    </div>
                   <div>
                      <h4 className="font-black text-lg tracking-tight leading-tight" style={{ fontFamily:"Fraunces, serif" }}>SkillBot</h4>
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/70">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" />
                         AI Engine Online
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={clearChat} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white/80" title="Clear Protocol">
                      <Trash2 size={16} />
                   </button>
                   <button onClick={toggleChat} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white" aria-label="Minimize Profile">
                      <X size={20} />
                   </button>
                </div>
             </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar bg-slate-50/10 dark:bg-slate-900/10">
            {messages.map((msg) => (
              <Message 
                key={msg.id} 
                text={msg.text} 
                sender={msg.sender} 
                timestamp={msg.timestamp} 
                quickReplies={msg.quickReplies}
                onQuickReplyClick={handleQuickReply}
              />
            ))}
            
            {/* Animated Typing Indicator */}
            {isTyping && (
              <div className="flex items-end gap-3 mb-6 animate-fade-in">
                 <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 text-white flex items-center justify-center shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <BotLogo size={22} />
                 </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-[1.5rem] rounded-bl-none border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay:"0ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay:"150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay:"300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Interface */}
          <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/50 flex-shrink-0">
            <div className="flex gap-3 items-center">
              <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 px-4 py-2 flex focus-within:border-primary-500 transition-all shadow-inner">
                <input
                  type="text"
                  className="w-full bg-transparent text-sm font-bold text-slate-800 dark:text-white outline-none placeholder-slate-400 h-10"
                  placeholder="Ask for knowledge insights..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </div>
              <button 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
                  !inputValue.trim() || isTyping
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed" 
                    : "bg-primary-600 text-white shadow-primary-500/30 hover:scale-105 active:scale-95"
                }`}
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
              >
                <SendHorizonal size={20} />
              </button>
            </div>
            <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em] mt-3 text-center">SkillBridge Secure Intelligence Grid v2.0</p>
          </div>
        </div>
      )}

      {/* Floating Toggle Icon */}
      <button 
        className={`chatbot-toggle-btn h-16 pointer-events-auto rounded-[1.75rem] flex items-center gap-3 transition-all duration-500 group shadow-2xl ${
          isOpen 
            ? "w-16 bg-slate-900 text-white rotate-90" 
            : "px-6 bg-white dark:bg-slate-800 text-primary-500 border-2 border-primary-500/20 hover:scale-105"
        }`} 
        onClick={toggleChat}
      >
        {isOpen ? (
          <X size={24} className="animate-fade-in" />
        ) : (
          <>
            <div className="relative group-hover:scale-110 transition-transform duration-500">
               <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                  <BotLogo size={32} />
               </div>
               <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800 shadow-[0_0_10px_rgba(244,63,94,0.5)] animate-pulse z-10" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap overflow-hidden transition-all group-hover:block hidden animate-fade-in-right text-primary-500 dark:text-primary-400">
               Expert Nexus
            </span>
          </>
        )}
      </button>

    </div>
  );
};

export default Chatbot;
