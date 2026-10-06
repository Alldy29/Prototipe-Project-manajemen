import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Client,
  Project,
  Issue,
  IssueStatusId,
  Sprint,
  Milestone,
  TimeEntry,
  Invoice,
  TestCase,
  ProjectDoc,
  Comment,
  ActivityLog,
  NotificationItem,
  ViewType,
  MainNavSection,
  ProjectDetailTab
} from '../types';
import {
  SEED_USERS,
  SEED_CLIENTS,
  SEED_PROJECTS,
  SEED_ISSUES,
  SEED_SPRINTS,
  SEED_MILESTONES,
  SEED_TIME_ENTRIES,
  SEED_INVOICES,
  SEED_TEST_CASES,
  SEED_DOCS,
  SEED_COMMENTS,
  SEED_ACTIVITIES,
  SEED_NOTIFICATIONS
} from '../data/seedData';

interface LiveTimerState {
  isRunning: boolean;
  seconds: number;
  issueId?: string;
  issueKey?: string;
  note: string;
}

interface AppContextType {
  // Data
  users: User[];
  clients: Client[];
  projects: Project[];
  issues: Issue[];
  sprints: Sprint[];
  milestones: Milestone[];
  timeEntries: TimeEntry[];
  invoices: Invoice[];
  testCases: TestCase[];
  docs: ProjectDoc[];
  comments: Comment[];
  activities: ActivityLog[];
  notifications: NotificationItem[];

  // Current session & navigation
  currentUser: User;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedProject: Project;

  // Modern Project Hub & Tab Navigation
  mainNavSection: MainNavSection;
  setMainNavSection: (s: MainNavSection) => void;
  isInsideProjectDetail: boolean;
  setIsInsideProjectDetail: (inside: boolean) => void;
  activeProjectTab: ProjectDetailTab;
  setActiveProjectTab: (tab: ProjectDetailTab) => void;
  openProjectDetail: (projectId: string, tab?: ProjectDetailTab) => void;
  exitProjectDetail: () => void;
  isEditProjectOpen: boolean;
  setIsEditProjectOpen: (open: boolean) => void;
  editingProject: Project | null;
  openEditProjectModal: (p: Project) => void;

  // Live Timer
  timer: LiveTimerState;
  startTimer: (issueId?: string, issueKey?: string, note?: string) => void;
  pauseTimer: () => void;
  stopAndLogTimer: (category?: string, billable?: boolean) => void;

