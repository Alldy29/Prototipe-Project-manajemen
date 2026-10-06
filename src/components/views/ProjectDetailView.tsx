import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectDetailTab } from '../../types';
import {
  ArrowLeft,
  LayoutDashboard,
  KanbanSquare,
  ListOrdered,
  Milestone,
  CheckCircle2,
  FileText,
  Clock,
  Receipt,
  ExternalLink,
  TableProperties,
  Edit3,
  Plus,
  Sparkles,
  Calendar,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

// Views for Tabs
import { ProjectOverviewView } from './ProjectOverviewView';
import { BoardView } from './BoardView';
import { BacklogView } from './BacklogView';
import { RoadmapView } from './RoadmapView';
import { QAView } from './QAView';
import { DocsView } from './DocsView';
import { TimeTrackingView } from './TimeTrackingView';
import { FinanceView } from './FinanceView';
import { ClientPortalView } from './ClientPortalView';
import { ListView } from './ListView';

export const ProjectDetailView: React.FC = () => {
  const {
    selectedProject,
    activeProjectTab,
    setActiveProjectTab,
    exitProjectDetail,
    openEditProjectModal,
    openCreateIssueModal,
    setIsAIAssistantOpen,
    issues
  } = useApp();

  const projIssues = issues.filter((i) => i.projectId === selectedProject.id);
  const doneCount = projIssues.filter((i) => i.statusId === 'done').length;
  const progressPercent = projIssues.length > 0 ? Math.round((doneCount / projIssues.length) * 100) : 0;

  const tabs: { id: ProjectDetailTab; label: string; icon: React.ElementType; badge?: string | number }[] = [
    { id: 'overview', label: 'Ringkasan Proyek', icon: LayoutDashboard },
    { id: 'board', label: 'Board Kanban', icon: KanbanSquare, badge: projIssues.length },
    { id: 'backlog', label: 'Backlog & Sprint', icon: ListOrdered },
    { id: 'roadmap', label: 'Roadmap & Gantt', icon: Milestone },
    { id: 'qa', label: 'QA & Testing', icon: CheckCircle2 },
    { id: 'docs', label: 'Docs & Wiki', icon: FileText },
    { id: 'timesheet', label: 'Time Tracking', icon: Clock },
    { id: 'finance', label: 'Financial', icon: Receipt },
    { id: 'client_portal', label: 'Client Portal', icon: ExternalLink, badge: 'FR-11' },
    { id: 'list', label: 'Tabel Issues', icon: TableProperties },
  ];

  const renderTabContent = () => {
    switch (activeProjectTab) {
      case 'overview':
        return <ProjectOverviewView />;
      case 'board':
        return <BoardView />;
      case 'backlog':
        return <BacklogView />;
      case 'roadmap':
        return <RoadmapView />;
      case 'qa':
        return <QAView />;
      case 'docs':
        return <DocsView />;
      case 'timesheet':
        return <TimeTrackingView />;
      case 'finance':
        return <FinanceView />;
      case 'client_portal':
        return <ClientPortalView />;
      case 'list':
        return <ListView />;
      default:
        return <ProjectOverviewView />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden">
      {/* Top Project Subheader */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 pt-3 pb-0 shrink-0">
        {/* Navigation Breadcrumb & Back button */}
        <div className="flex items-center justify-between pb-2">
          <button
            onClick={exitProjectDetail}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Kembali ke Daftar Proyek</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedProject.health === 'on_track'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : selectedProject.health === 'at_risk'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {selectedProject.health === 'on_track' ? '● On Track' : selectedProject.health === 'at_risk' ? '● At Risk' : '● Off Track'}
            </span>

            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 capitalize">
              {selectedProject.type.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Project Identity & Actions Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs shrink-0"
              style={{ backgroundColor: selectedProject.color }}
            >
              {selectedProject.key}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black text-slate-900 truncate">
                  {selectedProject.name}
                </h1>
                <span className="font-mono text-xs font-extrabold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {selectedProject.key}
                </span>
              </div>
              <p className="text-xs text-indigo-700 font-semibold truncate">
                Klien: <span className="font-bold text-slate-800">{selectedProject.clientName}</span> • Target: <span className="font-mono text-slate-600">{selectedProject.targetDate}</span> • Progres: <span className="font-bold text-emerald-700">{progressPercent}%</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openEditProjectModal(selectedProject)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:text-slate-900 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Edit Detail & Konfigurasi Proyek"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Proyek</span>
            </button>

            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition-colors cursor-pointer"
              title="AI Project Copilot"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            <button
              onClick={() => openCreateIssueModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Issue</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar (10 Tabs as requested) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-100 pt-1 -mx-4 md:-mx-6 px-4 md:px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeProjectTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveProjectTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Display */}
      <div className="flex-1 overflow-hidden relative">
        {renderTabContent()}
      </div>
    </div>
  );
};
