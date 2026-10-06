import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { IssueType, IssuePriority, IssueStatusId } from '../../types';
import { 
  Bookmark, 
  CheckSquare, 
  Bug, 
  Zap, 
  EyeOff
} from 'lucide-react';

export const CreateIssueModal: React.FC = () => {
  const {
    isCreateIssueOpen,
    setIsCreateIssueOpen,
    createIssueDefaultStatus,
    projects,
    selectedProjectId,
    users,
    sprints,
    createIssue
  } = useApp();

  const [projectId, setProjectId] = useState(selectedProjectId);
  const [type, setType] = useState<IssueType>('story');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusId, setStatusId] = useState<IssueStatusId>(createIssueDefaultStatus);
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [sprintId, setSprintId] = useState<string>('');
  const [storyPoints, setStoryPoints] = useState<number>(3);
  const [estimateHours, setEstimateHours] = useState<number>(8);
  const [dueDate, setDueDate] = useState<string>('');
  const [labelsInput, setLabelsInput] = useState<string>('Frontend, Core');
  const [internalOnly, setInternalOnly] = useState<boolean>(false);

  const availableSprints = sprints.filter((s) => s.projectId === projectId);
  const devUsers = users.filter((u) => u.role !== 'client');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const labels = labelsInput
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean);

    createIssue({
      projectId,
      type,
      title: title.trim(),
      description: description.trim(),
      statusId,
      priority,
      assigneeId: assigneeId || undefined,
      sprintId: sprintId || undefined,
      storyPoints: Number(storyPoints) || 3,
      estimateHours: Number(estimateHours) || 8,
      dueDate: dueDate || undefined,
      labels,
      internalOnly,
      clientVisible: !internalOnly,
      checklist: [
        { id: `chk-${Date.now()}-1`, text: 'Implementasi fungsionalitas utama', completed: false },
        { id: `chk-${Date.now()}-2`, text: 'Testing & code review', completed: false }
      ]
    });

    // Reset and close
    setTitle('');
    setDescription('');
    setIsCreateIssueOpen(false);
  };

  return (
    <Modal
      isOpen={isCreateIssueOpen}
      onClose={() => setIsCreateIssueOpen(false)}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-slate-900">
            Buat Issue Baru (Super Admin)
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-200">
            {projects.find((p) => p.id === projectId)?.key || 'PRJ'}
          </span>
        </div>
      }
      description="Gunakan shortcut C untuk membuka formulir ini kapan saja."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project & Issue Type Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Proyek
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.key} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tipe Issue
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'story', label: 'Story', icon: Bookmark, color: 'text-emerald-600' },
                { id: 'task', label: 'Task', icon: CheckSquare, color: 'text-sky-600' },
                { id: 'bug', label: 'Bug', icon: Bug, color: 'text-rose-600' },
                { id: 'spike', label: 'Spike', icon: Zap, color: 'text-amber-600' },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = type === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setType(t.id as IssueType)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${t.color}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Judul Issue <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Implementasi verifikasi biometrik dengan Secure Enclave"
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Deskripsi & Kriteria Penerimaan
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tuliskan detail latar belakang, acceptance criteria, atau langkah reproduksi bug..."
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 resize-none font-sans"
          />
        </div>

        {/* Status, Priority & Assignee Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Status Awal
            </label>
            <select
              value={statusId}
              onChange={(e) => setStatusId(e.target.value as IssueStatusId)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="backlog">Backlog</option>
              <option value="ready">Ready for Dev</option>
              <option value="in_progress">In Progress</option>
              <option value="code_review">Code Review</option>
              <option value="qa">QA Testing</option>
              <option value="uat">UAT (Klien)</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Prioritas
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as IssuePriority)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="urgent">🚨 Urgent (Critical)</option>
              <option value="high">▲ High</option>
              <option value="medium">━ Medium</option>
              <option value="low">▼ Low</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Belum Ditugaskan --</option>
              {devUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.roleTitle})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sprint, Story Points & Estimate Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Sprint / Cycle
            </label>
            <select
              value={sprintId}
              onChange={(e) => setSprintId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Backlog (Tanpa Sprint)</option>
              {availableSprints.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Story Points</span>
              <span className="text-[10px] text-slate-400 font-normal">Fibonacci</span>
            </label>
            <input
              type="number"
              min={1}
              max={21}
              value={storyPoints}
              onChange={(e) => setStoryPoints(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Estimasi (Jam)
            </label>
            <input
              type="number"
              min={1}
              max={200}
              value={estimateHours}
              onChange={(e) => setEstimateHours(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono font-semibold"
            />
          </div>
        </div>

        {/* Labels & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Labels (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={labelsInput}
              onChange={(e) => setLabelsInput(e.target.value)}
              placeholder="e.g. Auth, Mobile, Security"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Target Selesai (Due Date)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
            />
          </div>
        </div>

        {/* FR-11A: Internal Only Toggle */}
        <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <EyeOff className={`w-4 h-4 ${internalOnly ? 'text-amber-700' : 'text-slate-400'}`} />
            <div>
              <span className="text-xs font-bold text-slate-800">
                Tandai sebagai Task Internal Saja (Internal Only)
              </span>
              <p className="text-[11px] text-slate-600 leading-tight">
                Sesuai PRD FR-11A: Task ini disembunyikan dari Client Portal (contoh: refactoring internal, tech debt).
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={internalOnly}
            onChange={(e) => setInternalOnly(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 bg-white"
          />
        </div>

        {/* Footer actions */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsCreateIssueOpen(false)}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
          >
            Simpan & Buat Issue
          </button>
        </div>
      </form>
    </Modal>
  );
};
