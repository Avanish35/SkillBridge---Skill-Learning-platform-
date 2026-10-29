/**
 * PlatformActivity.js
 * The "Realistic Universe" Hub - High-Fidelity Professional Edition.
 * Features 3D-effect planets, deep-space nebulae, and a custom interstellar shuttle.
 */

import React, { useState, useEffect } from "react";
import { 
  Activity, Users, Zap, Globe, MessageSquare, 
  ShieldCheck, TrendingUp, Sparkles,
  Award, Heart, Target, Clock, ArrowUpRight,
  MapPin, Flame, Database, Plus, Search, BookOpen,
  CheckCircle, Star, Rocket
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Realistic Core Components ─────────────────────────────

const RealisticPlanet = ({ x, y, color, name, shadowColor = "rgba(0,0,0,0.8)" }) => (
  <g transform={`translate(${x}, ${y})`}>
     {/* Atmospheric Glow */}
     <circle r="25" fill={color} opacity="0.15" filter="blur(12px)" className="animate-pulse" />
     
     {/* 3D Sphere Body */}
     <defs>
        <radialGradient id={`planetGrad-${name}`} cx="35%" cy="35%" r="50%">
           <stop offset="0%" stopColor="white" stopOpacity="0.4" />
           <stop offset="30%" stopColor={color} />
           <stop offset="100%" stopColor="black" />
        </radialGradient>
     </defs>
     <circle r="18" fill={`url(#planetGrad-${name})`} shadow="0 0 20px rgba(0,0,0,0.5)" />
     
     {/* Shadow Overlay */}
     <circle r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
     
     {/* Label */}
     <text y="40" textAnchor="middle" className="fill-white font-black text-[10px] uppercase tracking-[0.2em] opacity-80">{name}</text>
  </g>
);

const RealisticSpaceship = () => (
  <g className="animate-float">
     {/* Engine Exhaust Glow */}
     <path 
       d="M -15,0 Q -25,-10 -40,0 Q -25,10 -15,0" 
       fill="url(#exhaustGrad)" 
       className="animate-pulse" 
     />
     
     {/* Main Hull */}
     <path 
       d="M 15,0 L -10,-8 L -15,0 L -10,8 Z" 
       fill="#cbd5e1" 
       stroke="#475569" 
       strokeWidth="0.5" 
     />
     {/* Cockpit */}
     <path d="M 5,-2 L 12,0 L 5,2 Z" fill="#94a3b8" />
     {/* Wings */}
     <path d="M -5,-4 L -12,-15 L -10,-4 Z" fill="#94a3b8" stroke="#475569" strokeWidth="0.5" />
     <path d="M -5,4 L -12,15 L -10,4 Z" fill="#94a3b8" stroke="#475569" strokeWidth="0.5" />
     
     <defs>
        <linearGradient id="exhaustGrad" x1="0%" y1="50%" x2="100%" y2="50%">
           <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
           <stop offset="100%" stopColor="rgba(59, 130, 246, 0.8)" />
        </linearGradient>
     </defs>
  </g>
);

// ─── Main Hub Component ──────────────────────────────────

const PlatformActivity = () => {
  const navigate = useNavigate();
  const [missionText, setMissionText] = useState("Launch Sequence Initialized");
  const [goalProgress, setGoalProgress] = useState(84.2);

  useEffect(() => {
    const sequence = [
      "Escaping Earth's Atmosphere...",
      "Navigation: Setting Course for AI Nexus",
      "Scanning Archive: Web Core Reached",
      "Analyzing Design Moon Surface...",
      "Neutralizing Threats at Cyber Hub",
      "Route Locked: Returning to Earth",
      "Knowledge Payload Delivered."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setMissionText(sequence[i]);
      i = (i + 1) % sequence.length;
    }, 4280);
    return () => clearInterval(interval);
  }, []);

  const voyagePath = "M 400,200 C 100,50 50,150 100,80 S 750,20 700,100 S 750,380 650,300 S 50,380 150,320 S 300,250 400,200";

  return (
    <div className="flex flex-col gap-10 pb-20 max-w-[1500px] mx-auto px-4 md:px-8 animate-fade-in custom-scrollbar">
      
      {/* ── Realistic Header ────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6">
         <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
               <Rocket size={12} className="animate-bounce" /> Interstellar Exchange Live
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white leading-none tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>
               The Knowledge <span className="text-gradient">Universe</span>.
            </h1>
            <p className="text-slate-500 font-medium max-w-xl text-lg">
               Advanced skill synchronization across our global planetary network. Real-time telemetry active.
            </p>
         </div>
         <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/skills')}
              className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 shadow-2xl shadow-blue-500/30 active:scale-95"
            >
               <Rocket size={18} /> Take Flight
            </button>
            <div className="w-14 h-14 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 backdrop-blur-sm">
               <Globe size={24} className="animate-spin-slow" />
            </div>
         </div>
      </div>

      {/* ── Premium Action Hub ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { l: "Find a Mentor", d: "Join an Expert Node", p: "/matches", t: "from-blue-700 to-slate-900 shadow-blue-500/20", i: <Search size={28}/> },
           { l: "Teach a Skill", d: "Expand our Galaxy", p: "/skills", t: "from-emerald-700 to-slate-900 shadow-emerald-500/20", i: <Award size={28}/> },
           { l: "Learning Path", d: "Your Roadmap to Stars", p: "/dashboard", t: "from-purple-700 to-slate-900 shadow-purple-500/20", i: <TrendingUp size={28}/> }
         ].map((card) => (
            <div 
               key={card.l}
               onClick={() => navigate(card.p)}
               className={`relative p-8 rounded-[2.5rem] bg-gradient-to-br ${card.t} text-white cursor-pointer group hover:-translate-y-2 transition-all duration-500 shadow-2xl active:scale-95 overflow-hidden border border-white/5`}
            >
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
               <div className="relative z-10">
                  <div className="p-4 rounded-2xl bg-white/10 w-fit mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-inner border border-white/10">
                     {card.i}
                  </div>
                  <h3 className="text-2xl font-black mb-1" style={{ fontFamily: "Fraunces, serif" }}>{card.l}</h3>
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em]">{card.d}</p>
               </div>
            </div>
         ))}
      </div>

      {/* ── THE GALAXY (Realistic Simulation) ────────────────── */}
      <BentoCard className="md:col-span-12 md:row-span-4 !p-0 !rounded-[3.5rem] border-none shadow-[0_0_100px_rgba(0,0,0,0.5)]">
         <div className="relative w-full h-full min-h-[550px] bg-slate-950 flex items-center justify-center overflow-hidden">
            
            {/* Real Space Background */}
            <div className="absolute inset-0">
               {/* 1. Deep Space Black/Blue Base */}
               <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black" />
               {/* 2. Nebula Layers */}
               <div className="absolute -top-1/4 -right-1/4 w-[80%] h-[80%] bg-blue-600/10 rounded-full blur-[150px] opacity-30" />
               <div className="absolute -bottom-1/4 -left-1/4 w-[80%] h-[80%] bg-purple-600/10 rounded-full blur-[150px] opacity-20" />
               {/* 3. Starfield (Multiple Layers) */}
               <div className="absolute inset-0 opacity-40">
                  {[...Array(80)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`absolute rounded-full bg-white animate-pulse shadow-[0_0_5px_white]`}
                      style={{ 
                        width: Math.random() * 2 + 'px', 
                        height: Math.random() * 2 + 'px', 
                        top: Math.random() * 100 + '%', 
                        left: Math.random() * 100 + '%',
                        animationDelay: Math.random() * 5 + 's',
                        opacity: Math.random()
                      }}
                    />
                  ))}
               </div>
            </div>

            {/* ── Realistic Simulation SVG ─────────────────── */}
            <svg viewBox="0 0 800 400" className="relative z-10 w-full h-full p-10 drop-shadow-2xl">
               <path d={voyagePath} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="5 5" className="animate-dash" />
               
               {/* Earth (Realistic) */}
               <g transform="translate(400, 200)">
                  <circle r="45" fill="rgba(59, 130, 246, 0.1)" filter="blur(20px)" />
                  <defs>
                     <radialGradient id="earthRealGrad" cx="30%" cy="30%" r="50%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="40%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#1e3a8a" />
                     </radialGradient>
                  </defs>
                  <circle r="36" fill="url(#earthRealGrad)" shadow="0 0 30px rgba(37, 99, 235, 0.5)" />
                  <text y="5" textAnchor="middle" className="fill-white font-black text-[9px] uppercase tracking-widest opacity-80">SkillBridge</text>
                  <circle r="36" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
               </g>

               {/* Real Planets */}
               <RealisticPlanet x="150" y="80" color="#ef4444" name="AI Nexus" />
               <RealisticPlanet x="680" y="100" color="#3b82f6" name="Web Core" />
               <RealisticPlanet x="640" y="320" color="#22d3ee" name="Design Moon" />
               <RealisticPlanet x="160" y="300" color="#fbbf24" name="Cyber Hub" />

               {/* Realistic Shuttle */}
               <g>
                  <RealisticSpaceship />
                  <animateMotion path={voyagePath} dur="35s" repeatCount="indefinite" rotate="auto" />
               </g>
            </svg>

            {/* Realistic HUD Overlay */}
            <div className="absolute top-10 left-10 space-y-3 z-20">
               <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-md bg-blue-600/20 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
                     System Status: Optimal
                  </div>
                  <div className="px-3 py-1 rounded-md bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
                     Sync: 100%
                  </div>
               </div>
               <h3 className="text-lg font-black text-white tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>{missionText}</h3>
               <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-400 animate-ping" />
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Voyager ID: SB-914</p>
               </div>
            </div>

            <div className="absolute bottom-10 right-10 text-right z-20">
               <div className="h-1.5 w-48 bg-white/10 rounded-full mb-2 overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse shadow-[0_0_15px_#3b82f6]" style={{ width: '84%' }} />
               </div>
               <p className="text-[10px] font-black text-blue-400/80 uppercase tracking-[0.3em]">Quantum Data Uplink Active</p>
            </div>
         </div>
      </BentoCard>

      {/* ── Supplementary Info ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         
         {/* Enhanced TRENDING Card */}
         <BentoCard title="Mission Hotspots" icon={<Flame size={20} className="text-orange-500"/>} className="lg:col-span-1 border-orange-500/10">
            <div className="space-y-4 mt-2">
               {[
                 { n: 'AI Systems', c: 'from-red-500 to-orange-500' }, 
                 { n: 'Fullstack JS', c: 'from-blue-500 to-indigo-500' }, 
                 { n: 'Data Lake', c: 'from-purple-500 to-pink-500' }
               ].map(s => (
                  <div key={s.n} className="space-y-1">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                        <span className="text-slate-900 dark:text-white/90">{s.n}</span>
                        <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded text-[8px] animate-pulse">HOT</span>
                     </div>
                     <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden flex gap-1 p-0.5 border border-white/5">
                        {[...Array(6)].map((_, idx) => (
                           <div 
                              key={idx} 
                              className={`h-full flex-1 rounded-sm bg-gradient-to-t ${s.c} ${idx < 4 ? 'opacity-100' : 'opacity-20'}`} 
                           />
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </BentoCard>

         {/* Enhanced GOAL Card */}
         <BentoCard title="Sector Expansion" icon={<Target size={20} className="text-emerald-500"/>} className="lg:col-span-1 border-emerald-500/10">
            <div className="mt-2 flex flex-col justify-center h-full">
               <div className="flex items-baseline gap-2 mb-4">
                  <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{goalProgress.toFixed(1)}%</p>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Synced</p>
               </div>
               <div className="space-y-1">
                  <div className="h-[2px] w-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[84%] transition-all duration-1000" />
                  </div>
                  <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                     <span>Launch</span>
                     <span>Full Expansion</span>
                  </div>
               </div>
            </div>
         </BentoCard>

         {/* Enhanced METRICS Card */}
         <BentoCard title="Universe Fleet" icon={<Database size={20} className="text-blue-500"/>} className="lg:col-span-2 border-blue-500/10">
            <div className="grid grid-cols-2 gap-8 mt-2 h-full items-center">
               <div className="relative group/stat">
                  <div className="absolute -inset-2 bg-blue-500/5 rounded-2xl scale-0 group-hover/stat:scale-100 transition-transform" />
                  <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" /> Nodes Online
                  </p>
                  <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">5,102</p>
                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Active across 12 sectors</p>
               </div>
               <div className="relative group/stat">
                  <div className="absolute -inset-2 bg-emerald-500/5 rounded-2xl scale-0 group-hover/stat:scale-100 transition-transform" />
                  <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Star Pilots
                  </p>
                  <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">1,204</p>
                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Vessel flight path locked</p>
               </div>
            </div>
         </BentoCard>
      </div>

    </div>
  );
};

const BentoCard = ({ children, className = "", title, icon, onClick }) => (
  <div 
    onClick={onClick}
    className={`glass-card p-6 md:p-8 rounded-[2.5rem] border-slate-200/50 dark:border-white/5 transition-all duration-500 relative overflow-hidden group flex flex-col ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
     {title && (
       <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-blue-500 group-hover:scale-110 transition-transform">
                {icon}
             </div>
             <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{title}</h3>
          </div>
       </div>
     )}
     <div className="relative z-10 flex-1 flex flex-col">{children}</div>
  </div>
);

export default PlatformActivity;
