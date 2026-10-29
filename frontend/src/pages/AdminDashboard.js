import React, { useState, useEffect } from "react";
import { 
  Users, Trash2, ShieldCheck, Mail, Calendar, 
  Search, Filter, ChevronRight, Activity, Zap,
  AlertCircle, CheckCircle2, MoreVertical, UserMinus,
  BookOpen, Plus, Edit3, Clock, GraduationCap, X,
  LayoutDashboard, Database, Rocket, Globe, Sparkles
} from "lucide-react";
import { adminAPI, courseAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("members"); // "members" or "courses"
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState(null); 
  const [deleteType, setDeleteType] = useState("user"); 
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: "", description: "", instructor: "", level: "Beginner", duration: 10
  });

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === "members") fetchUsers();
      else fetchCourses();
    }
  }, [isAdmin, activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.response?.status === 403 ? "Forbidden: Admin access required." : "Failed to load nexus nodes.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseAPI.getAll();
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("Failed to load course registry.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await adminAPI.updateCourse(editingCourse.id, courseForm);
      } else {
        await adminAPI.createCourse(courseForm);
      }
      setShowCourseModal(false);
      setEditingCourse(null);
      setCourseForm({ title: "", description: "", instructor: "", level: "Beginner", duration: 10 });
      fetchCourses();
    } catch (err) {
      alert("Failed to sync course data to the nexus.");
    }
  };

  const openEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.name || course.title,
      description: course.description,
      instructor: course.instructor?.name || course.instructor,
      level: course.level,
      duration: parseInt(course.duration) || 10
    });
    setShowCourseModal(true);
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    try {
      if (deleteType === "user") {
        await adminAPI.deleteUser(confirmDelete.id);
        setUsers(users.filter(u => u.id !== confirmDelete.id));
      } else {
        await adminAPI.deleteCourse(confirmDelete.id);
        setCourses(courses.filter(c => c.id !== confirmDelete.id));
      }
      setConfirmDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("System restriction: Access termination failed.");
    }
  };

  if (authLoading) return null;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const filteredUsers = users.filter(u => {
    const safeName = u.name || "";
    const safeEmail = u.email || "";
    const matchesSearch = safeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          safeEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole   = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredCourses = courses.filter(c => 
    (c.name || c.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.instructor?.name || c.instructor).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10 max-w-[1600px] mx-auto animate-fade-in pb-20 px-4 md:px-8 custom-scrollbar">
      
      {/* ── LUMINA CONTROL CENTER HEADER ──────────────────────────── */}
      <div className="relative group overflow-hidden bg-slate-950 border border-white/5 rounded-[3.5rem] p-10 lg:p-14 shadow-2xl transition-all duration-700 hover:shadow-primary-500/10">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px] pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
         <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
         
         <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-6 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                  <ShieldCheck size={12} className="animate-pulse" /> Platform Management Center
               </div>
               <h1 className="text-4xl lg:text-6xl font-black text-white leading-none tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>
                  Admin <span className="text-gradient">Dashboard</span>.
               </h1>
               <p className="text-slate-400 font-medium max-w-xl text-lg">
                  Manage users and courses across the SkillBridge community. Real-time platform status: <span className="text-emerald-400 font-black">99.9% Online</span>.
               </p>

               {/* ELITE TAB SWITCHER */}
               <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 w-fit mx-auto lg:mx-0 shadow-inner backdrop-blur-md">
                  <button 
                    onClick={() => setActiveTab("members")}
                    className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 active:scale-95 ${activeTab === 'members' ? 'bg-primary-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'text-slate-400 hover:text-white'}`}
                  >
                     <Users size={16} /> Members
                  </button>
                  <button 
                    onClick={() => setActiveTab("courses")}
                    className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 active:scale-95 ${activeTab === 'courses' ? 'bg-primary-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'text-slate-400 hover:text-white'}`}
                  >
                     <BookOpen size={16} /> Courses
                  </button>
               </div>
            </div>

            {/* BENTO STATS SUMMARY */}
            <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
               <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-center min-w-[200px] hover:bg-white/10 transition-colors shadow-2xl backdrop-blur-sm group/stat">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover/stat:text-primary-400 transition-colors">Total Members</p>
                  <h4 className="text-5xl font-black text-white mb-2 tracking-tighter">{users.length}</h4>
                  <div className="h-1 bg-primary-500/20 rounded-full overflow-hidden w-20 mx-auto">
                     <div className="h-full bg-primary-500 translate-x-[-100%] animate-slide-in" />
                  </div>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-center min-w-[200px] hover:bg-white/10 transition-colors shadow-2xl backdrop-blur-sm group/stat">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover/stat:text-emerald-400 transition-colors">Course Count</p>
                  <h4 className="text-5xl font-black text-emerald-400 mb-2 tracking-tighter">{courses.length}</h4>
                  <div className="h-1 bg-emerald-500/20 rounded-full overflow-hidden w-20 mx-auto">
                     <div className="h-full bg-emerald-500 translate-x-[-100%] animate-slide-in" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* ── ERROR NOTIFICATION ──────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-4 bg-red-500/10 border border-red-500/20 p-8 rounded-[2.5rem] text-red-500 animate-shake shadow-2xl shadow-red-500/5">
          <AlertCircle size={32} className="shrink-0" />
          <div className="flex-1">
            <p className="font-black text-xs uppercase tracking-widest text-red-400">Protocol Disruption Detected</p>
            <p className="text-sm font-medium opacity-80">{error}</p>
          </div>
          <button onClick={() => activeTab === 'members' ? fetchUsers() : fetchCourses()} className="px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-500/20">
            Relink System
          </button>
        </div>
      )}

      {/* ── BENTO PLATFORM PULSE ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Sync Fidelity", value: users.length > 0 ? "99.9%" : "---", trend: "Stable", theme: "primary", icon: <Zap size={20}/> },
           { label: "Elite Expert Node", value: "React JS", sub: "Most matches", trend: "Trending", theme: "indigo", icon: <Sparkles size={20}/> },
           { label: "Universe Uptime", value: "24/7", sub: "Global Link Active", trend: "Optimal", theme: "emerald", icon: <Globe size={20}/> },
           { label: "Defense Shield", value: "Level 10", sub: "Admin Override ON", theme: "amber", icon: <ShieldCheck size={20}/> }
         ].map((stat, i) => (
            <div key={i} className="glass-card p-10 rounded-[3rem] border-slate-100 dark:border-white/5 hover:border-primary-500/30 transition-all duration-500 group animate-fade-up relative overflow-hidden shadow-xl" style={{animationDelay: `${i*100}ms`}}>
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary-500/10 transition-colors" />
               <div className="flex items-center justify-between mb-8">
                  <div className={`w-14 h-14 rounded-2xl bg-${stat.theme}-500/10 flex items-center justify-center text-${stat.theme}-500 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner`}>
                     {stat.icon}
                  </div>
                  {stat.trend && (
                    <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md uppercase tracking-widest">
                       {stat.trend}
                    </span>
                  )}
               </div>
               <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1" style={{ fontFamily: "Fraunces, serif" }}>{stat.value}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  {stat.sub && <p className="text-[10px] font-bold text-primary-500/60 mt-3 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">{stat.sub}</p>}
               </div>
            </div>
         ))}
      </div>

      {/* ── MANAGEMENT CORE ───────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-[3.5rem] shadow-2xl overflow-hidden relative backdrop-blur-xl">
         
         <div className="p-10 lg:p-12 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="space-y-1">
               <h2 className="text-2xl font-black text-slate-900 dark:text-white" style={{ fontFamily: "Fraunces, serif" }}>
                  {activeTab === 'members' ? 'Member Management' : 'Course Management'}
               </h2>
               <p className="text-xs text-slate-500 font-medium">Filtering and managing global SkillBridge access.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
               <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Identify target..."
                    className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-primary-500 transition-all font-bold text-sm text-slate-900 dark:text-white placeholder:text-slate-500 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest shadow-inner"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               
               {activeTab === 'members' ? (
                  <select 
                    className="h-14 px-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-primary-500 font-black text-[11px] uppercase tracking-[0.2em] cursor-pointer min-w-[200px] text-slate-700 dark:text-slate-300 appearance-none shadow-inner"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                     <option value="all">All Access Levels</option>
                     <option value="USER">Standard Nodes</option>
                     <option value="ADMIN">Command Nodes</option>
                  </select>
               ) : (
                  <button 
                    onClick={() => { setEditingCourse(null); setCourseForm({ title: "", description: "", instructor: "", level: "Beginner", duration: 10 }); setShowCourseModal(true); }}
                    className="h-14 px-8 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center gap-3 shadow-2xl shadow-primary-500/30 active:scale-95 group"
                  >
                     <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Add Course
                  </button>
               )}
            </div>
         </div>

         {/* DATA GRID */}
         <div className="overflow-x-auto custom-scrollbar">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-slate-50 dark:bg-white/5 text-[10px] uppercase tracking-[0.4em] font-black text-slate-400">
                 <th className="px-10 py-8">{activeTab === 'members' ? 'Member / Account' : 'Course Title'}</th>
                 <th className="px-10 py-8">{activeTab === 'members' ? 'User Role' : 'Instructor'}</th>
                 <th className="px-10 py-8">{activeTab === 'members' ? 'Join Date' : 'Level / Time'}</th>
                 <th className="px-10 py-8 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100 dark:divide-white/5">
               {loading ? (
                 Array(5).fill(0).map((_, i) => (
                   <tr key={i} className="animate-pulse"><td colSpan="4" className="px-10 py-10 h-24 bg-slate-50/50 dark:bg-white/2" /></tr>
                 ))
               ) : (activeTab === 'members' ? filteredUsers : filteredCourses).length === 0 ? (
                 <tr>
                    <td colSpan="4" className="px-10 py-32 text-center bg-slate-900/10">
                       <div className="flex flex-col items-center gap-4 opacity-30">
                          <AlertCircle size={64} className="text-slate-400" />
                          <p className="font-black text-sm uppercase tracking-[0.5em] text-slate-400">Zero matching nodes in sectors</p>
                       </div>
                    </td>
                 </tr>
               ) : activeTab === 'members' ? (
                 filteredUsers.map((u) => (
                   <tr key={u.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300">
                     <td className="px-10 py-8">
                       <div className="flex items-center gap-6">
                         <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-indigo-600/20 flex items-center justify-center text-primary-500 font-black text-xl shadow-inner relative group-hover:scale-110 transition-all duration-500 border border-white/5">
                           {u.name ? u.name.charAt(0) : "U"}
                           {u.profilePicture && <img src={u.profilePicture} alt="" className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl" />}
                           <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
                         </div>
                         <div>
                           <p className="font-black text-slate-900 dark:text-white text-lg group-hover:text-primary-500 transition-colors uppercase tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>{u.name}</p>
                           <p className="text-xs text-slate-500 font-black uppercase tracking-widest opacity-60 mt-1">{u.email}</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-10 py-8">
                       <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${u.role === 'ADMIN' ? 'bg-amber-600 text-white shadow-amber-500/20' : 'bg-primary-600 text-white shadow-primary-500/20'}`}>
                          {u.role}
                       </span>
                     </td>
                     <td className="px-10 py-8">
                       <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                         <Clock size={16} className="text-primary-500/40" />
                         CYC: {new Date(u.createdAt).toLocaleDateString()}
                       </div>
                     </td>
                     <td className="px-10 py-8 text-right">
                        {u.email !== 'skillbridgeadmin@gmail.com' ? (
                          <button 
                            onClick={() => { setDeleteType("user"); setConfirmDelete(u); }}
                            className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-500 flex items-center justify-center ml-auto group/del shadow-lg border border-red-500/20"
                            title="Delete User Account"
                          >
                             <Trash2 size={20} className="group-hover/del:scale-110 transition-transform" />
                          </button>
                        ) : (
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-40 italic cursor-not-allowed">Permanent</span>
                        )}
                     </td>
                   </tr>
                 ))
               ) : (
                 filteredCourses.map((c) => (
                   <tr key={c.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300">
                     <td className="px-10 py-8">
                       <div className="flex items-center gap-6">
                         <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center text-indigo-400 font-black relative group-hover:scale-110 transition-all duration-500 border border-white/5 shadow-inner">
                           <BookOpen size={28} />
                         </div>
                         <div>
                           <p className="font-black text-slate-900 dark:text-white text-lg group-hover:text-primary-500 transition-colors uppercase tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>{c.name || c.title}</p>
                           <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">PROTO: {c.id}</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-10 py-8">
                       <div className="flex items-center gap-3 text-slate-900 dark:text-slate-200 font-black text-xs uppercase tracking-widest">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                             <GraduationCap size={16} />
                          </div>
                          {c.instructor?.name || c.instructor}
                       </div>
                     </td>
                     <td className="px-10 py-8">
                       <div className="flex items-center gap-4">
                         <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <Clock size={16} className="text-blue-500/40" /> {c.duration}H
                         </div>
                         <span className="px-3 py-1 rounded-lg bg-slate-950 text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] border border-white/5 shadow-2xl">
                            {c.level}
                         </span>
                       </div>
                     </td>
                     <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                           <button 
                             onClick={() => openEditCourse(c)}
                             className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-500 hover:bg-primary-600 hover:text-white transition-all duration-500 flex items-center justify-center border border-primary-500/20"
                           >
                              <Edit3 size={20} />
                           </button>
                           <button 
                             onClick={() => { setDeleteType("course"); setConfirmDelete(c); }}
                             className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-500 flex items-center justify-center border border-red-500/20"
                           >
                              <Trash2 size={20} />
                           </button>
                        </div>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
           </table>
         </div>

         {/* HUB FOOTER */}
         <div className="p-10 bg-slate-950 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">
               <Activity size={14} className="text-emerald-500" /> Live Nexus Stream Active
            </div>
            <div className="flex items-center gap-8">
               <div className="text-right">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Memory Load</p>
                  <p className="text-lg font-black text-white leading-none mt-1">2.4<span className="text-primary-500 text-xs">TB</span></p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Global Pings</p>
                  <p className="text-lg font-black text-white leading-none mt-1">104<span className="text-emerald-500 text-xs">ms</span></p>
               </div>
            </div>
         </div>
      </div>

      {/* ── DELETE CONFIRMATION MODAL ─────────────────────────── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
           <div className="w-full max-w-xl bg-slate-950 border border-red-500/30 rounded-[3.5rem] p-12 lg:p-16 shadow-[0_0_100px_rgba(220,38,38,0.2)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center text-center gap-10">
                 <div className="w-24 h-24 bg-red-600/10 border border-red-600/20 rounded-[2.8rem] flex items-center justify-center text-red-500 animate-pulse-slow shadow-2xl">
                    <UserMinus size={48} />
                 </div>
                 
                 <div className="space-y-6">
                    <h2 className="text-4xl lg:text-5xl font-black text-white leading-none" style={{ fontFamily: "Fraunces, serif" }}>Are you sure?</h2>
                    <p className="text-slate-400 font-medium text-lg leading-relaxed">
                       You are about to permanently delete <span className="font-black text-white italic underline decoration-red-500 underline-offset-4">{confirmDelete.name || confirmDelete.title}</span>. This action cannot be undone.
                    </p>
                 </div>

                 <div className="flex flex-col gap-4 w-full mt-4">
                    <button 
                      onClick={executeDelete}
                      className="w-full h-18 bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-[0.4em] rounded-2xl shadow-3xl shadow-red-600/30 transition-all hover:scale-[1.03] active:scale-95 py-6"
                    >
                       Confirm Deletion
                    </button>
                    <button 
                      onClick={() => setConfirmDelete(null)}
                      className="w-full h-18 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-black text-sm uppercase tracking-[0.4em] rounded-2xl transition-all py-6"
                    >
                       Cancel
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* ── COURSE FORM MODAL ───────────────────────────────── */}
      {showCourseModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
           <div className="w-full max-w-2xl bg-slate-950 border border-white/10 rounded-[3.5rem] p-12 lg:p-16 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-primary-600 via-indigo-500 to-emerald-500" />
              <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="relative z-10">
                 <div className="flex items-center justify-between mb-12">
                    <div className="space-y-1">
                       <h2 className="text-4xl font-black text-white leading-none" style={{ fontFamily: "Fraunces, serif" }}>
                          {editingCourse ? "Edit Course" : "Create New Course"}
                       </h2>
                       <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mt-2">Update or add new courses to the platform</p>
                    </div>
                    <button onClick={() => setShowCourseModal(false)} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-2xl active:scale-90">
                       <X size={28} />
                    </button>
                 </div>

                 <form onSubmit={handleSaveCourse} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Course Title</label>
                          <input 
                            required
                            className="w-full h-16 px-8 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-primary-500 outline-none font-black text-sm text-white placeholder:text-white/10 transition-all shadow-inner"
                            value={courseForm.title}
                            onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                            placeholder="Enter course name..."
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Instructor Name</label>
                          <input 
                            required
                            className="w-full h-16 px-8 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-primary-500 outline-none font-black text-sm text-white placeholder:text-white/10 transition-all shadow-inner"
                            value={courseForm.instructor}
                            onChange={(e) => setCourseForm({...courseForm, instructor: e.target.value})}
                            placeholder="Instructor ID or Name..."
                          />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Course Description</label>
                       <textarea 
                         required
                         rows="3"
                         className="w-full p-8 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-primary-500 outline-none font-bold text-sm text-white placeholder:text-white/10 transition-all resize-none shadow-inner"
                         value={courseForm.description}
                         onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                         placeholder="Describe what students will learn..."
                       />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Difficulty Level</label>
                          <div className="relative">
                            <select 
                              className="w-full h-16 px-8 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-primary-500 outline-none font-black text-[11px] uppercase tracking-[0.3em] text-slate-300 appearance-none shadow-inner cursor-pointer"
                              value={courseForm.level}
                              onChange={(e) => setCourseForm({...courseForm, level: e.target.value})}
                            >
                               <option>Beginner</option>
                               <option>Intermediate</option>
                               <option>Advanced</option>
                               <option>Expert</option>
                            </select>
                            <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-500 pointer-events-none" />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Duration (Hours)</label>
                          <input 
                            type="number"
                            required
                            className="w-full h-16 px-8 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-primary-500 outline-none font-black text-sm text-white transition-all shadow-inner"
                            value={courseForm.duration}
                            onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row gap-4">
                       <button 
                         type="submit"
                         className="flex-1 h-20 bg-primary-600 hover:bg-primary-700 text-white font-black text-sm uppercase tracking-[0.4em] rounded-2xl shadow-3xl shadow-primary-600/30 transition-all hover:scale-[1.02] active:scale-95 group"
                       >
                          {editingCourse ? "Save Changes" : "Create Course"}
                       </button>
                       <button 
                         type="button"
                         onClick={() => setShowCourseModal(false)}
                         className="w-full md:w-40 h-20 bg-white/5 text-slate-500 font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:text-white transition-all"
                       >
                          Cancel
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}


    </div>
  );
};

export default AdminDashboard;
