/**
 * BotLogo.jsx
 * Bespoke "SkillBot Nexus Core" AI identity.
 * Hexagonal neural-core with radiant pulsing center and synaptic paths.
 */

import React from "react";

const BotLogo = ({ size = 24, className = "" }) => {
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
        <linearGradient id="bot-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" /> {/* Violet */}
          <stop offset="100%" stopColor="#06b6d4" /> {/* Cyan */}
        </linearGradient>
        <filter id="bot-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <clipPath id="hexagon-clip">
          <path d="M20 4L34 12V28L20 36L6 28V12L20 4Z" />
        </clipPath>
      </defs>
      
      {/* Outer Hexagon Frame */}
      <path 
        d="M20 4L34 12V28L20 36L6 28V12L20 4Z" 
        stroke="url(#bot-gradient)" 
        strokeWidth="1.5" 
        strokeLinejoin="round" 
        className="opacity-30" 
      />

      {/* Synaptic Network Arcs */}
      <path 
        d="M20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28M20 12C15.5817 12 12 15.5817 12 20C12 24.4183 15.5817 28 20 28" 
        stroke="url(#bot-gradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        className="opacity-60"
      />
      
      {/* Radiant Pulsing Core */}
      <circle 
        cx="20" 
        cy="20" 
        r="6" 
        fill="url(#bot-gradient)" 
        filter="url(#bot-glow)"
        className="animate-pulse"
      />

      {/* Internal "S" Bridge Detail */}
      <path 
        d="M16 20H24" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round" 
        className="opacity-50"
      />
      
      {/* Orbiting Nexus Points */}
      <circle cx="20" cy="8" r="1.5" fill="#8b5cf6" />
      <circle cx="32" cy="16" r="1" fill="#06b6d4" className="animate-ping" style={{ animationDuration: '3s' }} />
      <circle cx="8" cy="24" r="1" fill="#22d3ee" className="animate-bounce" style={{ animationDuration: '4s' }} />
    </svg>
  );
};

export default BotLogo;