  // Search & Filter state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
  filterAssignee: string;
  setFilterAssignee: (assignee: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;

  // Modals & Drawers state
  isCreateIssueOpen: boolean;
  setIsCreateIssueOpen: (open: boolean) => void;
  createIssueDefaultStatus: IssueStatusId;
  openCreateIssueModal: (statusId?: IssueStatusId) => void;

  selectedIssueId: string | null;
  openIssueDetail: (issueId: string) => void;
  closeIssueDetail: () => void;

  isCreateProjectOpen: boolean;
  setIsCreateProjectOpen: (open: boolean) => void;

  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  isTimeTrackerModalOpen: boolean;
  setIsTimeTrackerModalOpen: (open: boolean) => void;

  isInvoiceModalOpen: boolean;
  setIsInvoiceModalOpen: (open: boolean) => void;
  activeInvoiceToPreview: Invoice | null;
  openInvoicePreview: (inv: Invoice) => void;

  isSprintModalOpen: boolean;
  setIsSprintModalOpen: (open: boolean) => void;

  isQABugModalOpen: boolean;
  setIsQABugModalOpen: (open: boolean) => void;

  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;

  isClientApprovalModalOpen: boolean;
  setIsClientApprovalModalOpen: (open: boolean) => void;
  selectedMilestoneForApproval: Milestone | null;
  openMilestoneApproval: (ms: Milestone) => void;

  // Actions
  createIssue: (issue: Partial<Issue>) => Issue;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  deleteIssue: (id: string) => void;
  moveIssueStatus: (issueId: string, targetStatus: IssueStatusId) => void;
  toggleChecklistItem: (issueId: string, itemId: string) => void;
  addChecklistItem: (issueId: string, text: string) => void;

  addComment: (issueId: string, content: string, internalOnly: boolean) => void;
  toggleReaction: (commentId: string, emoji: string) => void;

  createProject: (project: Partial<Project>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;

  createTimeEntry: (entry: Partial<TimeEntry>) => void;
  approveTimeEntry: (entryId: string) => void;

  createInvoice: (invoice: Partial<Invoice>) => Invoice;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;

  approveMilestone: (id: string, feedback: string) => void;
  rejectMilestone: (id: string, feedback: string) => void;

  startSprint: (sprintId: string) => void;
  completeSprint: (sprintId: string, moveToNextSprint: boolean) => void;

  updateTestCaseStatus: (id: string, status: TestCase['status']) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states or fallback to seed
  const [users] = useState<User[]>(SEED_USERS);
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('forgeflow_clients');
    return saved ? JSON.parse(saved) : SEED_CLIENTS;
  });
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('forgeflow_projects');
    return saved ? JSON.parse(saved) : SEED_PROJECTS;
  });
  const [issues, setIssues] = useState<Issue[]>(() => {
    const saved = localStorage.getItem('forgeflow_issues');
    return saved ? JSON.parse(saved) : SEED_ISSUES;
  });
  const [sprints, setSprints] = useState<Sprint[]>(() => {
    const saved = localStorage.getItem('forgeflow_sprints');
    return saved ? JSON.parse(saved) : SEED_SPRINTS;
  });
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('forgeflow_milestones');
    return saved ? JSON.parse(saved) : SEED_MILESTONES;
  });
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
    const saved = localStorage.getItem('forgeflow_time_entries');
    return saved ? JSON.parse(saved) : SEED_TIME_ENTRIES;
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('forgeflow_invoices');
    return saved ? JSON.parse(saved) : SEED_INVOICES;
  });
  const [testCases, setTestCases] = useState<TestCase[]>(() => {
    const saved = localStorage.getItem('forgeflow_test_cases');
    return saved ? JSON.parse(saved) : SEED_TEST_CASES;
  });
  const [docs] = useState<ProjectDoc[]>(SEED_DOCS);
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('forgeflow_comments');
    return saved ? JSON.parse(saved) : SEED_COMMENTS;
  });
  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('forgeflow_activities');
    return saved ? JSON.parse(saved) : SEED_ACTIVITIES;
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(SEED_NOTIFICATIONS);

  // Active Role and User
  const [currentRole, setCurrentRole] = useState<UserRole>('owner');
  const [currentUser, setCurrentUser] = useState<User>(SEED_USERS[0]);

  // Selected Project and View
  const [selectedProjectId, setSelectedProjectId] = useState<string>('prj-1');
  const [currentView, setCurrentView] = useState<ViewType>('board');

  // Modern Hub & Project Tab Architecture
  const [mainNavSection, setMainNavSection] = useState<MainNavSection>('projects');
  const [isInsideProjectDetail, setIsInsideProjectDetail] = useState<boolean>(false);
  const [activeProjectTab, setActiveProjectTab] = useState<ProjectDetailTab>('overview');
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Modals state
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false);
  const [createIssueDefaultStatus, setCreateIssueDefaultStatus] = useState<IssueStatusId>('ready');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTimeTrackerModalOpen, setIsTimeTrackerModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [activeInvoiceToPreview, setActiveInvoiceToPreview] = useState<Invoice | null>(null);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isQABugModalOpen, setIsQABugModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isClientApprovalModalOpen, setIsClientApprovalModalOpen] = useState(false);
  const [selectedMilestoneForApproval, setSelectedMilestoneForApproval] = useState<Milestone | null>(null);

  // Live Timer
  const [timer, setTimer] = useState<LiveTimerState>({
    isRunning: false,
    seconds: 0,
    note: ''
  });

  // Ticker for Live Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer.isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.isRunning]);

  // Persist important data to localStorage
  useEffect(() => {
    localStorage.setItem('forgeflow_issues', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem('forgeflow_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('forgeflow_time_entries', JSON.stringify(timeEntries));
  }, [timeEntries]);

  useEffect(() => {
    localStorage.setItem('forgeflow_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('forgeflow_milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('forgeflow_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('forgeflow_activities', JSON.stringify(activities));
  }, [activities]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input or textarea
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        openCreateIssueModal();
      } else if (e.key === '/') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      } else if (e.key === 'Escape') {
        setIsCreateIssueOpen(false);
        setIsCommandPaletteOpen(false);
        setIsTimeTrackerModalOpen(false);
        setIsInvoiceModalOpen(false);
        setIsSprintModalOpen(false);
        setIsQABugModalOpen(false);
        setIsAIAssistantOpen(false);
        setIsClientApprovalModalOpen(false);
        setSelectedIssueId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Switch role handler
  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    const matchedUser = users.find((u) => u.role === role) || users[0];
    setCurrentUser(matchedUser);

    // If switched to client role, automatically switch to Client Portal view!
    if (role === 'client') {
      setCurrentView('client_portal');
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || SEED_PROJECTS[0];

  // Live Timer controls
  const startTimer = (issueId?: string, issueKey?: string, note?: string) => {
    setTimer({
      isRunning: true,
      seconds: timer.seconds,
      issueId: issueId || timer.issueId,
      issueKey: issueKey || timer.issueKey,
      note: note || timer.note || 'Pekerjaan sprint task'
    });
  };

  const pauseTimer = () => {
    setTimer((prev) => ({ ...prev, isRunning: false }));
  };

  const stopAndLogTimer = (category = 'Development', billable = true) => {
    if (timer.seconds > 10) {
      const hoursLogged = Math.round((timer.seconds / 3600) * 100) / 100 || 0.1;
      const newEntry: TimeEntry = {
        id: `te-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        issueId: timer.issueId,
        issueKey: timer.issueKey,
        projectId: selectedProjectId,
        projectName: selectedProject.name,
        date: new Date().toISOString().split('T')[0],
        hours: hoursLogged,
        billable,
        category: category as any,
        note: timer.note || `Log otomatis live timer (${Math.round(timer.seconds / 60)} menit)`,
        status: 'submitted'
      };

      setTimeEntries((prev) => [newEntry, ...prev]);

      // Add activity
      const newAct: ActivityLog = {
        id: `act-${Date.now()}`,
        entityType: 'issue',
        entityId: timer.issueId || selectedProjectId,
        actorName: currentUser.name,
        action: 'Log Waktu',
        details: `Mencatat ${hoursLogged} jam kerja pada ${timer.issueKey || selectedProject.name}`,
        timestamp: 'Baru saja'
      };
      setActivities((prev) => [newAct, ...prev]);
    }

    setTimer({
      isRunning: false,
      seconds: 0,
      note: ''
    });
  };

  // Issue drawer & modal helpers
  const openCreateIssueModal = (statusId: IssueStatusId = 'ready') => {
    setCreateIssueDefaultStatus(statusId);
    setIsCreateIssueOpen(true);
  };

  const openIssueDetail = (issueId: string) => {
    setSelectedIssueId(issueId);
  };

  const closeIssueDetail = () => {
    setSelectedIssueId(null);
  };

  const openInvoicePreview = (inv: Invoice) => {
    setActiveInvoiceToPreview(inv);
    setIsInvoiceModalOpen(true);
  };

  const openMilestoneApproval = (ms: Milestone) => {
    setSelectedMilestoneForApproval(ms);
    setIsClientApprovalModalOpen(true);
  };

  const openProjectDetail = (projectId: string, tab: ProjectDetailTab = 'overview') => {
    setSelectedProjectId(projectId);
    setActiveProjectTab(tab);
    setIsInsideProjectDetail(true);
    setMainNavSection('projects');
  };

  const exitProjectDetail = () => {
    setIsInsideProjectDetail(false);
    setMainNavSection('projects');
  };

  const openEditProjectModal = (p: Project) => {
    setEditingProject(p);
    setIsEditProjectOpen(true);
  };

  // Issue CRUD Actions
  const createIssue = (issueData: Partial<Issue>): Issue => {
    const proj = projects.find((p) => p.id === (issueData.projectId || selectedProjectId)) || selectedProject;
    const currentMaxNum = issues
      .filter((i) => i.projectId === proj.id)
      .map((i) => parseInt(i.key.split('-')[1] || '0', 10))
      .reduce((max, num) => Math.max(max, num), 100);

    const nextKey = `${proj.key}-${currentMaxNum + 1}`;

    const newIssue: Issue = {
      id: `iss-${Date.now()}`,
      key: nextKey,
      projectId: proj.id,
      type: issueData.type || 'story',
      title: issueData.title || 'Untitled Issue',
      description: issueData.description || '',
      statusId: issueData.statusId || 'ready',
      priority: issueData.priority || 'medium',
      assigneeId: issueData.assigneeId,
      reporterId: currentUser.id,
      labels: issueData.labels || [],
      sprintId: issueData.sprintId,
      storyPoints: issueData.storyPoints || 3,
      estimateHours: issueData.estimateHours || 8,
      actualHours: 0,
      dueDate: issueData.dueDate,
      internalOnly: issueData.internalOnly ?? false,
      clientVisible: issueData.clientVisible ?? true,
      rank: issues.length + 1,
      checklist: issueData.checklist || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setIssues((prev) => [newIssue, ...prev]);

    // Activity log
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      entityType: 'issue',
      entityId: newIssue.id,
      actorName: currentUser.name,
      action: 'Issue Dibuat',
      details: `Membuat ${newIssue.key}: ${newIssue.title}`,
      timestamp: 'Baru saja'
    };
    setActivities((prev) => [newAct, ...prev]);

    return newIssue;
  };

  const updateIssue = (id: string, updates: Partial<Issue>) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === id) {
          return {
            ...iss,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return iss;
      })
    );
  };

  const deleteIssue = (id: string) => {
    setIssues((prev) => prev.filter((i) => i.id !== id));
    if (selectedIssueId === id) {
      setSelectedIssueId(null);
    }
  };

  const moveIssueStatus = (issueId: string, targetStatus: IssueStatusId) => {
    const targetIssue = issues.find((i) => i.id === issueId);
    if (!targetIssue || targetIssue.statusId === targetStatus) return;

    setIssues((prev) =>
      prev.map((iss) => (iss.id === issueId ? { ...iss, statusId: targetStatus, updatedAt: new Date().toISOString() } : iss))
    );

    // Activity
    const act: ActivityLog = {
      id: `act-${Date.now()}`,
      entityType: 'issue',
      entityId: issueId,
      actorName: currentUser.name,
      action: 'Ubah Status',
      details: `${targetIssue.key} dipindahkan ke status ${targetStatus.toUpperCase()}`,
      timestamp: 'Baru saja'
    };
    setActivities((prev) => [act, ...prev]);
  };

  const toggleChecklistItem = (issueId: string, itemId: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          const updatedChecklist = iss.checklist.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          );
          return { ...iss, checklist: updatedChecklist };
        }
        return iss;
      })
    );
  };

  const addChecklistItem = (issueId: string, text: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          const newItem = { id: `chk-${Date.now()}`, text, completed: false };
          return { ...iss, checklist: [...iss.checklist, newItem] };
        }
        return iss;
      })
    );
  };

  const addComment = (issueId: string, content: string, internalOnly: boolean) => {
    const newComment: Comment = {
      id: `cmt-${Date.now()}`,
      issueId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content,
      internalOnly,
      createdAt: new Date().toISOString(),
      reactions: []
    };
    setComments((prev) => [...prev, newComment]);
  };

  const toggleReaction = (commentId: string, emoji: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const existing = c.reactions.find((r) => r.emoji === emoji);
          if (existing) {
            const hasUser = existing.userIds.includes(currentUser.id);
            const newUserIds = hasUser
              ? existing.userIds.filter((uid) => uid !== currentUser.id)
              : [...existing.userIds, currentUser.id];
            const updatedReactions = c.reactions
              .map((r) => (r.emoji === emoji ? { ...r, count: newUserIds.length, userIds: newUserIds } : r))
              .filter((r) => r.count > 0);
            return { ...c, reactions: updatedReactions };
          } else {
            return {
              ...c,
              reactions: [...c.reactions, { emoji, count: 1, userIds: [currentUser.id] }]
            };
          }
        }
        return c;
      })
    );
  };

  const createProject = (projectData: Partial<Project>): Project => {
    const newProj: Project = {
      id: `prj-${Date.now()}`,
      key: projectData.key || 'PRJ',
      name: projectData.name || 'New Project',
      description: projectData.description || '',
      clientId: projectData.clientId || clients[0]?.id || '',
      clientName: clients.find((c) => c.id === projectData.clientId)?.name || 'Client',
      type: projectData.type || 'fixed_price',
      status: projectData.status || 'active',
      health: 'on_track',
      pmId: currentUser.id,
      startDate: projectData.startDate || new Date().toISOString().split('T')[0],
      targetDate: projectData.targetDate || '2026-12-31',
      budgetHours: projectData.budgetHours || 500,
      budgetAmount: projectData.budgetAmount || 450000000,
      spentHours: 0,
      spentAmount: 0,
      color: projectData.color || '#6366f1',
      memberIds: [currentUser.id],
      clientVisibilityMode: 'all',
      clientShowAssignee: true,
      clientShowEstimate: false
    };

    setProjects((prev) => [newProj, ...prev]);
    setSelectedProjectId(newProj.id);
    return newProj;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const createTimeEntry = (entry: Partial<TimeEntry>) => {
    const newEntry: TimeEntry = {
      id: `te-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      issueId: entry.issueId,
      issueKey: entry.issueKey,
      projectId: selectedProjectId,
      projectName: selectedProject.name,
      date: entry.date || new Date().toISOString().split('T')[0],
      hours: entry.hours || 1,
      billable: entry.billable ?? true,
      category: entry.category || 'Development',
      note: entry.note || '',
      status: 'submitted'
    };
    setTimeEntries((prev) => [newEntry, ...prev]);
  };

  const approveTimeEntry = (entryId: string) => {
    setTimeEntries((prev) =>
      prev.map((te) => (te.id === entryId ? { ...te, status: 'approved' } : te))
    );
  };

  const createInvoice = (inv: Partial<Invoice>): Invoice => {
    const subtotal = (inv.items || []).reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * (inv.taxPercent || 11)) / 100;
    const totalAmount = subtotal + taxAmount - (inv.discountAmount || 0);

    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      number: `INV-2026-10-${String(invoices.length + 1).padStart(3, '0')}`,
      clientId: inv.clientId || selectedProject.clientId,
      clientName: inv.clientName || selectedProject.clientName,
      projectId: inv.projectId || selectedProject.id,
      projectName: inv.projectName || selectedProject.name,
      items: inv.items || [],
      subtotal,
      taxPercent: inv.taxPercent || 11,
      taxAmount,
      discountAmount: inv.discountAmount || 0,
      totalAmount,
      status: inv.status || 'draft',
      issueDate: inv.issueDate || new Date().toISOString().split('T')[0],
      dueDate: inv.dueDate || '2026-10-31',
      notes: inv.notes
    };

    setInvoices((prev) => [newInv, ...prev]);
    return newInv;
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
  };

  const approveMilestone = (id: string, feedback: string) => {
    setMilestones((prev) =>
      prev.map((ms) =>
        ms.id === id
          ? {
              ...ms,
              status: 'approved',
              clientApproval: 'approved',
              clientFeedback: feedback
            }
          : ms
      )
    );
    // Add activity
    const act: ActivityLog = {
      id: `act-${Date.now()}`,
      entityType: 'milestone',
      entityId: id,
      actorName: currentUser.name,
      action: 'Milestone Disetujui (UAT)',
      details: feedback || 'Milestone telah disetujui untuk penagihan termin',
      timestamp: 'Baru saja'
    };
    setActivities((prev) => [act, ...prev]);
  };

  const rejectMilestone = (id: string, feedback: string) => {
    setMilestones((prev) =>
      prev.map((ms) =>
        ms.id === id
          ? {
              ...ms,
              status: 'rejected',
              clientApproval: 'rejected',
              clientFeedback: feedback
            }
          : ms
      )
    );
  };

  const startSprint = (sprintId: string) => {
    setSprints((prev) =>
      prev.map((sp) => (sp.id === sprintId ? { ...sp, status: 'active' } : sp))
    );
  };

  const completeSprint = (sprintId: string, moveToNextSprint: boolean) => {
    setSprints((prev) =>
      prev.map((sp) => (sp.id === sprintId ? { ...sp, status: 'completed' } : sp))
    );

    // If moving incomplete issues to next sprint / backlog:
    const nextSprint = sprints.find((s) => s.projectId === selectedProjectId && s.status === 'planned');
    if (moveToNextSprint && nextSprint) {
      setIssues((prev) =>
        prev.map((iss) => {
          if (iss.sprintId === sprintId && iss.statusId !== 'done') {
            return { ...iss, sprintId: nextSprint.id };
          }
          return iss;
        })
      );
    }
  };

  const updateTestCaseStatus = (id: string, status: TestCase['status']) => {
    setTestCases((prev) =>
      prev.map((tc) =>
        tc.id === id ? { ...tc, status, lastRunDate: new Date().toISOString().split('T')[0] } : tc
      )
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        users,
        clients,
        projects,
        issues,
        sprints,
        milestones,
        timeEntries,
        invoices,
        testCases,
        docs,
        comments,
        activities,
        notifications,

        currentUser,
        currentRole,
        switchRole,
        selectedProjectId,
        setSelectedProjectId,
        currentView,
        setCurrentView,
        selectedProject,

        mainNavSection,
        setMainNavSection,
        isInsideProjectDetail,
        setIsInsideProjectDetail,
        activeProjectTab,
        setActiveProjectTab,
        openProjectDetail,
        exitProjectDetail,
        isEditProjectOpen,
        setIsEditProjectOpen,
        editingProject,
        openEditProjectModal,

        timer,
        startTimer,
        pauseTimer,
        stopAndLogTimer,

        searchQuery,
        setSearchQuery,
        filterPriority,
        setFilterPriority,
        filterAssignee,
        setFilterAssignee,
        filterType,
        setFilterType,

        isCreateIssueOpen,
        setIsCreateIssueOpen,
        createIssueDefaultStatus,
        openCreateIssueModal,

        selectedIssueId,
        openIssueDetail,
        closeIssueDetail,

        isCreateProjectOpen,
        setIsCreateProjectOpen,

        isCommandPaletteOpen,
        setIsCommandPaletteOpen,

        isTimeTrackerModalOpen,
        setIsTimeTrackerModalOpen,

        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        activeInvoiceToPreview,
        openInvoicePreview,

        isSprintModalOpen,
        setIsSprintModalOpen,

        isQABugModalOpen,
        setIsQABugModalOpen,

        isAIAssistantOpen,
        setIsAIAssistantOpen,

        isClientApprovalModalOpen,
        setIsClientApprovalModalOpen,
        selectedMilestoneForApproval,
        openMilestoneApproval,

        createIssue,
        updateIssue,
        deleteIssue,
        moveIssueStatus,
        toggleChecklistItem,
        addChecklistItem,

        addComment,
        toggleReaction,

        createProject,
        updateProject,

        createTimeEntry,
        approveTimeEntry,

        createInvoice,
        updateInvoiceStatus,

        approveMilestone,
        rejectMilestone,

        startSprint,
        completeSprint,

        updateTestCaseStatus,

        markNotificationRead,
        markAllNotificationsRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
