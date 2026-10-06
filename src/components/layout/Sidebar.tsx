import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MainNavSection } from '../../types';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Clock,
  Receipt,
  Settings,
  Plus,
  Layers,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    projects,
    selectedProject,
    mainNavSection,
    setMainNavSection,
    isInsideProjectDetail,
    setIsInsideProjectDetail,
    setIsCreateProjectOpen,
    setIsCommandPaletteOpen,
    setIsAIAssistantOpen,
    openProjectDetail
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainNavItems: {
    section: MainNavSection;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
  }[] = [
    { section: 'dashboard', label: 'Ikhtisar Agensi', icon: LayoutDashboard },
    { section: 'projects', label: 'Proyek', icon: FolderKanban, badge: projects.length },
    { section: 'clients', label: 'Klien', icon: Users },
    { section: 'timesheet', label: 'Timesheet Global', icon: Clock },
    { section: 'finance', label: 'Keuangan & Invoicing', icon: Receipt },
    { section: 'settings', label: 'Pengaturan & Audit', icon: Settings },
  ];

  const handleSelectNav = (section: MainNavSection) => {
    setMainNavSection(section);
    if (section === 'projects') {
      // By default clicking Proyek in sidebar opens the Projects list!
      setIsInsideProjectDetail(false);
    } else {
      setIsInsideProjectDetail(false);
    }
  };

  return (
    <aside
      className={`bg-white border-r border-slate-200 transition-all duration-200 flex flex-col shrink-0 select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/20 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
                ForgeFlow
                <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold border border-indigo-200">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">Software House Platform</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 mx-auto rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            <Layers className="w-4 h-4" />
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title={isCollapsed ? 'Perluas sidebar' : 'Kecilkan sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Action Buttons */}
      <div className="px-3 py-2 space-y-1">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Command Palette (Cmd/Ctrl + K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {!isCollapsed && (
            <div className="flex items-center justify-between flex-1">
              <span>Command Palette</span>
              <kbd className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500 font-medium">
                ⌘K
              </kbd>
            </div>
          )}
        </button>

        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Gemini AI Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          {!isCollapsed && <span className="font-semibold">AI Copilot</span>}
        </button>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {!isCollapsed && (
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
            Menu Utama
          </div>
        )}

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isSelected = mainNavSection === item.section && !isInsideProjectDetail;
          const isProjectsActive = item.section === 'projects' && (mainNavSection === 'projects' || isInsideProjectDetail);

          return (
            <button
              key={item.section}
              onClick={() => handleSelectNav(item.section)}
              title={item.label}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isCollapsed ? 'justify-center' : ''
              } ${
                isProjectsActive
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : isSelected
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isProjectsActive || isSelected ? 'text-white' : 'text-slate-500'
                }`}
              />
              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        isProjectsActive || isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}

        {/* Active Project Quick Card (Visible if inside project detail) */}
        {!isCollapsed && isInsideProjectDetail && selectedProject && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
              <span>Proyek Dibuka</span>
              <span className="text-[10px] text-indigo-600 font-bold">Tabs Aktif</span>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: selectedProject.color }}
                />
                <span className="text-xs font-bold text-slate-900 truncate">
                  {selectedProject.name}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {selectedProject.key} • {selectedProject.clientName}
              </div>
              <button
                onClick={() => setIsInsideProjectDetail(false)}
                className="w-full text-center py-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-100/50 rounded-lg border border-indigo-200 transition-colors"
              >
                ← Semua Proyek
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Footer shortcut info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between bg-slate-50/60">
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Mode Super Admin
          </span>
          <button
            onClick={() => setIsCreateProjectOpen(true)}
            className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
            title="Buat Proyek Baru"
          >
            <Plus className="w-3 h-3" /> Proyek
          </button>
        </div>
      )}
    </aside>
  );
};
