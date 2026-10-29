import React, { useState } from 'react';
import { 
  Zap, Compass, Calendar, CheckCircle2, 
  Loader2, ArrowRight, BrainCircuit, Sparkles,
  ChevronDown
} from 'lucide-react';
import { aiAPI } from '../api/api';

const LearningPathGenerator = () => {
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!skill.trim()) return;

    setLoading(true);
    try {
      const res = await aiAPI.generatePath(skill);
      setRoadmap(res.data.roadmap);
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error("AI Generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
      
      <div className="relative z-10 flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-[10px] font-black uppercase tracking-widest">
                <BrainCircuit size={12} /> Neural Learning Nexus
             </div>
             <h2 className="text-4xl font-black text-white tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>AI Path Generator</h2>
             <p className="text-slate-400 font-medium max-w-lg">Enter any skill, and our AI nexus will synthesize a personalized 30-day roadmap with daily milestones and project goals.</p>
          </div>
          
          <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
             <div className="relative w-full sm:w-80 lg:w-96">
                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" size={18} />
                <input 
                  type="text" 
                  placeholder="What skill do you want to master?"
                  className="w-full h-14 pl-12 pr-6 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-slate-600 outline-none"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  disabled={loading}
                />
             </div>
             <button 
               type="submit"
               disabled={loading || !skill.trim()}
               className="h-14 px-8 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 whitespace-nowrap"
             >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Synthesizing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Roadmap
                  </>
                )}
             </button>
          </form>
        </div>

        {/* Roadmap Display */}
        {roadmap ? (
          <div className="animate-fade-in bg-white/5 border border-white/5 rounded-[2rem] p-8 lg:p-12">
            <div className="prose prose-invert max-w-none prose-pre:bg-slate-950 prose-pre:border prose-pre:border-white/10 prose-headings:text-white prose-p:text-slate-400 prose-strong:text-primary-400 prose-ul:list-none prose-ul:p-0">
               <div className="whitespace-pre-wrap font-medium text-sm lg:text-base leading-relaxed tracking-wide text-slate-300">
                  {roadmap}
               </div>
            </div>

            <div className="mt-12 pt-10 border-t border-white/10 flex flex-wrap gap-4 items-center">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">Neural Recommendations:</p>
               {suggestions.map((s, i) => (
                 <button key={i} className="px-4 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-500 text-[10px] font-black uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all">
                    {s}
                 </button>
               ))}
            </div>
          </div>
        ) : !loading && (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.02]">
             <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-700 mb-6">
                <Compass size={40} />
             </div>
             <p className="text-slate-500 font-black text-xs uppercase tracking-[0.4em]">Awaiting User Intent...</p>
          </div>
        )}

        {/* Loading State Overlay */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
             <div className="w-24 h-24 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin mb-8" />
             <div className="space-y-2 text-center">
                <p className="text-white font-black text-lg">Connecting to Neural Nexus</p>
                <p className="text-slate-500 font-medium text-sm">Groq AI is synthesizing your mastery trajectory...</p>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LearningPathGenerator;
