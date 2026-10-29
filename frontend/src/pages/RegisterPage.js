/**
 * RegisterPage.jsx
 * Premium multi-step onboarding with "Midnight Luminous" design.
 * Phase 1: Authentication Records. Phase 2: Professional Archetype.
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/Loader";
import { 
  Sparkles, UserPlus, Mail, Lock, ShieldCheck, 
  ArrowRight, ArrowLeft, CheckCircle2, Circle,
  PenTool, Brain, Code, Palette, BarChart3, 
  Cpu, Layout, GraduationCap, Stars
} from "lucide-react";
import Logo from "../components/Logo";

const ROLES = [
  { value: "Full-Stack Developer",  icon: <Code size={18} />,     color: "text-blue-500" },
  { value: "UI/UX Designer",        icon: <Palette size={18} />,  color: "text-rose-500" },
  { value: "Data Scientist",        icon: <BarChart3 size={18} />, color: "text-emerald-500" },
  { value: "ML Engineer",           icon: <Cpu size={18} />,      color: "text-indigo-500" },
  { value: "Product Manager",       icon: <Layout size={18} />,   color: "text-amber-500" },
  { value: "DevOps Engineer",       icon: <PenTool size={18} />,  color: "text-slate-500" },
  { value: "Student / Learner",     icon: <GraduationCap size={18} />, color: "text-cyan-500" },
  { value: "Other",                 icon: <Stars size={18} />,    color: "text-primary-500" },
];

const RegisterPage = ({ toast }) => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); 
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    role: "", bio: "", agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim())             e.name            = "Full Name is required";
    if (!form.email.trim())            e.email           = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email  = "Invalid email format";
    if (!form.password)                e.password        = "Secure key is required";
    else if (form.password.length < 6) e.password        = "Minimum 6 characters required";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Verify passwords match";
    return e;
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) {
       toast?.("Select a professional role to continue", "error");
       return;
    }
    if (!form.agreeTerms) {
      toast?.("Consent to terms and privacy protocol required", "error");
      return;
    }
    const res = await register(form);
    if (res.success) {
      toast?.("Account created successfully. Welcome! 🎉", "success");
      navigate("/dashboard");
    } else {
      toast?.(res.message || "Registration failed. Please attempt again.", "error");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-jakarta overflow-hidden">
      
      {/* ── Immersive Left Panel (Shared with Login) ────────────────── */}
      <div className="hidden lg:flex flex-col flex-1 hero-mesh-bg items-center justify-center p-16 relative">
         <div className="absolute top-0 left-0 w-full h-full bg-slate-900/10 dark:bg-slate-900/40 pointer-events-none" />
         
         <div className="relative z-10 max-w-lg w-full">
            <div className="flex items-center gap-4 mb-20 animate-fade-in group cursor-default">
              <div className="w-16 h-16 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 transition-transform group-hover:scale-110 duration-500">
                 <Logo size={42} />
              </div>
              <div>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter" style={{ fontFamily: "Fraunces, serif" }}>SkillBridge</h1>
                  <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] leading-none">Join the Network</p>
              </div>
            </div>

            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>
               The next step in your <span className="text-gradient">career.</span>
            </h2>
            
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-12 font-medium leading-relaxed max-w-sm">
               Join a global community of experts and learners. Share your skills, learn from others, and grow your career.
            </p>

            {/* Registration Progress Visualization */}
            <div className="flex flex-col gap-8 relative">
               <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 pointer-events-none" />
                {[
                  { step: 1, title: "Account Details", sub: "Create your login credentials" },
                  { step: 2, title: "Your Profile", sub: "Tell us about your background" },
                  { step: 3, title: "Get Started", sub: "Start your learning journey" },
                ].map((s, i) => (
                 <div key={s.step} className={`flex items-center gap-6 relative z-10 transition-all duration-500 ${step < s.step ? "opacity-30 grayscale" : ""}`}>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg border-4 ${
                     step > s.step ? "bg-emerald-500 border-emerald-500/20 text-white" :
                     step === s.step ? "bg-primary-600 border-primary-600/20 text-white animate-pulse" :
                     "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                   }`}>
                      {step > s.step ? <CheckCircle2 size={16} /> : s.step}
                   </div>
                   <div>
                      <p className={`text-sm font-black uppercase tracking-wider ${step === s.step ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>{s.title}</p>
                      <p className="text-xs font-medium text-slate-400">{s.sub}</p>
                   </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* ── Onboarding Port (Right) ───────────────────────────────── */}
      <div className="flex-1 lg:max-w-xl flex items-center justify-center p-8 bg-white dark:bg-slate-950 relative">
        <div className="lg:hidden absolute top-0 left-0 w-full h-full hero-mesh-bg opacity-30 pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10 animate-fade-in">
          
          {/* Step 1: Identity Creation */}
          {step === 1 && (
            <div className="animate-fade-up">
              <div className="text-center lg:text-left mb-10">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>Create Account</h2>
                <p className="text-slate-500 font-medium text-sm">Sign up to start your learning journey with SkillBridge.</p>
              </div>

              <form onSubmit={handleStep1} className="flex flex-col gap-6" noValidate>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                   <div className="relative group">
                     <UserPlus size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                     <input className={`input-field h-14 !pl-14 font-bold text-sm ${errors.name ? 'border-rose-400 ring-rose-50' : ''}`}
                        placeholder="Your full name" value={form.name}
                        onChange={(e) => set("name", e.target.value)} />
                     {errors.name && <p className="text-[10px] font-black text-rose-500 mt-2 ml-1 uppercase">{errors.name}</p>}
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                   <div className="relative group">
                     <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                     <input className={`input-field h-14 !pl-14 font-bold text-sm ${errors.email ? 'border-rose-400 ring-rose-50' : ''}`}
                        type="email" placeholder="name@email.com" value={form.email}
                        onChange={(e) => set("email", e.target.value)} />
                     {errors.email && <p className="text-[10px] font-black text-rose-500 mt-2 ml-1 uppercase">{errors.email}</p>}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                    <div className="relative group">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                      <input className={`input-field h-12 !pl-12 font-bold text-xs ${errors.password ? 'border-rose-400' : ''}`}
                        type="password" placeholder="••••••••" value={form.password}
                        onChange={(e) => set("password", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                    <div className="relative group">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                      <input className={`input-field h-12 !pl-12 font-bold text-xs ${errors.confirmPassword ? 'border-rose-400' : ''}`}
                        type="password" placeholder="••••••••" value={form.confirmPassword}
                        onChange={(e) => set("confirmPassword", e.target.value)} />
                    </div>
                  </div>
                </div>
                {(errors.password || errors.confirmPassword) && <p className="text-[10px] font-black text-rose-500 text-center uppercase">{errors.password || errors.confirmPassword}</p>}

                <button type="submit" className="btn-primary w-full h-14 justify-center text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 active:scale-[0.98] mt-2">
                  Continue <ArrowRight size={18} className="ml-2 animate-pulse" />
                </button>
              </form>

              <p className="text-center text-xs font-medium text-slate-500 mt-10">
                Already have an account?{" "}
                <Link to="/login" className="text-primary-500 font-black uppercase tracking-widest hover:underline ml-1">Log In</Link>
              </p>
            </div>
          )}

          {/* Step 2: Professional Archetype */}
          {step === 2 && (
            <div className="animate-fade-up">
              <button type="button" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-500 transition-colors mb-8"
                onClick={() => setStep(1)}>
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Step Back
              </button>

              <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>Your Role</h2>
                <p className="text-slate-500 font-medium text-sm">Choose the role that best describes you.</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Your Expertise</label>
                  <div className="grid grid-cols-2 gap-3">
                    {ROLES.map(({ value, icon, color }) => (
                      <button
                        key={value}
                        type="button"
                        className={`flex flex-col gap-2 p-4 rounded-2xl border-2 text-left transition-all duration-300 group ${
                          form.role === value
                            ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 shadow-lg shadow-primary-500/5 translate-y-[-2px]"
                            : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-200 dark:hover:border-primary-800"
                        }`}
                        onClick={() => set("role", value)}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform ${form.role === value ? 'bg-primary-500 text-white' : 'bg-slate-50 dark:bg-slate-800 ' + color}`}>
                           {icon}
                        </div>
                        <span className={`text-[11px] font-black leading-tight tracking-tight mt-1 ${form.role === value ? 'text-primary-700 dark:text-primary-300' : 'text-slate-500'}`}>{value}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">About You</label>
                   <textarea
                    className="input-field p-5 resize-none font-medium text-sm leading-relaxed"
                    rows={3}
                    placeholder="Tell us a bit about your experience and goals…"
                    value={form.bio}
                    onChange={(e) => set("bio", e.target.value)}
                  />
                </div>

                <div className="p-4 glass-card bg-slate-50 dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                       <input type="checkbox" className="sr-only"
                          checked={form.agreeTerms}
                          onChange={(e) => set("agreeTerms", e.target.checked)} />
                       <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${form.agreeTerms ? 'bg-primary-500 border-primary-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                          {form.agreeTerms && <CheckCircle2 size={16} className="text-white" />}
                       </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 leading-tight">
                       I agree to the <span className="text-primary-500 font-black cursor-pointer hover:underline">Community Guidelines</span> and <span className="text-primary-500 font-black cursor-pointer hover:underline">Privacy Policy</span>.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full h-15 justify-center text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/30 active:scale-[0.98] mt-2 group"
                  disabled={loading}
                >
                  {loading ? <Spinner /> : <span className="flex items-center gap-2">Create Account <ShieldCheck size={18} className="group-hover:animate-pulse" /></span>}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
