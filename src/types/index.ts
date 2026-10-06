export type UserRole = 
  | 'owner' 
  | 'admin' 
  | 'pm' 
  | 'developer' 
  | 'qa' 
  | 'designer' 
  | 'finance' 
  | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  roleTitle: string;
  timezone: string;
  skills: string[];
  costRate: number; // in IDR/hr
  billRate: number; // in IDR/hr
  workingHours: number; // hrs/week
}

export type ClientStatus = 'lead' | 'active' | 'churned';

export interface Client {
  id: string;
  name: string;
  code: string;
  logo?: string;
  contactName: string;
  email: string;
  phone: string;
  industry: string;
  status: ClientStatus;
  contractRef: string;
  activeProjectsCount: number;
}

export type ProjectType = 'fixed_price' | 'time_material' | 'retainer' | 'internal';
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
export type ProjectHealth = 'on_track' | 'at_risk' | 'off_track';
export type ClientVisibilityMode = 'all' | 'shared' | 'milestone';

export interface Project {
  id: string;
  key: string;
  name: string;
  description: string;
  clientId: string;
  clientName: string;
  type: ProjectType;
  status: ProjectStatus;
  health: ProjectHealth;
  pmId: string;
  startDate: string;
  targetDate: string;
  budgetHours: number;
  budgetAmount: number; // in IDR
  spentHours: number;
  spentAmount: number; // in IDR
  color: string;
  memberIds: string[];
  clientVisibilityMode: ClientVisibilityMode;
  clientShowAssignee: boolean;
  clientShowEstimate: boolean;
}

export type IssueType = 'epic' | 'story' | 'task' | 'bug' | 'subtask' | 'spike';
export type IssuePriority = 'urgent' | 'high' | 'medium' | 'low' | 'none';
export type IssueStatusId = 
  | 'backlog' 
  | 'ready' 
  | 'in_progress' 
  | 'code_review' 
  | 'qa' 
  | 'uat' 
  | 'done';

export type ClientCategoryStatus = 
  | 'not_started' 
  | 'in_progress' 
  | 'in_qa' 
  | 'waiting_approval' 
  | 'completed' 
  | 'blocked';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Issue {
  id: string;
  key: string;
  projectId: string;
  type: IssueType;
  title: string;
  description: string;
  statusId: IssueStatusId;
  priority: IssuePriority;
  assigneeId?: string;
  reporterId: string;
  reviewerId?: string;
  labels: string[];
  sprintId?: string;
  epicId?: string;
  parentId?: string;
  storyPoints?: number;
  estimateHours?: number;
  actualHours?: number;
  dueDate?: string;
  internalOnly: boolean; // FR-11A: Hidden from client if true
  clientVisible: boolean;
  rank: number;
  checklist: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'active' | 'completed';
  capacityHours: number;
  capacityPoints: number;
  committedPoints: number;
  completedPoints: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'ready_for_review' | 'approved' | 'rejected';
  clientApproval: 'approved' | 'pending' | 'rejected';
  clientFeedback?: string;
  billingAmount?: number;
  deliverables: string[];
  completedDeliverablesCount: number;
}

export interface TimeEntry {
  id: string;
  userId: string;
  userName: string;
  issueId?: string;
  issueKey?: string;
  projectId: string;
  projectName: string;
  date: string;
  hours: number;
  billable: boolean;
  category: 'Development' | 'UI/UX Design' | 'QA & Testing' | 'Project Management' | 'Meeting' | 'DevOps';
  note: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number; // IDR
  amount: number; // IDR
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  items: InvoiceItem[];
  subtotal: number;
  taxPercent: number; // 11% PPN
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  notes?: string;
}

export interface TestCase {
  id: string;
  projectId: string;
  suite: string;
  title: string;
  steps: string[];
  expected: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pass' | 'fail' | 'blocked' | 'untested';
  lastRunDate?: string;
  linkedIssueKey?: string;
}

export interface ProjectDoc {
  id: string;
  projectId: string;
  title: string;
  category: 'PRD' | 'SRS' | 'Architecture' | 'Meeting Notes' | 'Release Notes';
  content: string;
  authorId: string;
  updatedAt: string;
  version: string;
}

export interface Comment {
  id: string;
  issueId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  internalOnly: boolean; // Hidden from client portal if true
  createdAt: string;
  reactions: { emoji: string; count: number; userIds: string[] }[];
}

export interface ActivityLog {
  id: string;
  entityType: 'issue' | 'project' | 'sprint' | 'milestone' | 'invoice';
  entityId: string;
  actorName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'mention' | 'assigned' | 'status_change' | 'approval' | 'system';
  read: boolean;
  createdAt: string;
  issueKey?: string;
}

export type MainNavSection = 
  | 'dashboard' 
  | 'projects' 
  | 'clients' 
  | 'timesheet' 
  | 'finance' 
  | 'my_work' 
  | 'settings';

export type ProjectDetailTab = 
  | 'overview' 
  | 'board' 
  | 'backlog' 
  | 'list' 
  | 'roadmap' 
  | 'qa' 
  | 'docs' 
  | 'timesheet' 
  | 'finance' 
  | 'client_portal' 
  | 'project_settings';

export type ViewType = 
  | 'overview' 
  | 'board' 
  | 'backlog' 
  | 'list' 
  | 'roadmap' 
  | 'client_portal' 
  | 'timesheet' 
  | 'finance' 
  | 'qa' 
  | 'docs' 
  | 'my_work' 
  | 'settings'
  | 'dashboard'
  | 'projects'
  | 'clients';
