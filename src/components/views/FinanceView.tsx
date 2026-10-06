import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Receipt, Plus } from 'lucide-react';
import { InvoiceItem } from '../../types';

export const FinanceView: React.FC = () => {
  const {
    invoices,
    selectedProjectId,
    selectedProject,
    users,
    createInvoice,
    openInvoicePreview
  } = useApp();

  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [invDescription, setInvDescription] = useState('Termin Milestone Deliverables UAT');
  const [invAmount, setInvAmount] = useState<number>(350000000);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Super Admin has full finance access
  const totalContract = selectedProject.budgetAmount;
  const internalCost = selectedProject.spentAmount;
  const grossProfit = totalContract - internalCost;
  const marginPercent = totalContract > 0 ? Math.round((grossProfit / totalContract) * 100) : 0;

  const handleCreateNewInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const item: InvoiceItem = {
      id: `itm-${Date.now()}`,
      description: invDescription,
      quantity: 1,
      unit: 'Termin',
      rate: Number(invAmount),
      amount: Number(invAmount)
    };

    createInvoice({
      projectId: selectedProjectId,
      items: [item],
      subtotal: Number(invAmount),
      taxPercent: 11,
      taxAmount: (Number(invAmount) * 11) / 100,
      totalAmount: Number(invAmount) * 1.11,
      status: 'draft',
      dueDate: '2026-11-15'
    });

    setIsCreatingInvoice(false);
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600" />
            Finance, Billing & Profitabilitas
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Analisis margin per proyek, penerbitan faktur tagihan PPN 11%, dan rate card engineering (Akses Penuh Super Admin).
          </p>
        </div>

        <button
          onClick={() => setIsCreatingInvoice(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Terbitkan Faktur Baru
        </button>
      </div>

      {/* Project Profitability Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Nilai Kontrak Klien</span>
          <div className="text-xl font-black text-slate-900 font-mono">
            {formatIDR(totalContract)}
          </div>
          <span className="text-[11px] text-slate-500 block">{selectedProject.type.toUpperCase()} SLA</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Total Biaya Engineering (Cost)</span>
          <div className="text-xl font-black text-rose-600 font-mono">
            {formatIDR(internalCost)}
          </div>
          <span className="text-[11px] text-slate-500 block">Jam kerja × Cost Rate</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Gross Profit (Margin Bersih)</span>
          <div className="text-xl font-black text-emerald-600 font-mono">
            {formatIDR(grossProfit)}
          </div>
          <span className="text-[11px] text-emerald-700 font-bold block">
            Profit Margin: {marginPercent}%
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Status Pembayaran Klien</span>
          <div className="text-xl font-black text-indigo-700">
            {invoices.filter((i) => i.status === 'paid').length} Paid
          </div>
          <span className="text-[11px] text-amber-700 block font-semibold">
            {invoices.filter((i) => i.status === 'sent').length} Pending Settlement
          </span>
        </div>
      </div>

      {/* Quick Create Invoice Drawer/Card if open */}
      {isCreatingInvoice && (
        <form onSubmit={handleCreateNewInvoice} className="p-5 rounded-2xl bg-white border border-indigo-200 shadow-md space-y-4 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sm text-slate-900">Draft Faktur Baru</span>
            <button
              type="button"
              onClick={() => setIsCreatingInvoice(false)}
              className="text-slate-400 hover:text-slate-700 text-xs font-semibold"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Deskripsi Deliverable</label>
              <input
                type="text"
                required
                value={invDescription}
                onChange={(e) => setInvDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Nominal Dasar (IDR)</label>
              <input
                type="number"
                step="10000000"
                required
                value={invAmount}
                onChange={(e) => setInvAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
            >
              Simpan & Generate Faktur
            </button>
          </div>
        </form>
      )}

      {/* Invoice List */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-sm">Daftar Faktur / Invoices</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold bg-slate-50/60">
                <th className="py-2.5 px-3">Nomor Faktur</th>
                <th className="py-2.5 px-3">Klien & Proyek</th>
                <th className="py-2.5 px-3">Tanggal Terbit</th>
                <th className="py-2.5 px-3">Jatuh Tempo</th>
                <th className="py-2.5 px-3 text-right">Total Tagihan (Termasuk PPN)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => openInvoicePreview(inv)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                    {inv.number}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{inv.clientName}</div>
                    <div className="text-[11px] text-slate-500">{inv.projectName}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 font-medium">{inv.issueDate}</td>
                  <td className="py-3 px-3 font-mono text-slate-500 font-medium">{inv.dueDate}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    {formatIDR(inv.totalAmount)}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      inv.status === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : inv.status === 'sent'
                        ? 'bg-amber-50 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-indigo-600 font-bold hover:underline">
                    Buka Faktur
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internal Rate Card Matrix */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-sm">Internal Rate Card & Biaya Tim (IDR / Jam)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {users
            .filter((u) => u.role !== 'client')
            .map((u) => (
              <div key={u.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block truncate">{u.name}</span>
                <span className="text-[11px] text-slate-500 block truncate">{u.roleTitle}</span>
                <div className="pt-1 flex justify-between font-mono text-[11px]">
                  <span className="text-slate-500">Cost: {formatIDR(u.costRate)}</span>
                  <span className="text-indigo-700 font-bold">Bill: {formatIDR(u.billRate)}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
