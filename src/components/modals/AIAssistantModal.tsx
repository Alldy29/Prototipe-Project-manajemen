import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { generateIssuesFromText, generateSprintSummary } from '../../services/geminiService';
import { Sparkles, Check, Plus, Loader2 } from 'lucide-react';
import { IssueType, IssuePriority } from '../../types';

export const AIAssistantModal: React.FC = () => {
  const {
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    selectedProjectId,
    createIssue,
    sprints,
    issues
  } = useApp();

  const [activeTab, setActiveTab] = useState<'generate' | 'summary' | 'release'>('generate');
  const [inputText, setInputText] = useState(
    'Klien ingin sistem pembayaran QRIS diperbarui agar mendukung dynamic QR dengan timeout 3 menit. Jika timeout tercapai, sistem harus membatalkan transaksi di core banking dan mengirimkan notifikasi push ke aplikasi nasabah. Selain itu perlu dibuat unit test dan security audit token HMAC.'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [generatedStories, setGeneratedStories] = useState<any[]>([]);
  const [summaryOutput, setSummaryOutput] = useState<string>('');
  const [importedIndices, setImportedIndices] = useState<number[]>([]);

  if (!isAIAssistantOpen) return null;

  const handleGenerateIssues = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setImportedIndices([]);
    try {
      const results = await generateIssuesFromText(inputText.trim());
      setGeneratedStories(results);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSprintSummary = async () => {
    setIsLoading(true);
    const activeSprint = sprints.find((s) => s.projectId === selectedProjectId && s.status === 'active');
    const sprintIssues = issues.filter((i) => i.sprintId === activeSprint?.id);
    const doneCount = sprintIssues.filter((i) => i.statusId === 'done').length;
    const pendingCount = sprintIssues.length - doneCount;

    try {
      const text = await generateSprintSummary(
        activeSprint?.name || 'Sprint 4',
        doneCount,
        pendingCount,
        21
      );
      setSummaryOutput(text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportIssue = (story: any, index: number) => {
    createIssue({
      projectId: selectedProjectId,
      type: story.type as IssueType,
      title: story.title,
      description: `${story.description}\n\n*Dibuat otomatis oleh Gemini AI Copilot*`,
      priority: story.priority as IssuePriority,
      storyPoints: story.storyPoints,
      estimateHours: story.estimateHours,
      checklist: (story.checklist || []).map((text: string, i: number) => ({
        id: `chk-ai-${Date.now()}-${i}`,
        text,
        completed: false
      }))
    });

    setImportedIndices((prev) => [...prev, index]);
  };

  const handleImportAll = () => {
    generatedStories.forEach((story, idx) => {
      if (!importedIndices.includes(idx)) {
        handleImportIssue(story, idx);
      }
    });
  };

  return (
    <Modal
      isOpen={isAIAssistantOpen}
      onClose={() => setIsAIAssistantOpen(false)}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-indigo-50 text-indigo-600 border border-indigo-200">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-base font-bold text-slate-900">
            ForgeFlow Gemini AI Copilot
          </span>
          <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
            Gemini 2.5 Flash
          </span>
        </div>
      }
      description="Gunakan kecerdasan buatan untuk mengubah notulen/spesifikasi menjadi backlog terstruktur, meringkas sprint, dan membuat draft rilis."
    >
      <div className="space-y-4">
        {/* Feature selector tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'generate'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Pecah Teks Jadi User Stories
          </button>
          <button
            onClick={() => {
              setActiveTab('summary');
              if (!summaryOutput) handleGenerateSprintSummary();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Ringkasan Eksekutif Sprint
          </button>
        </div>

        {/* TAB 1: Generate issues from text */}
        {activeTab === 'generate' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Tempel Notulen Rapat Klien / Spesifikasi Fitur:
              </label>
              <textarea
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Tempel catatan meeting atau deskripsi fitur di sini..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 resize-none font-sans"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                AI akan memecah teks menjadi Stories, Tasks, Spikes lengkap dengan Acceptance Criteria & estimasi poin.
              </span>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGenerateIssues}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold shadow-xs transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Backlog Items</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated results cards */}
            {generatedStories.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">
                    Hasil Generasi AI ({generatedStories.length} Items)
                  </span>
                  <button
                    onClick={handleImportAll}
                    className="flex items-center gap-1.5 text-xs text-indigo-700 hover:text-indigo-900 font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Semua ke Backlog
                  </button>
                </div>

                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {generatedStories.map((story, idx) => {
                    const isImported = importedIndices.includes(idx);
                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                          isImported
                            ? 'bg-emerald-50/50 border-emerald-300 opacity-90'
                            : 'bg-white border-slate-200 hover:border-indigo-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {story.type}
                            </span>
                            <span className="font-bold text-slate-900">{story.title}</span>
                          </div>
                          <span className="font-mono text-[11px] font-bold text-amber-700 shrink-0">
                            {story.storyPoints} pts ({story.estimateHours}h)
                          </span>
                        </div>

                        <p className="text-slate-600 text-[11px] leading-relaxed">{story.description}</p>

                        {story.checklist && story.checklist.length > 0 && (
                          <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg text-[10px] text-slate-600 border border-slate-200">
                            <span className="font-bold text-slate-800 block mb-0.5">Acceptance Criteria:</span>
                            {story.checklist.map((chk: string, cIdx: number) => (
                              <div key={cIdx} className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                <span>{chk}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-end pt-1">
                          {isImported ? (
                            <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                              <Check className="w-3.5 h-3.5" /> Ditambahkan ke Backlog
                            </span>
                          ) : (
                            <button
                              onClick={() => handleImportIssue(story, idx)}
                              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow-2xs cursor-pointer"
                            >
                              <Plus className="w-3 h-3" /> Tambah ke Backlog
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Sprint Summary */}
        {activeTab === 'summary' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-indigo-700 font-semibold">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sedang merangkum pencapaian sprint...</span>
                </div>
              ) : (
                <div className="text-slate-800 whitespace-pre-wrap leading-relaxed text-xs">
                  {summaryOutput}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleGenerateSprintSummary}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold cursor-pointer"
              >
                Regenerate Ringkasan
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
