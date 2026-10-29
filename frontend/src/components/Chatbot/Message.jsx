/**
 * Message.jsx
 * Premium message component for SkillBot.
 * Theme: Luminous
 */

import React from 'react';
import { Bot, User, Sparkles } from 'lucide-react';
import BotLogo from './BotLogo';

const Message = ({ text, sender, timestamp, quickReplies, onQuickReplyClick }) => {
  const isBot = sender === 'bot';
  
  return (
    <div className={`flex items-end gap-3 mb-6 animate-fade-in ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
      
      {/* Avatar */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 transition-transform hover:scale-110 overflow-hidden ${
        isBot 
          ? 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800' 
          : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'
      }`}>
        {isBot ? <BotLogo size={22} /> : <User size={18} />}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col gap-2 max-w-[80%] ${isBot ? 'items-start' : 'items-end'}`}>
        <div className={`px-5 py-3.5 rounded-[1.5rem] text-sm font-medium leading-relaxed shadow-sm transition-all duration-300 ${
          isBot 
            ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-100 dark:border-slate-700/50' 
            : 'bg-primary-600 text-white rounded-br-none shadow-xl shadow-primary-500/20'
        }`}>
          {text}
        </div>
        
        {/* Quick Replies */}
        {isBot && quickReplies && quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {quickReplies.map((replyText, idx) => (
              <button 
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-primary-100/50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-widest border border-primary-500/10 hover:bg-primary-500 hover:text-white transition-all transform active:scale-95"
                onClick={() => onQuickReplyClick(replyText)}
              >
                {replyText}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-1.5 px-1">
          <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            {timestamp}
          </span>
          {isBot && <Sparkles size={10} className="text-primary-500/50" />}
        </div>
      </div>
    </div>
  );
};

export default Message;
