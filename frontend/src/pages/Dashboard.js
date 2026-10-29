import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SkillCard from "../components/SkillCard";
import UserCard  from "../components/UserCard";
import MatchCard from "../components/MatchCard";
import { courseAPI, userAPI } from "../api/api";
import { SkillCardSkeleton, UserCardSkeleton } from "../components/Loader";
import { 
  Sparkles, Code, Palette, BarChart3, Cloud, 
  Megaphone, Briefcase, Zap, Users, Calendar, Star, 
  Search, ArrowRight, Award, TrendingUp, Terminal,
  Globe, ZapIcon, CheckCircle2, BookOpen, Trash2, Plus, 
  X, Layout, FileText, Layers, Clock as TimeIcon, AlertCircle,
  ShieldCheck, Activity, Cpu, Rocket, Radar, Compass
} from "lucide-react";
import BotLogo from "../components/Chatbot/BotLogo";
import Logo from "../components/Logo";
import LearningPathGenerator from "../components/LearningPathGenerator";
import CourseReviewModal from "../components/CourseReviewModal";

const CATEGORIES = [
  { id: "all",           label: "All Node",      icon: <Globe size={20} /> },
  { id: "programming",   label: "Programming",   icon: <Code size={20} /> },
  { id: "design",        label: "Design",        icon: <Palette size={20} /> },
  { id: "business",      label: "Business",      icon: <Briefcase size={20} /> },
  { id: "marketing",     label: "Marketing",     icon: <Megaphone size={20} /> },
  { id: "data",          label: "Data Science",  icon: <BarChart3 size={20} /> },
  { id: "cloud",         label: "Cloud",         icon: <Cloud size={20} /> },
  { id: "cybersecurity", label: "Security",      icon: <ShieldCheck size={20} /> },
];

// ─── Section Wrapper ──────────────────────────────────────
const Section = ({ eyebrow, title, viewAll, onViewAll, children, className = "" }) => (
  <section className={`py-12 ${className}`}>
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
      <div className="space-y-2">
        {eyebrow && (
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
            <p className="text-[11px] font-black text-primary-400 uppercase tracking-[0.3em]">{eyebrow}</p>
          </div>
        )}
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight"
          style={{ fontFamily: "Fraunces, serif" }}>
          {title}
        </h2>
      </div>
      {viewAll && (
        <button 
          className="group flex items-center gap-3 text-[11px] font-black text-slate-500 hover:text-primary-400 transition-all uppercase tracking-widest bg-white/5 px-6 py-3 rounded-2xl border border-white/5 hover:border-primary-500/30 shadow-2xl" 
          onClick={onViewAll}
        >
          Explore All <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
        </button>
      )}
    </div>
    {children}
  </section>
);

