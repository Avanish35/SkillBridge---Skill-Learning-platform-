import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sessionAPI, userAPI } from "../api/api";
import { 
  Award, Zap, Calendar, Sparkles, 
  CheckCircle2, Clock, MapPin, 
  ChevronLeft, ChevronRight, Plus,
  BrainCircuit, ArrowLeft, Video,
  Info
} from "lucide-react";

const LuminaStyles = () => (
  <style>{`
    @keyframes mesh-gradient {
      0% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(10%, 10%) scale(1.1); }
      66% { transform: translate(-10%, 5%) scale(0.9); }
      100% { transform: translate(0, 0) scale(1); }
    }
    .animate-mesh {
      animation: mesh-gradient 15s ease-in-out infinite alternate;
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
    .cal-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
    }
  `}</style>
);

const DURATIONS = ["30 min", "45 min", "1 hour", "1.5 hours", "2 hours"];

// ─── Add Session Modal ────────────────────────────────────
const AddSessionModal = ({ onClose, onAdd, initialData, matches }) => {
  const [form, setForm] = useState({
    title: initialData?.skill ? `${initialData.skill} Help` : "",
    peerId: initialData?.partnerId || "",
    date: "",
    time: "",
    duration: "1 hour",
    type: "learn",
    skill: initialData?.skill || "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!form.date || !form.time || !form.peerId) return;
    const scheduledTime = `${form.date}T${form.time}:00`;
    onAdd({
      peerId: form.peerId,
      scheduledTime: scheduledTime,
      notes: `${form.title} (${form.skill}) - ${form.duration}`,
    });
    onClose();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="vibrant-glass w-full max-w-xl rounded-[3rem] p-10 lg:p-12 shadow-2xl border border-white/10 relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Background Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>Book a Skill Meeting</h3>
              <p className="text-slate-400 text-sm mt-2">Connect with your learning partner</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all">✕</button>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-3">Meeting Name</label>
                  <input 
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-sm focus:border-indigo-500/50 focus:bg-white/10 outline-none transition-all" 
                    placeholder="e.g. React Basics" 
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)} 
                  />
                </div>

                <div>
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-3">Type</label>
                   <div className="flex gap-3">
                     {[["learn", "Learn"], ["teach", "Teach"]].map(([val, label]) => (
                       <button 
                         key={val} 
                         className={`flex-1 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${
                           form.type === val ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                         }`}
                         onClick={() => set("type", val)}
                        >
                          {label}
                        </button>
                     ))}
                   </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-3">With Partner</label>
                  <select 
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-sm focus:border-indigo-500/50 outline-none appearance-none cursor-pointer" 
                    value={form.peerId} 
                    onChange={(e) => set("peerId", e.target.value)}
                  >
                    <option value="" className="bg-[#1e293b]">Select partner...</option>
                    {matches.map((m) => <option key={m.id} value={m.id} className="bg-[#1e293b]">{m.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-3">Skill to focus on</label>
                  <input 
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-sm focus:border-indigo-500/50 outline-none transition-all" 
                    placeholder="e.g. React" 
                    value={form.skill} 
                    onChange={(e) => set("skill", e.target.value)} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-3">Date</label>
                    <input 
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-white text-[11px] focus:border-indigo-500/50 outline-none" 
                      type="date" 
                      min={today} 
                      value={form.date}
                      onChange={(e) => set("date", e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-3">Time</label>
                    <input 
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-white text-[11px] focus:border-indigo-500/50 outline-none" 
                      type="time" 
                      value={form.time}
                      onChange={(e) => set("time", e.target.value)} 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-3">Time Needed</label>
                  <div className="flex gap-2 flex-wrap">
                    {DURATIONS.map((d) => (
                      <button 
                        key={d} 
                        className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                          form.duration === d ? "bg-white text-indigo-950 border-white shadow-xl" : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                        }`}
                        onClick={() => set("duration", d)}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button 
              className="w-full h-16 bg-white text-indigo-950 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 hover:bg-slate-100 hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)] active:scale-95" 
              onClick={handleAdd}
            >
              <Calendar size={18} />
              Book Skill Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Session Card ─────────────────────────────────────────
const SessionCard = ({ session, onComplete }) => {
  const isUpcoming = session.status === "PENDING" || session.status === "ACCEPTED";
  const isCompleted = session.status === "COMPLETED";

  const d = new Date(session.scheduledTime);
  const formattedDate = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const formattedTime = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`vibrant-glass p-6 rounded-[2.5rem] flex gap-8 items-center transition-all duration-500 group ${isCompleted ? "opacity-50" : "hover:-translate-y-1 hover:bg-[#0f172a]/60 shadow-xl"}`}>
      <div className="flex flex-col items-center gap-4 min-w-[70px]">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/5 ${session.peerRole === "Learner" ? "bg-indigo-500/20 text-indigo-400" : "bg-emerald-500/20 text-emerald-400"}`}>
           <Clock size={24} />
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-white tracking-tighter">{formattedTime}</p>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <h4 className="text-xl font-black text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors uppercase truncate max-w-[70%]">{session.notes || "Skill Exchange"}</h4>
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <span className="px-4 py-1.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                ✓ Completed
              </span>
            ) : (
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${session.peerRole === "Learner" ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
                {session.peerRole === "Learner" ? "Teaching" : "Learning"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 text-slate-400 mb-6 font-medium">
          <div className="flex items-center gap-2">
            <Award size={14} className="text-indigo-400" />
            <span className="text-xs">{session.peerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-pink-400" />
            <span className="text-xs">{formattedDate}</span>
          </div>
        </div>

        {isUpcoming && (
          <div className="flex gap-4">
            <a 
              href={session.meetingLink} 
              target="_blank" 
              rel="noreferrer" 
              className="h-12 px-8 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 hover:bg-indigo-500 hover:shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              <Video size={16} />
              Join Call
            </a>
            <button 
              className="h-12 px-6 rounded-2xl border border-white/10 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all active:scale-95" 
              onClick={() => onComplete?.(session.id)}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Mini Calendar ────────────────────────────────────────
const MiniCalendar = ({ sessions }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const sessionDates = new Set(
    sessions.filter((s) => s.status !== "COMPLETED").map((s) => new Date(s.scheduledTime).getDate().toString().padStart(2, "0"))
  );

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const today = new Date();
  const isToday = (d) => d && today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
  const hasSession = (d) => d && sessionDates.has(d.toString().padStart(2, "0"));

  return (
    <div className="vibrant-glass p-10 rounded-[3rem] border border-white/5">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>{monthName}</h4>
        <div className="flex gap-2">
          <button 
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all active:scale-90"
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all active:scale-90"
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-4">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => (
          <div 
            key={i} 
            className={`relative h-12 flex items-center justify-center rounded-2xl text-[11px] font-black transition-all cursor-pointer group/day
            ${!d ? "" :
              isToday(d) ? "bg-white text-indigo-950 scale-110 shadow-2xl" :
              hasSession(d) ? "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30" :
              "text-slate-400 hover:bg-white/5"}`}
          >
            {d}
            {d && hasSession(d) && !isToday(d) && (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            )}
            {d && !isToday(d) && !hasSession(d) && (
              <span className="absolute inset-0 border border-transparent rounded-2xl group-hover/day:border-white/10 transition-all" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Schedule Page ────────────────────────────────────────
const Schedule = ({ toast }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessions, setSessions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setTab] = useState("upcoming");
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    fetchSessions();
    fetchMatches();

    const params = new URLSearchParams(location.search);
    const partnerId = params.get("partnerId");
    if (partnerId) {
      setInitialData({ partnerId });
      setShowAdd(true);
    }
  }, [location]);

  const fetchSessions = async () => {
    try {
      const { data } = await sessionAPI.getMySessions();
      setSessions(data);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    }
  };

  const fetchMatches = async () => {
    try {
      const { data } = await userAPI.getMatches();
      setMatches(data);
    } catch (err) {}
  };

  const handleAdd = async (sessionData) => {
    try {
      await sessionAPI.bookSession(sessionData);
      toast?.("Meeting scheduled successfully! 📅", "success");
      fetchSessions(); // Refresh
    } catch (err) {
      toast?.("Failed to schedule meeting.", "error");
    }
  };

  const upcoming = sessions.filter((s) => s.status !== "COMPLETED");
  const completed = sessions.filter((s) => s.status === "COMPLETED");
  const filtered = activeTab === "upcoming" ? upcoming : completed;

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-200 selection:bg-indigo-500/40 relative overflow-hidden font-sans">
      <LuminaStyles />

      {/* ─── Animated Mesh Background ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] -left-[5%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[100px] animate-mesh" />
        <div className="absolute -bottom-[10%] right-0 w-[45%] h-[45%] bg-purple-600/10 rounded-full blur-[100px] animate-mesh" style={{ animationDelay: "-7s" }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-12">
        <div className="flex items-start justify-between gap-8 flex-wrap">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
                <Calendar size={14} /> My Private Calendar
             </div>
             <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-tight" style={{ fontFamily: "Fraunces, serif" }}>
                Active <span className="text-gradient">Schedule</span>
             </h1>
             <p className="text-slate-400 font-medium max-w-xl text-lg">
                Manage your skill sessions and upcoming partner meetings.
             </p>
          </div>
          <button 
            className="h-16 px-10 bg-white text-indigo-950 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center gap-3 hover:bg-slate-50 hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)] active:scale-95" 
            onClick={() => setShowAdd(true)}
          >
            <Plus size={20} />
            Book Skill Meeting
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 flex flex-col gap-10">
            <div className="flex bg-white/5 p-2 rounded-[1.5rem] border border-white/10 w-fit">
              {[["upcoming", "Upcoming Events"], ["completed", "Past History"]].map(([k, l]) => (
                <button 
                  key={k} 
                  className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === k ? "bg-white text-indigo-950 shadow-xl" : "text-slate-500 hover:text-slate-300"
                  }`} 
                  onClick={() => setTab(k)}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-6">
              {filtered.length === 0 ? (
                <div className="vibrant-glass py-24 rounded-[3rem] flex flex-col items-center justify-center border-2 border-dashed border-white/5 text-center px-10 group">
                  <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 text-slate-700 group-hover:text-indigo-400 transition-all duration-700">
                    <Clock size={48} className="group-hover:rotate-12" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Timeline is Empty</h3>
                  <p className="text-slate-500 max-w-xs font-medium leading-relaxed mb-10">
                    No {activeTab} meetings found. Perhaps it's time to reach out to a partner and start learning?
                  </p>
                  {activeTab === "upcoming" && (
                    <button 
                      className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all active:scale-95" 
                      onClick={() => setShowAdd(true)}
                    >
                      Book Your First Match
                    </button>
                  )}
                </div>
              ) : (
                filtered.map((s, i) => (
                  <div key={s.id} className="animate-fade-up">
                    <SessionCard session={s} onComplete={fetchSessions} />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <MiniCalendar sessions={sessions} />
            
            {/* Quick Tips Tooltip */}
            <div className="p-10 vibrant-glass rounded-[3rem] border border-white/5 space-y-6 relative overflow-hidden group">
               <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
               <div className="flex items-center gap-4 text-white">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-xl border border-white/5">
                    <Info size={24} />
                  </div>
                  <h5 className="text-lg font-black tracking-tight">Meeting Tips</h5>
               </div>
               <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  • Arrive 5 minutes early to test your camera and audio.<br/><br/>
                  • Have a clear list of questions ready for your partner.<br/><br/>
                  • Capture quick notes during the meet to review later.
               </p>
            </div>
          </div>
        </div>
      </div>

      {showAdd && (
        <AddSessionModal 
          matches={matches} 
          onClose={() => { setShowAdd(false); setInitialData(null); }} 
          onAdd={handleAdd} 
          initialData={initialData} 
        />
      )}
    </div>
  );
};

export default Schedule;
