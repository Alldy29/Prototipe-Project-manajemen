import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { CheckCircle2, XCircle, FileCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ClientApprovalModal: React.FC = () => {
  const {
    isClientApprovalModalOpen,
    setIsClientApprovalModalOpen,
    selectedMilestoneForApproval,
    approveMilestone,
    rejectMilestone
  } = useApp();

  const [feedback, setFeedback] = useState('');

  if (!selectedMilestoneForApproval) return null;

  const ms = selectedMilestoneForApproval;

  const handleApprove = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
    approveMilestone(ms.id, feedback || 'Deliverable disetujui tanpa catatan revisi.');
    setIsClientApprovalModalOpen(false);
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      alert('Mohon masukkan catatan revisi yang diperlukan.');
      return;
    }
    rejectMilestone(ms.id, feedback.trim());
    setIsClientApprovalModalOpen(false);
  };

  return (
    <Modal
      isOpen={isClientApprovalModalOpen}
      onClose={() => setIsClientApprovalModalOpen(false)}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-amber-600" />
          <span className="text-base font-bold text-slate-900">
            Persetujuan UAT Deliverable — {ms.name}
          </span>
        </div>
      }
      description="Evaluasi hasil kerja deliverable milestone sebelum penagihan invoice termin diterbitkan."
    >
      <div className="space-y-4 text-xs">
        {/* Deliverables checklist */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
            Daftar Dokumen & Artifact Yang Diserahkan:
          </span>
          <div className="space-y-1.5 pl-1">
            {ms.deliverables.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback / Signoff note */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Catatan Persetujuan / Permintaan Revisi:
          </label>
          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tuliskan catatan verifikasi hasil pengujian atau detail revisi bila ada..."
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 resize-none font-sans"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReject}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold transition-colors cursor-pointer"
          >
            <XCircle className="w-4 h-4 text-rose-600" />
            Minta Revisi Tim
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsClientApprovalModalOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Setujui Deliverable (Signoff)
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
