import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Plus,
  Play,
  KanbanSquare,
  ListOrdered,
  Receipt,
  ExternalLink,
  Clock,
  Sparkles,
  UserCheck,
  ChevronRight,
  FolderKanban,
  Users,
  Settings
} from 'lucide-react';

export const CommandPaletteModal: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    openCreateIssueModal,
    projects,
    selectedProjectId,
    issues,
    openIssueDetail,
    openProjectDetail,
    setMainNavSection,
    setIsInsideProjectDetail,
    setIsAIAssistantOpen,
    setIsTimeTrackerModalOpen
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Filter issues based on query
  const matchedIssues = issues.filter(
    (i) =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.key.toLowerCase().includes(query.toLowerCase()) ||
      i.labels.some((l) => l.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 5);

  const matchedProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.key.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      {/* Palette Dialog */}
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-100 flex flex-col text-slate-900">
        {/* Search input bar */}
        <div className="p-3.5 border-b border-slate-100 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik perintah, nama issue, atau navigasi..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-500 font-mono shrink-0 font-medium">
            ESC
          </kbd>
        </div>

        {/* Action Results list */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Quick primary tools */}
          {(!query || 'buat issue'.includes(query.toLowerCase())) && (
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1">
                Aksi Cepat
              </div>
              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  openCreateIssueModal();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-indigo-50 hover:text-indigo-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  <span>Buat Issue Baru</span>
                </div>
                <kbd className="text-[10px] font-mono opacity-60">C</kbd>
              </button>

              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  setIsAIAssistantOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Buka Gemini AI Copilot (Generate Stories)</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  setIsTimeTrackerModalOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-indigo-50 hover:text-indigo-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Play className="w-4 h-4 text-emerald-600" />
                  <span>Mulai / Catat Jam Kerja</span>
                </div>
              </button>
            </div>
          )}

          {/* Matched Issues */}
          {matchedIssues.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1">
                Issues ({matchedIssues.length})
              </div>
              {matchedIssues.map((iss) => (
                <button
                  key={iss.id}
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    openIssueDetail(iss.id);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono font-bold text-indigo-700">{iss.key}</span>
                    <span className="truncate font-medium">{iss.title}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Switch Projects */}
          {matchedProjects.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1">
                Proyek
              </div>
              {matchedProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    openProjectDetail(p.id, 'overview');
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="font-bold text-slate-900">{p.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({p.key})</span>
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-600">Buka Workspace →</span>
                </button>
              ))}
            </div>
          )}

          {/* Navigasi Utama */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1">
              Navigasi Halaman
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  setMainNavSection('projects');
                  setIsInsideProjectDetail(false);
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <FolderKanban className="w-4 h-4 text-indigo-600" />
                <span>Manajemen Proyek (Semua Proyek)</span>
              </button>

              <button
                onClick={() => {
                  setMainNavSection('dashboard');
                  setIsInsideProjectDetail(false);
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <UserCheck className="w-4 h-4 text-slate-500" />
                <span>Ikhtisar Agensi / My Work</span>
              </button>

              <button
                onClick={() => {
                  setMainNavSection('clients');
                  setIsInsideProjectDetail(false);
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Users className="w-4 h-4 text-slate-500" />
                <span>Direktori Klien</span>
              </button>

              <button
                onClick={() => {
                  setMainNavSection('timesheet');
                  setIsInsideProjectDetail(false);
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Timesheet Global</span>
              </button>

              <button
                onClick={() => {
                  setMainNavSection('finance');
                  setIsInsideProjectDetail(false);
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Receipt className="w-4 h-4 text-slate-500" />
                <span>Keuangan & Invoices</span>
              </button>

              <button
                onClick={() => {
                  openProjectDetail(selectedProjectId, 'board');
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <KanbanSquare className="w-4 h-4 text-indigo-600" />
                <span>Board Kanban Proyek Aktif</span>
              </button>

              <button
                onClick={() => {
                  openProjectDetail(selectedProjectId, 'client_portal');
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <ExternalLink className="w-4 h-4 text-amber-600" />
                <span>Client Portal (FR-11)</span>
              </button>

              <button
                onClick={() => {
                  setMainNavSection('settings');
                  setIsInsideProjectDetail(false);
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Pengaturan & Audit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tekan ESC untuk menutup</span>
          <span className="font-mono">ForgeFlow OS v1.0</span>
        </div>
      </div>
    </div>
  );
};
