import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen } from 'lucide-react';

export const DocsView: React.FC = () => {
  const { docs, selectedProjectId } = useApp();

  const projectDocs = docs.filter((d) => d.projectId === selectedProjectId);
  const [selectedDocId, setSelectedDocId] = useState(projectDocs[0]?.id || '');

  const activeDoc = projectDocs.find((d) => d.id === selectedDocId) || projectDocs[0];

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-slate-50 text-slate-900">
      {/* Sidebar Doc List */}
      <div className="w-full md:w-72 border-r border-slate-200 bg-white p-4 space-y-4 shrink-0 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="font-extrabold text-xs uppercase text-slate-800 tracking-wider">
              Knowledge Base
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono font-semibold">{projectDocs.length} Dokumen</span>
        </div>

        <div className="space-y-1.5 overflow-y-auto flex-1">
          {projectDocs.map((doc) => {
            const isSelected = activeDoc?.id === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all space-y-1 ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600 font-bold">
                    {doc.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">{doc.version}</span>
                </div>
                <div className="font-bold text-slate-900 line-clamp-1">{doc.title}</div>
                <div className="text-[10px] text-slate-500">Updated: {doc.updatedAt}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Doc Preview / Reader */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {activeDoc ? (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="pb-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                  {activeDoc.category}
                </span>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                  {activeDoc.title}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Versi {activeDoc.version} • Terakhir diperbarui pada {activeDoc.updatedAt}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans text-sm">
              {activeDoc.content}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 text-xs">
            Pilih dokumen untuk membaca spesifikasi teknis.
          </div>
        )}
      </div>
    </div>
  );
};
