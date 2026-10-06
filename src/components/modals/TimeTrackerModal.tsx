import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Play, Pause, Square, Clock } from 'lucide-react';

export const TimeTrackerModal: React.FC = () => {
  const {
    isTimeTrackerModalOpen,
    setIsTimeTrackerModalOpen,
    timer,
    startTimer,
    pauseTimer,
    stopAndLogTimer,
    issues,
    selectedProjectId,
    createTimeEntry
  } = useApp();

  const [manualIssueId, setManualIssueId] = useState('');
  const [manualHours, setManualHours] = useState<number>(2);
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualCategory, setManualCategory] = useState<'Development' | 'UI/UX Design' | 'QA & Testing' | 'Project Management' | 'Meeting' | 'DevOps'>('Development');
  const [manualBillable, setManualBillable] = useState(true);
  const [manualNote, setManualNote] = useState('');

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetIssue = issues.find((i) => i.id === manualIssueId);

    createTimeEntry({
      issueId: manualIssueId || undefined,
      issueKey: targetIssue?.key,
      projectId: selectedProjectId,
      date: manualDate,
      hours: Number(manualHours),
      billable: manualBillable,
      category: manualCategory,
      note: manualNote || (targetIssue ? `Pengerjaan ${targetIssue.key}` : 'General engineering task')
    });

    setManualNote('');
    setIsTimeTrackerModalOpen(false);
  };

  return (
    <Modal
      isOpen={isTimeTrackerModalOpen}
      onClose={() => setIsTimeTrackerModalOpen(false)}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <span className="text-base font-bold text-slate-900">Time Tracking & Timesheet</span>
        </div>
      }
      description="Gunakan stopwatch real-time saat bekerja atau catat jam kerja manual harian."
    >
      <div className="space-y-6">
        {/* Stopwatch widget */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Live Stopwatch Timer
          </div>
          <div className="font-mono text-3xl font-black text-emerald-700 tracking-widest">
            {formatTimer(timer.seconds)}
          </div>
          {timer.issueKey && (
            <div className="text-xs text-slate-700 font-mono font-semibold">
              Issue Aktif: <span className="text-indigo-700 font-bold">{timer.issueKey}</span>
            </div>
          )}
          <div className="flex items-center justify-center gap-3 pt-1">
            {timer.isRunning ? (
              <button
                type="button"
                onClick={pauseTimer}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Pause className="w-4 h-4" /> Jeda Timer
              </button>
            ) : (
              <button
                type="button"
                onClick={() => startTimer(undefined, undefined, 'Aktivitas Sprint')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" /> Mulai Stopwatch
              </button>
            )}

            {(timer.isRunning || timer.seconds > 0) && (
              <button
                type="button"
                onClick={() => {
                  stopAndLogTimer();
                  setIsTimeTrackerModalOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Square className="w-4 h-4" /> Stop & Catat Log
              </button>
            )}
          </div>
        </div>

        {/* Manual time entry section */}
        <form onSubmit={handleManualSubmit} className="space-y-3.5 border-t border-slate-100 pt-4">
          <div className="text-xs font-extrabold text-slate-900">Input Manual Jam Kerja</div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Pilih Issue Task
            </label>
            <select
              value={manualIssueId}
              onChange={(e) => setManualIssueId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="">General Project Time (Tanpa spesifik task)</option>
              {issues
                .filter((i) => i.projectId === selectedProjectId)
                .map((iss) => (
                  <option key={iss.id} value={iss.id}>
                    {iss.key}: {iss.title}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jumlah Jam
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                value={manualHours}
                onChange={(e) => setManualHours(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-mono font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kategori Aktivitas
              </label>
              <select
                value={manualCategory}
                onChange={(e) => setManualCategory(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="Development">Development (Coding)</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="QA & Testing">QA & Testing</option>
                <option value="Project Management">Project Management</option>
                <option value="Meeting">Meeting Klien / Internal</option>
                <option value="DevOps">DevOps & Cloud</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tipe Billing
              </label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="billableCheck"
                  checked={manualBillable}
                  onChange={(e) => setManualBillable(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 bg-white border-slate-300"
                />
                <label htmlFor="billableCheck" className="text-xs text-slate-700 cursor-pointer font-medium">
                  Tagihkan ke Klien (Billable)
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan Pekerjaan
            </label>
            <input
              type="text"
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
              placeholder="e.g. Debugging query latency dan setup Redis cache..."
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsTimeTrackerModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs cursor-pointer"
            >
              Simpan Timesheet
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
