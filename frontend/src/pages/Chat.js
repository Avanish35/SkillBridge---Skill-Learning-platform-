import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "react-router-dom";
import { userAPI, chatAPI } from "../api/api";
import api from "../api/api"; // standard axios
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ChatSkeleton } from "../components/Loader";
import { 
  Search, Send, Paperclip, Smile, Settings, 
  Phone, Video, Sparkles, CheckCheck, Info,
  Clock, MessageCircle, Trash2
} from "lucide-react";
import BotLogo from "../components/Chatbot/BotLogo";

// Helper color generator
const avatarColor = (name) => `hsl(${(name?.charCodeAt(0) || 65) * 7 % 360}, 55%, 45%)`;

// Lumina Styles Injection
const LuminaChatStyles = () => (
  <style>{`
    @keyframes mesh-chat {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .chat-mesh {
      background: linear-gradient(-45deg, #06080d, #0f172a, #1a1033, #06080d);
      background-size: 400% 400%;
      animation: mesh-chat 15s ease infinite;
    }
    .glass-sidebar {
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(20px);
      border-right: 1px solid rgba(255, 255, 255, 0.05);
    }
    .contact-card-active {
      background: linear-gradient(90deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15));
      border-right: 3px solid #6366f1;
      box-shadow: inset 0 0 20px rgba(99, 102, 241, 0.05);
    }
    .bubble-me {
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3), inset 0 0 10px rgba(255,255,255,0.2);
    }
    .bubble-them {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .chat-input-container {
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(25px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 -10px 40px rgba(0,0,0,0.4);
    }
    .neon-pulse {
      animation: neon-pulse-animation 2s infinite;
    }
    @keyframes neon-pulse-animation {
      0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
      100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
    }
  `}</style>
);

