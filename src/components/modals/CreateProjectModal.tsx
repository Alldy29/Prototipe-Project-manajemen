import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ProjectType, ClientVisibilityMode } from '../../types';
import { 
  FolderPlus, 
  Smartphone, 
  Globe, 
  Wrench, 
  BrainCircuit, 
  ShieldCheck 
} from 'lucide-react';

export const CreateProjectModal: React.FC = () => {
  const {
    isCreateProjectOpen,
    setIsCreateProjectOpen,
    clients,
    createProject,
    openProjectDetail
  } = useApp();

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [type, setType] = useState<ProjectType>('fixed_price');
  const [selectedTemplate, setSelectedTemplate] = useState('mobile');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [budgetAmount, setBudgetAmount] = useState<number>(750000000);
  const [budgetHours, setBudgetHours] = useState<number>(900);
  const [color, setColor] = useState('#6366f1');
  const [clientVisibilityMode, setClientVisibilityMode] = useState<ClientVisibilityMode>('all');

  const templates = [
    {
      id: 'mobile',
      label: 'Mobile Banking & Fintech',
      icon: Smartphone,
      desc: 'Native iOS & Android, biometrik, QRIS, compliance OJK & BI',
      suggestedKey: 'MBF'
    },
    {
      id: 'webapp',
      label: 'Web SaaS & E-Commerce',
      icon: Globe,
      desc: 'Fullstack Next.js, headless catalog, gateway pembayaran',
      suggestedKey: 'WEB'
    },
    {
      id: 'ai',
      label: 'AI & Data Intelligence',
      icon: BrainCircuit,
      desc: 'LLM fine-tuning, analytics ETL pipeline, vector search',
      suggestedKey: 'DAT'
    },
    {
      id: 'retainer',
      label: 'Maintenance Retainer',
      icon: Wrench,
      desc: 'SLA per jam, dedicated DevOps & monitoring security bulanan',
      suggestedKey: 'RET'
    }
  ];

  const handleTemplateSelect = (t: typeof templates[0]) => {
    setSelectedTemplate(t.id);
    if (!key) setKey(t.suggestedKey);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!key && val.trim().length >= 3) {
      const generated = val
        .split(' ')
        .map((w) => w[0])
        .slice(0, 3)
        .join('')
        .toUpperCase();
      setKey(generated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProj = createProject({
      name: name.trim(),
      key: key.toUpperCase().trim() || 'PRJ',
      description: description.trim(),
      clientId,
      type,
      startDate,
      targetDate,
      budgetAmount: Number(budgetAmount),
      budgetHours: Number(budgetHours),
      color,
      clientVisibilityMode
    });

    openProjectDetail(newProj.id, 'overview');
    setIsCreateProjectOpen(false);
  };

  return (
    <Modal
      isOpen={isCreateProjectOpen}
      onClose={() => setIsCreateProjectOpen(false)}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <FolderPlus className="w-5 h-5 text-indigo-600" />
          <span className="text-base font-bold text-slate-900">Buat Proyek Baru</span>
        </div>
      }
      description="Pilih template software house dan konfigurasi model kontrak serta transparansi portal klien."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Template Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Template Proyek Software House
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {templates.map((tpl) => {
              const Icon = tpl.icon;
              const isSelected = selectedTemplate === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => handleTemplateSelect(tpl)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{tpl.label}</span>
                    <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">{tpl.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Name & Key */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nama Proyek <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Mobile Banking 3.0 Revamp"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Project Key (Prefix)
            </label>
            <input
              type="text"
              required
              maxLength={5}
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              placeholder="MBN"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-indigo-700 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Client & Contract Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Klien Sponsor
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.industry})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Model Billing & Kontrak
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ProjectType)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="fixed_price">Fixed Price (Termin Milestone)</option>
              <option value="time_material">Time & Material (Jam Engineering)</option>
              <option value="retainer">Retainer (Jam Bulanan)</option>
              <option value="internal">Internal Software House Initiative</option>
            </select>
          </div>
        </div>

        {/* Budget in Rupiah & Budget Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nilai Kontrak / Budget (IDR)
            </label>
            <input
              type="number"
              step="50000000"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Alokasi Kapasitas (Jam)
            </label>
            <input
              type="number"
              step="50"
              value={budgetHours}
              onChange={(e) => setBudgetHours(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Dates & Color */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Target Deadline
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Warna Identitas
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-9 h-8 bg-transparent cursor-pointer rounded border border-slate-300"
              />
              <span className="text-xs font-mono text-slate-600 font-medium">{color}</span>
            </div>
          </div>
        </div>

        {/* FR-11A: Client Portal Visibility Mode Setting */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-slate-900">
              Pengaturan Visibilitas Klien (PRD FR-11A)
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'all', title: 'Semua Task (Default)', desc: 'Klien melihat semua task kecuali yang ditandai Internal Only' },
              { id: 'shared', title: 'Hanya Task Dibagikan', desc: 'Hanya task yang diberi centang "Visible to Client"' },
              { id: 'milestone', title: 'Milestone Saja', desc: 'Hanya tingkat tinggi milestone tanpa detail task' }
            ].map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => setClientVisibilityMode(m.id as ClientVisibilityMode)}
                className={`p-2 rounded-lg border text-left text-[11px] transition-all cursor-pointer ${
                  clientVisibilityMode === m.id
                    ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="font-bold">{m.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsCreateProjectOpen(false)}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
          >
            Buat Proyek
          </button>
        </div>
      </form>
    </Modal>
  );
};
