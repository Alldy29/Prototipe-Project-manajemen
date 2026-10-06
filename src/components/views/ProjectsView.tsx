import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStatus, ProjectHealth, ProjectType } from '../../types';
import { Avatar } from '../common/Avatar';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  Edit3,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  AlertTriangle,
  Users,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    clients,
    issues,
    openProjectDetail,
    openEditProjectModal,
    setIsCreateProjectOpen,
    users
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.key.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesClient = clientFilter === 'all' || p.clientId === clientFilter;
    const matchesType = typeFilter === 'all' || p.type === typeFilter;

    return matchesSearch && matchesStatus && matchesClient && matchesType;
  });

  // Calculate project progress based on issues
  const getProjectStats = (projectId: string) => {
    const projIssues = issues.filter((i) => i.projectId === projectId);
    const total = projIssues.length;
    const done = projIssues.filter((i) => i.statusId === 'done').length;
    const inProgress = projIssues.filter((i) => ['in_progress', 'code_review', 'qa', 'uat'].includes(i.statusId)).length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, inProgress, percent };
  };

  // High level agency metrics
  const totalContractValue = projects.reduce((sum, p) => sum + (p.budgetAmount || 0), 0);
  const onTrackCount = projects.filter((p) => p.health === 'on_track').length;
  const activeCount = projects.filter((p) => p.status === 'active').length;

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50 text-slate-900">
      {/* Header with Title & Create button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <FolderKanban className="w-4 h-4" />
            Portofolio Software House
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Proyek
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola seluruh proyek digital agency, konfigurasi sprint, alokasi anggaran, dan akses tab workspace tim.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateProjectOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Proyek Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Proyek</span>
            <FolderKanban className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {projects.length}
          </div>
          <span className="text-[11px] text-indigo-700 font-semibold block">
            {activeCount} proyek sprint aktif
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Kesehatan On-Track</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            {onTrackCount} / {projects.length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            {Math.round((onTrackCount / (projects.length || 1)) * 100)}% delivery lancar
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Nilai Kontrak</span>
            <DollarSign className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono truncate">
            Rp {(totalContractValue / 1000000).toLocaleString('id-ID')} Jt
          </div>
          <span className="text-[11px] text-slate-500 block">
            Portofolio gabungan agensi
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Klien Korporat</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {clients.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            100% Retensi Klien Aktif
          </span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari proyek, key, klien, deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50 hover:bg-white focus:bg-white transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Semua Status</option>
            <option value="active">Active</option>
            <option value="planning">Planning</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>

          {/* Client filter */}
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Semua Klien</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Contract type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Semua Model Kontrak</option>
            <option value="fixed_price">Fixed Price</option>
            <option value="time_material">Time & Material</option>
            <option value="retainer">Retainer</option>
            <option value="internal">Internal</option>
          </select>

          {/* View toggle (Grid / Table) */}
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-100 p-0.5 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Grid Card"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Tabel"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <FolderKanban className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Tidak ada proyek yang sesuai</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Silakan ubah kata kunci pencarian atau reset filter untuk menampilkan proyek software house lainnya.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
              setClientFilter('all');
              setTypeFilter('all');
            }}
            className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-colors"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const stats = getProjectStats(project.id);
            const budgetPercent = project.budgetAmount > 0
              ? Math.min(100, Math.round(((project.spentAmount || 0) / project.budgetAmount) * 100))
              : 0;

            return (
              <div
                key={project.id}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-600/5 transition-all duration-200 flex flex-col justify-between overflow-hidden"
              >
                {/* Project Header Bar */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-4 h-4 rounded-full shrink-0 ring-2 ring-slate-200"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {project.key}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          project.health === 'on_track'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : project.health === 'at_risk'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {project.health === 'on_track' ? '● On Track' : project.health === 'at_risk' ? '● At Risk' : '● Off Track'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditProjectModal(project);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Edit Pengaturan Proyek"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Project Title & Client */}
                  <div>
                    <h3
                      onClick={() => openProjectDetail(project.id, 'overview')}
                      className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                    >
                      {project.name}
                    </h3>
                    <p className="text-xs text-indigo-700 font-semibold mt-0.5 truncate">
                      Klien: {project.clientName}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {project.description || 'Proyek software house dengan metodologi agile sprint dan integrasi portal klien.'}
                    </p>
                  </div>

                  {/* Badges (Type & Status) */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                      {project.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize">
                      Status: {project.status}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono ml-auto">
                      Target: {project.targetDate}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Progres Penyelesaian Issue</span>
                      <span className="font-mono font-bold text-slate-900">{stats.percent}% ({stats.done}/{stats.total})</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300 bg-linear-to-r from-indigo-500 to-indigo-600"
                        style={{ width: `${stats.percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Budget & Hours mini stats */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Penggunaan Anggaran</div>
                      <div className="font-mono font-bold text-slate-900 truncate">
                        Rp {((project.spentAmount || 0) / 1000000).toLocaleString('id-ID')}Jt / {(project.budgetAmount / 1000000).toLocaleString('id-ID')}Jt
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{budgetPercent}% terpakai</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Jam Kerja Terpakai</div>
                      <div className="font-mono font-bold text-slate-900">
                        {project.spentHours || 0} / {project.budgetHours || 0} Jam
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium">
                        {(project.budgetHours || 0) - (project.spentHours || 0)} jam tersisa
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer with Workspace CTA */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex -space-x-1.5 items-center">
                    {project.memberIds?.slice(0, 4).map((uid) => {
                      const user = users.find((u) => u.id === uid);
                      return user ? (
                        <Avatar key={uid} name={user.name} avatar={user.avatar} size="xs" />
                      ) : null;
                    })}
                    {(project.memberIds?.length || 0) > 4 && (
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center">
                        +{project.memberIds.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditProjectModal(project)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openProjectDetail(project.id, 'overview')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Buka Workspace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && filteredProjects.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Proyek & Key</th>
                  <th className="py-3 px-4">Klien</th>
                  <th className="py-3 px-4">Model Kontrak</th>
                  <th className="py-3 px-4">Kesehatan</th>
                  <th className="py-3 px-4">Progres Issue</th>
                  <th className="py-3 px-4">Anggaran (IDR)</th>
                  <th className="py-3 px-4">Jam Kerja</th>
                  <th className="py-3 px-4">Target Deadline</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((project) => {
                  const stats = getProjectStats(project.id);
                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-indigo-50/40 transition-colors group cursor-pointer"
                      onClick={() => openProjectDetail(project.id, 'overview')}
                    >
                      <td className="py-3 px-4 font-medium">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: project.color }}
                          />
                          <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                            {project.key}
                          </span>
                          <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {project.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {project.clientName}
                      </td>
                      <td className="py-3 px-4 capitalize text-slate-600">
                        {project.type.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            project.health === 'on_track'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : project.health === 'at_risk'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {project.health === 'on_track' ? 'On Track' : project.health === 'at_risk' ? 'At Risk' : 'Off Track'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-indigo-600 h-full rounded-full"
                              style={{ width: `${stats.percent}%` }}
                            />
                          </div>
                          <span className="font-mono text-slate-700 font-bold">{stats.percent}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        Rp {((project.budgetAmount || 0) / 1000000).toLocaleString('id-ID')}Jt
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {project.spentHours || 0} / {project.budgetHours || 0} jam
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {project.targetDate}
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditProjectModal(project)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title="Edit Proyek"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openProjectDetail(project.id, 'overview')}
                            className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-[11px]"
                          >
                            Buka
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
