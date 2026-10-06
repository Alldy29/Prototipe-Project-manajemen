import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, ShieldCheck, History, Check, X } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { activities } = useApp();
  const [activeTab, setActiveTab] = useState<'rbac' | 'audit'>('rbac');

  const permissionsList = [
    { feature: 'Kelola Organisasi & Sistem Billing', owner: true, admin: true, pm: false, dev: false, qa: false, designer: false, finance: false, client: false },
    { feature: 'Buat & Arsipkan Proyek', owner: true, admin: true, pm: true, dev: false, qa: false, designer: false, finance: false, client: false },
    { feature: 'CRUD Issues & Sprints', owner: true, admin: true, pm: true, dev: true, qa: true, designer: true, finance: false, client: false },
    { feature: 'Pencatatan Jam Waktu (Timesheet)', owner: true, admin: true, pm: true, dev: true, qa: true, designer: true, finance: false, client: false },
    { feature: 'Approve Timesheet Karyawan', owner: true, admin: true, pm: true, dev: false, qa: false, designer: false, finance: true, client: false },
    { feature: 'Akses Tarif Rate Card & Margin Keuntungan', owner: true, admin: true, pm: true, dev: false, qa: false, designer: false, finance: true, client: false },
    { feature: 'Penerbitan Faktur / Invoice Klien', owner: true, admin: true, pm: false, dev: false, qa: false, designer: false, finance: true, client: false },
    { feature: 'Client Portal (FR-11 & FR-11A Transparansi)', owner: true, admin: true, pm: true, dev: false, qa: false, designer: false, finance: false, client: true },
    { feature: 'Persetujuan Deliverable UAT (Signoff)', owner: true, admin: true, pm: true, dev: false, qa: false, designer: false, finance: false, client: true },
    { feature: 'Audit Log & Activity History', owner: true, admin: true, pm: false, dev: false, qa: false, designer: false, finance: false, client: false }
  ];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50 text-slate-900">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          Pengaturan Organisasi & RBAC Matrix
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Matriks hak akses peran granular dan rekam jejak audit trail (Akses Penuh Super Admin).
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('rbac')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'rbac' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Matriks Role & Permission</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'audit' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Log Sistem ({activities.length})</span>
        </button>
      </div>

      {/* TAB 1: RBAC Table */}
      {activeTab === 'rbac' && (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold bg-slate-50/60">
                <th className="py-3 px-3">Fitur & Kewenangan</th>
                <th className="py-3 px-2 text-center text-indigo-700">Super Admin</th>
                <th className="py-3 px-2 text-center">Admin</th>
                <th className="py-3 px-2 text-center">PM</th>
                <th className="py-3 px-2 text-center">Dev</th>
                <th className="py-3 px-2 text-center">QA</th>
                <th className="py-3 px-2 text-center">Designer</th>
                <th className="py-3 px-2 text-center">Finance</th>
                <th className="py-3 px-2 text-center">Klien</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsList.map((perm, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800">{perm.feature}</td>
                  <td className="py-3 px-2 text-center bg-indigo-50/40">{perm.owner ? <Check className="w-4 h-4 text-indigo-600 font-bold mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                  <td className="py-3 px-2 text-center">{perm.admin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                  <td className="py-3 px-2 text-center">{perm.pm ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                  <td className="py-3 px-2 text-center">{perm.dev ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                  <td className="py-3 px-2 text-center">{perm.qa ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                  <td className="py-3 px-2 text-center">{perm.designer ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                  <td className="py-3 px-2 text-center">{perm.finance ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                  <td className="py-3 px-2 text-center">{perm.client ? <Check className="w-4 h-4 text-amber-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3 shadow-xs">
          <div className="text-xs text-slate-500">
            Audit trail mencatat setiap perubahan status, modifikasi dokumen, dan aksi approval untuk kepatuhan tata kelola IT perbankan.
          </div>

          <div className="space-y-2">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{act.actorName}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                      {act.action}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{act.details}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 font-medium">{act.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
