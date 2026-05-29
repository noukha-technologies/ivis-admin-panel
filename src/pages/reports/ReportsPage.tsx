import React from 'react';

const ReportsPage: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-16 px-4">
      {/* Premium Coming Soon Card */}
      <div className="w-full max-w-xl bg-white border border-neutral-200/90 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)] p-10 flex flex-col items-center text-center animate-fadeIn">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F1F3F5] text-neutral-800 text-[12px] font-bold uppercase tracking-wider rounded-full mb-6 select-none animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1C2434]"></span>
          <span>Coming Soon</span>
        </div>

        {/* Beautiful vector-like Analytics SVG */}
        <div className="w-48 h-48 mb-8 text-neutral-400 flex items-center justify-center">
          <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="65" width="12" height="20" rx="4" fill="#E2E8F0" />
            <rect x="35" y="45" width="12" height="40" rx="4" fill="#CBD5E1" />
            <rect x="55" y="30" width="12" height="55" rx="4" fill="#94A3B8" />
            <rect x="75" y="15" width="12" height="70" rx="4" fill="#475569" />
            <path d="M21 60L41 40L61 25L81 10" stroke="#1C2434" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="21" cy="60" r="5" fill="#1C2434" />
            <circle cx="41" cy="40" r="5" fill="#1C2434" />
            <circle cx="61" cy="25" r="5" fill="#1C2434" />
            <circle cx="81" cy="10" r="5" fill="#1C2434" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-[22px] font-bold text-neutral-900 mb-3 tracking-tight">
          Reports & Analytics Insights
        </h2>

        {/* Subtitle description */}
        <p className="text-[14.5px] text-[#667085] leading-relaxed max-w-sm">
          We are currently building state-of-the-art diagnostic dashboards, business KPI charts, and vehicle inspection trend statistics.
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-neutral-100 my-8"></div>

        {/* Additional info badge */}
        <span className="text-[12.5px] text-neutral-400 font-semibold">
          Expected release: v1.1.0-alpha
        </span>
      </div>
    </div>
  );
};

export default ReportsPage;
