import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Receipt, Printer, CheckCircle, Send } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const {
    isInvoiceModalOpen,
    setIsInvoiceModalOpen,
    activeInvoiceToPreview,
    updateInvoiceStatus
  } = useApp();

  if (!activeInvoiceToPreview) return null;

  const inv = activeInvoiceToPreview;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isInvoiceModalOpen}
      onClose={() => setIsInvoiceModalOpen(false)}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-indigo-600" />
          <span className="text-base font-bold text-slate-900">
            Faktur Pembayaran — {inv.number}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
              inv.status === 'paid'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : inv.status === 'sent'
                ? 'bg-amber-50 text-amber-800 border border-amber-300'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {inv.status.toUpperCase()}
          </span>
        </div>
      }
    >
      <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 text-slate-800 shadow-xs" id="printable-invoice">
        {/* Invoice Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xl font-black text-indigo-700 tracking-tight flex items-center gap-2">
              ForgeFlow <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded font-mono font-bold">DIGITAL AGENCY</span>
            </div>
            <p className="text-xs text-slate-700 font-semibold mt-1">PT Kreasi Teknologi ForgeFlow</p>
            <p className="text-[11px] text-slate-500">Cyber 2 Tower Lt. 18, HR Rasuna Said, Jakarta Selatan</p>
            <p className="text-[11px] text-slate-500">NPWP: 01.345.678.9-012.000</p>
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-black text-slate-900">INVOICE</h2>
            <div className="text-xs font-mono text-slate-600 mt-1 font-bold">No: {inv.number}</div>
            <div className="text-xs text-slate-600 mt-1">
              Tanggal Terbit: <strong className="text-slate-900">{inv.issueDate}</strong>
            </div>
            <div className="text-xs text-rose-600 mt-0.5 font-bold">
              Jatuh Tempo: {inv.dueDate}
            </div>
          </div>
        </div>

        {/* Client & Project Info */}
        <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-200 text-xs">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
              Ditagihkan Kepada:
            </span>
            <div className="font-extrabold text-sm text-slate-900">{inv.clientName}</div>
            <p className="text-slate-600 mt-0.5">Departemen Digital Innovation & Core Banking</p>
            <p className="text-slate-500">Jakarta, Indonesia</p>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
              Referensi Proyek:
            </span>
            <div className="font-bold text-indigo-700 text-sm">{inv.projectName}</div>
            <p className="text-slate-600 mt-0.5">Status Kontrak: Active Milestone SLA</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] bg-slate-50/80 font-bold">
                <th className="py-2.5 px-2">Deskripsi Deliverable</th>
                <th className="py-2.5 px-2 text-center">Qty</th>
                <th className="py-2.5 px-2 text-right">Tarif Satuan (IDR)</th>
                <th className="py-2.5 px-2 text-right">Jumlah (IDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inv.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 px-2 font-semibold text-slate-800 pr-2">
                    {item.description}
                  </td>
                  <td className="py-3 px-2 text-center text-slate-600 font-medium">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-slate-700">
                    {formatIDR(item.rate)}
                  </td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-slate-900">
                    {formatIDR(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation summary */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <div className="w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Subtotal</span>
              <span className="font-mono text-slate-900 font-bold">{formatIDR(inv.subtotal)}</span>
            </div>

            {inv.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Diskon Khusus</span>
                <span className="font-mono font-bold">- {formatIDR(inv.discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600 font-medium">
              <span>PPN ({inv.taxPercent}%)</span>
              <span className="font-mono text-slate-900 font-bold">{formatIDR(inv.taxAmount)}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Tagihan</span>
              <span className="font-mono text-indigo-700 text-base font-extrabold">{formatIDR(inv.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Payment instructions */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-800">Instruksi Pembayaran Transfer Rekening:</div>
          <p>Bank: <strong className="text-slate-800">PT Bank Mandiri (Persero) Tbk</strong></p>
          <p>Nomor Rekening: <strong className="text-indigo-700 font-mono font-bold">122-00-9876543-2</strong> a.n. PT Kreasi Teknologi ForgeFlow</p>
          {inv.notes && <p className="text-slate-500 italic pt-1">{inv.notes}</p>}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2">
            {inv.status !== 'paid' && (
              <button
                onClick={() => updateInvoiceStatus(inv.id, 'paid')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Tandai Lunas (Paid)
              </button>
            )}
            {inv.status === 'draft' && (
              <button
                onClick={() => updateInvoiceStatus(inv.id, 'sent')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Kirim ke Klien (Sent)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak / Export PDF
            </button>
            <button
              onClick={() => setIsInvoiceModalOpen(false)}
              className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
