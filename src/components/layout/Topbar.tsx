import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import {
  Play,
  Pause,
  Square,
  Plus,
  Bell,
  Search,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const Topbar: React.FC = () => {
  const {
    selectedProject,
    mainNavSection,
    isInsideProjectDetail,
    activeProjectTab,
    exitProjectDetail,
    currentUser,
    timer,
    startTimer,
    pauseTimer,
    stopAndLogTimer,
    setIsTimeTrackerModalOpen,
    openCreateIssueModal,
    setIsCommandPaletteOpen,
    setIsAIAssistantOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    openIssueDetail,
    issues
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const unreadNotifs = notifications.filter((n) => !n.read);

  const tabTitles: Record<string, string> = {
    overview: 'Ringkasan Proyek',
    board: 'Board Kanban',
    backlog: 'Backlog & Sprint',
    roadmap: 'Roadmap & Gantt',
    qa: 'QA & Testing',
    docs: 'Docs & Wiki',
    timesheet: 'Time Tracking',
    finance: 'Financial',
    client_portal: 'Client Portal',
    list: 'Tabel Issues',
  };

  const navSectionTitles: Record<string, string> = {
    dashboard: 'Ikhtisar Agensi',
    projects: 'Manajemen Proyek',
    clients: 'Direktori Klien',
    timesheet: 'Timesheet Global',
    finance: 'Keuangan & Invoicing',
    settings: 'Pengaturan & Audit Log'
  };

  return (
    <header className="h-14 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-20 select-none">
      {/* Left: Breadcrumbs & Project Health */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="font-bold text-slate-800 hidden sm:inline">ForgeFlow Agency</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />

          {mainNavSection === 'projects' ? (
            isInsideProjectDetail ? (
              <>
                <button
                  onClick={exitProjectDetail}
                  className="font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Proyek
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-800 truncate max-w-36 sm:max-w-56">
                  {selectedProject?.name || 'Proyek'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-indigo-600 font-bold truncate">
                  {tabTitles[activeProjectTab] || activeProjectTab}
                </span>
              </>
            ) : (
              <span className="text-indigo-600 font-bold">
                Manajemen Proyek
              </span>
            )
          ) : (
            <span className="text-indigo-600 font-bold">
              {navSectionTitles[mainNavSection] || mainNavSection}
            </span>
          )}
        </div>

        {isInsideProjectDetail && selectedProject?.health && (
          <span
            className={`hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              selectedProject.health === 'on_track'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : selectedProject.health === 'at_risk'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {selectedProject.health === 'on_track' ? 'On Track' : selectedProject.health === 'at_risk' ? 'At Risk' : 'Off Track'}
          </span>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Search trigger button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500">Cari issue, dokumen, tim...</span>
          <kbd className="text-[10px] px-1.5 py-0.2 rounded bg-white border border-slate-200 font-mono text-slate-500 font-medium">
            ⌘K
          </kbd>
        </button>

        {/* Live Timer Pill */}
        <div className="flex items-center">
          {timer.isRunning || timer.seconds > 0 ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-slate-800 shadow-xs">
              <span className="relative flex h-2 w-2">
                {timer.isRunning && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${timer.isRunning ? 'bg-emerald-600' : 'bg-amber-500'}`}></span>
              </span>
              <span className="font-mono font-bold tracking-wider text-emerald-700">
                {formatTimer(timer.seconds)}
              </span>
              {timer.issueKey && (
                <span className="text-[11px] font-mono text-slate-600 hidden lg:inline max-w-24 truncate">
                  {timer.issueKey}
                </span>
              )}
              {timer.isRunning ? (
                <button
                  onClick={pauseTimer}
                  className="p-1 hover:bg-emerald-100 rounded text-slate-600 hover:text-slate-900"
                  title="Jeda timer"
                >
                  <Pause className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={() => startTimer()}
                  className="p-1 hover:bg-emerald-100 rounded text-emerald-700 hover:text-emerald-900"
                  title="Lanjutkan timer"
                >
                  <Play className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => stopAndLogTimer()}
                className="p-1 hover:bg-rose-100 rounded text-rose-600 hover:text-rose-800"
                title="Simpan log waktu"
              >
                <Square className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsTimeTrackerModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors"
              title="Mulai Timer Kerja"
            >
              <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
              <span>Timer</span>
            </button>
          )}
        </div>

        {/* AI Assistant button */}
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition-all hover:scale-[1.02]"
          title="Buka Gemini AI Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
            title="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Inbox & Notifikasi</span>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-indigo-600 hover:underline font-semibold"
                  >
                    Tandai semua dibaca
                  </button>
                )}
              </div>
              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markNotificationRead(notif.id);
                      if (notif.issueKey) {
                        const target = issues.find((i) => i.key === notif.issueKey);
                        if (target) openIssueDetail(target.id);
                      }
                      setIsNotifOpen(false);
                    }}
                    className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      notif.read ? 'bg-slate-50 text-slate-600' : 'bg-indigo-50/60 text-slate-900 font-semibold border-l-2 border-indigo-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{notif.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{notif.createdAt}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">{notif.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Create Issue button (Shortcut C) */}
        <button
          onClick={() => openCreateIssueModal()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] cursor-pointer"
          title="Buat Issue Baru (Shortcut: C)"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Buat Issue</span>
          <kbd className="hidden md:inline px-1 py-0.2 rounded bg-indigo-700 text-[10px] font-mono text-indigo-100">
            C
          </kbd>
        </button>

        {/* Super Admin Profile Pill */}
        <div className="pl-2 border-l border-slate-200 flex items-center gap-2">
          <Avatar
            name={currentUser.name}
            avatar={currentUser.avatar}
            size="sm"
          />
          <div className="hidden lg:flex flex-col text-left leading-tight">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
              {currentUser.name}
              <ShieldCheck className="w-3 h-3 text-indigo-600" />
            </span>
            <span className="text-[10px] font-semibold text-indigo-700">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};
