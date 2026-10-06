import React from 'react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import { 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  Calendar, 
  ArrowUpRight 
} from 'lucide-react';

export const ProjectOverviewView: React.FC = () => {
  const {
    selectedProject,
    issues,
    milestones,
    sprints,
    users,
    setCurrentView,
    setActiveProjectTab
  } = useApp();

  const projectIssues = issues.filter((i) => i.projectId === selectedProject.id);
  const doneIssues = projectIssues.filter((i) => i.statusId === 'done');
  const projectMilestones = milestones.filter((m) => m.projectId === selectedProject.id);
  const activeSprint = sprints.find((s) => s.projectId === selectedProject.id && s.status === 'active');

  const completionPercent = projectIssues.length > 0 ? Math.round((doneIssues.length / projectIssues.length) * 100) : 0;
  const budgetBurnPercent = selectedProject.budgetAmount > 0 ? Math.round((selectedProject.spentAmount / selectedProject.budgetAmount) * 100) : 0;
  const hoursBurnPercent = selectedProject.budgetHours > 0 ? Math.round((selectedProject.spentHours / selectedProject.budgetHours) * 100) : 0;

  const projectMembers = users.filter((u) => selectedProject.memberIds.includes(u.id));

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50 text-slate-900">
      {/* Project Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedProject.color }}
            />
            <span className="text-xs font-mono font-bold text-slate-500">
              {selectedProject.key} • {selectedProject.clientName}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
              selectedProject.health === 'on_track' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {selectedProject.health === 'on_track' ? 'On Track' : 'At Risk'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">{selectedProject.name}</h1>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            {selectedProject.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveProjectTab('board')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            Buka Board Kanban
          </button>
          <button
            onClick={() => setActiveProjectTab('client_portal')}
            className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold transition-all cursor-pointer"
          >
            Lihat Client Portal
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progress */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Overall Progress</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{completionPercent}%</div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${completionPercent}%` }} />
          </div>
          <span className="text-[11px] text-slate-500 block">
            {doneIssues.length} dari {projectIssues.length} issues selesai
          </span>
        </div>

        {/* Budget Burn */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Budget Burn Rate (Super Admin)</span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700">{budgetBurnPercent}%</div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${budgetBurnPercent > 80 ? 'bg-amber-500' : 'bg-indigo-600'}`}
              style={{ width: `${Math.min(100, budgetBurnPercent)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-600 block font-mono">
            {formatIDR(selectedProject.spentAmount)} / {formatIDR(selectedProject.budgetAmount)}
          </span>
        </div>

        {/* Hours Spent */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Jam Alokasi Tim</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {selectedProject.spentHours} <span className="text-xs text-slate-500 font-normal">/ {selectedProject.budgetHours} Jam</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${hoursBurnPercent > 80 ? 'bg-amber-500' : 'bg-sky-500'}`}
              style={{ width: `${Math.min(100, hoursBurnPercent)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 block">
            {selectedProject.budgetHours - selectedProject.spentHours} jam tersisa dalam alokasi
          </span>
        </div>

        {/* Timeline Target */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Target Deadline</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{selectedProject.targetDate}</div>
          <span className="text-[11px] text-emerald-700 font-bold block">
            Sisa 56 hari menuju Go-Live
          </span>
          <span className="text-[10px] text-slate-500 block">
            Mulai: {selectedProject.startDate}
          </span>
        </div>
      </div>

      {/* Main 2-Column Split: Active Sprint & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Sprint Summary */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Sprint Berjalan Saat Ini</h3>
            <button
              onClick={() => setCurrentView('backlog')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              Lihat Detail Backlog <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeSprint ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{activeSprint.name}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase text-[10px]">
                  {activeSprint.status}
                </span>
              </div>
              <p className="text-slate-600">{activeSprint.goal}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                <span>Durasi: {activeSprint.startDate} s/d {activeSprint.endDate}</span>
                <span className="font-mono text-slate-700 font-bold">{activeSprint.capacityPoints} Story Points</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Tidak ada sprint aktif.</p>
          )}
        </div>

        {/* Milestone Deliverables Checklist */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Milestones & Termin Pembayaran</h3>
            <button
              onClick={() => setCurrentView('roadmap')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              Gantt Roadmap <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {projectMilestones.map((ms) => (
              <div
                key={ms.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{ms.name}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      ms.clientApproval === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {ms.clientApproval === 'approved' ? 'UAT Disetujui' : 'Review Klien'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Target: {ms.dueDate}</span>
                </div>

                <div className="text-right">
                  {ms.billingAmount && (
                    <span className="font-mono font-bold text-indigo-700 block text-xs">
                      {formatIDR(ms.billingAmount)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Members Roster */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm">Tim Software House Ditugaskan ({projectMembers.length} Orang)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {projectMembers.map((member) => (
            <div
              key={member.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3"
            >
              <Avatar name={member.name} avatar={member.avatar} size="md" />
              <div className="min-w-0 flex-1">
                <span className="font-bold text-xs text-slate-900 block truncate">{member.name}</span>
                <span className="text-[11px] text-indigo-600 font-semibold block truncate">{member.roleTitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
