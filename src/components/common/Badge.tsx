import React from 'react';
import { IssuePriority, IssueType, IssueStatusId, ClientCategoryStatus } from '../../types';
import { 
  AlertCircle, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Bookmark, 
  CheckSquare, 
  Bug, 
  Zap, 
  FolderKanban,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const PriorityBadge: React.FC<{ priority: IssuePriority; showText?: boolean }> = ({ priority, showText = true }) => {
  switch (priority) {
    case 'urgent':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          {showText && <span>Urgent</span>}
        </span>
      );
    case 'high':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <ArrowUp className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          {showText && <span>High</span>}
        </span>
      );
    case 'medium':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <Minus className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          {showText && <span>Medium</span>}
        </span>
      );
    case 'low':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          <ArrowDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {showText && <span>Low</span>}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-normal text-slate-500">
          <Minus className="w-3 h-3 text-slate-400" />
          {showText && <span>None</span>}
        </span>
      );
  }
};

export const TypeBadge: React.FC<{ type: IssueType; showText?: boolean }> = ({ type, showText = true }) => {
  switch (type) {
    case 'epic':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <FolderKanban className="w-3.5 h-3.5 shrink-0" />
          {showText && <span>Epic</span>}
        </span>
      );
    case 'story':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Bookmark className="w-3.5 h-3.5 shrink-0" />
          {showText && <span>Story</span>}
        </span>
      );
    case 'task':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
          <CheckSquare className="w-3.5 h-3.5 shrink-0" />
          {showText && <span>Task</span>}
        </span>
      );
    case 'bug':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <Bug className="w-3.5 h-3.5 shrink-0" />
          {showText && <span>Bug</span>}
        </span>
      );
    case 'spike':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Zap className="w-3.5 h-3.5 shrink-0" />
          {showText && <span>Spike</span>}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <CheckSquare className="w-3.5 h-3.5" />
          {showText && <span>Task</span>}
        </span>
      );
  }
};

export const StatusBadge: React.FC<{ statusId: IssueStatusId }> = ({ statusId }) => {
  const map: Record<IssueStatusId, { label: string; bg: string; text: string; border: string }> = {
    backlog: { label: 'Backlog', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
    ready: { label: 'Ready', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    in_progress: { label: 'In Progress', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    code_review: { label: 'Code Review', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
    qa: { label: 'QA Testing', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    uat: { label: 'UAT (Klien)', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    done: { label: 'Done', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
  };

  const current = map[statusId] || map.ready;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${current.bg} ${current.text} border ${current.border}`}>
      {current.label}
    </span>
  );
};

// FR-11A: Client Status Category Badge
export const ClientStatusBadge: React.FC<{ status: ClientCategoryStatus }> = ({ status }) => {
  switch (status) {
    case 'not_started':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          <Clock className="w-3 h-3 text-slate-500" />
          Belum Dimulai
        </span>
      );
    case 'in_progress':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          Sedang Dikerjakan
        </span>
      );
    case 'in_qa':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          Sedang Diuji (QA)
        </span>
      );
    case 'waiting_approval':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Menunggu Persetujuan Anda
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Selesai
        </span>
      );
    case 'blocked':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
          Ditunda / Terkendala
        </span>
      );
    default:
      return null;
  }
};
