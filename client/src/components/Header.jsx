import React from 'react';
import { User, Shield } from 'lucide-react';

export default function Header({ userName, role, activeBatch }) {
  return (
    <header className="h-20 border-b border-white/10 glass-card fixed top-0 right-0 left-64 z-30 px-8 flex items-center justify-between">
      {/* College Title and Logo */}
      <div className="flex items-center gap-4">
        {/* Sankara College Logo Outline SVG */}
        <svg className="w-10 h-10 text-gold animate-pulse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M50 25 L80 40 L50 55 L20 40 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="3"/>
          <path d="M50 55 L50 95" stroke="currentColor" strokeWidth="4"/>
          <circle cx="50" cy="5" r="3" fill="currentColor"/>
        </svg>
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide uppercase">Sankara College of Science and Commerce (Autonomous)</h2>
          <p className="text-xs text-gold">Department of Computer Science with Data Analytics (CSDA)</p>
        </div>
      </div>

      {/* User information & Batch display */}
      <div className="flex items-center gap-6">
        {activeBatch && (
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-xs font-semibold text-gold">
            <span className="w-2 h-2 rounded-full bg-gold animate-ping"></span>
            Active Batch: {activeBatch.batchYearRange} (v{activeBatch.deeksharambhVersion})
          </div>
        )}

        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right">
            <h4 className="text-xs font-bold text-white">{userName || "Guest"}</h4>
            <span className="text-[10px] text-gray-400 capitalize flex items-center gap-1 justify-end">
              <Shield className="w-3 h-3 text-gold" />
              {role}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-navy border border-white/10 flex items-center justify-center text-white">
            <User className="w-4 h-4 text-gold" />
          </div>
        </div>
      </div>
    </header>
  );
}
