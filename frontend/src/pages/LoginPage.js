/**
 * LoginPage.jsx
 * Premium auth experience with "Midnight Luminous" design.
 * Left: Immersive value-prop panel. Right: Sleek glassmorphism form.
 */

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/Loader";
import { 
  Eye, EyeOff, Sparkles, Zap, Users, 
  Calendar, TrendingUp, CheckCircle2, 
  ArrowRight, ShieldCheck, Mail, Lock
} from "lucide-react";
import Logo from "../components/Logo";

const LoginPage = ({ toast }) => {
  const { login, loading } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || "/dashboard";

  const [form, setForm]     = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim())    e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    if (!form.password)        e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Must be at least 6 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const res = await login(form.email, form.password);
    if (res.success) {
      toast?.("Login successful. Welcome back! 🚀", "success");
      navigate(from, { replace: true });
    } else {
      toast?.(res.message || "Authentication failed. Please check your credentials.", "error");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-jakarta">
      
      {/* ── Immersive Left Panel ─────────────────────────────────── */}
      <div className="hidden lg:flex flex-1 hero-mesh-bg relative overflow-hidden items-center justify-center p-16">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-900/10 dark:bg-slate-900/40 pointer-events-none" />
        
        {/* Animated Background Shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-[100px] animate-float" />
        
        <div className="relative z-10 max-w-lg">
          {/* Brand Identity */}
          <div className="flex items-center gap-4 mb-16 animate-fade-in group cursor-default">
            <div className="w-16 h-16 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 transition-transform group-hover:scale-110 duration-500">
               <Logo size={42} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter" style={{ fontFamily: "Fraunces, serif" }}>SkillBridge</h1>
               <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] leading-none">Elevated Learning</p>
            </div>
          </div>

          <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>
            The premier network for <span className="text-gradient">knowledge exchange.</span>
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-12 font-medium leading-relaxed max-w-md">
            Unlock the potential of peer-to-peer mentoring. Master new skills, teach what you love, and grow with a global cohort of 50k+ experts.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 gap-6 mb-16">
            {[
              { icon: <Users size={18} />, label: "Find the Perfect Mentor", sub: "Get matched based on your learning goals" },
              { icon: <Zap size={18} />, label: "Learn from the Best", sub: "1-on-1 sessions with verified experts" },
              { icon: <TrendingUp size={18} />, label: "Track Your Progress", sub: "Keep a detailed record of your achievements" },
            ].map((f, i) => (
              <div key={i} className={`flex items-start gap-4 p-4 glass-card bg-white/40 dark:bg-slate-900/20 border-slate-200/50 dark:border-slate-800/50 animate-fade-up`} style={{ animationDelay: `${(i+1)*150}ms` }}>
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary-500 shadow-xl border border-slate-100 dark:border-slate-700/50 flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white mb-0.5">{f.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 backdrop-blur-md">
             <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
                     <img src={`https://i.pravatar.cc/150?u=${i*10}`} alt="User" />
                  </div>
                ))}
             </div>
             <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-2">
                Trusted by <span className="text-primary-500">50K+ innovators</span>
             </p>
          </div>
        </div>
      </div>

      {/* ── Authentication Gateway (Right) ───────────────────────── */}
      <div className="flex-1 lg:max-w-xl flex items-center justify-center p-8 bg-white dark:bg-slate-950 relative overflow-hidden">
        {/* Mobile Background Accents */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-full hero-mesh-bg opacity-30 pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10 animate-fade-in delay-300">
          
          {/* Mobile Identity */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-xl border border-slate-100 dark:border-slate-800">
               <Logo size={28} />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter" style={{ fontFamily: "Fraunces, serif" }}>SkillBridge</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>
              Welcome Back
            </h2>
            <p className="text-slate-500 font-medium text-sm">Log in to your account to continue your learning journey.</p>
          </div>


          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  className={`input-field h-14 !pl-14 font-bold text-sm ${errors.email ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100" : ""}`}
                  type="email"
                  placeholder="name@email.com"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                  autoComplete="email"
                />
                {errors.email && <p className="text-[10px] font-black text-rose-500 mt-2 uppercase tracking-widest ml-1">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Password</label>
                <button type="button" className="text-[10px] font-black text-primary-500 uppercase tracking-widest hover:text-primary-600 transition-colors">Forgot Password?</button>
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  className={`input-field h-14 !pl-14 pr-12 font-bold text-sm ${errors.password ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100" : ""}`}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: "" }); }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && <p className="text-[10px] font-black text-rose-500 mt-2 uppercase tracking-widest ml-1">{errors.password}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 px-1 my-2">
              <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-slate-200 dark:border-slate-800 text-primary-600 focus:ring-primary-500/30" />
              <label htmlFor="remember" className="text-xs font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest cursor-pointer select-none">Remember Me</label>
            </div>

            <button
              type="submit"
              className="btn-primary w-full h-14 justify-center text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/30 active:scale-[0.98] transition-all"
              disabled={loading}
            >
              {loading ? <Spinner /> : <span className="flex items-center gap-2">Log In <ArrowRight size={18} className="animate-pulse" /></span>}
            </button>
          </form>

          <div className="flex items-center gap-4 my-10">
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-900" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">OR</span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-900" />
          </div>

          <button className="w-full h-14 glass-card bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-sm" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Sign in with Google</span>
          </button>

          <p className="text-center text-xs font-medium text-slate-500 mt-10">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-500 font-black uppercase tracking-widest hover:underline ml-1">
              Sign Up For Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
