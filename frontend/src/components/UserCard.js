/**
 * UserCard.jsx
 * Displays a user/instructor in a premium Upwork-style card.
 * Theme: Luminous Premium
 */

import React, { useState } from "react";
import { 
  Star, MessageCircle, UserPlus, Award, 
  MapPin, Activity, CheckCircle2, Zap, 
  Users, Calendar, ChevronRight, Share2
} from "lucide-react";

// ─── Match score ring ─────────────────────────────────────
const MatchRing = ({ score }) => {
  const r    = 22;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#6366f1" : "#f59e0b";

  return (
    <div className="relative w-14 h-14 flex-shrink-0 animate-pulse-glow rounded-full">
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="4" />
        <circle
          cx="28" cy="28" r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-black" style={{ color }}>{score}%</span>
      </div>
    </div>
  );
};

// ─── Star Rating ──────────────────────────────────────────
const Stars = ({ rating }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={12} 
          className={i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"} 
        />
      ))}
    </div>
    <span className="text-[11px] font-black text-slate-900 dark:text-white mt-0.5">{rating.toFixed(1)}</span>
  </div>
);

// ─── UserCard ─────────────────────────────────────────────
const UserCard = ({
  user,
  showMatch    = false,
  onConnect,
  onChat,
  onViewProfile,
  variant      = "default", // "default" | "horizontal"
}) => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected]   = useState(user?.connected || false);

  const {
    name         = "Unknown",
    role         = "Learner",
    bio          = "",
    skillsTeach  = [],
    skillsLearn  = [],
    rating       = 0,
    sessions     = 0,
    learners     = 0,
    match        = 0,
    isOnline     = false,
    profilePicture = null,
  } = user || {};

  const avatarColor = `hsl(${(name.charCodeAt(0) || 65) * 7 % 360}, 55%, 48%)`;

  const handleConnect = async (e) => {
    e.stopPropagation();
    setConnecting(true);
    await new Promise((r) => setTimeout(r, 700));
    setConnected(true);
    setConnecting(false);
    onConnect?.(user);
  };

  if (variant === "horizontal") {
    return (
      <div 
        className="group glass-card p-4 flex items-center gap-5 cursor-pointer hover:border-primary-500/30 transition-all duration-300 relative overflow-hidden" 
        onClick={() => onViewProfile?.(user)}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-primary-500/10 transition-colors" />
        
        {/* User Image/Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 transition-transform duration-300 overflow-hidden"
            style={{ background: avatarColor }}
          >
            {profilePicture ? (
              <img src={profilePicture} alt={name} className="w-full h-full object-cover" />
            ) : (
              name[0]
            )}
          </div>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-lg border-2 border-white dark:border-slate-900 shadow-sm animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-primary-500 transition-colors tracking-tight">{name}</h4>
            {isOnline && <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">Online</span>}
          </div>
          <p className="text-[11px] text-slate-500 font-medium truncate">{role}</p>
          <div className="flex gap-2 mt-2 flex-wrap text-[10px] font-black uppercase tracking-wider">
            {skillsTeach.slice(0, 2).map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-100/50 dark:border-primary-800/30">{s}</span>
            ))}
          </div>
        </div>

        {showMatch && <MatchRing score={match} />}

        <div className="flex gap-2 flex-shrink-0 ml-2">
          <button 
            className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/40 transition-all flex items-center justify-center border border-slate-100 dark:border-slate-700/50" 
            onClick={(e) => { e.stopPropagation(); onChat?.(user); }}
          >
            <MessageCircle size={18} />
          </button>
          <button
            className={`h-10 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              connected
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                : "btn-primary shadow-lg shadow-primary-500/20"
            }`}
            onClick={handleConnect}
            disabled={connecting || connected}
          >
            {connecting ? "…" : connected ? <CheckCircle2 size={18} /> : "Connect"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <article 
      className="group glass-card p-6 flex flex-col gap-6 cursor-pointer hover:border-primary-500/40 hover:-translate-y-1.5 transition-all duration-500 relative overflow-hidden" 
      onClick={() => onViewProfile?.(user)}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-[80px] -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-all duration-700" />
      
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-white font-black text-2xl shadow-xl group-hover:rotate-3 transition-transform duration-500 overflow-hidden"
              style={{ background: avatarColor }}
            >
              {profilePicture ? (
                <img src={profilePicture} alt={name} className="w-full h-full object-cover" />
              ) : (
                name[0]
              )}
            </div>
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-xl border-4 border-white dark:border-slate-900 shadow-sm animate-pulse" />
            )}
          </div>

          {/* Title Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white truncate group-hover:text-primary-500 transition-colors tracking-tight">{name}</h3>
              <Award size={16} className="text-amber-500" />
            </div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Activity size={12} className="text-primary-500" /> {role}
            </p>
            <div className="mt-2">
              <Stars rating={rating} />
            </div>
          </div>
        </div>

        {/* Match ring */}
        {showMatch && <MatchRing score={match} />}
      </div>

      {/* ── Bio ─────────────────────────────────────────────── */}
      {bio && (
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed line-clamp-2 italic">
          "{bio}"
        </p>
      )}

      {/* ── Stats ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 pb-2">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 flex items-center gap-3 border border-slate-100/50 dark:border-slate-700/30">
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-primary-500 shadow-sm border border-slate-100 dark:border-slate-700/50">
            <Calendar size={14} />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-900 dark:text-white leading-none">{sessions}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Sessions</p>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 flex items-center gap-3 border border-slate-100/50 dark:border-slate-700/30">
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100 dark:border-slate-700/50">
            <Users size={14} />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-900 dark:text-white leading-none">{learners}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Learners</p>
          </div>
        </div>
      </div>

      {/* ── Skills Matrix ── */}
      <div className="flex flex-col gap-4">
        {skillsTeach.length > 0 && (
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Zap size={10} className="text-primary-500" /> Can Mentor
            </p>
            <div className="flex flex-wrap gap-1.5">
              {skillsTeach.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-md bg-primary-100/40 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-black tracking-tight border border-primary-500/10">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Actions ─────────────────────────────────────────── */}
      <div className="flex gap-3 pt-2 mt-auto">
        <button
          className={`flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 relative overflow-hidden group/btn ${
            connected
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50 shadow-inner"
              : "btn-primary shadow-xl shadow-primary-500/20 active:scale-95"
          }`}
          onClick={handleConnect}
          disabled={connecting || connected}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {connecting ? "Handshaking…" : connected ? <><CheckCircle2 size={16} /> Partnered</> : <><UserPlus size={16} /> Connect</>}
          </span>
          {!connected && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-out" />}
        </button>
        
        <button
          className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-slate-500 hover:text-primary-500 hover:border-primary-500 transition-all active:scale-90"
          onClick={(e) => { e.stopPropagation(); onChat?.(user); }}
          aria-label="Send message"
        >
          <MessageCircle size={20} />
        </button>
        
        <button
          className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 transition-all border-dashed"
          aria-label="Share profile"
        >
          <Share2 size={18} />
        </button>
      </div>
    </article>
  );
};

export default UserCard;

