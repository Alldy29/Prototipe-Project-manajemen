import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { ShieldCheck, Eye, Sparkles } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { currentRole, switchRole, currentUser } = useApp();

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'owner', label: 'Owner / CTO', desc: 'Akses penuh seluruh organisasi & profitabilitas' },
    { role: 'pm', label: 'Project Manager', desc: 'Sprint planning, roadmap, kontrol budget & UAT' },
    { role: 'developer', label: 'Developer', desc: 'Pengerjaan issue, log waktu, tanpa akses rate/margin' },
    { role: 'qa', label: 'Lead QA', desc: 'Test case execution, bug reporting & verifikasi release' },
    { role: 'designer', label: 'UI/UX Designer', desc: 'Design review & deliverable acceptance' },
    { role: 'finance', label: 'Finance & Ops', desc: 'Timesheet approval, invoice termin, rate card' },
    { role: 'client', label: 'Klien (Mandiri)', desc: 'Client Portal: Transparansi task read-only (FR-11A) & persetujuan UAT' }
  ];

  return (
    <div className="bg-slate-900/90 border-b border-indigo-900/50 px-4 py-2 flex flex-wrap items-center justify-between text-xs backdrop-blur-md z-30 shrink-0 gap-2">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          DEMO RBAC SIMULATOR
        </span>
        <span className="text-slate-400 hidden sm:inline">
          Login aktif sebagai: <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.roleTitle})
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        <span className="text-slate-500 text-[11px] font-medium mr-1 flex items-center gap-1">
          <Eye className="w-3 h-3" /> Ganti Role:
        </span>
        {roles.map((r) => {
          const isActive = currentRole === r.role;
          return (
            <button
              key={r.role}
              onClick={() => switchRole(r.role)}
              title={r.desc}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? r.role === 'client'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              {r.role === 'client' && <Sparkles className="w-3 h-3" />}
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
