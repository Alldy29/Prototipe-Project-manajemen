import React from 'react';
import { useApp } from '../../context/AppContext';
import { PriorityBadge, TypeBadge, StatusBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { Search, Plus, Lock } from 'lucide-react';

export const ListView: React.FC = () => {
  const {
    issues,
    selectedProjectId,
    users,
    openIssueDetail,
    openCreateIssueModal,
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority,
    filterAssignee,
    setFilterAssignee,
    filterType,
    setFilterType
  } = useApp();

  let projectIssues = issues.filter((i) => i.projectId === selectedProjectId);

  // Filter application
  if (searchQuery.trim()) {
    projectIssues = projectIssues.filter(
      (i) =>
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.labels.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
  if (filterPriority !== 'all') {
    projectIssues = projectIssues.filter((i) => i.priority === filterPriority);
  }
  if (filterAssignee !== 'all') {
    projectIssues = projectIssues.filter((i) => i.assigneeId === filterAssignee);
  }
  if (filterType !== 'all') {
    projectIssues = projectIssues.filter((i) => i.type === filterType);
  }

  return (
    <div className="h-full flex flex-col p-4 space-y-3 select-none bg-slate-50 text-slate-900">
      {/* Top Filter Builder Bar */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter cepat berdasarkan judul, kode, atau tag..."
              className="bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none w-full text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none text-xs"
          >
            <option value="all">Semua Prioritas</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none text-xs"
          >
            <option value="all">Semua Tipe</option>
            <option value="story">Story</option>
            <option value="task">Task</option>
            <option value="bug">Bug</option>
            <option value="spike">Spike</option>
          </select>

          {/* Assignee filter */}
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none text-xs"
          >
            <option value="all">Semua Assignee</option>
            {users
              .filter((u) => u.role !== 'client')
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
          </select>

          <button
            onClick={() => openCreateIssueModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Buat Issue
          </button>
        </div>
      </div>

      {/* Issues Table */}
      <div className="flex-1 rounded-xl bg-white border border-slate-200 overflow-y-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold z-10">
            <tr>
              <th className="py-2.5 px-3">Kode</th>
              <th className="py-2.5 px-3">Tipe</th>
              <th className="py-2.5 px-3">Judul Issue</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Prioritas</th>
              <th className="py-2.5 px-3">Assignee</th>
              <th className="py-2.5 px-3 text-center">Points</th>
              <th className="py-2.5 px-3 text-right">Target Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projectIssues.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  Tidak ada issue yang sesuai kriteria pencarian.
                </td>
              </tr>
            ) : (
              projectIssues.map((issue) => {
                const assignee = users.find((u) => u.id === issue.assigneeId);

                return (
                  <tr
                    key={issue.id}
                    onClick={() => openIssueDetail(issue.id)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">
                      {issue.key}
                    </td>
                    <td className="py-2.5 px-3">
                      <TypeBadge type={issue.type} />
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 group-hover:text-indigo-600">
                      <div className="flex items-center gap-2">
                        <span>{issue.title}</span>
                        {issue.internalOnly && (
                          <span title="Internal Only (Hidden from client)">
                            <Lock className="w-3 h-3 text-amber-600 shrink-0" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge statusId={issue.statusId} />
                    </td>
                    <td className="py-2.5 px-3">
                      <PriorityBadge priority={issue.priority} />
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <Avatar name={assignee?.name || 'Unassigned'} avatar={assignee?.avatar} size="xs" />
                        <span className="text-slate-700 truncate max-w-28 font-medium">{assignee?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700">
                      {issue.storyPoints || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-500 font-medium">
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
  );
};
