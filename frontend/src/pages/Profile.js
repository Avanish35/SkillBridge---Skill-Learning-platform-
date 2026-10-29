/**
 * Profile.js
 * Lumina Design System - High-End Vibrant Professional Dashboard.
 * Features: Animated Mesh Backgrounds, Neon Glassmorphism, Image Upload Hub.
 * Refinement: Expansive "One-Page" Identity Sync (Eliminated internal scrolling).
 */

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { reviewAPI } from "../api/api";
import { 
  MapPin, Star, Award, ShieldCheck, 
  Camera, Mail, Link, Plus, ChevronRight,
  TrendingUp, BookOpen, Zap, Trophy, Medal, Target,
  Quote, X, Settings2, Share2, User,
  Sparkles, Binary, Fingerprint, Clock, Users,
  Upload, CheckCircle, Flame, ExternalLink, Cpu, LayoutGrid
} from "lucide-react";

// ─── Custom Brand Icons ───
const GithubIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
  </svg>
);

// ─── Custom Global Styles for Animations ───
const LuminaStyles = () => (
  <style>{`
    @keyframes mesh-gradient {
      0% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(10%, 10%) scale(1.1); }
      66% { transform: translate(-10%, 5%) scale(0.9); }
      100% { transform: translate(0, 0) scale(1); }
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 0; }
      50% { opacity: 0.3; }
      100% { transform: scale(1.3); opacity: 0; }
    }
    .animate-mesh {
      animation: mesh-gradient 15s ease-in-out infinite alternate;
    }
    .animate-pulse-ring {
      animation: pulse-ring 3s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
    }
    .vibrant-glass {
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(12px) saturate(200%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.3);
    }
    .vibrant-glass:hover {
      border-color: rgba(99, 102, 241, 0.4);
      background: rgba(15, 23, 42, 0.55);
      box-shadow: 0 0 25px rgba(99, 102, 241, 0.1);
    }
    .text-gradient {
      background: linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #f472b6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .text-vibrant-indigo {
       background: linear-gradient(to right, #6366f1, #a855f7);
       -webkit-background-clip: text;
       -webkit-text-fill-color: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar { width: 5px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #06080d; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6366f1; }
  `}</style>
);

// ─── Components ───

const StarRating = ({ rating, size = 12 }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={size} 
        className={i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-700/50"} 
      />
    ))}
  </div>
);

