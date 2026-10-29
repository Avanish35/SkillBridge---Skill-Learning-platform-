/**
 * Loader.jsx
 * Skeleton loading components for every content type.
 * No spinner — only content-aware skeletons.
 */

import React from "react";

// ─── Base Skeleton Block ───────────────────────────────────
export const SkeletonBlock = ({ className = "" }) => (
  <div className={`skeleton rounded-lg ${className}`} />
);

// ─── Skill Card Skeleton ───────────────────────────────────
export const SkillCardSkeleton = () => (
  <div className="card p-0 overflow-hidden">
    {/* Thumbnail */}
    <SkeletonBlock className="h-44 w-full rounded-b-none" />
    <div className="p-4 flex flex-col gap-3">
      {/* Category badge */}
      <SkeletonBlock className="h-5 w-20" />
      {/* Title */}
      <SkeletonBlock className="h-5 w-full" />
      <SkeletonBlock className="h-4 w-3/4" />
      {/* Author + rating */}
      <div className="flex items-center gap-2 pt-1">
        <SkeletonBlock className="h-7 w-7 rounded-full" />
        <SkeletonBlock className="h-4 w-28" />
      </div>
      {/* Rating bar */}
      <div className="flex items-center gap-2">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-3 w-8" />
      </div>
      {/* Button */}
      <SkeletonBlock className="h-9 w-full mt-1" />
    </div>
  </div>
);

// ─── User Card Skeleton ───────────────────────────────────
export const UserCardSkeleton = () => (
  <div className="card p-5 flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <SkeletonBlock className="h-14 w-14 rounded-full flex-shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <SkeletonBlock className="h-5 w-32" />
        <SkeletonBlock className="h-4 w-24" />
      </div>
    </div>
    <div className="flex gap-2 flex-wrap">
      <SkeletonBlock className="h-5 w-16 rounded-full" />
      <SkeletonBlock className="h-5 w-20 rounded-full" />
      <SkeletonBlock className="h-5 w-14 rounded-full" />
    </div>
    <SkeletonBlock className="h-9 w-full" />
  </div>
);

// ─── Dashboard Row Skeleton ───────────────────────────────
export const RowSkeleton = () => (
  <div className="flex gap-5 overflow-hidden">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex-shrink-0 w-56">
        <SkillCardSkeleton />
      </div>
    ))}
  </div>
);

// ─── Full Page Loader ─────────────────────────────────────
export const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-surface-50 z-50">
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 border-4 border-brand-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-brand-600 rounded-full animate-spin" />
        <div className="absolute inset-2 bg-brand-600 rounded-full opacity-10 animate-pulse" />
      </div>
      <p className="text-sm text-gray-500 font-medium tracking-wide">Loading…</p>
    </div>
  </div>
);

// ─── Inline Spinner ───────────────────────────────────────
export const Spinner = ({ size = "sm" }) => {
  const s = size === "sm" ? "w-4 h-4 border-2" : "w-6 h-6 border-3";
  return (
    <div className={`${s} border-white border-t-transparent rounded-full animate-spin`} />
  );
};

// ─── Chat Skeleton ────────────────────────────────────────
export const ChatSkeleton = () => (
  <div className="flex flex-col gap-4 p-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className={`flex gap-2 ${i % 2 === 0 ? "" : "flex-row-reverse"}`}>
        <SkeletonBlock className="h-8 w-8 rounded-full flex-shrink-0" />
        <SkeletonBlock className={`h-10 rounded-2xl ${i % 2 === 0 ? "w-48" : "w-36"}`} />
      </div>
    ))}
  </div>
);

// ─── Default export: Spinner ──────────────────────────────
export default Spinner;
