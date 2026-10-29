/**
 * About.js
 * High-fidelity Platform Info page with "Midnight Luminous Ultimate" design.
 * Features: Immersive Hero, Dynamic Capability Matrix, Admin-Managed Founders.
 */

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, Zap, ArrowRight, Cpu, 
  Settings2, Github, Linkedin, Twitter, Camera, Loader2,
  Trash2, UserPlus, CheckCircle2, AlertCircle
} from "lucide-react";
import Logo from "../components/Logo";
import { publicAPI, adminAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

// ─── Custom Brand Icons ───
const GithubIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const FEATURES = [
  { 
    title: "Skill Exchange", 
    desc: "The purest form of peer learning. Trade your mastery for new knowledge with no barriers. It's built on mutual growth.", 
    icon: <Zap size={24} className="text-primary-500" />,
    color: "bg-primary-500/10"
  },
  { 
    title: "Verified Mentors", 
    desc: "Connect with high-caliber experts whose credentials and peer endorsements are indexed and cryptographically verified.", 
    icon: <ShieldCheck size={24} className="text-emerald-500" />,
    color: "bg-emerald-500/10"
  },
  { 
    title: "Nexus Growth", 
    desc: "Track your intellectual evolution with our real-time skill-mapping system. Every session contributes to your global index.", 
    icon: <Cpu size={24} className="text-blue-500" />,
    color: "bg-blue-500/10"
  },
];

const STATS = [
  { val: "50K+", label: "Global Innovators" },
  { val: "24/7", label: "Direct Mentoring" },
  { val: "120+", label: "Skill Categories" },
  { val: "94%", label: "Match Accuracy" },
];

const STATIC_FOUNDERS = [
  {
    id: 1,
    name: "Shivam Singh",
    roleName: "Co-founder & Lead Architect",
    bio: "Spearheading the strategic vision and full-stack architecture of SkillBridge, leveraging advanced engineering and scalable system design.",
    avatarChar: "S",
    color: "from-primary-500 to-indigo-600",
    skill: "System Architecture",
  },
  {
    id: 2,
    name: "Avanish Verma",
    roleName: "Founder & Engineer",
    bio: "Mastering the backend infrastructure of SkillBridge, Avanish ensures seamless data flow and robust database design, building our world-class platform.",
    avatarChar: "A",
    color: "from-emerald-500 to-teal-600",
    skill: "Infrastructure Ops",
  },
  {
    id: 3,
    name: "Muskan Kumari",
    roleName: "Co-founder & UI/UX Lead",
    bio: "Passionate about crafting beautiful and intuitive user experiences, Muskan transforms complex workflows into seamless platform interactions.",
    avatarChar: "M",
    color: "from-rose-500 to-pink-600",
    skill: "Product Experience",
  }
];

const SynapticNode = ({ size = 100, delay = "0s", className = "" }) => (
  <div className={`absolute pointer-events-none select-none opacity-10 animate-drift-slow ${className}`} style={{ animationDelay: delay }}>
     <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="2" fill="currentColor" />
        <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
        <path d="M50 40 L50 10 M50 60 L50 90 M40 50 L10 50 M60 50 L90 50" stroke="currentColor" strokeWidth="0.5" />
     </svg>
  </div>
);

const About = () => {
  const { isAdmin } = useAuth();
  const [founders, setFounders] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState(null); // ID of founder being updated
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchFounders();
  }, []);

  const fetchFounders = async () => {
    try {
      const res = await publicAPI.getFounders();
      if (res.data && res.data.length > 0) {
        setFounders(res.data);
      } else {
        setFounders(STATIC_FOUNDERS);
      }
    } catch (err) {
      console.error("Failed to fetch founders:", err);
      setFounders(STATIC_FOUNDERS);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (founderId) => {
    setUpdating(founderId);
    fileInputRef.current.onclick = () => {
      // Small hack to ensure we capture the specific founderId in the change event
      fileInputRef.current.dataset.founderId = founderId;
    };
    fileInputRef.current.click();
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    const founderId = e.target.dataset.founderId;
    if (!file || !founderId) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      try {
        const founder = founders.find(f => f.id === parseInt(founderId));
        await adminAPI.updateFounder(founderId, { ...founder, photoUrl: base64String });
        await fetchFounders();
      } catch (err) {
        alert("Failed to update photo");
      } finally {
        setUpdating(null);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-14 pb-20 max-w-[1500px] mx-auto animate-fade-in relative px-6">
      <style>{`
        @keyframes liquid-1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(5%, 10%) scale(1.1); } }
        @keyframes liquid-2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-10%, -5%) scale(1.2); } }
        @keyframes drift-slow { 0% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(20px, -20px) rotate(5deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
        
        .animate-liquid-1 { animation: liquid-1 15s ease-in-out infinite; }
        .animate-liquid-2 { animation: liquid-2 20s ease-in-out infinite; }
        .animate-drift-slow { animation: drift-slow 12s ease-in-out infinite; }
        
        .glass-card { border-radius: 2.75rem !important; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .glass-card:hover { transform: translateY(-8px) scale(1.02); }
      `}</style>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* ── Immersive Genesis Hero ─────────────────────────────────── */}
      <div className="relative overflow-hidden hero-mesh-bg rounded-[3rem] p-10 lg:p-24 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 mt-6">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[140px] animate-liquid-1" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-liquid-2" />
        
        <SynapticNode className="top-10 right-[15%] text-primary-500" size={180} delay="1s" />
        <SynapticNode className="bottom-10 left-[10%] text-emerald-500" size={140} delay="4s" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="w-28 h-28 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl flex items-center justify-center p-6 border border-slate-100 dark:border-slate-800 mb-12 animate-float">
             <Logo size={72} />
          </div>

          <h1 className="text-5xl lg:text-8xl font-black text-slate-900 dark:text-white mb-10 tracking-tighter leading-[0.95] uppercase" style={{ fontFamily: "Fraunces, serif" }}>
            The Genesis of <span className="text-gradient">Peer Access.</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-16 max-w-3xl px-4">
            Democratizing knowledge through a global neural network. We believe the fastest way to master a new skill is by teaching what you already know in exchange.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
             <Link to="/register" className="btn-primary h-16 px-12 rounded-2xl text-lg font-black shadow-xl shadow-primary-500/20 active:scale-95 group overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">Initialize Account <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" /></span>
             </Link>
             <button className="btn-ghost h-16 px-12 rounded-2xl text-lg font-black hover:border-primary-500 active:scale-95 transition-all text-slate-500">
                Nexus Manifesto
             </button>
          </div>
        </div>
      </div>

      {/* ── Global Pulse Metrics ────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map((s, i) => (
          <div key={i} className="glass-card bg-slate-900/5 dark:bg-white/5 border-slate-100 dark:border-white/10 p-10 flex flex-col items-center text-center group hover:border-primary-500/30">
             <h4 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-primary-500 transition-colors" style={{ fontFamily: "Fraunces, serif" }}>{s.val}</h4>
             <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.5em]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent my-10" />

      {/* ── Capability Matrix (Features) ──────────────────────────────── */}
      <div className="flex flex-col gap-12">
        <div className="text-center space-y-4">
           <p className="text-[11px] font-black text-primary-500 uppercase tracking-[0.5em]">System Protocols</p>
           <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>Core Capabilities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           {FEATURES.map((f, i) => (
             <div key={i} className="glass-card bg-white dark:bg-slate-900/40 p-12 flex flex-col items-start gap-8 group hover:shadow-2xl shadow-primary-500/10 border-slate-100 dark:border-slate-800">
                <div className={`w-20 h-20 rounded-[1.75rem] ${f.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500`}>
                   {f.icon}
                </div>
                <div>
                   <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4" style={{ fontFamily: "Fraunces, serif" }}>{f.title}</h3>
                   <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-lg">{f.desc}</p>
                </div>
                <div className="h-1.5 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 via-indigo-500 to-emerald-500 transition-all duration-700 rounded-full mt-auto" />
             </div>
           ))}
        </div>
      </div>

      {/* ── Elite Architects (Founders) ───────────────────────────────── */}
      <div className="py-24 flex flex-col gap-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[150px] -z-10 animate-liquid-1" />
        
        <div className="text-center space-y-4">
           <p className="text-[11px] font-black text-primary-500 uppercase tracking-[0.5em]">The Human Core</p>
           <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>Architects of Vision</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="glass-card h-96 bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))
          ) : (
            founders.map((founder, i) => (
              <div key={i} className="flex flex-col gap-10 glass-card bg-slate-50/50 dark:bg-slate-900/10 p-12 border-slate-100 dark:border-slate-800/80 group transform-gpu">
                <div className="flex items-start justify-between">
                  <div className={`relative w-40 h-40 rounded-[3rem] bg-gradient-to-br ${founder.color} p-1.5 shadow-2xl group-hover:rotate-2 group-hover:scale-105 transition-all duration-500 overflow-hidden`}>
                    {founder.photoUrl ? (
                      <img src={founder.photoUrl} alt={founder.name} className="w-full h-full object-cover rounded-[2.5rem]" />
                    ) : (
                      <div className="w-full h-full rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-5xl font-black text-white" style={{ fontFamily: "Fraunces, serif" }}>
                        {founder.avatarChar}
                      </div>
                    )}
                    
                    {/* Admin Edit Overlay */}
                    {isAdmin && (
                      <button 
                        onClick={() => handlePhotoUpload(founder.id)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 backdrop-blur-sm"
                      >
                        {updating === founder.id ? (
                           <Loader2 size={24} className="animate-spin" />
                        ) : (
                           <>
                            <Camera size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Update Photo</span>
                           </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 text-[10px] font-black text-primary-500 uppercase tracking-widest border border-slate-100 dark:border-slate-700 shadow-xl">
                      {founder.skill}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2" style={{ fontFamily: "Fraunces, serif" }}>{founder.name}</h3>
                  <p className="text-primary-500 font-black text-xs uppercase tracking-[0.4em] mb-6">{founder.roleName}</p>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-base">
                    {founder.bio}
                  </p>
                </div>

                <div className="mt-auto pt-10 border-t border-slate-100 dark:border-slate-800 flex items-center gap-5">
                   <button className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary-500 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm group/social">
                      <GithubIcon size={22} className="group-hover/social:scale-110 transition-transform" />
                   </button>
                   <button className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary-500 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm group/social">
                      <LinkedinIcon size={22} className="group-hover/social:scale-110 transition-transform" />
                   </button>
                   <button className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary-500 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm group/social">
                      <TwitterIcon size={22} className="group-hover/social:scale-110 transition-transform" />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Admin Management Section (Hidden from public) ─────────────── */}
      {isAdmin && (
        <div className="relative mt-12 rounded-[3.5rem] p-12 bg-white/5 border border-primary-500/20 backdrop-blur-3xl overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-primary-500 group-hover:rotate-12 transition-transform duration-1000">
             <Settings2 size={200} />
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="space-y-4 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck size={12} /> Admin Control Node
               </div>
               <h3 className="text-4xl font-black text-slate-900 dark:text-white" style={{ fontFamily: "Fraunces, serif" }}>Nexus Administration</h3>
               <p className="text-slate-500 font-medium max-w-xl">
                  You are identified as the singleton platform administrator. You have exclusive authority to modify founder identities and oversee member access.
               </p>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
               <Link to="/admin" className="btn-primary h-14 px-8 rounded-2xl text-sm font-black shadow-xl shadow-primary-500/20 active:scale-95 group">
                  Member Management <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </Link>
               <button className="btn-ghost h-14 px-8 rounded-2xl text-sm font-black hover:border-red-500 hover:text-red-500 active:scale-95 transition-all">
                  Emergency Lockout
               </button>
            </div>
          </div>
        </div>
      )}

      {/* ── The Quantum Leap (Final CTA) ───────────────────────────────── */}
      <div className="relative mt-12 rounded-[4rem] p-16 lg:p-32 overflow-hidden bg-gradient-to-br from-indigo-700 via-primary-600 to-emerald-600 shadow-2xl text-center group">
         <div className="absolute top-0 right-0 p-16 opacity-10 text-white rotate-12 group-hover:rotate-0 transition-all duration-[2s] scale-150">
            <Zap size={400} />
         </div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
         
         <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            <h2 className="text-5xl lg:text-8xl font-black text-white leading-[0.9] uppercase tracking-tighter" style={{ fontFamily: "Fraunces, serif" }}>
               Initialize your <br /> <span className="text-black/20">Quantum Leap.</span>
            </h2>
            <p className="text-white/90 font-medium text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto">
               Join the world's most sophisticated peer-to-peer knowledge ecosystem. Deploy your skills. Harvest expertise.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-8">
               <Link to="/register" className="w-full sm:w-auto h-20 px-16 bg-white text-primary-700 rounded-3xl font-black text-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/30 flex items-center justify-center gap-3">
                  Activate Pulse <ArrowRight size={24} />
               </Link>
               <Link to="/login" className="w-full sm:w-auto h-20 px-16 bg-white/10 text-white border border-white/20 rounded-3xl font-black text-lg uppercase tracking-widest hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center">
                  Authorize Key
               </Link>
            </div>
         </div>
      </div>

    </div>
  );
};

export default About;
