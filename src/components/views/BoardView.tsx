import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IssueStatusId, Issue, IssuePriority } from '../../types';
import { PriorityBadge, TypeBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import {
  Plus,
  Lock,
  CheckCircle2
} from 'lucide-react';

export const BoardView: React.FC = () => {
  const {
    issues,
    selectedProjectId,
    users,
    moveIssueStatus,
    openIssueDetail,
    openCreateIssueModal,
    searchQuery,
    filterPriority,
    filterAssignee,
    filterType
  } = useApp();

  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);
  const [activeDragOverCol, setActiveDragOverCol] = useState<IssueStatusId | null>(null);
  const [swimlaneMode, setSwimlaneMode] = useState<'none' | 'priority' | 'assignee'>('none');

  const columns: { id: IssueStatusId; title: string; limit?: number; dotColor: string }[] = [
    { id: 'backlog', title: 'Backlog', dotColor: 'bg-slate-400' },
    { id: 'ready', title: 'Ready for Dev', dotColor: 'bg-indigo-600' },
    { id: 'in_progress', title: 'In Progress', limit: 4, dotColor: 'bg-blue-600' },
    { id: 'code_review', title: 'Code Review', limit: 3, dotColor: 'bg-cyan-600' },
    { id: 'qa', title: 'QA Testing', limit: 4, dotColor: 'bg-purple-600' },
    { id: 'uat', title: 'UAT (Klien)', dotColor: 'bg-amber-500' },
    { id: 'done', title: 'Done', dotColor: 'bg-emerald-600' }
  ];

  // Super Admin sees all issues
  let projectIssues = issues.filter((i) => i.projectId === selectedProjectId);

  // Apply filters
  if (searchQuery.trim()) {
    projectIssues = projectIssues.filter(
      (i) =>
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.labels.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
  if (filterPriority !== 'all') {
    projectIssues = projectIssues.filter((i) => i.priority === filterPriority);
  }
  if (filterAssignee !== 'all') {
    projectIssues = projectIssues.filter((i) => i.assigneeId === filterAssignee);
  }
  if (filterType !== 'all') {
    projectIssues = projectIssues.filter((i) => i.type === filterType);
  }

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedIssueId(id);
  };

  const handleDragOver = (e: React.DragEvent, colId: IssueStatusId) => {
    e.preventDefault();
    if (activeDragOverCol !== colId) {
      setActiveDragOverCol(colId);
    }
  };

  const handleDragLeave = () => {
    setActiveDragOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, targetColId: IssueStatusId) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData('text/plain') || draggedIssueId;
    if (issueId) {
      moveIssueStatus(issueId, targetColId);
    }
    setDraggedIssueId(null);
    setActiveDragOverCol(null);
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-3 overflow-hidden select-none bg-slate-50 text-slate-900">
      {/* Top Filter and Swimlane control */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 pb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Swimlane:</span>
          <div className="flex rounded-lg bg-white border border-slate-200 p-0.5 text-xs shadow-xs">
            <button
              onClick={() => setSwimlaneMode('none')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                swimlaneMode === 'none' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Standar
            </button>
            <button
              onClick={() => setSwimlaneMode('priority')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                swimlaneMode === 'priority' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Berdasarkan Prioritas
            </button>
            <button
              onClick={() => setSwimlaneMode('assignee')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                swimlaneMode === 'assignee' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Berdasarkan Assignee
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Menampilkan <strong className="text-slate-800">{projectIssues.length}</strong> issues</span>
          <button
            onClick={() => openCreateIssueModal()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Issue
          </button>
        </div>
      </div>

      {/* Kanban Board Columns Horizontal Container */}
      <div className="flex-1 flex gap-3 overflow-x-auto pb-2">
        {columns.map((col) => {
          const colIssues = projectIssues.filter((i) => i.statusId === col.id);
          const isOverLimit = col.limit ? colIssues.length > col.limit : false;
          const isDragOver = activeDragOverCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`w-72 shrink-0 flex flex-col rounded-xl bg-slate-100/70 border transition-all ${
                isDragOver
                  ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-slate-200/80 flex items-center justify-between shrink-0 bg-slate-100/90 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                  <span className="text-xs font-bold text-slate-800">{col.title}</span>
                  <span className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    isOverLimit ? 'bg-rose-100 text-rose-700' : 'bg-white border border-slate-200 text-slate-600'
                  }`}>
                    {colIssues.length}{col.limit ? `/${col.limit}` : ''}
                  </span>
                </div>

                <button
                  onClick={() => openCreateIssueModal(col.id)}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                  title={`Tambah issue di kolom ${col.title}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Column Cards Container */}
              <div className="flex-1 p-2 space-y-2.5 overflow-y-auto min-h-48">
                {colIssues.length === 0 ? (
                  <div className="h-28 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[11px] text-slate-400">
                    Tarik kartu ke sini
                  </div>
                ) : (
                  colIssues.map((issue) => {
                    const assignee = users.find((u) => u.id === issue.assigneeId);
                    const completedChecklist = issue.checklist.filter((c) => c.completed).length;

                    return (
                      <div
                        key={issue.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, issue.id)}
                        onClick={() => openIssueDetail(issue.id)}
                        className={`p-3 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all shadow-xs cursor-pointer group text-xs space-y-2.5 ${
                          draggedIssueId === issue.id ? 'opacity-50 scale-95' : ''
                        }`}
                      >
                        {/* Header: Key & Type */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-[11px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                              {issue.key}
                            </span>
                            <TypeBadge type={issue.type} showText={false} />
                            {issue.internalOnly && (
                              <span title="Internal Only (Hidden from client)" className="bg-amber-50 p-0.5 rounded text-amber-700 border border-amber-200">
                                <Lock className="w-3 h-3 text-amber-600" />
                              </span>
                            )}
                          </div>
                          <PriorityBadge priority={issue.priority} showText={false} />
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-slate-800 text-xs leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {issue.title}
                        </h4>

                        {/* Checklist progress pill if any */}
                        {issue.checklist.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>
                              {completedChecklist}/{issue.checklist.length} kriteria
                            </span>
                          </div>
                        )}

                        {/* Footer: Labels, Points & Assignee */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-1 flex-wrap">
                            {issue.storyPoints && (
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 font-mono text-[10px] text-slate-600 font-semibold border border-slate-200">
                                {issue.storyPoints}pt
                              </span>
                            )}
                            {issue.labels.slice(0, 1).map((lbl) => (
                              <span
                                key={lbl}
                                className="px-1.5 py-0.2 rounded bg-slate-50 text-[10px] text-slate-600 border border-slate-200 font-medium"
                              >
                                {lbl}
                              </span>
                            ))}
                          </div>

                          <Avatar
                            name={assignee?.name || 'Unassigned'}
                            avatar={assignee?.avatar}
                            size="xs"
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