const Dashboard = ({ toast }) => {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery]       = useState("");
  const [loadingSkills, setLoadingSkills]   = useState(true);
  const [loadingUsers, setLoadingUsers]     = useState(true);
  const [courses, setCourses] = useState([]);
  const [matches, setMatches] = useState([]);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("sb_sessions");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeReviewCourse, setActiveReviewCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDeleteId, setCourseToDeleteId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: "", description: "", category: "Programming", level: "Beginner", duration: 5
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [courseRes, matchRes] = await Promise.all([
          courseAPI.getAll(),
          userAPI.getMatches()
        ]);
        setCourses(courseRes.data);
        setMatches(matchRes.data.slice(0, 3));
        setLoadingSkills(false);
        setLoadingUsers(false);
      } catch (err) {
        console.error("Dashboard init error:", err);
        setLoadingSkills(false);
        setLoadingUsers(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/skills?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleOpenModal = () => {
    setCourseForm({ title: "", description: "", category: "Programming", level: "Beginner", duration: 5 });
    setIsModalOpen(true);
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await courseAPI.create(courseForm);
      setCourses(prev => [res.data, ...prev]);
      setIsModalOpen(false);
      toast?.("Course published successfully! 🚀", "success");
    } catch (err) {
      toast?.("Failed to publish. Check your connection.", "error");
    } finally { setIsSubmitting(false); }
  };

  const performDelete = async () => {
    if (!courseToDeleteId) return;
    setIsSubmitting(true);
    try {
      await courseAPI.delete(courseToDeleteId);
      setCourses(prev => prev.filter(c => c.id !== courseToDeleteId));
      setIsDeleteModalOpen(false);
      toast?.("Course removed from center.", "success");
    } catch (err) { toast?.("Deletion error.", "error"); }
    finally { setIsSubmitting(false); setCourseToDeleteId(null); }
  };

  const myCourses = courses.filter(c => c.authorId === user?.id);
  const filteredSkills = activeCategory === "all" ? courses : courses.filter((s) => s.category?.toLowerCase() === activeCategory);

  return (
    <div className="flex flex-col gap-6 pb-20 bg-slate-950 min-h-screen scroll-smooth">
      
      {/* ── CENTRAL HERO ────────────────────────────── */}
      <div className="relative rounded-[3.5rem] p-10 lg:p-24 overflow-hidden border border-white/10 bg-slate-900/40 shadow-3xl backdrop-blur-3xl group">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[150px] pointer-events-none group-hover:bg-primary-600/20 transition-all duration-1000" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl space-y-12">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-primary-400 text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl">
            <Activity size={16} className="text-cyan-400 animate-pulse" /> Welcome to your Hub, {user?.name?.split(" ")[0]}
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter" style={{ fontFamily: "Fraunces, serif" }}>
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Skills</span>. <br />
            Define the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Future</span>.
          </h1>
          
          <p className="text-slate-400 text-2xl max-w-2xl font-medium leading-relaxed">
            Access world-class courses and connect with expert mentors in real-time.
          </p>

          <form onSubmit={handleSearch} className="max-w-3xl relative group/search">
            <div className="flex items-center gap-4 p-2.5 bg-slate-950/80 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl focus-within:border-primary-500/50 focus-within:shadow-[0_0_60px_rgba(79,70,229,0.15)] transition-all shadow-3xl">
              <div className="pl-8 text-slate-600">
                <Search size={28} />
              </div>
              <input
                type="text"
                className="flex-1 bg-transparent border-none outline-none py-7 text-2xl font-bold text-white placeholder:text-slate-700"
                placeholder="Search masterclasses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="h-20 px-12 bg-primary-600 hover:bg-primary-700 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-3xl shadow-primary-500/30 active:scale-95 flex items-center gap-3">
                Search Courses <Rocket size={20} />
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-4 pt-6">
            {["React Patterns", "AI Strategy", "Product Design", "Cloud Native", "Marketing"].map((q) => (
              <button key={q} onClick={() => navigate(`/skills?search=${q}`)} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-white hover:bg-white/10 text-[11px] font-black uppercase tracking-widest transition-all">
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none group-hover:opacity-15 transition-opacity translate-x-1/4 translate-y-1/4 scale-150">
          <Compass size={400} className="text-primary-500 animate-[spin_60s_linear_infinite]" />
        </div>
      </div>

      {/* ── BENTO METRIC CARDS ───────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <Cpu />, value: "05", label: "Active Courses", color: "text-cyan-400" },
          { icon: <Users />, value: "12", label: "Expert Mentors", color: "text-emerald-400" },
          { icon: <Activity />, value: "24", label: "Learning Sessions", color: "text-violet-400" },
          { icon: <Star />, value: "4.8", label: "Trust Score", color: "text-amber-400" }
        ].map((stat, i) => (
          <div key={i} className="group relative p-10 rounded-[3rem] border border-white/5 bg-slate-900/50 hover:bg-slate-900 transition-all shadow-2xl backdrop-blur-sm text-center space-y-4 overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className={`w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform shadow-inner`}>
                {stat.icon}
             </div>
             <div>
                <h4 className="text-5xl font-black text-white tracking-tighter" style={{ fontFamily: "Fraunces, serif" }}>{stat.value}</h4>
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">{stat.label}</p>
             </div>
          </div>
        ))}
      </div>

      {/* ── AI ROADMAP GENERATOR ─────────────────────────── */}
      <div className="py-14">
        <Section eyebrow="Smart Planning" title="AI Roadmap Generator">
          <div className="relative rounded-[3.5rem] p-6 lg:p-10 bg-slate-950 border border-white/10 backdrop-blur-3xl shadow-3xl group overflow-hidden">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
            <LearningPathGenerator />
          </div>
        </Section>
      </div>

      {/* ── LEARNING JOURNEY (PREMIUM GRADIENT) ────────────── */}
      <div className="relative rounded-[4rem] p-12 lg:p-20 bg-slate-900 border border-white/10 overflow-hidden shadow-3xl">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-primary-500/5 via-transparent to-cyan-500/5 blur-[150px] pointer-events-none" />
         
         <div className="flex flex-col lg:flex-row items-center gap-20 relative z-10">
            <div className="lg:w-1/3 space-y-8 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest">
                  <Activity size={14} className="animate-pulse" /> Live Status
               </div>
               <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight" style={{ fontFamily: "Fraunces, serif" }}>Your Journey.</h2>
               <p className="text-slate-400 text-xl font-medium leading-relaxed">Track your progress from beginner to certified expert.</p>
            </div>

            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-4 gap-12 relative pb-8">
               {/* Neon Gradient Connector Line */}
               <div className="absolute top-12 left-0 w-full h-2 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                  <div className={`h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-primary-500 transition-all duration-1000`} 
                       style={{ width: user?.skillsTeach ? '75%' : '25%' }} />
               </div>
               
               {[
                 { label: "Profile Setup", desc: "Profile ready", status: (user?.skillsTeach || user?.skillsLearn) ? "complete" : "upcoming", icon: <Terminal size={24} /> },
                 { label: "Find Mentors", desc: "Sync with experts", status: matches.length > 0 ? "complete" : "upcoming", icon: <Users size={24} /> },
                 { label: "Begin Learning", desc: "Courses active", status: sessions.length > 0 ? "active" : "upcoming", icon: <Calendar size={24} /> },
                 { label: "Get Certified", desc: "Final validation", status: sessions.some(s => s.endorsed) ? "complete" : "upcoming", icon: <Award size={24} /> }
               ].map((step, i) => (
                 <div key={i} className="relative z-10 flex flex-col items-center gap-8 text-center group/step">
                    <div className={`w-24 h-24 rounded-[2.2rem] flex items-center justify-center border-4 transition-all duration-1000 relative ${
                      step.status === 'complete' ? 'bg-emerald-500 border-white/20 text-white shadow-[0_0_50px_rgba(16,185,129,0.4)]' :
                      step.status === 'active' ? 'bg-slate-950 border-cyan-500 text-cyan-400 animate-pulse shadow-[0_0_40px_rgba(6,182,212,0.5)]' :
                      'bg-slate-900 border-white/5 text-slate-700'
                    }`}>
                       {step.icon}
                       {step.status === 'active' && (
                         <div className="absolute inset-0 rounded-[2.2rem] border-4 border-cyan-400 animate-ping opacity-20" />
                       )}
                    </div>
                    <div className="space-y-2">
                       <p className={`font-black text-xs uppercase tracking-[0.2em] transition-colors ${step.status === 'upcoming' ? 'text-slate-600' : 'text-white'}`}>
                          {step.label}
                       </p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider opacity-60">{step.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* ── COURSE COLLECTIONS ────────────────────────────── */}
      <div className="relative pt-20 pb-32">
        <Section eyebrow="Explore Topics" title="Categories" className="px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-5">
            {CATEGORIES.map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`group flex flex-col items-center gap-4 p-8 rounded-[2.5rem] border transition-all duration-700 shadow-3xl ${
                  activeCategory === id ? "bg-primary-600 border-white/20 text-white shadow-primary-500/40 scale-105" : "bg-white/5 border-white/5 text-slate-500 hover:border-white/20 hover:text-white"
                }`}
              >
                <span className={`transition-all duration-500 ${activeCategory === id ? "scale-125 text-white" : "group-hover:scale-110 text-primary-400"}`}>{icon}</span>
                <span className="font-black text-[10px] uppercase tracking-[0.2em]">{label}</span>
              </button>
            ))}
          </div>
        </Section>

        <div className="relative z-10 px-6 sm:px-10 mt-10">
          <Section eyebrow="🔥 High Interest" title="Trending Courses" viewAll onExpand={() => navigate("/skills")}>
            {loadingSkills ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {[...Array(3)].map((_, i) => <SkillCardSkeleton key={i} />)}
              </div>
            ) : filteredSkills.length === 0 ? (
              <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[3.5rem]">
                <Activity size={48} className="mx-auto mb-6 text-slate-700" />
                <p className="text-slate-500 font-bold uppercase tracking-widest">No active courses in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {filteredSkills.map((skill, i) => (
                  <div key={skill.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <SkillCard skill={{...skill, isTrending: true}} onLearn={() => navigate(`/skills/${skill.id}`)} onReviewClick={setActiveReviewCourse} />
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>
      </div>

      {/* ── CREATOR CENTER ────────────────────────────────── */}
      <Section eyebrow="🎨 Teach & Create" title="Creator Center" className="px-6">
        <div className="relative rounded-[4rem] p-12 lg:p-20 bg-slate-900 border border-white/10 shadow-3xl overflow-hidden group">
           <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[150px] pointer-events-none" />
           
           <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-10">
              <div className="space-y-6 max-w-2xl text-center md:text-left">
                 <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>My Courses</h3>
                 <p className="text-slate-400 text-xl font-medium leading-relaxed">Manage and track your courses published to the global repository.</p>
              </div>
              <button onClick={handleOpenModal} className="h-20 px-14 bg-gradient-to-r from-primary-600 via-indigo-600 to-blue-600 hover:scale-105 active:scale-95 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_60px_rgba(79,70,229,0.4)] transition-all flex items-center gap-4">
                 <Plus size={24} /> Add Course
              </button>
           </div>

           {myCourses.length === 0 ? (
             <div className="text-center py-24 bg-white/5 border-2 border-dashed border-white/10 rounded-[3.5rem] space-y-8">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-white/5 flex items-center justify-center text-slate-700">
                   <BarChart3 size={48} />
                </div>
                <div className="space-y-3 px-6">
                   <p className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">No Active Published Content</p>
                   <p className="text-slate-600 font-medium max-w-lg mx-auto text-lg">Help others learn. Build your own mastery track today.</p>
                </div>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
               {myCourses.map(c => (
                 <div key={c.id} className="relative group/course p-10 rounded-[3rem] bg-slate-950 border border-white/10 hover:border-primary-500/50 transition-all shadow-3xl flex flex-col justify-between h-80">
                    <div className="absolute top-6 right-6 opacity-0 group-hover/course:opacity-100 transition-opacity">
                       <button onClick={() => { setCourseToDeleteId(c.id); setIsDeleteModalOpen(true); }} className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-2xl">
                          <Trash2 size={22} />
                       </button>
                    </div>
                    <div className="space-y-6">
                       <div className="w-14 h-14 rounded-2xl bg-primary-500/10 text-primary-400 flex items-center justify-center shadow-inner">
                          <BookOpen size={28} />
                       </div>
                       <h4 className="text-2xl font-black text-white leading-tight tracking-tight pr-10">{c.name}</h4>
                    </div>
                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                          <Star size={14} className="fill-emerald-400" />
                          <span className="text-[11px] font-black">{c.rating || 0}</span>
                       </div>
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{c.reviewCount || 0} Learners</span>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </Section>

      {/* ── MENTORS & SESSIONS ────────────────────────────── */}
      <div className="relative pt-12 pb-32 px-6">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-3xl border-y border-white/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
           <Radar size={1000} className="text-cyan-500/10 animate-[spin_100s_linear_infinite]" />
        </div>

        <div className="relative z-10 space-y-32">
          <Section eyebrow="⭐ Top Picks" title="Recommended for You" viewAll onViewAll={() => navigate("/skills")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {courses.slice(0,2).map((skill, i) => (
                <div key={skill.id} className="animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                  <SkillCard skill={skill} variant="compact" onLearn={() => navigate(`/skills/${skill.id}`)} />
                </div>
              ))}
            </div>
          </Section>

          <div className="relative py-20 px-8 lg:px-20 rounded-[4rem] bg-indigo-950/20 border border-white/5 overflow-hidden group shadow-3xl">
             <div className="absolute inset-0 opacity-20 pointer-events-none">
                <Radar size={1200} className="text-cyan-500/20 animate-[spin_120s_linear_infinite] absolute -top-1/2 -left-1/4" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950" />
             </div>

             <Section eyebrow="👥 Real-time Match" title="Top Mentors" viewAll onViewAll={() => navigate("/matches")}>
                {loadingUsers ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[...Array(3)].map((_, i) => <UserCardSkeleton key={i} />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {matches.map((m, i) => (
                      <div key={m.id} className="animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                        <MatchCard match={m} onChat={() => navigate("/chat")} />
                      </div>
                    ))}
                  </div>
                )}
             </Section>
          </div>

          <div className="space-y-16">
            <div className="relative p-12 rounded-[4rem] overflow-hidden bg-gradient-to-br from-indigo-600 via-primary-600 to-violet-800 shadow-[0_0_80px_rgba(79,70,229,0.4)] group hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-white rotate-12 group-hover:rotate-0 transition-all duration-1000">
                <TrendingUp size={200} />
              </div>
              <div className="relative z-10 space-y-8">
                <h2 className="text-4xl font-black text-white leading-[0.9] tracking-tighter" style={{ fontFamily: "Fraunces, serif" }}>SkillBridge <br />Pro Access</h2>
                <p className="text-white/70 text-lg font-medium leading-relaxed">Unlock planetary scale matching and verified certification nodes.</p>
                <button className="w-full h-16 bg-white text-primary-900 font-black rounded-2xl text-xs uppercase tracking-[0.3em] shadow-3xl hover:bg-slate-100 transition-all active:scale-95">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── COURSE PUBLISH MODAL (REFINED) ────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-3xl animate-fade-in overflow-y-auto">
          <div className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-[4rem] p-14 lg:p-20 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 via-cyan-500 to-indigo-600" />
            
            <div className="flex items-center justify-between mb-16 px-2">
               <div className="space-y-2">
                  <h2 className="text-5xl font-black text-white leading-none" style={{ fontFamily: "Fraunces, serif" }}>Add Course.</h2>
                  <p className="text-slate-500 font-black text-[11px] uppercase tracking-[0.4em] mt-3">Share your expertise with the world</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-3xl hover:rotate-90 hover:bg-red-500/20 active:scale-90">
                 <X size={32} />
               </button>
            </div>

            <form onSubmit={handleSubmitCourse} className="space-y-12">
              <div className="space-y-5">
                <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 ml-2 flex items-center gap-3"><Layout size={14} /> Course Title</label>
                <input required placeholder="Enter clear course title..." className="w-full h-20 px-10 rounded-2xl bg-slate-950 border border-white/10 focus:border-primary-500 focus:shadow-[0_0_40px_rgba(79,70,229,0.1)] outline-none font-black text-lg text-white placeholder:text-slate-800 transition-all shadow-inner" value={courseForm.title} onChange={(e) => setCourseForm({...courseForm, title: e.target.value})} />
              </div>
              <div className="space-y-5">
                <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 ml-2 flex items-center gap-3"><FileText size={14} /> Description</label>
                <textarea required placeholder="What will students learn?" rows={4} className="w-full p-10 rounded-2xl bg-slate-950 border border-white/10 focus:border-cyan-500 focus:shadow-[0_0_40px_rgba(6,182,212,0.1)] outline-none font-medium text-lg text-white placeholder:text-slate-800 transition-all shadow-inner resize-none" value={courseForm.description} onChange={(e) => setCourseForm({...courseForm, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-5">
                  <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 ml-2 flex items-center gap-3"><Layers size={14} /> Level</label>
                  <select className="w-full h-20 px-10 rounded-2xl bg-slate-950 border border-white/10 focus:border-primary-500 outline-none font-black text-[12px] uppercase tracking-widest text-slate-300 appearance-none shadow-inner cursor-pointer" value={courseForm.level} onChange={(e) => setCourseForm({...courseForm, level: e.target.value})}>
                    <option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-5">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2 flex items-center gap-3"><TimeIcon size={14} /> Duration (Hrs)</label>
                  <input type="number" min="1" className="w-full h-20 px-10 rounded-2xl bg-slate-950 border border-white/10 focus:border-primary-500 outline-none font-black text-lg text-white transition-all shadow-inner" value={courseForm.duration} onChange={(e) => setCourseForm({...courseForm, duration: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="flex gap-6 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-20 bg-white/5 text-slate-500 font-black uppercase text-xs tracking-widest rounded-3xl hover:text-white transition-all active:scale-95">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] h-20 bg-gradient-to-r from-primary-600 to-indigo-600 hover:scale-[1.02] text-white font-black uppercase text-xs tracking-[0.4em] rounded-3xl shadow-3xl shadow-primary-500/30 transition-all active:scale-95 disabled:bg-slate-800">
                  {isSubmitting ? "PUBLISHING..." : "PUBLISH COURSE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION ──────────────────────────── */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-3xl animate-fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-red-500/20 rounded-[4rem] p-16 lg:p-20 text-center shadow-[0_0_120px_rgba(220,38,38,0.3)]">
             <div className="w-28 h-28 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-12 shadow-3xl shadow-red-500/30 animate-pulse">
                <AlertCircle size={56} />
             </div>
             <h3 className="text-5xl font-black text-white leading-tight mb-6" style={{ fontFamily: "Fraunces, serif" }}>Remove Course?</h3>
             <p className="text-xl font-medium text-slate-500 mb-14">Are you sure? This will permanently delete your course from the repository.</p>
             <div className="flex flex-col sm:flex-row gap-6">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 h-20 bg-white/5 text-slate-500 font-black uppercase text-xs tracking-widest rounded-3xl hover:text-white transition-all active:scale-95">Cancel</button>
                <button onClick={performDelete} disabled={isSubmitting} className="flex-[2] h-20 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-[0.4em] rounded-3xl shadow-3xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95">
                   {isSubmitting ? "DELETING..." : "DELETE NOW"}
                </button>
             </div>
          </div>
        </div>
      )}

      {activeReviewCourse && <CourseReviewModal course={activeReviewCourse} onClose={() => setActiveReviewCourse(null)} onReviewAdded={() => courseAPI.getAll().then(res => setCourses(res.data))} toast={toast} />}

    </div>
  );
};
export default Dashboard;
