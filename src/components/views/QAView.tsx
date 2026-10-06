import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, XCircle, Bug } from 'lucide-react';

export const QAView: React.FC = () => {
  const {
    testCases,
    updateTestCaseStatus,
    openCreateIssueModal,
    selectedProjectId,
    openIssueDetail,
    issues
  } = useApp();

  const [filterStatus, setFilterStatus] = useState('all');

  const projectTests = testCases.filter((tc) => tc.projectId === selectedProjectId);
  const filtered = projectTests.filter((tc) => filterStatus === 'all' || tc.status === filterStatus);

  const passCount = projectTests.filter((tc) => tc.status === 'pass').length;
  const failCount = projectTests.filter((tc) => tc.status === 'fail').length;
  const blockedCount = projectTests.filter((tc) => tc.status === 'blocked').length;
  const passRate = projectTests.length > 0 ? Math.round((passCount / projectTests.length) * 100) : 0;

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
            QA & Test Automation Suite
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Manajemen skenario uji (test cases), verifikasi regresi, dan keterkaitan dengan issue bug tiket.
          </p>
        </div>

        <button
          onClick={() => openCreateIssueModal('qa')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Bug className="w-4 h-4" /> Laporkan Bug Baru
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">QA Pass Rate</span>
          <div className="text-2xl font-black text-emerald-600 font-mono">{passRate}%</div>
          <span className="text-[11px] text-slate-500 block">{passCount} skenario lolos</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Failed / Regressions</span>
          <div className="text-2xl font-black text-rose-600 font-mono">{failCount}</div>
          <span className="text-[11px] text-rose-700 block font-medium">Perlu investigasi perbaikan</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Blocked / Pending</span>
          <div className="text-2xl font-black text-amber-600 font-mono">{blockedCount}</div>
          <span className="text-[11px] text-slate-500 block">Tergantung dependensi backend</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Total Test Scenarios</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{projectTests.length}</div>
          <span className="text-[11px] text-slate-500 block">Security & Functional Tests</span>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Filter Status Uji:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
            >
              <option value="all">Semua Hasil</option>
              <option value="pass">Pass (Lolos)</option>
              <option value="fail">Fail (Gagal)</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((tc) => {
            const linkedIssue = issues.find((i) => i.key === tc.linkedIssueKey);

            return (
              <div
                key={tc.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white border border-slate-200 text-slate-700">
                        {tc.suite}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900">{tc.title}</h4>
                    </div>
                    {tc.lastRunDate && (
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Terakhir diuji: {tc.lastRunDate}
                      </span>
                    )}
                  </div>

                  {/* Status Badge & Pass/Fail quick action */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                        tc.status === 'pass'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : tc.status === 'fail'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {tc.status.toUpperCase()}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateTestCaseStatus(tc.id, 'pass')}
                        className="p-1 rounded bg-white hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 border border-slate-200 cursor-pointer"
                        title="Tandai Pass"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateTestCaseStatus(tc.id, 'fail')}
                        className="p-1 rounded bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-700 border border-slate-200 cursor-pointer"
                        title="Tandai Fail"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Steps and expected */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg bg-white border border-slate-200">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Langkah Pengujian:</span>
                    {tc.steps.map((st, sIdx) => (
                      <div key={sIdx} className="text-slate-700 text-[11px] font-medium">{st}</div>
                    ))}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Hasil Yang Diharapkan:</span>
                    <p className="text-slate-700 text-[11px] leading-relaxed font-medium">{tc.expected}</p>
                    {tc.linkedIssueKey && linkedIssue && (
                      <div className="pt-2 flex items-center gap-1.5 text-indigo-600 font-semibold">
                        <Bug className="w-3.5 h-3.5" />
                        <span
                          onClick={() => openIssueDetail(linkedIssue.id)}
                          className="hover:underline cursor-pointer"
                        >
                          Terkait dengan Bug: {tc.linkedIssueKey}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
