import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Drawer } from '../common/Drawer';
import { PriorityBadge, TypeBadge, StatusBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { IssueStatusId, IssuePriority } from '../../types';
import {
  CheckSquare,
  MessageSquare,
  Clock,
  GitBranch,
  History,
  Play,
  Pause,
  Trash2,
  Lock,
  Eye,
  CheckCircle2,
  Smile,
  Send,
  GitPullRequest
} from 'lucide-react';

export const IssueDetailDrawer: React.FC = () => {
  const {
    selectedIssueId,
    closeIssueDetail,
    issues,
    updateIssue,
    deleteIssue,
    users,
    projects,
    sprints,
    currentUser,
    timer,
    startTimer,
    pauseTimer,
    timeEntries,
    comments,
    addComment,
    toggleReaction,
    toggleChecklistItem,
    addChecklistItem,
    activities
  } = useApp();

  const [activeTab, setActiveTab] = useState<'checklist' | 'comments' | 'time' | 'git' | 'activity'>('checklist');
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentInternalOnly, setCommentInternalOnly] = useState(false);

  if (!selectedIssueId) return null;

  const issue = issues.find((i) => i.id === selectedIssueId);
  if (!issue) return null;

  const project = projects.find((p) => p.id === issue.projectId);
  const assignee = users.find((u) => u.id === issue.assigneeId);
  const reporter = users.find((u) => u.id === issue.reporterId);
  const sprint = sprints.find((s) => s.id === issue.sprintId);

  // Super Admin can see all comments
  const issueComments = comments.filter((c) => c.issueId === issue.id);
  const issueTimeEntries = timeEntries.filter((te) => te.issueId === issue.id || te.issueKey === issue.key);
  const issueActivities = activities.filter((a) => a.entityId === issue.id);

  const completedChecklistCount = issue.checklist.filter((c) => c.completed).length;
  const checklistPercent = issue.checklist.length > 0 ? Math.round((completedChecklistCount / issue.checklist.length) * 100) : 0;

  const isTimerActiveOnThis = timer.isRunning && timer.issueId === issue.id;

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    addChecklistItem(issue.id, newChecklistText.trim());
    setNewChecklistText('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(issue.id, newCommentText.trim(), commentInternalOnly);
    setNewCommentText('');
  };

  return (
    <Drawer
      isOpen={Boolean(selectedIssueId)}
      onClose={closeIssueDetail}
      width="3xl"
      title={
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono font-bold text-sm text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
            {issue.key}
          </span>
          <TypeBadge type={issue.type} />
          <PriorityBadge priority={issue.priority} />
          {issue.internalOnly && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Lock className="w-3 h-3 text-amber-600" /> Internal Only
            </span>
          )}
        </div>
      }
      subtitle={
        <span className="text-slate-500 text-xs">
          {project?.name} • Dibuat oleh {reporter?.name || 'Admin'}
        </span>
      }
      actions={
        <div className="flex items-center gap-2">
          {isTimerActiveOnThis ? (
            <button
              onClick={pauseTimer}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" /> Jeda Timer
            </button>
          ) : (
            <button
              onClick={() => startTimer(issue.id, issue.key, `Mengerjakan ${issue.key}: ${issue.title}`)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Mulai Timer
            </button>
          )}
          <button
            onClick={() => {
              if (confirm(`Yakin hapus issue ${issue.key}?`)) {
                deleteIssue(issue.id);
              }
            }}
            className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Hapus Issue"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      }
    >
      {/* Title & Description section */}
      <div className="space-y-3">
        <input
          type="text"
          value={issue.title}
          onChange={(e) => updateIssue(issue.id, { title: e.target.value })}
          className="w-full bg-transparent text-lg font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition-colors px-1 py-0.5"
        />

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Deskripsi Kebutuhan
          </label>
          <textarea
            rows={3}
            value={issue.description}
            onChange={(e) => updateIssue(issue.id, { description: e.target.value })}
            className="w-full bg-transparent text-xs text-slate-800 focus:outline-none resize-none placeholder:text-slate-400 font-sans"
            placeholder="Tambahkan detail deskripsi..."
          />
        </div>
      </div>

      {/* Meta Properties Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs">
        {/* Status */}
        <div>
          <span className="text-[11px] text-slate-500 block mb-1 font-semibold">Status</span>
          <select
            value={issue.statusId}
            onChange={(e) => updateIssue(issue.id, { statusId: e.target.value as IssueStatusId })}
            className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 w-full focus:outline-none focus:border-indigo-500"
          >
            <option value="backlog">Backlog</option>
            <option value="ready">Ready</option>
            <option value="in_progress">In Progress</option>
            <option value="code_review">Code Review</option>
            <option value="qa">QA Testing</option>
            <option value="uat">UAT (Klien)</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <span className="text-[11px] text-slate-500 block mb-1 font-semibold">Prioritas</span>
          <select
            value={issue.priority}
            onChange={(e) => updateIssue(issue.id, { priority: e.target.value as IssuePriority })}
            className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 w-full focus:outline-none focus:border-indigo-500"
          >
            <option value="urgent">🚨 Urgent</option>
            <option value="high">▲ High</option>
            <option value="medium">━ Medium</option>
            <option value="low">▼ Low</option>
          </select>
        </div>

        {/* Assignee */}
        <div>
          <span className="text-[11px] text-slate-500 block mb-1 font-semibold">Penanggung Jawab</span>
          <select
            value={issue.assigneeId || ''}
            onChange={(e) => updateIssue(issue.id, { assigneeId: e.target.value || undefined })}
            className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 w-full focus:outline-none focus:border-indigo-500 truncate"
          >
            <option value="">Unassigned</option>
            {users
              .filter((u) => u.role !== 'client')
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
          </select>
        </div>

        {/* Sprint / Story Points */}
        <div>
          <span className="text-[11px] text-slate-500 block mb-1 font-semibold">Sprint & Points</span>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 text-xs font-mono font-bold shadow-2xs">
              {issue.storyPoints || 0} pts
            </span>
            <span className="text-slate-600 text-[11px] truncate">{sprint?.name.split(':')[0] || 'Backlog'}</span>
          </div>
        </div>
      </div>

      {/* FR-11A: Task Client Visibility Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          {issue.internalOnly ? (
            <Lock className="w-4 h-4 text-amber-600" />
          ) : (
            <Eye className="w-4 h-4 text-emerald-600" />
          )}
          <div>
            <span className="font-bold text-slate-800">
              {issue.internalOnly ? 'Internal Only (Rahasia Agensi)' : 'Terlihat oleh Klien di Portal (Transparansi)'}
            </span>
            <p className="text-[11px] text-slate-500">
              {issue.internalOnly
                ? 'Task ini disembunyikan dari dashboard klien Mandiri.'
                : 'Klien dapat memantau status pengerjaan task ini secara transparan.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => updateIssue(issue.id, { internalOnly: !issue.internalOnly, clientVisible: issue.internalOnly })}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            issue.internalOnly
              ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
          }`}
        >
          {issue.internalOnly ? 'Jadikan Publik Klien' : 'Set Jadi Internal Only'}
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-slate-200 flex items-center gap-1 pt-2">
        {[
          { id: 'checklist', label: `Acceptance Criteria (${completedChecklistCount}/${issue.checklist.length})`, icon: CheckSquare },
          { id: 'comments', label: `Komentar (${issueComments.length})`, icon: MessageSquare },
          { id: 'time', label: `Log Waktu (${issueTimeEntries.length})`, icon: Clock },
          { id: 'git', label: 'Git & DevTools', icon: GitBranch },
          { id: 'activity', label: 'Audit Trail', icon: History }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-indigo-600 text-indigo-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Checklist */}
      {activeTab === 'checklist' && (
        <div className="space-y-4 pt-2">
          {issue.checklist.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Progress Kriteria Penerimaan</span>
                <span className="font-bold text-slate-800">{checklistPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${checklistPercent}%` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            {issue.checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(issue.id, item.id)}
                className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                  item.completed
                    ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleChecklistItem(issue.id, item.id)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 bg-white border-slate-300"
                />
                <span className="text-xs flex-1 font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddChecklist} className="flex gap-2">
            <input
              type="text"
              value={newChecklistText}
              onChange={(e) => setNewChecklistText(e.target.value)}
              placeholder="+ Tambah kriteria penerimaan..."
              className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Tambah
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: Comments */}
      {activeTab === 'comments' && (
        <div className="space-y-4 pt-2">
          <div className="space-y-3">
            {issueComments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Belum ada diskusi pada issue ini.</p>
            ) : (
              issueComments.map((cmt) => (
                <div
                  key={cmt.id}
                  className={`p-3 rounded-xl border text-xs space-y-2 ${
                    cmt.internalOnly
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar name={cmt.authorName} avatar={cmt.authorAvatar} size="xs" />
                      <span className="font-bold text-slate-900">{cmt.authorName}</span>
                      {cmt.internalOnly && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Internal Team Only
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(cmt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{cmt.content}</p>

                  <div className="flex items-center gap-1.5 pt-1">
                    {cmt.reactions.map((r) => (
                      <button
                        key={r.emoji}
                        onClick={() => toggleReaction(cmt.id, r.emoji)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border transition-colors cursor-pointer ${
                          r.userIds.includes(currentUser.id)
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>{r.emoji}</span>
                        <span>{r.count}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => toggleReaction(cmt.id, '👍')}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs cursor-pointer"
                      title="Tambah reaksi 👍"
                    >
                      <Smile className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddComment} className="space-y-2 pt-2">
            <textarea
              rows={2}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Tulis balasan atau instruksi teknis..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 resize-none font-sans"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={commentInternalOnly}
                  onChange={(e) => setCommentInternalOnly(e.target.checked)}
                  className="rounded bg-white border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800">
                  <Lock className="w-3 h-3 text-amber-600" /> Sembunyikan dari Klien (Internal Catatan)
                </span>
              </label>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Send className="w-3 h-3" /> Kirim
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Time Log */}
      {activeTab === 'time' && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900">Total Waktu Terpakai</span>
              <p className="text-[11px] text-slate-500">
                Estimasi: {issue.estimateHours || 0} Jam • Aktual:{' '}
                {issueTimeEntries.reduce((acc, curr) => acc + curr.hours, 0)} Jam
              </p>
            </div>
            <button
              onClick={() => startTimer(issue.id, issue.key, `Mengerjakan ${issue.key}: ${issue.title}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Start Timer
            </button>
          </div>

          <div className="space-y-2">
            {issueTimeEntries.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Belum ada jam kerja yang dicatat.</p>
            ) : (
              issueTimeEntries.map((te) => (
                <div key={te.id} className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{te.userName}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                        {te.category}
                      </span>
                      {te.billable && (
                        <span className="text-[10px] text-emerald-700 font-mono font-bold">Billable</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{te.note || '-'}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900">{te.hours} Jam</span>
                    <span className="text-[10px] text-slate-400 block">{te.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Git & Branch Mock */}
      {activeTab === 'git' && (
        <div className="space-y-4 pt-2">
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 font-mono text-xs space-y-2 text-slate-100">
            <span className="text-slate-400 text-[11px] block">Git Branch Helper</span>
            <div className="p-2 bg-slate-950 rounded-lg text-emerald-400 flex items-center justify-between">
              <code>git checkout -b feature/{issue.key.toLowerCase()}-{issue.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 24)}</code>
              <button
                onClick={() => navigator.clipboard.writeText(`git checkout -b feature/${issue.key.toLowerCase()}`)}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 hover:text-white cursor-pointer"
              >
                Salin
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Linked Pull Requests & Commits</span>
            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
              <div className="flex items-center gap-2.5">
                <GitPullRequest className="w-4 h-4 text-purple-600" />
                <div>
                  <span className="font-bold text-slate-800">
                    PR #42: feat({issue.key}): Core implementation & tests
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                    <span>GitHub Actions CI: Passed</span>
                    <span>•</span>
                    <span className="text-purple-700 font-bold">Merged into main</span>
                  </div>
                </div>
              </div>
              <span className="font-mono text-[11px] text-slate-500 font-semibold">commit #7a9c81f</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Activity Log */}
      {activeTab === 'activity' && (
        <div className="space-y-3 pt-2">
          {issueActivities.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Belum ada riwayat perubahan.</p>
          ) : (
            issueActivities.map((act) => (
              <div key={act.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{act.actorName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{act.timestamp}</span>
                </div>
                <p className="text-[11px] text-indigo-700 font-semibold mt-0.5">{act.details}</p>
              </div>
            ))
          )}
        </div>
      )}
    </Drawer>
  );
};
