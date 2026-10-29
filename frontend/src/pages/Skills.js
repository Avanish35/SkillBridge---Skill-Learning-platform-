/**
 * Skills.jsx
 * Course-listing style page — browse, filter, search, and add skills.
 * Theme: Luminous Premium
 */

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SkillCard from "../components/SkillCard";
import CourseReviewModal from "../components/CourseReviewModal";
import { courseAPI } from "../api/api";
import { SkillCardSkeleton } from "../components/Loader";
import { 
  BookOpen, Sparkles, Plus, Search, X, 
  LayoutGrid, List, ArrowUpDown, Filter,
  Clock, Target, GraduationCap, Brain,
  ChevronRight, Award, Zap
} from "lucide-react";

const CATEGORIES = ["All","Programming","Design","AI/ML","Data","Cloud","DevOps","Business","Marketing"];
const LEVELS     = ["All Levels","Beginner","Intermediate","Advanced"];
const TYPES      = ["All","Teaching","Learning"];
const SORT_OPTIONS = ["Most Popular","Highest Rated","Newest","Most Reviews"];

// ─── Add Skill Modal ──────────────────────────────────────
const AddSkillModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({ name:"", category:"Programming", level:"beginner", type:"teach", description:"", duration:"" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay flex items-center justify-center p-4 z-[999]" onClick={onClose}>
      <div className="glass-card max-w-xl w-full p-0 overflow-hidden shadow-2xl animate-fade-up border-slate-200/50 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/90" onClick={e => e.stopPropagation()}>
        <div className="p-8 bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10 flex items-center justify-between text-white">
            <div>
               <h3 className="text-2xl font-black tracking-tight" style={{fontFamily:"Fraunces, serif"}}>Register New Skill</h3>
               <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mt-1">Skill Inventory Addition</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/10 blur-sm hover:blur-none hover:bg-white/20 flex items-center justify-center transition-all">
               <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designation Title</label>
              <div className="relative group">
                <Brain size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input className="input-field h-14 pl-12 font-bold text-sm" placeholder="e.g. Advanced Reactive Systems" value={form.name}
                  onChange={e => set("name", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Domain Category</label>
                <div className="relative">
                  <select className="input-field h-14 pl-4 font-bold text-xs uppercase tracking-widest appearance-none bg-slate-50/50 dark:bg-slate-800/50" value={form.category} onChange={e => set("category", e.target.value)}>
                    {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Proficiency Level</label>
                <div className="relative">
                  <select className="input-field h-14 pl-4 font-bold text-xs uppercase tracking-widest appearance-none bg-slate-50/50 dark:bg-slate-800/50" value={form.level} onChange={e => set("level", e.target.value)}>
                    {["beginner","intermediate","advanced","expert"].map(l => (
                      <option key={l} value={l}>{l.toUpperCase()}</option>
                    ))}
                  </select>
                   <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Intent & Objective</label>
              <div className="flex gap-4">
                {[["teach",<GraduationCap size={16} />,"Mentees"],["learn",<Target size={16} />,"Learning"]].map(([val, icon, label]) => (
                  <button key={val} type="button"
                    className={`flex-1 h-14 rounded-2xl flex items-center justify-center gap-3 border-2 transition-all duration-300 ${
                      form.type === val 
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 shadow-lg shadow-emerald-500/10" 
                        : "border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200"
                    }`}
                    onClick={() => set("type", val)}>
                    {icon} <span className="text-xs font-black uppercase tracking-widest">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Curriculum Abstract</label>
              <textarea className="input-field p-5 resize-none font-medium text-sm leading-relaxed" rows={3}
                placeholder="Briefly summarize the core value proposition of this skill..." value={form.description}
                onChange={e => set("description", e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Temporal Commitment</label>
              <div className="relative group">
                <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input className="input-field h-14 pl-12 font-bold text-sm" placeholder="e.g. 12 Contact Hours" value={form.duration}
                  onChange={e => set("duration", e.target.value)} />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button className="btn-primary flex-1 justify-center h-14 text-xs font-black uppercase tracking-[0.2em] bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
                onClick={() => { if (form.name.trim()) { onAdd(form); onClose(); } }}>
                Deploy Skill Index ✓
              </button>
              <button className="btn-ghost px-8 h-14 text-xs font-black uppercase tracking-widest" onClick={onClose}>Abort</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Skills Page ──────────────────────────────────────────
const Skills = ({ toast }) => {
  const location = useLocation();
  const params   = new URLSearchParams(location.search);
  const initSearch = params.get("search") || "";

  const [skills, setSkills]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeReviewCourse, setActiveReviewCourse] = useState(null);
  const [search, setSearch]           = useState(initSearch);
  const [activeCategory, setCategory] = useState("All");
  const [activeLevel, setLevel]       = useState("All Levels");
  const [activeType, setType]         = useState("All");
  const [activeSort, setSort]         = useState("Most Popular");
  const [showAdd, setShowAdd]         = useState(false);
  const [viewMode, setViewMode]       = useState("grid");

  const fetchSkills = async () => {
    try {
      const res = await courseAPI.getAll();
      setSkills(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleReviewAdded = async () => {
    try {
      const res = await courseAPI.getAll();
      setSkills(res.data);
    } catch (err) {
      console.error("Failed to refresh skills:", err);
    }
  };

  const filtered = skills
    .filter(s => {
      const q = search.toLowerCase();
      if (q && !s.name.toLowerCase().includes(q) && !s.category.toLowerCase().includes(q)) return false;
      if (activeCategory !== "All" && s.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
      if (activeLevel !== "All Levels" && s.level.toLowerCase() !== activeLevel.toLowerCase()) return false;
      if (activeType === "Teaching" && s.type !== "teach") return false;
      if (activeType === "Learning" && s.type !== "learn") return false;
      return true;
    })
    .sort((a, b) => {
      if (activeSort === "Highest Rated")  return b.rating - a.rating;
      if (activeSort === "Most Reviews")   return b.reviewCount - a.reviewCount;
      if (activeSort === "Newest")         return b.id.localeCompare(a.id);
      return b.learners - a.learners;
    });

  const handleAdd = async (skillData) => {
    setLoading(true);
    try {
        const payload = {
            title: skillData.name,
            description: skillData.description,
            instructor: "Professional Member",
            level: skillData.level,
            duration: parseInt(skillData.duration) || 10
        };
        await courseAPI.create(payload);
        toast?.(`Inventory Updated. "${skillData.name}" successfully indexed! 🎯`, "success");
        const res = await courseAPI.getAll();
        setSkills(res.data);
    } catch (e) {
        toast?.("Synchronize error. Verify authentication state.", "error");
    } finally {
        setLoading(false);
        setShowAdd(false);
    }
  };

  const handleLearn = (skill) => toast?.(`Loading curriculum for "${skill.name}"… 🚀`, "info");

  return (
    <div className="flex flex-col gap-10 pb-16 animate-fade-in font-jakarta">
      
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100/50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-widest w-fit mb-3">
             <BookOpen size={14} /> Knowledge Repository
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>
             Global <span className="text-gradient">Skill Library.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-3 max-w-xl">
             Explore {skills.length} verified specializations. From foundational concepts to industry-leading expertise.
          </p>
        </div>
        
        <button className="btn-primary h-14 px-10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2" onClick={() => setShowAdd(true)}>
           <Plus size={20} strokeWidth={3} /> Add New Specialization
        </button>
      </div>

      {/* ── Discovery Interface ─────────────────────────────────── */}
      <div className="flex flex-col gap-8">
        
        {/* Search & Main Filter */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Query by specialization, category, or keyword…"
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full h-16 bg-white dark:bg-slate-900 shadow-xl shadow-black/[0.02] border-slate-200/50 dark:border-slate-800/50 rounded-[1.25rem] pl-16 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-bold text-sm text-slate-900 dark:text-white placeholder-slate-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors p-1">
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 p-1.5 glass-card bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border-slate-200/50 overflow-x-auto scrollbar-hide max-w-full">
            {CATEGORIES.map(c => (
              <button 
                key={c}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                  activeCategory === c 
                    ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-xl shadow-primary-500/10 border border-primary-500/20" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters & View Modes */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 glass-card bg-white/50 dark:bg-slate-900/50 border-slate-200/50">
           <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto scrollbar-hide">
              {/* Level Filter */}
              <div className="flex flex-col gap-1.5 min-w-[140px]">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Filter size={10} /> Proficiency</label>
                 <select className="h-10 px-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-600 dark:text-white border-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                   value={activeLevel} onChange={e => setLevel(e.target.value)}>
                   {LEVELS.map(l => <option key={l}>{l}</option>)}
                 </select>
              </div>

              {/* Type Switcher */}
              <div className="flex flex-col gap-1.5">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Zap size={10} /> Intent</label>
                 <div className="flex gap-1 p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl h-10 w-fit">
                    {TYPES.map(t => (
                      <button 
                        key={t} 
                        className={`px-4 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${activeType === t ? "bg-white dark:bg-slate-700 text-primary-500 shadow-sm shadow-black/5" : "text-slate-500 hover:text-slate-700"}`}
                        onClick={() => setType(t)}
                      >
                        {t}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Sort Matrix */}
              <div className="flex flex-col gap-1.5 min-w-[160px]">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><ArrowUpDown size={10} /> Relevance</label>
                 <select className="h-10 px-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-600 dark:text-white border-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                   value={activeSort} onChange={e => setSort(e.target.value)}>
                   {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
                 </select>
              </div>
           </div>

           {/* View Modes */}
           <div className="flex flex-col gap-1.5 items-end">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-1 flex items-center gap-1.5">Perspective</label>
              <div className="flex gap-1 p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl">
                 {[
                   { mode: "grid", icon: <LayoutGrid size={16} /> },
                   { mode: "list", icon: <List size={16} /> }
                 ].map(({ mode, icon }) => (
                   <button 
                     key={mode}
                     className={`w-9 h-8 flex items-center justify-center rounded-lg transition-all ${
                       viewMode === mode ? "bg-white dark:bg-slate-700 text-primary-500 shadow-sm" : "text-slate-400 hover:text-slate-600"
                     }`}
                     onClick={() => setViewMode(mode)}
                   >
                     {icon}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* ── Results Matrix ────────────────────────────────────── */}
      {loading ? (
        <div className={viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          : "grid gap-6"}>
          {[...Array(6)].map((_, i) => <SkillCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card py-24 flex flex-col items-center justify-center text-center bg-white/50 dark:bg-slate-900/50 border-dashed border-2">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-300 mb-8 animate-float">
               <Search size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight" style={{ fontFamily:"Fraunces, serif" }}>Registry Empty.</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm font-medium leading-relaxed mb-10">
               No specializations found matching your specified attributes. Review your filter matrix for broader results.
            </p>
            <button className="btn-primary h-12 px-10 rounded-xl text-xs uppercase tracking-widest font-black shadow-xl shadow-primary-500/20" onClick={() => { setSearch(""); setCategory("All"); setLevel("All Levels"); setType("All"); }}>
               Reset Library Filter
            </button>
        </div>
      ) : (
        <div className={viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          : "grid gap-6"}>
          {filtered.map((skill, i) => (
            <div key={skill.id} className="animate-fade-up" style={{ animationDelay: `${(i % 12) * 60}ms` }}>
              <SkillCard
                skill={skill}
                onLearn={handleLearn}
                onReviewClick={setActiveReviewCourse}
                variant={viewMode === "list" ? "compact" : "default"}
              />
            </div>
          ))}
        </div>
      )}

      {/* Persistence Citation */}
      {!loading && filtered.length > 0 && (
          <div className="mt-16 text-center">
             <div className="inline-flex items-center gap-4 text-slate-300 dark:text-slate-700">
                <div className="h-px w-12 bg-current" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Index Complete</p>
                <div className="h-px w-12 bg-current" />
             </div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                <Award size={12} className="text-emerald-500" /> Professional Skill Ledger Phase {Math.ceil(filtered.length / 10)} active
             </p>
          </div>
      )}

      {/* Add Skill Dialog */}
      {showAdd && <AddSkillModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}

      {/* ── Course Review Modal (Interactivity Layer) ─────────────────────── */}
      {activeReviewCourse && (
          <CourseReviewModal 
            course={activeReviewCourse}
            onClose={() => setActiveReviewCourse(null)}
            onReviewAdded={handleReviewAdded}
            toast={toast}
          />
      )}
      
    </div>
  );
};

export default Skills;
