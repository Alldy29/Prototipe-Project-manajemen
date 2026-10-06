import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, CheckCircle2, Plus } from 'lucide-react';
import { Avatar } from '../common/Avatar';

export const TimeTrackingView: React.FC = () => {
  const {
    timeEntries,
    approveTimeEntry,
    setIsTimeTrackerModalOpen,
    users
  } = useApp();

  const [filterUser, setFilterUser] = useState('all');

  const filteredEntries = timeEntries.filter((te) => {
    return filterUser === 'all' || te.userId === filterUser;
  });

  const totalHours = filteredEntries.reduce((sum, te) => sum + te.hours, 0);
  const billableHours = filteredEntries.filter((te) => te.billable).reduce((sum, te) => sum + te.hours, 0);
  const billablePercent = totalHours > 0 ? Math.round((billableHours / totalHours) * 100) : 0;

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Timesheet & Alokasi Jam Kerja
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Log jam kerja harian tim engineering, verifikasi billable vs internal, dan approval persetujuan Super Admin.
          </p>
        </div>

        <button
          onClick={() => setIsTimeTrackerModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Catat Jam Kerja
        </button>
      </div>

      {/* Metric summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Total Jam Tercatat (Minggu Ini)</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalHours} Jam</div>
          <span className="text-[11px] text-slate-500 block">Dari seluruh aktivitas tim</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Billable Ratio Klien</span>
          <div className="text-2xl font-black text-emerald-600 font-mono">{billablePercent}%</div>
          <span className="text-[11px] text-emerald-700 block font-semibold">
            {billableHours} jam dapat ditagihkan ke invoice
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Aktivitas Internal / Non-Billable</span>
          <div className="text-2xl font-black text-slate-700 font-mono">
            {Math.round((totalHours - billableHours) * 10) / 10} Jam
          </div>
          <span className="text-[11px] text-slate-500 block">Meeting internal & refactoring</span>
        </div>
      </div>

      {/* Filter and entries table */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Filter Anggota Tim:</span>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
            >
              <option value="all">Semua Tim</option>
              {users
                .filter((u) => u.role !== 'client')
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.roleTitle})
                  </option>
                ))}
            </select>
          </div>

          <span className="text-xs text-slate-500">
            Menampilkan <strong className="text-slate-800">{filteredEntries.length}</strong> entri timesheet
          </span>
        </div>

        {/* Timesheet Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold bg-slate-50/60">
                <th className="py-2.5 px-3">Tanggal</th>
                <th className="py-2.5 px-3">Anggota Tim</th>
                <th className="py-2.5 px-3">Proyek & Task</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3 text-center">Durasi (Jam)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Aksi Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.map((te) => {
                const user = users.find((u) => u.id === te.userId);
                const isApproved = te.status === 'approved';

                return (
                  <tr key={te.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-500 font-medium">{te.date}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={te.userName} avatar={user?.avatar} size="xs" />
                        <span className="font-bold text-slate-800">{te.userName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{te.projectName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        {te.issueKey && (
                          <span className="font-mono text-indigo-700 font-bold bg-indigo-50 px-1 py-0.2 rounded border border-indigo-100">{te.issueKey}</span>
                        )}
                        <span>{te.note}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                        {te.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                      {te.hours}h {te.billable && <span className="text-[10px] text-emerald-600 font-semibold">($)</span>}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-300'
                      }`}>
                        {te.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {!isApproved ? (
                        <button
                          onClick={() => approveTimeEntry(te.id)}
                          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-xs cursor-pointer"
                        >
                          Approve
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[11px] flex items-center justify-end gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
