import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, BrainCircuit, Activity, 
  HelpCircle, Sparkles, Filter,
  Compass, ArrowLeft, RefreshCw
} from 'lucide-react';
import { userAPI } from '../api/api';
import MatchCard from '../components/MatchCard';
import { UserCardSkeleton } from '../components/Loader';

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
  `}</style>
);

const Matches = ({ toast }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMatches = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await userAPI.getMatches();
      setMatches(res.data);
    } catch (err) {
      console.error("Match synthesis failed:", err);
      toast?.("Neural Nexus connection failed. Retrying sync...", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleConnect = (user) => {
    toast?.(`Match request sent to ${user.name}! 🤝`, "success");
  };

  const handleChat = (user) => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-200 selection:bg-indigo-500/40 relative overflow-hidden font-sans">
      <LuminaStyles />

      {/* ─── Animated Mesh Background ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/15 rounded-full blur-[120px] animate-mesh" />
        <div className="absolute top-[20%] -right-[15%] w-[50%] h-[50%] bg-purple-600/15 rounded-full blur-[120px] animate-mesh" style={{ animationDelay: '-5s' }} />
        <div className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] bg-pink-600/10 rounded-full blur-[120px] animate-mesh" style={{ animationDelay: '-10s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-16">
        
        {/* Header Section */}
        <div className="relative group p-12 lg:p-20 rounded-[3rem] bg-[#0f172a]/40 backdrop-blur-md overflow-hidden border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.5)] transition-all hover:bg-[#0f172a]/50">
          <div className="absolute top-0 right-0 w-[600px] h-full bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
          
          <div className="relative z-10 flex flex-col xl:flex-row xl:items-end justify-between gap-12">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
                  <BrainCircuit size={14} className="animate-pulse" /> Your Learning Network
               </div>
               <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]" style={{ fontFamily: "Fraunces, serif" }}>
                  Find Your Perfect<br /><span className="text-gradient">Skill Partner</span>
               </h1>
               <p className="text-indigo-200/60 font-medium max-w-2xl text-xl leading-relaxed">
                  We've analyzed your skills and interests to find the best people for you to learn from and teach.
               </p>
            </div>

            <div className="flex gap-4">
               <button 
                 onClick={() => fetchMatches(true)}
                 disabled={refreshing || loading}
                 className="h-16 w-16 rounded-[1.5rem] bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 hover:rotate-180 transition-all duration-700 active:scale-90 disabled:opacity-50 shadow-inner"
               >
                  <RefreshCw size={24} className={refreshing ? "animate-spin" : ""} />
               </button>
               <button 
                 className="h-16 px-10 bg-white text-indigo-950 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center gap-3 hover:bg-indigo-50 hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)] active:scale-95"
                 onClick={() => navigate('/dashboard')}
               >
                  <ArrowLeft size={18} />
                  Return to Hub
               </button>
            </div>
          </div>

          {/* Neural Stats Row */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 bg-black/40 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-xl">
             {[
               { label: "Matches Found", value: matches.length, icon: Activity, color: "text-blue-400", bg: "bg-blue-400/10" },
               { label: "Partner Quality", value: "98%", icon: Zap, color: "text-emerald-400", bg: "bg-emerald-400/10" },
               { label: "Smart Search", value: "Active", icon: Sparkles, color: "text-amber-400", bg: "bg-amber-400/10" }
             ].map((stat, i) => (
               <div key={i} className="flex items-center gap-6 px-6 relative last:after:hidden after:absolute after:right-0 after:h-12 after:w-[1px] after:bg-white/5 md:after:block after:hidden">
                  <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} shadow-lg border border-white/5 transition-transform hover:scale-110`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-white font-black text-2xl tracking-tighter leading-none">{stat.value}</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mt-2">{stat.label}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="min-h-[500px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => <UserCardSkeleton key={i} />)}
            </div>
          ) : matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-[#0f172a]/30 rounded-[4rem] border-4 border-dashed border-white/5 group hover:border-indigo-500/20 transition-all duration-700">
              <div className="w-32 h-32 bg-white/5 backdrop-blur-xl rounded-[3rem] flex items-center justify-center shadow-2xl mb-10 text-slate-700 group-hover:text-indigo-400 transition-colors">
                 <Compass size={64} className="group-hover:rotate-45 transition-transform duration-1000" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4 tracking-tight">No Matches Found</h2>
              <p className="text-slate-500 max-w-sm text-center font-medium text-lg leading-relaxed mb-12">
                We couldn't find any partners yet. Try adding more skills to your profile so our system can find the right people for you.
              </p>
              <button 
                className="px-12 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:-translate-y-2 active:translate-y-0 transition-all"
                onClick={() => navigate('/profile')}
              >
                Update My Skills
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {matches.map((m, i) => (
                <div key={m.id} className="animate-fade-up">
                   <MatchCard 
                      match={m} 
                      onConnect={handleConnect}
                      onChat={handleChat}
                   />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Why Matches Matter Section */}
        <div className="p-12 lg:p-16 vibrant-glass rounded-[4rem] flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
           <div className="absolute -left-10 -top-10 w-40 h-40 bg-pink-500/10 rounded-full blur-[80px]" />
           <div className="flex-shrink-0 w-24 h-24 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-center text-indigo-400 border border-white/5 shadow-2xl group-hover:scale-110 transition-transform">
              <HelpCircle size={48} />
           </div>
           <div className="flex-1 space-y-4 text-center md:text-left">
              <h4 className="text-2xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-4">
                How Matching Works <Sparkles size={20} className="text-amber-400" />
              </h4>
              <p className="text-slate-400 font-medium leading-relaxed text-lg italic">
                 "We look at what you want to learn and what you can teach to find a perfect match. When your needs align with someone else's skills, we suggest you connect!"
              </p>
           </div>
           <button 
             className="px-10 py-5 rounded-[1.5rem] border-2 border-white/5 bg-white/5 text-slate-400 font-black text-[11px] uppercase tracking-[0.3em] hover:border-indigo-500/50 hover:text-white transition-all whitespace-nowrap"
           >
              Documentation
           </button>
        </div>

      </div>
    </div>
  );
};

export default Matches;
