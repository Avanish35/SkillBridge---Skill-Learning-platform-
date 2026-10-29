import React, { useState, useEffect } from 'react';
import { X, Star, Send, MessageSquare, User as UserIcon, Calendar } from 'lucide-react';
import { reviewAPI } from '../api/api';

const CourseReviewModal = ({ course, onClose, onReviewAdded, toast }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await reviewAPI.getByCourse(course.id);
                setReviews(res.data);
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [course.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmitting(true);
        try {
            const res = await reviewAPI.post({
                courseId: course.id,
                rating,
                comment
            });
            setReviews(prev => [res.data, ...prev]);
            setComment("");
            toast?.("Review posted! Thanks for your feedback.", "success");
            onReviewAdded?.();
        } catch (err) {
            toast?.("Failed to post review. Please try again.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in" onClick={onClose} />
            
            <div className="relative w-full max-w-2xl glass-card rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                            <Star size={20} className="fill-amber-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white truncate max-w-[300px]">{course.name}</h2>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Student Reviews</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                    {/* Add Review Form */}
                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-inner">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                             <MessageSquare size={14} className="text-primary-500" /> Write a Review
                        </h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setRating(s)}
                                        className="transition-transform active:scale-90"
                                    >
                                        <Star 
                                            size={24} 
                                            className={`${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'} hover:scale-110 transition-all`} 
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 text-xs font-black text-amber-500 uppercase">{rating} Stars</span>
                            </div>
                            <div className="relative">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your experience with this instructor..."
                                    className="w-full bg-white dark:bg-slate-900 rounded-2xl p-4 text-sm font-medium border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                    rows={3}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all disabled:bg-slate-400"
                                >
                                    {submitting ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Send size={18} />
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Review List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Community Feedback ({reviews.length})</h4>
                        </div>

                        {loading ? (
                            <div className="flex flex-col gap-4">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-10">
                                <div className="text-4xl mb-2">🎈</div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Be the first to review!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((r) => (
                                    <div key={r.id} className="glass-card p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 hover:border-primary-500/20 transition-all group">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-500 text-xs font-black">
                                                {r.userName?.[0] || <UserIcon size={16} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white truncate">{r.userName || 'Student'}</p>
                                                    <div className="flex items-center gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star 
                                                                key={i} 
                                                                size={10} 
                                                                className={i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'} 
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 text-[9px] font-black uppercase tracking-wider">
                                                        Verified Student
                                                    </span>
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1">
                                                        <Calendar size={10} /> {new Date(r.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic border-l-2 border-slate-100 dark:border-slate-800 pl-3">
                                                    "{r.comment}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseReviewModal;
