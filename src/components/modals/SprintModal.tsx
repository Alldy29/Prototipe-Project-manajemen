import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SprintModal: React.FC = () => {
  const {
    isSprintModalOpen,
    setIsSprintModalOpen,
    sprints,
    issues,
    selectedProjectId,
    completeSprint
  } = useApp();

  const activeSprint = sprints.find((s) => s.projectId === selectedProjectId && s.status === 'active');
  const plannedSprint = sprints.find((s) => s.projectId === selectedProjectId && s.status === 'planned');

  const [moveToNextSprint, setMoveToNextSprint] = useState(true);

  if (!isSprintModalOpen) return null;

  const currentSprintIssues = issues.filter((i) => i.sprintId === activeSprint?.id);
  const doneIssues = currentSprintIssues.filter((i) => i.statusId === 'done');
  const incompleteIssues = currentSprintIssues.filter((i) => i.statusId !== 'done');

  const completedPoints = doneIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);
  const totalPoints = currentSprintIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);

  const handleCompleteSprint = () => {
    if (!activeSprint) return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    completeSprint(activeSprint.id, moveToNextSprint);
    setIsSprintModalOpen(false);
  };

  return (
    <Modal
      isOpen={isSprintModalOpen}
      onClose={() => setIsSprintModalOpen(false)}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-base font-bold text-slate-900">
            Selesaikan {activeSprint?.name || 'Sprint'}
          </span>
        </div>
      }
      description="Menutup siklus sprint dan memindahkan sisa task yang belum rampung."
    >
      <div className="space-y-4">
        {/* Sprint Summary Metrics */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block mb-0.5">Issue Selesai (Done)</span>
            <span className="text-2xl font-black text-emerald-600">
              {doneIssues.length} <span className="text-xs text-slate-400 font-normal">/ {currentSprintIssues.length}</span>
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 font-semibold block mb-0.5">Velocity Story Points</span>
            <span className="text-2xl font-black text-indigo-700">
              {completedPoints} <span className="text-xs text-slate-400 font-normal">/ {totalPoints} pts</span>
            </span>
          </div>
        </div>

        {/* Warning if incomplete issues exist */}
        {incompleteIssues.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Terdapat {incompleteIssues.length} task yang belum selesai:</span>
            </div>

            <div className="space-y-1.5 pl-6 font-medium text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="migrationTarget"
                  checked={moveToNextSprint}
                  onChange={() => setMoveToNextSprint(true)}
                  className="text-indigo-600 bg-white border-slate-300"
                />
                <span>Pindahkan ke Sprint Berikutnya ({plannedSprint?.name || 'Sprint 5'})</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="migrationTarget"
                  checked={!moveToNextSprint}
                  onChange={() => setMoveToNextSprint(false)}
                  className="text-indigo-600 bg-white border-slate-300"
                />
                <span>Kembalikan ke Backlog Proyek</span>
              </label>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsSprintModalOpen(false)}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleCompleteSprint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Konfirmasi & Selesaikan Sprint
          </button>
        </div>
      </div>
    </Modal>
  );
};
