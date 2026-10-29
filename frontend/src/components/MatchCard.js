import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, MessageCircle, Calendar, 
  CheckCircle2, Star, Sparkles,
  ArrowUpRight, Award, ChevronRight
} from 'lucide-react';

const MatchCard = ({ match, onChat }) => {
  const navigate = useNavigate();
  const { 
    name, bio, profilePicture, 
    matchPercentage, matchType, 
    commonSkills, role 
  } = match;

  const handleBookSync = () => {
    const skill = commonSkills?.[0] || '';
    navigate(`/schedule?partner=${encodeURIComponent(name)}&skill=${encodeURIComponent(skill)}`);
  };

  const getSkillColor = (i) => {
    const colors = [
      'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      'bg-violet-500/10 text-violet-300 border-violet-500/20',
      'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
      'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
    ];
    return colors[i % colors.length];
  };

  return (
    <div className="group relative rounded-[3rem] bg-indigo-950/40 border border-white/5 hover:border-cyan-500/50 transition-all duration-700 overflow-hidden flex flex-col h-full shadow-3xl backdrop-blur-xl">
      
      {/* ── CINEMATIC OVERLAYS ───────────────────────── */}
      <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <div className="relative z-10 p-10 flex flex-col gap-10 h-full">
        
        {/* COMPATIBILITY RING (NEON UPGRADE) */}
        <div className="absolute top-10 right-10">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="34" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
              <circle
                cx="40" cy="40" r="34"
                fill="transparent"
                stroke="url(#mentorGradient)"
                strokeWidth="6"
                strokeDasharray={213.6}
                strokeDashoffset={213.6 - (213.6 * matchPercentage) / 100}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
                style={{ filter: matchPercentage > 80 ? 'drop-shadow(0 0 8px #06b6d4)' : 'none' }}
              />
              <defs>
                <linearGradient id="mentorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-sm font-black text-white">{matchPercentage}%</span>
            </div>
            {matchPercentage > 85 && (
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-10" />
            )}
          </div>
        </div>

        {/* HEADER: AVATAR & IDENTITY */}
        <div className="flex gap-8 items-start">
          <div className="relative">
            <div className={`absolute -inset-2 bg-gradient-to-tr ${matchPercentage > 80 ? 'from-cyan-500 to-violet-600' : 'from-slate-700 to-slate-800'} rounded-[2.5rem] blur opacity-20 group-hover:opacity-50 transition-opacity`} />
            <div className="w-24 h-24 rounded-[2.2rem] overflow-hidden border-2 border-white/10 bg-slate-950 shadow-2xl relative z-10 transition-all duration-700 group-hover:scale-105 group-hover:rotate-3">
              {profilePicture ? (
                <img src={profilePicture} alt={name} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center text-white capitalize text-4xl font-black">
                  {name?.[0]}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 pt-3">
            <h3 className="text-2xl font-black text-white tracking-tighter leading-none flex items-center gap-3" style={{ fontFamily: "Fraunces, serif" }}>
              {name}
              {matchPercentage > 90 && <Sparkles size={18} className="text-cyan-400 animate-pulse" />}
            </h3>
            <div className="flex items-center gap-2 mt-4 text-cyan-400/60 font-black text-[10px] uppercase tracking-[0.3em]">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              Mentor Connection
            </div>
          </div>
        </div>

        {/* IDENTITY QUOTE (CINEMATIC DISPLAY) */}
        <div className="relative py-4">
          <p className="text-slate-400 text-lg font-medium italic leading-relaxed pl-6 border-l-4 border-cyan-500/20">
            "{bio || "Expert Mentor ready to synchronize knowledge nodes and accelerate learning pathways."}"
          </p>
        </div>

        {/* SKILL OVERLAP SECTION */}
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Overlapping Core</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          <div className="flex flex-wrap gap-3">
            {(commonSkills || []).length > 0 ? (
              commonSkills.map((skill, i) => (
                <span key={i} className={`px-5 py-2.5 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-white/5 active:scale-95 cursor-default ${getSkillColor(i)}`}>
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-slate-700 font-black uppercase tracking-[0.3em]">Synching Skills...</span>
            )}
          </div>
        </div>

        {/* SYSTEM ACTIONS */}
        <div className="flex gap-5 pt-6 mt-auto">
          <button 
            onClick={handleBookSync}
            className="flex-1 h-16 rounded-[1.8rem] bg-white text-slate-950 font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 hover:bg-cyan-50 hover:shadow-[0_0_50px_rgba(6,182,212,0.3)] active:scale-95 group/btn"
          >
            <Calendar size={20} className="text-cyan-600 transition-transform group-hover/btn:rotate-12" />
            Schedule Sync
          </button>
          <button 
            onClick={() => onChat(match)}
            className="w-16 h-16 rounded-[1.8rem] bg-slate-950 border border-white/5 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all flex items-center justify-center active:scale-95 shadow-inner group/msg"
          >
            <MessageCircle size={26} className="group-hover/msg:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* BACKGROUND SCANLINE ANIMATION */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-500/20 shadow-[0_0_30px_#06b6d4] animate-[scan_8s_linear_infinite]" />
    </div>
  );
};

export default MatchCard;
