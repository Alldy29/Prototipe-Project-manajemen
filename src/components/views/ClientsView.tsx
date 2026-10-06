import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Client } from '../../types';
import {
  Users,
  Building2,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  Plus,
  Search,
  CheckCircle2,
  FolderKanban,
  DollarSign
} from 'lucide-react';

export const ClientsView: React.FC = () => {
  const { clients, projects, openProjectDetail, invoices } = useApp();
  const [search, setSearch] = useState('');

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.contactName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            Manajemen Klien & Stakeholder
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Direktori Klien
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar korporasi mitra software house, kontak PIC, kontrak aktif, dan integrasi Client Portal FR-11.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari klien, PIC, industri..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
        </div>
      </div>

      {/* Grid of Clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => {
          const clientProjects = projects.filter((p) => p.clientId === client.id);
          const clientInvoices = invoices.filter((inv) => inv.clientId === client.id);
          const totalInvoiced = clientInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

          return (
            <div
              key={client.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-linear-to-br from-indigo-50 to-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-sm shadow-xs">
                    {client.code}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {client.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      {client.industry}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ● Aktif
                </span>
              </div>

              {/* Contact Info */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>PIC: <strong>{client.contactName}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`mailto:${client.email}`} className="hover:text-indigo-600 hover:underline">
                    {client.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ref: {client.contractRef}</span>
                </div>
              </div>

              {/* Projects List under Client */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Proyek Terkait ({clientProjects.length})</span>
                  <span className="font-mono text-slate-700">Rp {(totalInvoiced / 1000000).toLocaleString('id-ID')} Jt Ditagih</span>
                </div>
                <div className="space-y-1.5">
                  {clientProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => openProjectDetail(p.id, 'overview')}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 flex items-center justify-between cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="font-mono font-bold text-[10px] text-slate-500">{p.key}</span>
                        <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-700 truncate">
                          {p.name}
                        </span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
