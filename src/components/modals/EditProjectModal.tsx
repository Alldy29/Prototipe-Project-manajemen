import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Project, ProjectType, ProjectStatus, ProjectHealth, ClientVisibilityMode } from '../../types';
import { Settings, Save, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';

export const EditProjectModal: React.FC = () => {
  const {
    isEditProjectOpen,
    setIsEditProjectOpen,
    editingProject,
    updateProject,
    clients
  } = useApp();

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [type, setType] = useState<ProjectType>('fixed_price');
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [health, setHealth] = useState<ProjectHealth>('on_track');
  const [startDate, setStartDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [budgetAmount, setBudgetAmount] = useState<number>(0);
  const [budgetHours, setBudgetHours] = useState<number>(0);
  const [color, setColor] = useState('#6366f1');
  const [clientVisibilityMode, setClientVisibilityMode] = useState<ClientVisibilityMode>('all');
  const [clientShowAssignee, setClientShowAssignee] = useState(true);
  const [clientShowEstimate, setClientShowEstimate] = useState(false);

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name || '');
      setKey(editingProject.key || '');
      setDescription(editingProject.description || '');
      setClientId(editingProject.clientId || clients[0]?.id || '');
      setType(editingProject.type || 'fixed_price');
      setStatus(editingProject.status || 'active');
      setHealth(editingProject.health || 'on_track');
      setStartDate(editingProject.startDate || '');
      setTargetDate(editingProject.targetDate || '');
      setBudgetAmount(editingProject.budgetAmount || 0);
      setBudgetHours(editingProject.budgetHours || 0);
      setColor(editingProject.color || '#6366f1');
      setClientVisibilityMode(editingProject.clientVisibilityMode || 'all');
      setClientShowAssignee(editingProject.clientShowAssignee ?? true);
      setClientShowEstimate(editingProject.clientShowEstimate ?? false);
    }
  }, [editingProject]);

  if (!editingProject) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateProject(editingProject.id, {
      name: name.trim(),
      key: key.toUpperCase().trim(),
      description: description.trim(),
      clientId,
      type,
      status,
      health,
      startDate,
      targetDate,
      budgetAmount: Number(budgetAmount),
      budgetHours: Number(budgetHours),
      color,
      clientVisibilityMode,
      clientShowAssignee,
      clientShowEstimate
    });

    setIsEditProjectOpen(false);
  };

  return (
    <Modal
      isOpen={isEditProjectOpen}
      onClose={() => setIsEditProjectOpen(false)}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full ring-2 ring-slate-300"
            style={{ backgroundColor: color }}
          />
          <span className="text-base font-bold text-slate-900">
            Edit Proyek: {editingProject.name}
          </span>
        </div>
      }
      description="Ubah konfigurasi proyek, klien, target tanggal, batas anggaran, dan preferensi portal transparansi klien."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Key */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Proyek <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Key Prefix
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-xs font-mono font-bold uppercase rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>

        {/* Client & Contract Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Klien Pemilik
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.industry})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Model Kontrak Proyek
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ProjectType)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="fixed_price">Fixed Price (Termin Pembayaran)</option>
              <option value="time_material">Time & Material (Billing per Jam)</option>
              <option value="retainer">Maintenance Retainer (Bulanan)</option>
              <option value="internal">Proyek Internal RnD</option>
            </select>
          </div>
        </div>

        {/* Status & Health */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Status Proyek
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="planning">Planning & Discovery</option>
              <option value="active">Active (Sprint Berjalan)</option>
              <option value="on_hold">On Hold (Ditunda)</option>
              <option value="completed">Completed (Selesai)</option>
              <option value="archived">Archived (Diarsipkan)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kesehatan Proyek (Health Metric)
            </label>
            <select
              value={health}
              onChange={(e) => setHealth(e.target.value as ProjectHealth)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white font-semibold"
            >
              <option value="on_track">🟢 On Track (Sesuai Timeline & Budget)</option>
              <option value="at_risk">🟡 At Risk (Ada Kendala / Risiko Deadline)</option>
              <option value="off_track">🔴 Off Track (Terlambat / Melebihi Batas)</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Deskripsi & Tujuan Proyek
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        {/* Dates & Budget */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Deadline
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Budget (IDR)
            </label>
            <input
              type="number"
              step={10000000}
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Batas Jam Kerja
            </label>
            <input
              type="number"
              value={budgetHours}
              onChange={(e) => setBudgetHours(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white font-mono"
            />
          </div>
        </div>

        {/* Color picker */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Warna Identitas Proyek
          </label>
          <div className="flex items-center gap-2">
            {['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full transition-transform ${
                  color === c ? 'scale-125 ring-2 ring-indigo-600 ring-offset-2' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Client Portal Visibility Settings */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Pengaturan Visibilitas Klien (FR-11 Client Portal)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={clientShowAssignee}
                onChange={(e) => setClientShowAssignee(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              Tampilkan Nama Assignee Developer ke Klien
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={clientShowEstimate}
                onChange={(e) => setClientShowEstimate(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              Tampilkan Estimasi Jam Kerja ke Klien
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setIsEditProjectOpen(false)}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Simpan Perubahan
          </button>
        </div>
      </form>
    </Modal>
  );
};
