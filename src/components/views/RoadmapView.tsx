import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, CheckCircle2, Clock, Flag, Milestone as MilestoneIcon } from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const {
    selectedProject,
    milestones,
    sprints,
    issues
  } = useApp();

  const projectMilestones = milestones.filter((m) => m.projectId === selectedProject.id);
  const projectSprints = sprints.filter((s) => s.projectId === selectedProject.id);
  const epics = issues.filter((i) => i.projectId === selectedProject.id && (i.type === 'epic' || i.type === 'story'));

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <MilestoneIcon className="w-5 h-5 text-indigo-600" />
            Roadmap & Gantt Deliverables
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Jadwal fase pengembangan, timeline sprint, dan milestone UAT persetujuan termin.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-300">
            <Clock className="w-3.5 h-3.5" /> In Progress
          </span>
        </div>
      </div>

      {/* Gantt Timeline Visual Container */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-6 shadow-xs">
        {/* Months timeline header */}
        <div className="grid grid-cols-4 border-b border-slate-200 pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center bg-slate-50/60 py-2 rounded-t-xl">
          <div>Agustus 2026</div>
          <div>September 2026</div>
          <div>Oktober 2026 (Sekarang)</div>
          <div>November 2026 (Go-Live)</div>
        </div>

        {/* Milestone Tracks */}
        <div className="space-y-4">
          <div className="text-xs font-extrabold uppercase text-indigo-700 tracking-wider flex items-center gap-2">
            <Flag className="w-3.5 h-3.5 text-indigo-600" /> Contract Milestones
          </div>

          <div className="space-y-3">
            {projectMilestones.map((ms, idx) => {
              const isApproved = ms.clientApproval === 'approved';
              const isPending = ms.clientApproval === 'pending';

              return (
                <div key={ms.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{ms.name}</span>
                    <span className="text-slate-500 font-mono text-[11px] font-medium">{ms.dueDate}</span>
                  </div>

                  <div className="relative h-7 bg-slate-100 rounded-lg p-1 overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded flex items-center px-3 text-[11px] font-bold text-white transition-all shadow-2xs ${
                        isApproved
                          ? 'bg-emerald-600'
                          : isPending
                          ? 'bg-linear-to-r from-indigo-600 to-amber-500'
                          : 'bg-slate-400'
                      }`}
                      style={{
                        width: idx === 0 ? '45%' : idx === 1 ? '75%' : '100%',
                        marginLeft: idx === 1 ? '30%' : idx === 2 ? '65%' : '0%'
                      }}
                    >
                      <span className="truncate">
                        {isApproved ? '✓ Disetujui Klien' : 'Dalam Pelaksanaan & UAT Review'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sprints Track */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="text-xs font-extrabold uppercase text-sky-700 tracking-wider flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-sky-600" /> Agile Cycles / Sprints
          </div>

          <div className="space-y-3">
            {projectSprints.map((sp, idx) => (
              <div key={sp.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{sp.name}</span>
                  <span className="text-slate-500 text-[11px] font-mono">{sp.startDate} - {sp.endDate}</span>
                </div>

                <div className="relative h-6 bg-slate-100 rounded-lg p-0.5 overflow-hidden border border-slate-200">
                  <div
                    className={`h-full rounded flex items-center px-2 text-[10px] font-mono font-bold ${
                      sp.status === 'active'
                        ? 'bg-indigo-600 text-white animate-pulse'
                        : 'bg-slate-500 text-white'
                    }`}
                    style={{
                      width: '35%',
                      marginLeft: idx === 0 ? '45%' : '70%'
                    }}
                  >
                    <span>{sp.capacityPoints} pts • {sp.status.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Epics Breakdown */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="text-xs font-extrabold uppercase text-purple-700 tracking-wider">
            Features & Deliverables Deliverable Progress
          </div>

          <div className="space-y-2">
            {epics.slice(0, 5).map((epic) => (
              <div
                key={epic.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 truncate pr-4">
                  <span className="font-mono font-bold text-indigo-700">{epic.key}</span>
                  <span className="font-semibold text-slate-800 truncate">{epic.title}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-slate-500 font-mono text-[11px]">Due: {epic.dueDate || '-'}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    epic.statusId === 'done' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {epic.statusId.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
