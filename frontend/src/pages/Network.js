import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../api/api';
import { Search, MessageSquare, Users, Star, ArrowRight } from 'lucide-react';
import { Spinner } from '../components/Loader';

const avatarColor = (name) => `hsl(${(name?.charCodeAt(0) || 65) * 7 % 360}, 55%, 45%)`;

const Network = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    userAPI.getAllUsers()
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => console.error("Failed to load users", err))
      .finally(() => setLoading(false));
  }, []);

  const handleChat = (userId) => {
    navigate(`/chat?userId=${userId}`);
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(search.toLowerCase()) || 
    user.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)] font-jakarta animate-fade-in relative z-10">
      
      {/* Header Section */}
      <div className="mb-10 group cursor-default">
        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-3 leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
          Discovery <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">Network</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">
          Explore the global community. Connect with experts, find mentors, and collaborate on your next big breakthrough.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4 mb-10 overflow-x-auto pb-4 custom-scrollbar">
        <div className="relative flex-1 min-w-[300px]">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search by name, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm outline-none"
          />
        </div>
        <div className="flex items-center gap-2 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-sm font-black text-slate-600 dark:text-slate-300 whitespace-nowrap">
          <Users size={18} className="text-primary-500" />
          {users.length} Active Members
        </div>
      </div>

      {/* Network Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6">
            <Users size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">No experts found</h3>
          <p className="text-slate-500 text-sm font-medium">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user, idx) => (
            <div key={user.id} className="group glass-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-1 overflow-hidden" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="p-6 relative">
                 <div className="absolute top-6 right-6 flex gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-300">5.0</span>
                 </div>
                 
                 <div className="flex flex-col items-center text-center mt-2">
                    <div className="relative mb-5 group-hover:scale-105 transition-transform duration-500">
                      <div className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-white font-black text-3xl shadow-xl relative z-10" style={{ background: avatarColor(user.name) }}>
                        {user.name && user.name.length > 0 ? user.name[0].toUpperCase() : '?'}
                      </div>
                      <div className="absolute inset-0 rounded-[1.5rem] bg-indigo-500/20 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 z-20 shadow-sm" />
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight truncate w-full mb-1">{user.name}</h3>
                    <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-4 truncate w-full">
                      {user.role || "Knowledge Seeker"}
                    </p>

                    <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                      {(user.skillsTeachList || []).slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50">
                          {skill}
                        </span>
                      ))}
                      {(user.skillsTeachList?.length > 3) && (
                        <span className="px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 py-[3px]">
                          +{user.skillsTeachList.length - 3}
                        </span>
                      )}
                    </div>
                 </div>

                 <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-6" />

                 <button 
                  onClick={() => handleChat(user.id)}
                  className="w-full h-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-primary-50 dark:hover:bg-primary-500/10 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700/50 hover:border-primary-200 dark:hover:border-primary-500/30 transition-all duration-300"
                 >
                   <MessageSquare size={16} /> Open Communication <ArrowRight size={14} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Network;
