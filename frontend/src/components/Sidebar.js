/**
 * Sidebar.jsx
 * Left navigation sidebar with nav items, user card, and progress summary.
 */

import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { 
  LayoutDashboard, User, Target, Users, 
  MessageSquare, Calendar, Info, X, ChevronRight,
  TrendingUp, ShieldCheck, Zap, Menu
} from "lucide-react";
import Logo from "./Logo";

// ─── Nav Items config ─────────────────────────────────────
const NAV_ITEMS = [
  { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard",   sub: "Overview"       },
  { path: "/profile",   icon: <User size={20} />,            label: "My Profile",   sub: "Identity"       },
  { path: "/skills",    icon: <Target size={20} />,          label: "Browse Skills", sub: "Learn & Grow"  },
  { path: "/matches",   icon: <Users size={20} />,           label: "Network",      sub: "Connections"    },
  { path: "/network",   icon: <Users size={20} />,           label: "Discovery",    sub: "All Users"      },
  { path: "/chat",      icon: <MessageSquare size={20} />,   label: "Messages",     badge: 3              },
  { path: "/schedule",  icon: <Calendar size={20} />,        label: "Schedule",     sub: "Sessions"       },
  { path: "/activity",  icon: <ShieldCheck size={20} className="text-primary-500" />, label: "Platform Activity", sub: "Statistics" },
  { path: "/about",     icon: <Info size={20} />,            label: "About Platform"                     },
];

const Sidebar = ({ open, onClose, onMenuToggle, isAuthenticated, sidebarOpen }) => {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user }  = useAuth();
  
  const statusColor = "#06b6d4"; 

  const isActive = (path) => location.pathname === path;

  const handleNav = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) onClose?.();
  };

  return (
    <>
      {/* ── Global Dimmed Overlay backdrop ───────────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[60] animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* ── Sidebar Panel ───────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-[70] w-[310px]
          bg-slate-950/80 backdrop-blur-3xl border-r border-white/5
          flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)] transition-all duration-700 ease-[cubic-bezier(0.2,1,0.3,1)]
          ${open ? "translate-x-0" : "-translate-x-full"}
          m-0 h-screen lg:rounded-none overflow-hidden
        `}
      >
        <div className="nexus-scanline" />

        {/* ── Sidebar Header ── */}
        <div className="h-[90px] px-8 flex items-center justify-between flex-shrink-0 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
          <div className="hidden lg:hidden items-center gap-4 group cursor-pointer pl-16 transition-all duration-700" onClick={() => navigate("/dashboard")}>
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl transition-all duration-500 group-hover:scale-110">
              <Logo size={32} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-white text-2xl tracking-tighter leading-none" style={{ fontFamily: "Fraunces, serif" }}>
                Skill<span className="text-primary-500">Bridge</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 opacity-80 mt-1">Command Center</span>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-5 py-8 flex flex-col gap-1.5 custom-scrollbar relative">
          <div className="px-5 mb-6">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">Navigation Hub</p>
             <div className="w-8 h-1 bg-primary-600 rounded-full" />
          </div>
          
          {NAV_ITEMS.map(({ path, icon, label, sub, badge }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                className={`
                  group relative flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-500
                  ${active ? 'bg-white/5 text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-white/5' : 'text-slate-500 hover:text-slate-200'}
                `}
                onClick={() => handleNav(path)}
              >
                {active && (
                   <div className="absolute inset-0 bg-primary-600/10 rounded-[1.5rem] blur-xl" />
                )}
                
                <div className={`
                  w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-500 z-10
                  ${active ? 'bg-primary-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] rotate-3 scale-110' : 'bg-white/5 group-hover:bg-white/10'}
                `}>
                  {icon}
                </div>

                <div className="flex-1 text-left min-w-0 z-10">
                  <p className={`text-sm font-black tracking-tight ${active ? 'text-white' : 'group-hover:text-white'}`}>{label}</p>
                  {sub && <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 opacity-60">{sub}</p>}
                </div>

                {badge && (
                  <span className="relative z-10 bg-primary-600 text-white text-[9px] px-2 py-1 rounded-lg font-black shadow-[0_0_15px_rgba(99,102,241,0.4)] animate-pulse">
                    {badge}
                  </span>
                )}

                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-primary-400 to-cyan-500 rounded-r-full shadow-[4px_0_15px_rgba(6,182,212,0.6)]" />
                )}
              </button>
            );
          })}

          {user?.role === "ADMIN" && (
            <div className="mt-10 pt-8 border-t border-white/5">
                <div className="px-5 mb-5 flex items-center justify-between">
                   <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.4em]">Strategic Control</p>
                   <ShieldCheck size={14} className="text-primary-500 animate-pulse" />
                </div>
                <button
                  className={`
                    group relative flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-500
                    ${isActive("/admin") ? 'bg-white/5 text-white border border-white/5' : 'text-slate-500 hover:text-primary-400'}
                  `}
                  onClick={() => handleNav("/admin")}
                >
                  <div className={`
                    w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-500 z-10
                    ${isActive("/admin") ? 'bg-primary-600 text-white' : 'bg-primary-500/5 group-hover:bg-primary-500/20'}
                  `}>
                    <TrendingUp size={20} />
                  </div>
                  <div className="flex-1 text-left min-w-0 z-10">
                    <p className="text-sm font-black tracking-tight">Admin Terminal</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 opacity-60">System Overrides</p>
                  </div>
                </button>
            </div>
          )}
        </nav>

        {/* ── User & Progress Footer ── */}
        <div className="p-2.5 space-y-2.5 bg-slate-900/40 border-t border-white/5 relative overflow-hidden backdrop-blur-2xl flex-shrink-0">
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative p-2.5 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary-500/30 transition-all duration-500 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-primary-500/10 flex items-center justify-center text-primary-400">
                  <Target size={12} />
                </div>
                <p className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Efficiency Core</p>
              </div>
              <span className="text-[9px] font-black text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 px-1.5 py-0.5 rounded-full">60%</span>
            </div>
            
            <div className="energy-bar-track p-0.5 bg-slate-950/50 h-1.5">
               {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`energy-bar-segment flex-1 rounded-sm ${i < 6 ? 'active' : ''}`}
                    style={{ transitionDelay: `${i * 50}ms` }}
                  />
               ))}
            </div>
            
            <p className="text-[9px] text-slate-500 font-medium mt-2 flex items-center gap-1.5 leading-relaxed italic">
               <Zap size={9} className="text-amber-500 animate-pulse" /> +2 Nodes until validation.
            </p>
          </div>

          <button
            className="flex items-center w-full gap-2.5 p-1.5 rounded-xl hover:bg-white/5 transition-all duration-500 group relative overflow-hidden border border-transparent hover:border-white/5"
            onClick={() => handleNav("/profile")}
          >
            <div className="status-aura" />
            <div className="relative z-10">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black flex-shrink-0 overflow-hidden shadow-sm shadow-black/50 group-hover:scale-105 transition-all duration-500 ring-2 ring-white/5"
                style={{ background: `linear-gradient(135deg, ${statusColor}, #4f46e5)` }}
              >
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" />
                ) : (
                  user?.name?.[0] || "U"
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
            </div>
            
            <div className="min-w-0 flex-1 text-left z-10">
              <p className="font-black text-[12px] text-white tracking-tight truncate uppercase leading-none">{user?.name || "Pilot Node"}</p>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.1em] mt-1 flex items-center gap-1">
                 <ShieldCheck size={8} className="text-cyan-500" /> Authorized
              </p>
            </div>
            <ChevronRight size={12} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all z-10" />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
