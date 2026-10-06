import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClientCategoryStatus, Issue, Milestone, IssueStatusId } from '../../types';
import { ClientStatusBadge, PriorityBadge, TypeBadge } from '../common/Badge';
import { 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  Receipt, 
  Plus, 
  Search, 
  ExternalLink,
  Columns,
  List
} from 'lucide-react';

export const ClientPortalView: React.FC = () => {
  const {
    selectedProject,
    issues,
    milestones,
    invoices,
    openMilestoneApproval,
    openIssueDetail,
    openInvoicePreview,
    openCreateIssueModal
  } = useApp();

  const [portalTab, setPortalTab] = useState<'overview' | 'tasks' | 'board' | 'invoices'>('overview');
  const [taskFilterCategory, setTaskFilterCategory] = useState<string>('all');
  const [taskSearch, setTaskSearch] = useState('');

  // Mapping internal statuses to client category statuses (PRD FR-11A)
  const mapToClientStatus = (statusId: IssueStatusId): ClientCategoryStatus => {
    switch (statusId) {
      case 'backlog':
      case 'ready':
        return 'not_started';
      case 'in_progress':
      case 'code_review':
        return 'in_progress';
      case 'qa':
        return 'in_qa';
      case 'uat':
        return 'waiting_approval';
      case 'done':
        return 'completed';
      default:
        return 'not_started';
    }
  };

  // FR-11A: Filter out ALL internal-only issues from the client view
  const clientVisibleIssues = issues
    .filter((i) => i.projectId === selectedProject.id)
    .filter((i) => !i.internalOnly && i.clientVisible);

  const projectMilestones = milestones.filter((m) => m.projectId === selectedProject.id);
  const projectInvoices = invoices.filter((inv) => inv.projectId === selectedProject.id);

  // Stats calculation
  const totalTasks = clientVisibleIssues.length;
  const completedTasks = clientVisibleIssues.filter((i) => i.statusId === 'done').length;
  const inProgressTasks = clientVisibleIssues.filter((i) => ['in_progress', 'code_review'].includes(i.statusId)).length;
  const inQATasks = clientVisibleIssues.filter((i) => i.statusId === 'qa').length;
  const waitingApprovalTasks = clientVisibleIssues.filter((i) => i.statusId === 'uat').length;

  const projectPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filtered tasks for list view
  const filteredIssues = clientVisibleIssues.filter((i) => {
    const clientStatus = mapToClientStatus(i.statusId);
    const matchesCategory = taskFilterCategory === 'all' || clientStatus === taskFilterCategory;
    const matchesSearch =
      i.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      i.key.toLowerCase().includes(taskSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50 text-slate-900">
      {/* Client Portal Header & Branding */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-amber-50/80 via-white to-indigo-50/70 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700 font-black text-xl shadow-xs">
            BM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300">
                CLIENT PORTAL RESMI
              </span>
              <span className="text-xs text-slate-600">
                Mode: <strong className="text-slate-900">Semua Task (FR-11A Transparansi)</strong>
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
              PT Bank Mandiri Digital — {selectedProject.name}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Mitra Pelaksana: <span className="text-indigo-600 font-bold">ForgeFlow Digital Agency</span> • Target Go-Live: {selectedProject.targetDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openCreateIssueModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Kirim Permintaan / Bug</span>
          </button>
        </div>
      </div>

      {/* Progress Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block mb-1">Total Progres</span>
          <div className="text-2xl font-black text-slate-900">{projectPercent}%</div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${projectPercent}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block mb-1">Sedang Dikerjakan</span>
          <div className="text-2xl font-black text-blue-600">{inProgressTasks}</div>
          <span className="text-[10px] text-slate-500">Dalam sprint engineering</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block mb-1">Sedang Diuji (QA)</span>
          <div className="text-2xl font-black text-purple-600">{inQATasks}</div>
          <span className="text-[10px] text-slate-500">Verifikasi kualitas & keamanan</span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300 shadow-xs">
          <span className="text-[11px] font-bold text-amber-800 block mb-1">Menunggu Anda</span>
          <div className="text-2xl font-black text-amber-700">{waitingApprovalTasks}</div>
          <span className="text-[10px] text-amber-800 font-medium">UAT review dibutuhkan</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block mb-1">Task Selesai</span>
          <div className="text-2xl font-black text-emerald-600">{completedTasks}</div>
          <span className="text-[10px] text-slate-500">Dari total {totalTasks} task</span>
        </div>
      </div>

      {/* Portal Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setPortalTab('overview')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            portalTab === 'overview'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Milestone Deliverable (UAT)</span>
        </button>

        <button
          onClick={() => setPortalTab('tasks')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            portalTab === 'tasks'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <List className="w-4 h-4" />
          <span>Daftar Seluruh Task ({clientVisibleIssues.length})</span>
        </button>

        <button
          onClick={() => setPortalTab('board')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            portalTab === 'board'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Columns className="w-4 h-4" />
          <span>Board Read-Only</span>
        </button>

        <button
          onClick={() => setPortalTab('invoices')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            portalTab === 'invoices'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Tagihan & Invoices ({projectInvoices.length})</span>
        </button>
      </div>

      {/* TAB 1: Overview & Milestones Approval */}
      {portalTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Tahapan Milestone & Persetujuan UAT</h3>
              <p className="text-xs text-slate-600">
                Silakan lakukan peninjauan deliverable untuk memberikan persetujuan (signoff) termin pembayaran.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projectMilestones.map((ms) => {
              const isApproved = ms.clientApproval === 'approved';
              const isPending = ms.clientApproval === 'pending';

              return (
                <div
                  key={ms.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isApproved
                      ? 'bg-white border-emerald-300 shadow-xs'
                      : isPending
                      ? 'bg-amber-50/40 border-amber-300 shadow-xs ring-1 ring-amber-300/40'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        Target: {ms.dueDate}
                      </span>
                      {isApproved ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" /> Disetujui
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-700 animate-pulse">
                          <AlertTriangle className="w-4 h-4" /> Siap Direview
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm">{ms.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{ms.description}</p>

                    {/* Deliverables checklist */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Deliverables:</span>
                      {ms.deliverables.map((d, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-[11px] text-slate-700 font-medium">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isApproved ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>

                    {ms.clientFeedback && (
                      <div className="p-2.5 rounded-lg bg-slate-100 text-[11px] text-slate-700 italic border border-slate-200">
                        "{ms.clientFeedback}"
                      </div>
                    )}
                  </div>

                  {/* Action button */}
                  <div className="pt-4 mt-3 border-t border-slate-200 flex justify-end">
                    <button
                      onClick={() => openMilestoneApproval(ms)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isApproved
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs'
                      }`}
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>{isApproved ? 'Lihat Lembar Signoff' : 'Review & Setujui Deliverable'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Task List (FR-11A: Full Read-Only Transparency) */}
      {portalTab === 'tasks' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                placeholder="Cari task berdasarkan judul atau kode (e.g. MBN-101)..."
                className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Filter Kategori:</span>
              <select
                value={taskFilterCategory}
                onChange={(e) => setTaskFilterCategory(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
              >
                <option value="all">Semua Status ({clientVisibleIssues.length})</option>
                <option value="not_started">Belum Dimulai</option>
                <option value="in_progress">Sedang Dikerjakan</option>
                <option value="in_qa">Sedang Diuji (QA)</option>
                <option value="waiting_approval">Menunggu Persetujuan Anda</option>
                <option value="completed">Selesai</option>
              </select>
            </div>
          </div>

          {/* Read-Only Table */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] bg-slate-50/80 font-bold">
                  <th className="py-3 px-4">Kode Task</th>
                  <th className="py-3 px-4">Judul Pekerjaan</th>
                  <th className="py-3 px-4">Tipe</th>
                  <th className="py-3 px-4">Status Progres Klien</th>
                  <th className="py-3 px-4">Prioritas</th>
                  <th className="py-3 px-4 text-right">Target Selesai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Tidak ada task yang cocok dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((issue) => {
                    const clientStatus = mapToClientStatus(issue.statusId);
                    return (
                      <tr
                        key={issue.id}
                        onClick={() => openIssueDetail(issue.id)}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                          {issue.key}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {issue.title}
                        </td>
                        <td className="py-3 px-4">
                          <TypeBadge type={issue.type} />
                        </td>
                        <td className="py-3 px-4">
                          <ClientStatusBadge status={clientStatus} />
                        </td>
                        <td className="py-3 px-4">
                          <PriorityBadge priority={issue.priority} />
                        </td>
                        <td className="py-3 px-4 text-right text-slate-500 font-mono font-medium">
                          {issue.dueDate || '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Board Read-Only */}
      {portalTab === 'board' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>
              Tampilan papan interaktif read-only. Status diperbarui real-time saat tim engineering menyelesaikan tugas.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 overflow-x-auto pb-4">
            {[
              { id: 'not_started', title: 'Belum Dimulai', color: 'border-slate-300' },
              { id: 'in_progress', title: 'Sedang Dikerjakan', color: 'border-blue-400' },
              { id: 'in_qa', title: 'Sedang Diuji (QA)', color: 'border-purple-400' },
              { id: 'waiting_approval', title: 'Menunggu Persetujuan', color: 'border-amber-400' },
              { id: 'completed', title: 'Selesai', color: 'border-emerald-400' }
            ].map((col) => {
              const colIssues = clientVisibleIssues.filter(
                (i) => mapToClientStatus(i.statusId) === col.id
              );

              return (
                <div
                  key={col.id}
                  className="rounded-xl bg-slate-100/70 border border-slate-200 flex flex-col p-3 space-y-3 min-h-80"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-xs text-slate-800">{col.title}</span>
                    <span className="font-mono text-xs font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.2 rounded shadow-2xs">
                      {colIssues.length}
                    </span>
                  </div>

                  <div className="space-y-2 overflow-y-auto flex-1">
                    {colIssues.map((issue) => (
                      <div
                        key={issue.id}
                        onClick={() => openIssueDetail(issue.id)}
                        className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer text-xs space-y-2 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-indigo-700">{issue.key}</span>
                          <PriorityBadge priority={issue.priority} showText={false} />
                        </div>
                        <h5 className="font-bold text-slate-800 leading-snug line-clamp-2">
                          {issue.title}
                        </h5>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                          <TypeBadge type={issue.type} showText={false} />
                          <span>Target: {issue.dueDate || 'Sprint 4'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Invoices & Billing */}
      {portalTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Faktur & Tagihan Termin Proyek</h3>
              <p className="text-xs text-slate-600">
                Riwayat pembayaran termin milestone proyek resmi Bank Mandiri.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectInvoices.map((inv) => (
              <div
                key={inv.id}
                onClick={() => openInvoicePreview(inv)}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-indigo-600" />
                    <span className="font-mono font-bold text-sm text-slate-900">{inv.number}</span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      inv.status === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {inv.status === 'paid' ? 'LUNAS' : 'MENUNGGU PEMBAYARAN'}
                  </span>
                </div>

                <div>
                  <div className="text-xs text-slate-500">Total Tagihan Termasuk PPN (11%):</div>
                  <div className="text-2xl font-black font-mono text-slate-900 mt-0.5">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0
                    }).format(inv.totalAmount)}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Jatuh Tempo: {inv.dueDate}</span>
                  <span className="text-indigo-600 font-bold flex items-center gap-1">
                    Buka Faktur & PDF <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
