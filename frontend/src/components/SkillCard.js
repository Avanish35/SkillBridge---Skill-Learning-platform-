import React, { useState } from "react";
import { 
  Star, Clock, Users, Flame, Sparkles, 
  GraduationCap, Heart, Bookmark, ChevronRight,
  PlayCircle, Timer, Award, Zap, Activity
} from "lucide-react";

// ─── Star Rating ──────────────────────────────────────────
const StarRating = ({ rating, size = 14 }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(full)].map((_, i) => <Star key={`f-${i}`} size={size} className="fill-amber-400 text-amber-400" />)}
      {half && <div className="relative overflow-hidden w-[7px]"><Star size={size} className="fill-amber-400 text-amber-400" /></div>}
      {[...Array(empty)].map((_, i) => <Star key={`e-${i}`} size={size} className="text-slate-700" />)}
    </div>
  );
};

// ─── SkillCard ─────────────────────────────────────────────
const SkillCard = ({
  skill,
  onLearn,
  onSave,
  onReviewClick,
  showActions = true,
  variant = "default", // "default" | "compact"
}) => {
  const [saved, setSaved] = useState(skill?.saved || false);

  const {
    id,
    name        = "Untitled Skill",
    description = "No description provided.",
    category    = "default",
    level       = "beginner",
    rating      = 0,
    reviewCount = 0,
    learners    = 0,
    instructor  = { name: "Unknown", avatar: null },
    duration    = "N/A",
    thumbnail   = null,
    isTrending  = false,
    isNew       = false,
  } = skill || {};

  const instructorAvatarColor = `hsl(${(instructor.name?.charCodeAt(0) || 65) * 5}, 65%, 45%)`;

  const handleSave = (e) => {
    e.stopPropagation();
    setSaved(!saved);
    onSave?.({ ...skill, saved: !saved });
  };

  if (variant === "compact") {
    return (
      <div
        className="group relative flex gap-5 p-4 rounded-[2rem] bg-slate-900/40 border border-white/5 hover:border-primary-500/30 transition-all duration-500 backdrop-blur-xl cursor-pointer overflow-hidden"
        onClick={() => onLearn?.(skill)}
      >
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0 relative shadow-2xl">
          {thumbnail ? (
            <img src={thumbnail} alt={name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-600 to-indigo-700 text-white">
               <GraduationCap size={24} />
            </div>
          )}
          <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/20 transition-all flex items-center justify-center">
            <PlayCircle size={20} className="text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0" />
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="text-[9px] font-black text-primary-400 uppercase tracking-[0.2em] mb-1">{category}</p>
          <h4 className="font-black text-white text-sm truncate group-hover:text-primary-400 transition-colors tracking-tight">{name}</h4>
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={rating} size={10} />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{reviewCount} REVIEWS</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article
      className={`group relative flex flex-col rounded-[2.5rem] bg-slate-950 border transition-all duration-700 cursor-pointer overflow-hidden shadow-2xl
        ${isTrending ? 'border-primary-500/20 hover:border-primary-500/50 shadow-[0_0_50px_rgba(79,70,229,0.1)]' : 'border-white/5 hover:border-white/20'}
        hover:-translate-y-3`}
      onClick={() => onLearn?.(skill)}
    >
      {/* ── CINEMATIC THUMBNAIL ── */}
      <div className="relative h-56 bg-slate-900 overflow-hidden">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out brightness-90 group-hover:brightness-100" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 to-slate-800 p-8 text-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-primary-400 shadow-inner">
              <GraduationCap size={40} />
            </div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">{category}</p>
          </div>
        )}

        {/* Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

        {/* HUD Elements */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950 to-transparent opacity-60" />

        {/* Status Badges - FIXED VISIBILITY */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
          {isTrending && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/40 border border-white/20 animate-pulse-glow">
              <Activity size={12} /> TRENDING
            </div>
          )}
          {isNew && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/40 border border-white/20">
              <Sparkles size={12} /> NEW
            </div>
          )}
        </div>

        {/* Favorite Interaction */}
        {showActions && (
          <button
            className={`absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 backdrop-blur-3xl border
              ${saved
                ? "bg-rose-500 border-rose-400 text-white shadow-xl shadow-rose-500/40 rotate-[360deg]"
                : "bg-white/5 border-white/10 text-slate-400 hover:bg-rose-500 hover:border-rose-400 hover:text-white"
              }`}
            onClick={handleSave}
          >
            <Heart size={24} className={saved ? "fill-white" : ""} />
          </button>
        )}

        {/* Duration HUD */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-[10px] font-black backdrop-blur-md">
          <Clock size={12} className="text-primary-400" /> {duration.toString().toUpperCase()}
        </div>
      </div>

      {/* ── PREMIUM CONTENT ── */}
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <Zap size={10} className="text-primary-500" /> {level.toUpperCase()}
           </div>
           <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <Users size={12} className="text-emerald-500" /> {learners.toLocaleString()} LEARNERS
           </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-black text-white leading-tight tracking-tight group-hover:text-primary-400 transition-colors line-clamp-2 min-h-[3rem]" style={{ fontFamily: "Fraunces, serif" }}>
            {name}
          </h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center gap-4 pt-6 border-t border-white/5">
           <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black text-white flex-shrink-0 shadow-2xl border border-white/10"
            style={{ background: instructorAvatarColor }}
          >
            {instructor.name?.[0] || "?"}
          </div>
          <div className="flex-1 min-w-0">
             <p className="text-[11px] font-black text-white uppercase tracking-wider truncate">{instructor.name}</p>
             <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Expert Mentor</p>
          </div>
          <div 
            className="flex flex-col items-end gap-1 cursor-pointer group/rating"
            onClick={(e) => { e.stopPropagation(); onReviewClick?.(skill); }}
          >
             <StarRating rating={rating} size={11} />
             <span className="text-[10px] font-black text-white font-mono tracking-tighter group-hover/rating:text-primary-400 transition-colors">{rating.toFixed(1)} / 5.0</span>
          </div>
        </div>

        {/* CTA Launch */}
        {showActions && (
          <button
            className="w-full h-16 bg-white/5 border border-white/10 hover:border-primary-500/50 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black text-slate-300 hover:text-white uppercase tracking-[0.3em] transition-all group/btn active:scale-95 shadow-3xl overflow-hidden relative"
            onClick={(e) => { e.stopPropagation(); onLearn?.(skill); }}
          >
            <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover/btn:opacity-10 transition-opacity" />
            LEARN NOW <ChevronRight size={16} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
          </button>
        )}
      </div>
    </article>
  );
};

export default SkillCard;