const SectionHeader = ({ title, icon: Icon, badge, color = "text-indigo-400" }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${color}`}>
          <Icon size={16} />
        </div>
      )}
      <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">{title}</h3>
    </div>
    {badge > 0 && (
      <div className="px-3 py-0.5 rounded-full text-[9px] font-black bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
        {badge} UNITS
      </div>
    )}
  </div>
);

const EditModal = ({ user, onSave, onClose }) => {
  const [form, setForm] = useState({ ...user });
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, profilePicture: reader.result });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={onClose}>
      <div className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] w-full max-w-[1100px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-scale-in" onClick={e=>e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="relative px-10 py-8 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-pink-900/30 border-b border-white/5 ">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-indigo-400 shadow-inner">
                <LayoutGrid size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight text-gradient">Identity Core Sync</h2>
                <p className="text-[10px] text-indigo-300/80 mt-1 uppercase font-black tracking-[0.3em] font-mono flex items-center gap-2">
                  <Cpu size={12} className="text-pink-400" /> Operational Protocol: Enhanced_Sync_v3.0
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 border border-white/10 bg-white/5 hover:bg-white/10 rounded-[1.2rem] transition-all text-white hover:rotate-90 duration-300">
              <X size={20}/>
            </button>
          </div>
        </div>
        
        <div className="p-10 bg-slate-900/40">
          <div className="grid grid-cols-12 gap-10">
            
            {/* Left Column: Vision & Identity */}
            <div className="col-span-12 md:col-span-4 space-y-10">
              <div className="flex flex-col items-center gap-6">
                <div className="relative group/avatar">
                  <div className="absolute -inset-3 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-[3rem] blur-xl opacity-20 group-hover/avatar:opacity-50 transition-all duration-700"></div>
                  <div className="w-40 h-40 rounded-[3rem] border-2 border-white/10 overflow-hidden bg-slate-900 relative z-10 shadow-2xl">
                    {form.profilePicture ? (
                      <img src={form.profilePicture} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-black bg-gradient-to-br from-indigo-600 to-purple-800 text-white shadow-inner">
                        {form.name?.[0]}
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 backdrop-blur-sm">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-3 -right-3 z-20 p-4 bg-indigo-600 text-white rounded-[1.5rem] shadow-[0_10px_30px_rgba(79,70,229,0.5)] border-4 border-[#0f172a] hover:scale-110 active:scale-95 transition-all"
                  >
                    <Camera size={24} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono">Neural Interface ID</p>
                  <p className="text-xs font-black text-indigo-400 mt-1 uppercase">Live Identity Signature</p>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="p-6 rounded-[2rem] bg-black/40 border border-white/5 space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.25em] ml-1 flex items-center gap-2"><User size={12}/> Public Label</label>
                       <input className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-indigo-500/50 outline-none transition-all shadow-inner" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Input Identity Label" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.25em] ml-1 flex items-center gap-2"><Cpu size={12}/> Primary Role</label>
                       <input className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-purple-500/50 outline-none transition-all shadow-inner" value={form.role} onChange={e=>setForm({...form, role: e.target.value})} placeholder="Calibration Role" />
                    </div>
                 </div>
              </div>
            </div>

            {/* Right Column: Experience & Bio */}
            <div className="col-span-12 md:col-span-8 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.25em] ml-1 flex items-center gap-2"><BookOpen size={12}/> Digital Biography</label>
                <textarea className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-6 py-5 text-base text-slate-300 focus:border-pink-500/50 outline-none min-h-[160px] resize-none leading-relaxed transition-all shadow-inner font-medium" value={form.bio} onChange={e=>setForm({...form, bio: e.target.value})} placeholder="Describe your operational existence..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.25em] ml-1 flex items-center gap-2"><Zap size={12}/> Transmission Skills</label>
                  <input className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white outline-none focus:border-indigo-500/50 transition-all shadow-inner" placeholder="Calibration: React, Node, Java" value={form.skillsTeach} onChange={e=>setForm({...form, skillsTeach: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.25em] ml-1 flex items-center gap-2"><Sparkles size={12}/> Learning Channels</label>
                  <input className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white outline-none focus:border-indigo-500/50 transition-all shadow-inner" placeholder="Acquisition: AI, Rust, Web3" value={form.skillsLearn} onChange={e=>setForm({...form, skillsLearn: e.target.value})} />
                </div>
              </div>

              <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between">
                 <div className="flex items-center gap-4 text-emerald-400">
                    <CheckCircle size={24} />
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.25em]">Sync Status</p>
                       <p className="text-xs text-slate-400 mt-0.5">Parameters are stable and ready for commit</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button className="px-6 py-3 text-xs font-bold text-slate-400 hover:text-white transition-colors" onClick={onClose}>Abort Sync</button>
                    <button 
                      className="px-10 py-5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white rounded-2xl shadow-[0_15px_40px_rgba(79,70,229,0.4)] hover:scale-[1.05] active:scale-95 transition-all text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3" 
                      onClick={() => { onSave(form); onClose(); }}
                    >
                      Update Core Directives <ChevronRight size={16} />
                    </button>
                 </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

// ─── Main Page ───

const Profile = ({ toast }) => {
  const { user, updateUser } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [realReviews, setRealReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      reviewAPI.getByInstructor(user.id)
        .then(res => setRealReviews(res.data))
        .catch(err => console.error("Error fetching real reviews:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const displayedReviews = useMemo(() => {
    if (!realReviews) return [];
    return [...realReviews]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [realReviews]);

  const completeness = useMemo(() => {
    let score = 0;
    if (user?.bio) score += 20;
    if (user?.profilePicture) score += 20;
    if (user?.location) score += 10;
    if (user?.skillsTeach) score += 25;
    if (user?.skillsLearn) score += 25;
    return score;
  }, [user]);

  const handleSave = (data) => {
    updateUser(data);
    if(toast) toast("Neural patterns updated successfully.", "success");
  };

  const teachingSkills = useMemo(() => 
    typeof user?.skillsTeach === 'string' ? user.skillsTeach.split(",").map(s => s.trim()).filter(Boolean) : [],
    [user?.skillsTeach]
  );

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-200 selection:bg-indigo-500/40 relative overflow-hidden font-sans">
      <LuminaStyles />
      
      {/* ─── Animated Mesh Background ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/15 rounded-full blur-[120px] animate-mesh" />
        <div className="absolute top-[20%] -right-[15%] w-[50%] h-[50%] bg-purple-600/15 rounded-full blur-[120px] animate-mesh" style={{ animationDelay: '-5s' }} />
        <div className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] bg-pink-600/10 rounded-full blur-[120px] animate-mesh" style={{ animationDelay: '-10s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="relative mb-20 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur opacity-15 group-hover:opacity-30 transition duration-1000"></div>
          <div className="h-64 w-full rounded-[2.5rem] bg-[#0f172a] border border-white/10 overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-transparent to-pink-900/30"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(99,102,241,0.2),_transparent_50%)]"></div>
          </div>
          
          <div className="absolute -bottom-16 left-12 flex flex-col md:flex-row items-end gap-10 w-[calc(100%-6rem)]">
            <div className="relative group/avatar">
              <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-[2.5rem] blur-xl opacity-30"></div>
              <div className="w-40 h-40 md:w-52 md:h-52 rounded-[2.5rem] border-8 border-[#06080d] bg-slate-900 overflow-hidden shadow-2xl relative z-10 transition-transform duration-500 group-hover/avatar:scale-[1.02]">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-purple-800 text-white text-6xl font-black">
                    {user?.name?.[0]}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 z-20 p-2.5 bg-emerald-500 rounded-2xl border-4 border-[#06080d] shadow-xl text-white">
                <ShieldCheck size={20} />
              </div>
            </div>

            <div className="flex-1 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">{user?.name}</h1>
                  <Sparkles className="text-amber-400 animate-pulse" size={24} />
                </div>
                <div className="flex flex-wrap items-center gap-6 text-slate-400">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400 bg-indigo-400/10 px-5 py-2 rounded-xl border border-indigo-400/20">
                    {user?.role || "Nexus Controller"}
                  </span>
                  <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                    <MapPin size={16} className="text-rose-500" /> {user?.location || "Node:Earth"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-5">
                <button 
                  onClick={() => setShowEdit(true)} 
                  className="group relative flex items-center gap-3 bg-white text-black px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl active:scale-95"
                >
                  <Settings2 size={18} className="group-hover:rotate-180 transition-transform duration-1000" /> Sync Patterns
                </button>
                <button className="p-5 rounded-[2rem] bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
                  <Share2 size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Expansive Refined Grid ─── */}
        <div className="grid grid-cols-12 gap-10 mt-28">
          
          <div className="col-span-12 xl:col-span-8 space-y-10">
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Uptime", value: user?.sessions || "0", icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10" },
                { label: "Trust", value: "98%", icon: Trophy, color: "text-amber-400", bg: "bg-amber-400/10" },
                { label: "Nodes", value: user?.learners || "0", icon: Users, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                { label: "Sync", value: "Optimal", icon: Flame, color: "text-rose-400", bg: "bg-rose-400/10" }
              ].map((s, i) => (
                <div key={i} className="vibrant-glass p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group transition-all">
                  <div className={`p-4 rounded-2xl ${s.bg} ${s.color} group-hover:scale-110 transition-transform`}>
                    <s.icon size={24} />
                  </div>
                  <span className="text-2xl font-black text-white">{s.value}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="vibrant-glass p-12 rounded-[3rem] relative overflow-hidden group border-l-4 border-indigo-500/30">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-all rotate-12 scale-125"><Binary size={260} /></div>
              <SectionHeader title="Digital Narrative" icon={BookOpen} color="text-pink-400" />
              <p className="text-2xl text-slate-300 font-bold leading-relaxed tracking-tight">
                 {user?.bio || "Node summary offline. Calibrate identity parameters to reveal existence context."}
              </p>
              <div className="flex items-center justify-between border-t border-white/5 pt-10 mt-10">
                 <div className="flex gap-8 items-center">
                    <GithubIcon className="text-slate-500 hover:text-indigo-400 hover:scale-125 cursor-pointer transition-all duration-300" size={28} />
                    <LinkedinIcon className="text-slate-500 hover:text-blue-400 hover:scale-125 cursor-pointer transition-all duration-300" size={28} />
                    <Mail size={28} className="text-slate-500 hover:text-rose-400 hover:scale-125 cursor-pointer transition-all duration-300" />
                 </div>
                 <button className="flex items-center gap-3 px-8 py-3.5 rounded-[1.5rem] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-lg">
                    Connect Node <ExternalLink size={16} />
                 </button>
              </div>
            </div>

            <div className="vibrant-glass p-12 rounded-[3rem]">
              <SectionHeader title="Transmission Logs" icon={Quote} badge={realReviews.length} color="text-amber-400" />
              {loading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-8 text-slate-500">
                  <div className="w-12 h-12 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin shadow-2xl shadow-indigo-500/20"></div>
                  <p className="text-xs font-black uppercase tracking-[0.4em] animate-pulse">Decrypting Feedback Channels...</p>
                </div>
              ) : displayedReviews.length > 0 ? (
                <div className="space-y-10">
                  {displayedReviews.map((r, i) => (
                    <div key={i} className="p-10 rounded-[2.5rem] bg-black/40 border border-white/5 group hover:border-indigo-500/30 transition-all relative overflow-hidden shadow-xl">
                      <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-xl font-black text-indigo-100 border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-300">
                            {r.userName?.[0] || "?"}
                          </div>
                          <div>
                            <p className="text-lg font-black text-white leading-tight mb-1.5">{r.userName || "Unknown Peer"}</p>
                            <p className="text-[10px] text-indigo-400/40 font-black uppercase tracking-widest font-mono">Stream ID: SRC_CRS_{r.courseId}</p>
                          </div>
                        </div>
                        <div className="bg-amber-400/5 px-4 py-2 rounded-2xl border border-amber-400/20">
                          <StarRating rating={r.rating} size={14} />
                        </div>
                      </div>
                      <p className="text-slate-300 text-xl leading-relaxed italic font-bold tracking-tight">"{r.comment}"</p>
                    </div>
                  ))}
                  {realReviews.length > 5 && (
                    <div className="pt-4 text-center">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">
                        + {realReviews.length - 5} more transmissions archived
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-32 text-center border-8 border-dashed border-white/5 rounded-[3rem] group hover:border-indigo-500/20 transition-all">
                  <p className="text-slate-600 text-base font-black uppercase tracking-[0.4em] italic opacity-30 group-hover:opacity-60">Void_Space: No Signals Detected</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-12 xl:col-span-4 space-y-10">
            
            <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950 rounded-[3rem] p-12 pb-16 text-white relative overflow-hidden group shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10">
               <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform duration-1000 group-hover:scale-150 rotate-12 group-hover:rotate-0"><Fingerprint size={220} /></div>
               <div className="relative z-10">
                 <SectionHeader title="Core Fidelity" color="text-white" />
                 <div className="flex flex-col items-center gap-12 mt-12">
                    <div className="relative w-56 h-56 flex items-center justify-center">
                       <div className="absolute inset-0 animate-pulse-ring rounded-full border border-white/20 "></div>
                       <svg className="w-full h-full -rotate-90">
                          <circle cx="112" cy="112" r="102" fill="transparent" stroke="rgba(255,255,255,0.15)" strokeWidth="16" />
                          <circle cx="112" cy="112" r="102" fill="transparent" stroke="white" strokeWidth="16" strokeDasharray="640.88" strokeDashoffset={640.88 * (1 - completeness / 100)} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                       </svg>
                       <div className="absolute flex flex-col items-center">
                         <span className="text-6xl font-black tracking-tighter">{completeness}</span>
                         <span className="text-[12px] font-black uppercase tracking-[0.3em] opacity-60">SYNC</span>
                       </div>
                    </div>
                    <div className="text-center w-full">
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 mb-4">Integrity Signature</p>
                      <p className="text-3xl font-black uppercase tracking-tight text-white mb-12 drop-shadow-xl">Optimum Level</p>
                      <button 
                        onClick={() => setShowEdit(true)} 
                        className="w-full py-5 bg-white text-indigo-700 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:shadow-[0_20px_50px_rgba(255,255,255,0.4)] hover:-translate-y-2 transition-all active:translate-y-0 shadow-2xl relative z-10 flex items-center justify-center gap-2"
                      >
                        Update Core Directives <Sparkles size={14} className="text-purple-500" />
                      </button>
                    </div>
                 </div>
               </div>
            </div>

            <div className="vibrant-glass p-10 rounded-[3rem] border-t-4 border-emerald-500/30">
              <SectionHeader title="Knowledge Array" icon={Sparkles} color="text-emerald-400" />
              <div className="flex flex-wrap gap-4">
                {teachingSkills.length > 0 ? teachingSkills.map(s => (
                  <span key={s} className="px-5 py-3 rounded-2xl bg-emerald-500/5 text-emerald-300 text-[11px] font-black border border-emerald-500/10 shadow-lg uppercase tracking-widest hover:border-emerald-400 hover:bg-emerald-500/10 transition-all">{s}</span>
                )) : (
                  <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.4em] ml-2 animate-pulse w-full text-center py-4">System Calibration...</p>
                )}
              </div>
            </div>

            <div className="vibrant-glass p-10 rounded-[3rem] border-b-4 border-rose-500/30">
               <SectionHeader title="Legacy Units" icon={Award} color="text-amber-400" />
               <div className="space-y-6">
                  {[
                    { title: "Grand Mentor 2024", icon: Medal, accent: "text-amber-400", bg: "bg-amber-400/10" },
                    { title: "Top Sync Node", icon: Target, accent: "text-blue-400", bg: "bg-blue-400/10" },
                    { title: "Elite Contributor", icon: Zap, accent: "text-pink-400", bg: "bg-pink-400/10" }
                  ].map((a, i) => (
                    <div key={i} className="flex items-center gap-8 p-5 rounded-[2.5rem] hover:bg-white/5 transition-all group border border-transparent hover:border-white/5 cursor-default shadow-sm hover:shadow-xl">
                       <div className={`p-5 rounded-2xl ${a.bg} ${a.accent} group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-2xl border border-white/5`}><a.icon size={28} /></div>
                       <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 group-hover:text-white transition-colors">{a.title}</span>
                    </div>
                  ))}
               </div>
            </div>

          </div>

        </div>
      </div>

      {showEdit && <EditModal user={user} onSave={handleSave} onClose={() => setShowEdit(false)} />}
    </div>
  );
};

export default Profile;
