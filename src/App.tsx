/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';

// Views
import { ProjectsView } from './components/views/ProjectsView';
import { ProjectDetailView } from './components/views/ProjectDetailView';
import { ClientsView } from './components/views/ClientsView';
import { MyWorkView } from './components/views/MyWorkView';
import { TimeTrackingView } from './components/views/TimeTrackingView';
import { FinanceView } from './components/views/FinanceView';
import { SettingsView } from './components/views/SettingsView';

// Modals & Drawers
import { CreateIssueModal } from './components/modals/CreateIssueModal';
import { IssueDetailDrawer } from './components/modals/IssueDetailDrawer';
import { CreateProjectModal } from './components/modals/CreateProjectModal';
import { EditProjectModal } from './components/modals/EditProjectModal';
import { CommandPaletteModal } from './components/modals/CommandPaletteModal';
import { TimeTrackerModal } from './components/modals/TimeTrackerModal';
import { InvoiceModal } from './components/modals/InvoiceModal';
import { SprintModal } from './components/modals/SprintModal';
import { ClientApprovalModal } from './components/modals/ClientApprovalModal';
import { AIAssistantModal } from './components/modals/AIAssistantModal';

const MainLayout: React.FC = () => {
  const { mainNavSection, isInsideProjectDetail } = useApp();

  const renderCurrentView = () => {
    switch (mainNavSection) {
      case 'dashboard':
      case 'my_work':
        return <MyWorkView />;
      case 'projects':
        return isInsideProjectDetail ? <ProjectDetailView /> : <ProjectsView />;
      case 'clients':
        return <ClientsView />;
      case 'timesheet':
        return <TimeTrackingView />;
      case 'finance':
        return <FinanceView />;
      case 'settings':
        return <SettingsView />;
      default:
        return isInsideProjectDetail ? <ProjectDetailView /> : <ProjectsView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Main App Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-hidden bg-slate-50">
            {renderCurrentView()}
          </main>
        </div>
      </div>

      {/* Popups, Modals & Slide-out Drawers */}
      <CreateIssueModal />
      <IssueDetailDrawer />
      <CreateProjectModal />
      <EditProjectModal />
      <CommandPaletteModal />
      <TimeTrackerModal />
      <InvoiceModal />
      <SprintModal />
      <ClientApprovalModal />
      <AIAssistantModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
