/**
 * Navbar.jsx
 * Top navigation bar: Logo, Search, Notifications, Profile menu
 */

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { 
  Menu, X, Search, Bell, Sun, Moon, 
  ChevronDown, LogOut, User, Target, 
  Calendar, CreditCard, Settings, Terminal
} from "lucide-react";

// ─── Profile Dropdown ─────────────────────────────────────
const ProfileDropdown = ({ user, onLogout, onClose }) => {
  const ref = useRef(null);
  
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const avatarColor = `hsl(${(user?.name?.charCodeAt(0) || 65) * 7 % 360}, 55%, 48%)`;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-4 w-72 glass-card rounded-3xl shadow-2xl overflow-hidden z-50 animate-fade-in border-slate-200/50 dark:border-slate-800/50"
    >
      {/* User info */}
      <div className="px-5 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold overflow-hidden shadow-inner flex-shrink-0 ring-4 ring-white dark:ring-slate-800"
            style={{ background: avatarColor }}
          >
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl">{user?.name?.[0] || "U"}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-base text-slate-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-bold uppercase tracking-wider">
               Premium Learner
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="p-2">
        {[
          { to: "/profile",  icon: <User size={18} />,     label: "Account Profile" },
          { to: "/skills",   icon: <Target size={18} />,   label: "My Learning Path" },
          { to: "/schedule", icon: <Calendar size={18} />, label: "Session Schedule" },
        ].map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-2xl transition-all duration-200 group"
            onClick={onClose}
          >
            <span className="text-slate-400 group-hover:text-primary-500 transition-colors">{icon}</span>
            <span className="font-medium group-hover:text-slate-900 dark:group-hover:text-white">{label}</span>
          </Link>
        ))}
      </div>

      <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
        <button
          className="flex items-center gap-3 px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all duration-200 w-full text-left"
          onClick={onLogout}
        >
          <LogOut size={18} />
          <span className="font-bold">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

// ─── Navbar ───────────────────────────────────────────────
const Navbar = ({ onMenuToggle, sidebarOpen }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery,   setSearchQuery]   = useState("");
  const [showDropdown,  setShowDropdown]  = useState(false);
  const [showNotif,     setShowNotif]     = useState(false);
  const navigate = useNavigate();

  const avatarColor = `hsl(${(user?.name?.charCodeAt(0) || 65) * 7 % 360}, 55%, 48%)`;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/skills?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[80] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 shadow-sm"
      style={{ height: "var(--navbar-height)" }}>
      <div className="h-full flex items-center px-6 relative">

        {/* ── Fixed Toggle Button (Absolute to Header) ────────── */}
        {isAuthenticated && (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-[100]">
            <button
              className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-700 transition-all active:scale-95 group"
              onClick={onMenuToggle}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={22} className="group-hover:rotate-90 transition-transform" /> : <Menu size={22} />}
            </button>
          </div>
        )}

        {/* ── Fixed Brand & Search Container ──────────────────── */}
        <div className="flex items-center gap-5 flex-1 pl-20">
          {/* Logo - STATIONARY */}
          <Link 
            to={isAuthenticated ? "/dashboard" : "/"} 
            className="flex items-center gap-3 group transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 transition-transform group-hover:scale-110 duration-500">
              <Logo size={28} />
            </div>
            <span className="font-black text-slate-900 dark:text-white text-2xl tracking-tighter hide-mobile"
              style={{ fontFamily: "Fraunces, serif" }}>
              Skill<span className="text-primary-500">Bridge</span>
            </span>
          </Link>

          {/* Search Bar - SHIFTS to avoid sidebar overlap if necessary */}
          <form
            className={`flex-1 max-w-2xl transition-all duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] hide-mobile
              ${isAuthenticated && sidebarOpen ? 'lg:pl-[240px]' : 'mx-auto'}`}
            onSubmit={handleSearch}
          >
            <div className="search-bar py-3 group">
              <Search size={18} className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                className="text-sm font-medium placeholder:text-slate-400 focus:outline-none bg-transparent"
                placeholder="Search skills, topics, instructors…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ── Right Controls ─────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 hover:bg-primary-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center text-slate-600 dark:text-yellow-400 active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  className="w-10 h-10 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 hover:bg-primary-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-95"
                  onClick={() => setShowNotif(!showNotif)}
                >
                  <Bell size={20} />
                  <span className="notif-dot animate-pulse-glow" />
                </button>
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  className="flex items-center gap-3 pl-1.5 pr-3 py-1.5 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 hover:bg-primary-50 dark:hover:bg-slate-700 transition-all active:scale-[0.98]"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm overflow-hidden shadow-sm"
                    style={{ background: avatarColor }}
                  >
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.[0] || "U"
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 hide-mobile max-w-[100px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <ProfileDropdown
                    user={user}
                    onLogout={handleLogout}
                    onClose={() => setShowDropdown(false)}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn-ghost text-sm px-5 py-2.5">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm px-5 py-2.5">
                Join SkillBridge
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