const Chat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userIdParam = queryParams.get("userId");
  
  // Real data state
  const [matches, setMatches] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [conversations, setConversations] = useState({}); // { recipientId: [messages] }
  const [activeId, setActiveId] = useState("ai");
  const [input, setInput] = useState("");
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [search, setSearch] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [stompClient, setStompClient] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize Data & STOMP Client
  useEffect(() => {
    if (!user) return;

    // 1. Fetch Matches (Real Users) & Conversations
    Promise.all([
      userAPI.getMatches(),
      chatAPI.getConversations(),
      userAPI.getAllUsers()
    ])
      .then(([matchesRes, convsRes, allUsersRes]) => {
        const allUsers = allUsersRes.data;
        
        // Parse active users from conversations
        const activeU = convsRes.data.map(c => {
           const pId = c.participants?.find(p => p.id !== user.id)?.id;
           return pId ? allUsers.find(u => u.id === pId) : null;
        }).filter(Boolean);

        // De-duplicate matches
        const activeIds = activeU.map(u => u.id);
        const filteredMatches = matchesRes.data.filter(m => !activeIds.includes(m.id));

        setActiveUsers(activeU);
        setMatches(filteredMatches);
        setLoadingMatches(false);

        // Handle direct link from Network
        if (userIdParam) {
           const uid = parseInt(userIdParam, 10);
           setActiveId(uid);
           if (!activeIds.includes(uid) && !filteredMatches.find(m => m.id === uid)) {
              const u = allUsers.find(x => x.id === uid);
              if (u) {
                 setActiveUsers(prev => [u, ...prev]);
              }
           }
        }
      })
      .catch(err => {
        console.error("Failed to load side panel data", err);
        setLoadingMatches(false);
      });

    // 2. Setup Stomp Client
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      debug: (str) => {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function () {
      console.log("🟢 Connected to WebSockets");
      client.subscribe(`/user/${user.email}/queue/messages`, (msg) => {
        const received = JSON.parse(msg.body);
        const newMsg = {
          id: received.id,
          from: received.senderId === user.id ? "me" : "them",
          text: received.content,
          time: received.timestamp,
        };
        const targetChatId = received.recipientId === user.id ? received.senderId : received.recipientId;
        setConversations(prev => {
          const chatList = prev[targetChatId] || [];
          if (chatList.find(c => c.id === newMsg.id)) return prev;
          return { ...prev, [targetChatId]: [...chatList, newMsg] };
        });
      });
    };

    client.onStompError = (frame) => console.error(frame);
    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, [user]);

  // Scroll bottom
  const currentMessages = activeId === "ai" 
        ? (conversations["ai"] || [{ id: "m0", from: "them", text: "Hi there! I'm SkillBridge AI. How can I assist you today?", time: "Now" }]) 
        : (conversations[activeId] || []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isTyping]);

  // Load history
  useEffect(() => {
    if (activeId !== "ai" && !conversations[activeId]) {
      chatAPI.getHistoryWithUser(activeId)
        .then(res => {
          const history = res.data.map(m => ({
            id: m.id,
            from: m.senderId === user.id ? "me" : "them",
            text: m.content,
            time: m.timestamp,
            conversationId: m.conversationId
          }));
          setConversations(prev => ({ ...prev, [activeId]: history }));
        })
        .catch(err => console.error("Failed history load", err));
    }
  }, [activeId, user, conversations]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const currentInput = input.trim();
    setInput("");
    inputRef.current?.focus();

    if (activeId === "ai") {
      const userMsg = { id:"ai_m"+Date.now(), from:"me", text:currentInput, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      setConversations(prev => {
        const aiList = prev["ai"] || [{ id: "m0", from: "them", text: "Hi there! I'm SkillBridge AI. How can I assist you today?", time: "Now" }];
        return { ...prev, ai: [...aiList, userMsg] };
      });
      setIsTyping(true);
      try {
        const response = await chatAPI.sendMessage(currentInput);
        const aiMsg = { id: "ai_rm"+Date.now(), from: "them", text: response.data.response, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
        setConversations(prev => ({ ...prev, ai: [...prev.ai, aiMsg] }));
      } catch (error) {
        setConversations(prev => ({ ...prev, ai: [...prev.ai, { id: "err", from: "them", text: "I'm offline right now.", time: "Now" }] }));
      } finally {
        setIsTyping(false);
      }
    } else if (stompClient?.connected) {
      const currentChat = conversations[activeId] || [];
      const payload = {
        senderId: user.id,
        recipientId: activeId,
        conversationId: currentChat.length > 0 ? currentChat[0].conversationId : null,
        content: currentInput
      };
      stompClient.publish({ destination: "/app/message", body: JSON.stringify(payload) });
    }
  };

  const handleClearChat = async () => {
    if (activeId === "ai") return;
    try {
      const currentChat = conversations[activeId];
      const conversationId = currentChat?.[0]?.conversationId;
      if (conversationId) await chatAPI.clearHistory(conversationId);
      setConversations(prev => ({ ...prev, [activeId]: [] }));
    } catch (err) { alert("Failed to clear chat."); }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const activeContact = activeId === "ai" 
    ? { name: "SkillBridge AI", role: "Direct Assistant", isOnline: true }
    : (activeUsers.find(m => m.id === activeId) || matches.find(m => m.id === activeId));



  return (
    <div className="flex h-[calc(100vh-140px)] chat-mesh border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] animate-fade-in mb-8 relative">
      <LuminaChatStyles />

      {/* ── Sidebar: Contacts List ───────────────────────── */}
      <div className="w-[340px] flex-shrink-0 flex flex-col glass-sidebar z-20">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-black text-white tracking-tighter" style={{ fontFamily:"Outfit, sans-serif" }}>
              Messages
            </h2>
            <button className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors border border-white/10 hover:border-white/20">
               <Settings size={20} />
            </button>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-white/30 group-focus-within:text-primary-400 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search contacts..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-white outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2 custom-scrollbar">
          {/* AI Pinned */}
          <button
             className={`w-full flex items-center gap-4 p-4 rounded-[1.75rem] text-left transition-all duration-500 relative group ${activeId === "ai" ? "contact-card-active" : "hover:bg-white/5"}`}
             onClick={() => setActiveId("ai")}
           >
             <div className="relative flex-shrink-0">
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary-600 to-indigo-700 shadow-lg border border-white/20 ${activeId === 'ai' ? 'neon-pulse' : ''}`}>
                  <BotLogo size={28} className="text-white" />
               </div>
               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#06080d]" />
             </div>
             <div className="flex-1 min-w-0">
               <div className="flex justify-between items-start">
                 <h4 className="text-sm font-black text-white truncate tracking-tight">Core AI</h4>
                 <div className="bg-primary-500/20 text-primary-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md border border-primary-500/30">Auto</div>
               </div>
               <p className="text-[11px] truncate text-white/40 font-bold mt-0.5">Quantum Neural Agent</p>
             </div>
          </button>

          {loadingMatches ? (
             <ChatSkeleton />
          ) : (
             <>
               {activeUsers.length > 0 && (
                 <>
                  <div className="pt-6 pb-2 px-6 flex items-center gap-4">
                     <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                     <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 whitespace-nowrap">Active Conversations</p>
                     <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>
                  {activeUsers.filter(m => m?.name?.toLowerCase().includes(search.toLowerCase())).map(m => (
                     <button
                         key={`active-${m.id}`}
                         className={`w-full flex items-center gap-4 p-4 rounded-[1.75rem] text-left transition-all duration-500 relative group ${activeId === m.id ? "contact-card-active" : "hover:bg-white/5"}`}
                         onClick={() => setActiveId(m.id)}
                       >
                         <div className="relative flex-shrink-0">
                           <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform" style={{ background: avatarColor(m.name) }}>
                             {m.name && m.name[0]}
                           </div>
                           <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[#06080d] bg-emerald-500`} />
                         </div>
                         <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-black text-white truncate tracking-tight">{m.name}</h4>
                         </div>
                       </button>
                  ))}
                 </>
               )}

               {matches.length > 0 && (
                 <>
                    <div className="pt-6 pb-2 px-6 flex items-center gap-4">
                       <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                       <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 whitespace-nowrap">Suggested Matches</p>
                       <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                    {matches.filter(m => m?.name?.toLowerCase().includes(search.toLowerCase())).map(m => (
                       <button
                         key={`match-${m.id}`}
                         className={`w-full flex items-center gap-4 p-4 rounded-[1.75rem] text-left transition-all duration-500 relative group ${activeId === m.id ? "contact-card-active" : "hover:bg-white/5"}`}
                         onClick={() => setActiveId(m.id)}
                       >
                         <div className="relative flex-shrink-0">
                           <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform" style={{ background: avatarColor(m.name) }}>
                             {m.name && m.name[0]}
                           </div>
                           <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[#06080d] bg-slate-500`} />
                         </div>
                         <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-black text-white truncate tracking-tight">{m.name}</h4>
                         </div>
                       </button>
                    ))}
                 </>
               )}

               {activeUsers.length === 0 && matches.length === 0 && (
                 <div className="py-12 text-center text-[10px] font-black text-white/20 uppercase tracking-widest italic">No connections found</div>
               )}
             </>
          )}
         </div>
      </div>

      {/* ── Main Chat Window ─────────────────────────────────── */}
      {activeContact ? (
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          {/* Header */}
          <div className="flex items-center gap-4 px-8 py-5 border-b border-white/5 backdrop-blur-3xl sticky top-0 z-30">
            <div className="relative flex-shrink-0">
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg border border-white/10 ${activeId === 'ai' ? 'bg-gradient-to-br from-primary-600 to-indigo-700' : ''}`}
                    style={activeId !== 'ai' ? { background: avatarColor(activeContact.name) } : {}}>
                    {activeId === 'ai' ? <BotLogo size={28} /> : activeContact.name[0]}
               </div>
               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-[#06080d]" />
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-white tracking-tight truncate">{activeContact.name}</h3>
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[8px] font-black uppercase tracking-wider text-emerald-400">Secure Node</span>
                  </div>
               </div>
               <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.1em] text-white/30 mt-0.5">
                  <span className="flex items-center gap-1"><Info size={10} /> Active Secure Protocol</span>
               </div>
            </div>
            <div className="flex items-center gap-2">
              {activeId !== "ai" && (
                <button onClick={handleClearChat} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all border border-white/5" title="Purge History">
                   <Trash2 size={18} />
                </button>
              )}
              <div className="h-6 w-px bg-white/5 mx-1" />
              <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 hover:text-primary-400 border border-white/5"><Phone size={18} /></button>
              <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 hover:text-primary-400 border border-white/5"><Video size={18} /></button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-8 py-8 flex flex-col gap-6 custom-scrollbar">
            {currentMessages.map((msg, index) => {
              const fromMe = msg.from === "me";
              return (
                <div key={msg.id + index} className={`flex gap-4 group animate-fade-in ${fromMe ? "flex-row-reverse" : ""}`}>
                  {!fromMe && (
                     <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[11px] font-black shadow-lg mt-auto flex-shrink-0 border border-white/10" style={activeId !== 'ai' ? { background: avatarColor(activeContact.name) } : { background: '#6366f1' }}>
                       {activeId === 'ai' ? <BotLogo size={18} /> : activeContact.name[0]}
                     </div>
                  )}
                  <div className={`flex flex-col gap-1.5 max-w-[70%] ${fromMe ? "items-end" : "items-start"}`}>
                    <div className={`px-5 py-3 rounded-2xl text-[14px] font-medium leading-relaxed shadow-lg transition-all duration-300 ${fromMe ? "bubble-me text-white rounded-br-none" : "bubble-them text-white/90 rounded-bl-none"}`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.2em] px-2">{msg.time}</span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-4 animate-fade-in">
                 <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary-600 border border-white/10 flex-shrink-0">
                    <BotLogo size={18} />
                 </div>
                 <div className="bubble-them px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay:"0ms" }} />
                   <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay:"150ms" }} />
                   <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay:"300ms" }} />
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area: Streamlined & Lowered */}
          <div className="px-8 pb-5 pt-2 chat-input-container">
            <div className="max-w-4xl mx-auto relative">
                {/* Visual Glow Layer beneath the input */}
                <div className="absolute -inset-4 bg-primary-500/5 blur-[50px] rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                {/* The "Click Board" with Gradient Border */}
                <div className="relative p-[1.5px] rounded-[1.75rem] bg-gradient-to-r from-primary-500/20 via-indigo-500/20 to-pink-500/20 focus-within:from-primary-500/80 focus-within:via-indigo-500/80 focus-within:to-pink-500/80 transition-all duration-500 shadow-2xl">
                    <div className="flex gap-3 items-end bg-[#0a0d14]/80 backdrop-blur-3xl rounded-[1.7rem] p-2 transition-all">
                        <button className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center justify-center text-white/30 hover:text-white transition-all border border-white/5 active:scale-95 group">
                           <Paperclip size={20} className="group-hover:rotate-12 transition-transform" />
                        </button>
                        
                        <textarea
                          ref={inputRef}
                          className="flex-1 bg-transparent text-[15px] font-medium text-white resize-none outline-none placeholder-white/10 py-3.5 px-3 custom-scrollbar selection:bg-primary-500/30"
                          placeholder={`Message ${activeContact.name.split(' ')[0]}...`}
                          rows={1}
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          style={{ maxHeight:"140px" }}
                        />

                        <div className="flex items-center gap-2.5 pr-1.5 pb-1.5">
                            <button className="w-11 h-11 rounded-xl hover:bg-white/5 flex items-center justify-center text-white/10 hover:text-primary-400 transition-all group">
                               <Smile size={22} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              className={`w-12 h-12 rounded-[1.1rem] flex items-center justify-center transition-all duration-500 relative overflow-hidden group/send ${!input.trim() ? "text-white/5 cursor-not-allowed" : "bg-gradient-to-br from-primary-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-90"}`}
                              onClick={sendMessage}
                              disabled={!input.trim()}
                            >
                              {input.trim() && (
                                <>
                                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/send:opacity-100 transition-opacity" />
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/send:translate-x-full transition-transform duration-1000" />
                                </>
                              )}
                              <Send size={22} className={`relative z-10 transition-transform ${input.trim() ? "group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5" : ""}`} />
                            </button>
                        </div>
                </div>
            </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-20 z-10">
            <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center text-white/10 border border-white/5 mb-8 animate-pulse">
               <MessageCircle size={48} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-4">Start Messaging</h2>
            <p className="text-white/30 text-sm max-w-xs font-medium leading-relaxed">System awaiting contact selection. Establish encrypted line to start data exchange.</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
