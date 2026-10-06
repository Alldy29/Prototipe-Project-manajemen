import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck } from 'lucide-react';
import { PriorityBadge, TypeBadge, StatusBadge } from '../common/Badge';

export const MyWorkView: React.FC = () => {
  const {
    currentUser,
    issues,
    openIssueDetail,
    notifications,
    markNotificationRead,
    timeEntries
  } = useApp();

  const myAssignedIssues = issues.filter((i) => i.assigneeId === currentUser.id);
  const inProgressIssues = myAssignedIssues.filter((i) => i.statusId === 'in_progress');
  const urgentIssues = myAssignedIssues.filter((i) => i.priority === 'urgent');

  const myHoursThisWeek = timeEntries
    .filter((te) => te.userId === currentUser.id)
    .reduce((sum, te) => sum + te.hours, 0);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">
              Workspace Super Admin — {currentUser.name}
            </h1>
            <p className="text-xs text-slate-500">
              {currentUser.roleTitle} • Total Jam Dicatat Minggu Ini: <strong className="text-emerald-700 font-mono font-bold">{myHoursThisWeek} Jam</strong>
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Total Task Ditugaskan</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{myAssignedIssues.length}</div>
          <span className="text-[11px] text-slate-500 block">Lintas seluruh proyek aktif</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Sedang Dikerjakan (In Progress)</span>
          <div className="text-2xl font-black text-blue-600 font-mono">{inProgressIssues.length}</div>
          <span className="text-[11px] text-slate-500 block">Aktif dalam sprint ini</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Perhatian Urgent</span>
          <div className="text-2xl font-black text-rose-600 font-mono">{urgentIssues.length}</div>
          <span className="text-[11px] text-rose-700 block font-medium">Prioritas tinggi / bug kritikal</span>
        </div>
      </div>

      {/* 2-Column Split: Assigned Issues & Inbox Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Assigned Issues */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h3 className="font-extrabold text-sm text-slate-900">Daftar Tugas Anda ({myAssignedIssues.length})</h3>

          <div className="space-y-2">
            {myAssignedIssues.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Tidak ada task yang ditugaskan ke akun ini saat ini.</p>
            ) : (
              myAssignedIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => openIssueDetail(issue.id)}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate pr-3">
                    <TypeBadge type={issue.type} showText={false} />
                    <span className="font-mono font-bold text-indigo-700">{issue.key}</span>
                    <span className="font-semibold text-slate-800 truncate">{issue.title}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge priority={issue.priority} showText={false} />
                    <StatusBadge statusId={issue.statusId} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Notification Inbox */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">Inbox & Peringatan ({notifications.length})</h3>
          </div>

          <div className="space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  notif.read ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-indigo-50/70 border-indigo-200 text-slate-900 font-semibold'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{notif.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{notif.createdAt}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">{notif.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
