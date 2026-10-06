import React from 'react';
import { useApp } from '../../context/AppContext';
import { PriorityBadge, TypeBadge, StatusBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Layers,
  Lock
} from 'lucide-react';

export const BacklogView: React.FC = () => {
  const {
    issues,
    sprints,
    selectedProjectId,
    users,
    openIssueDetail,
    openCreateIssueModal,
    updateIssue,
    setIsSprintModalOpen,
    startSprint
  } = useApp();

  const activeSprint = sprints.find((s) => s.projectId === selectedProjectId && s.status === 'active');
  const plannedSprint = sprints.find((s) => s.projectId === selectedProjectId && s.status === 'planned');

  const projectIssues = issues.filter((i) => i.projectId === selectedProjectId);
  const activeSprintIssues = projectIssues.filter((i) => i.sprintId === activeSprint?.id);
  const plannedSprintIssues = projectIssues.filter((i) => i.sprintId === plannedSprint?.id);
  const backlogIssues = projectIssues.filter((i) => !i.sprintId);

  // Calculate capacities
  const activeCommittedPoints = activeSprintIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);
  const activeCompletedPoints = activeSprintIssues.filter((i) => i.statusId === 'done').reduce((sum, i) => sum + (i.storyPoints || 0), 0);
  const activeCapacity = activeSprint?.capacityPoints || 40;
  const isOverCapacity = activeCommittedPoints > activeCapacity;

  const renderIssueRow = (issue: typeof issues[0], currentSprintId?: string) => {
    const assignee = users.find((u) => u.id === issue.assigneeId);

    return (
      <div
        key={issue.id}
        onClick={() => openIssueDetail(issue.id)}
        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/80 border border-slate-200 hover:border-indigo-300 hover:bg-slate-100/90 transition-all text-xs cursor-pointer group shadow-2xs"
      >
        {/* Left: Key, Type, Title */}
        <div className="flex items-center gap-2.5 min-w-0 pr-4">
          <TypeBadge type={issue.type} showText={false} />
          <span className="font-mono font-bold text-indigo-700 shrink-0 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
            {issue.key}
          </span>
          <span className="font-semibold text-slate-800 truncate group-hover:text-indigo-600">
            {issue.title}
          </span>
          {issue.internalOnly && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 shrink-0 font-medium">
              <Lock className="w-2.5 h-2.5 text-amber-600" /> Internal
            </span>
          )}
        </div>

        {/* Right: Status, Priority, Points, Assignee, Move action */}
        <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
          <StatusBadge statusId={issue.statusId} />
          <PriorityBadge priority={issue.priority} showText={false} />

          {/* Quick story point editor */}
          <span className="font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-xs shadow-2xs">
            {issue.storyPoints || 0} pts
          </span>

          <Avatar name={assignee?.name || 'Unassigned'} avatar={assignee?.avatar} size="xs" />

          {/* Quick Sprint Mover buttons */}
          <div className="flex items-center gap-1">
            {currentSprintId ? (
              <button
                onClick={() => updateIssue(issue.id, { sprintId: undefined })}
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-200 text-[11px]"
                title="Kembalikan ke Backlog"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              activeSprint && (
                <button
                  onClick={() => updateIssue(issue.id, { sprintId: activeSprint.id })}
                  className="p-1 rounded text-slate-400 hover:text-emerald-700 hover:bg-slate-200 text-[11px]"
                  title="Pindahkan ke Sprint Aktif"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6 bg-slate-50 text-slate-900">
      {/* SECTION 1: Active Sprint */}
      {activeSprint && (
        <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3.5 shadow-xs">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Sprint Aktif
                </span>
                <h3 className="text-base font-extrabold text-slate-900">{activeSprint.name}</h3>
                <span className="text-xs text-slate-500">
                  ({activeSprint.startDate} s/d {activeSprint.endDate})
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{activeSprint.goal}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSprintModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Selesaikan Sprint
              </button>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 flex items-center gap-1.5">
                Kapasitas Tim: <strong className="text-slate-900">{activeCommittedPoints}</strong> / {activeCapacity} Points Terkomitmen
                {isOverCapacity && (
                  <span className="text-amber-700 flex items-center gap-1 font-bold ml-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Over Capacity!
                  </span>
                )}
              </span>
              <span className="text-emerald-700 font-bold">
                Selesai: {activeCompletedPoints} pts ({activeSprintIssues.length > 0 ? Math.round((activeCompletedPoints / (activeCommittedPoints || 1)) * 100) : 0}%)
              </span>
            </div>

            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all"
                style={{ width: `${Math.min(100, (activeCompletedPoints / (activeCapacity || 1)) * 100)}%` }}
                title="Selesai"
              />
              <div
                className={`h-full transition-all ${isOverCapacity ? 'bg-amber-500' : 'bg-indigo-600'}`}
                style={{
                  width: `${Math.min(100, ((activeCommittedPoints - activeCompletedPoints) / (activeCapacity || 1)) * 100)}%`
                }}
                title="Dalam Pengerjaan"
              />
            </div>
          </div>

          {/* Issue list in active sprint */}
          <div className="space-y-1.5">
            {activeSprintIssues.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Belum ada issue di sprint aktif ini.</p>
            ) : (
              activeSprintIssues.map((iss) => renderIssueRow(iss, activeSprint.id))
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: Planned Sprint */}
      {plannedSprint && (
        <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-600 border border-slate-200">
                Direncanakan
              </span>
              <h3 className="text-sm font-bold text-slate-900">{plannedSprint.name}</h3>
              <span className="text-xs text-slate-500 font-mono">
                {plannedSprintIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0)} pts
              </span>
            </div>

            <button
              onClick={() => startSprint(plannedSprint.id)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
            >
              <Play className="w-3 h-3 fill-white" /> Mulai Sprint Ini
            </button>
          </div>

          <div className="space-y-1.5">
            {plannedSprintIssues.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-3">Belum ada issue yang dialokasikan ke sprint ini.</p>
            ) : (
              plannedSprintIssues.map((iss) => renderIssueRow(iss, plannedSprint.id))
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: Product Backlog */}
      <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-900">Product Backlog</h3>
            <span className="text-xs font-mono text-slate-500 font-semibold">
              ({backlogIssues.length} issues • {backlogIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0)} pts)
            </span>
          </div>

          <button
            onClick={() => openCreateIssueModal('backlog')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200"
          >
            <Plus className="w-3 h-3" /> Tambah ke Backlog
          </button>
        </div>

        <div className="space-y-1.5">
          {backlogIssues.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">Semua issue telah dimasukkan ke sprint!</p>
          ) : (
            backlogIssues.map((iss) => renderIssueRow(iss))
          )}
        </div>
      </div>
    </div>
  );
};
