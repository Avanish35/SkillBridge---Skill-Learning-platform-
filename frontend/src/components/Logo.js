/**
 * Logo.js
 * Bespoke "SkillBridge Nexus" brand identity.
 * Interlocking paths representing connection and knowledge transfer.
 */

import React from "react";

const Logo = ({ size = 24, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      
      {/* Primary Nexus Bridge Path */}
      <path 
        d="M8 22C8 14.268 14.268 8 22 8C27.5228 8 32.327 11.1962 34.641 15.8564" 
        stroke="url(#logo-gradient)" 
        strokeWidth="4" 
        strokeLinecap="round" 
        filter="url(#glow)"
      />
      
      <path 
        d="M32 18C32 25.732 25.732 32 18 32C12.4772 32 7.67299 28.8038 5.35898 24.1436" 
        stroke="url(#logo-gradient)" 
        strokeWidth="4" 
        strokeLinecap="round"
        className="opacity-80"
      />

      {/* The "Tech" Cursor Point */}
      <rect x="18" y="18" width="6" height="4" rx="1" fill="url(#logo-gradient)" className="animate-pulse" />
      
      {/* Connection Nodes */}
      <circle cx="8" cy="22" r="2.5" fill="#6366f1" />
      <circle cx="32" cy="18" r="2.5" fill="#06b6d4" />
    </svg>
  );
};

export default Logo;
