import {
  User,
  Client,
  Project,
  Issue,
  Sprint,
  Milestone,
  TimeEntry,
  Invoice,
  TestCase,
  ProjectDoc,
  ActivityLog,
  NotificationItem,
  Comment
} from '../types';

export const SEED_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Aditya Pratama',
    email: 'aditya@forgeflow.agency',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'owner',
    roleTitle: 'Super Admin & Managing Partner (CTO)',
    timezone: 'Asia/Jakarta (WIB)',
    skills: ['System Architecture', 'Go', 'Kubernetes', 'Tech Strategy'],
    costRate: 450000,
    billRate: 1200000,
    workingHours: 40
  },
  {
    id: 'usr-2',
    name: 'Rian Hidayat',
    email: 'rian@forgeflow.agency',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    role: 'pm',
    roleTitle: 'Lead Project Manager',
    timezone: 'Asia/Jakarta (WIB)',
    skills: ['Scrum', 'Risk Management', 'Client Relations', 'Jira/Agile'],
    costRate: 350000,
    billRate: 850000,
    workingHours: 40
  },
  {
    id: 'usr-3',
    name: 'Budi Santoso',
    email: 'budi@forgeflow.agency',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    role: 'developer',
    roleTitle: 'Senior Backend Engineer',
    timezone: 'Asia/Jakarta (WIB)',
    skills: ['Node.js', 'PostgreSQL', 'Redis', 'Microservices', 'GraphQL'],
    costRate: 300000,
    billRate: 750000,
    workingHours: 40
  },
  {
    id: 'usr-4',
    name: 'Siti Rahma',
    email: 'siti@forgeflow.agency',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    role: 'developer',
    roleTitle: 'Senior Frontend Engineer',
    timezone: 'Asia/Jakarta (WIB)',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Performance'],
    costRate: 280000,
    billRate: 700000,
    workingHours: 40
  },
  {
    id: 'usr-5',
    name: 'Kevin Wijaya',
    email: 'kevin@forgeflow.agency',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    role: 'developer',
    roleTitle: 'Fullstack Engineer',
    timezone: 'Asia/Jakarta (WIB)',
    skills: ['React Native', 'TypeScript', 'Docker', 'REST API'],
    costRate: 240000,
    billRate: 600000,
    workingHours: 40
  },
  {
    id: 'usr-6',
    name: 'Maya Anggraini',
    email: 'maya@forgeflow.agency',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    role: 'qa',
    roleTitle: 'Lead QA Automation',
    timezone: 'Asia/Jakarta (WIB)',
    skills: ['Playwright', 'Cypress', 'Postman API', 'Load Testing', 'UAT'],
    costRate: 220000,
    billRate: 550000,
    workingHours: 40
  },
  {
    id: 'usr-7',
    name: 'Dina Putri',
    email: 'dina@forgeflow.agency',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    role: 'designer',
    roleTitle: 'Senior Product Designer',
    timezone: 'Asia/Jakarta (WIB)',
    skills: ['Figma', 'Design System', 'User Testing', 'Prototyping'],
    costRate: 250000,
    billRate: 650000,
    workingHours: 40
  },
  {
    id: 'usr-8',
    name: 'Hendra Kusuma',
    email: 'hendra@forgeflow.agency',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    role: 'finance',
    roleTitle: 'Head of Finance & Operations',
    timezone: 'Asia/Jakarta (WIB)',
    skills: ['Invoicing', 'Tax (PPN)', 'Budgeting', 'Financial Forecast'],
    costRate: 280000,
    billRate: 0,
    workingHours: 40
  },
  {
    id: 'usr-client',
    name: 'Bambang Sudiro',
    email: 'bambang.s@bankmandiri.co.id',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80',
    role: 'client',
    roleTitle: 'VP Digital Innovation & Banking',
    timezone: 'Asia/Jakarta (WIB)',
    skills: ['Client Stakeholder', 'Banking Compliance', 'Product Sponsor'],
    costRate: 0,
    billRate: 0,
    workingHours: 0
  }
];

export const SEED_CLIENTS: Client[] = [
  {
    id: 'cl-1',
    name: 'PT Bank Mandiri Digital',
    code: 'MANDIRI',
    contactName: 'Bambang Sudiro',
    email: 'bambang.s@bankmandiri.co.id',
    phone: '+62 21 526 5045',
    industry: 'Banking & Fintech',
    status: 'active',
    contractRef: 'CTR-2026-BMD-004',
    activeProjectsCount: 2
  },
  {
    id: 'cl-2',
    name: 'PT Nusantara Retail Group',
    code: 'NUSANTARA',
    contactName: 'Elvira Chandra',
    email: 'elvira@nusantararetail.id',
    phone: '+62 21 884 1290',
    industry: 'Retail & E-Commerce',
    status: 'active',
    contractRef: 'CTR-2025-NRG-012',
    activeProjectsCount: 1
  },
  {
    id: 'cl-3',
    name: 'PT Astra Logistik Pintar',
    code: 'ASTRA',
    contactName: 'Irfan Hakim',
    email: 'irfan.h@astralogistik.co.id',
    phone: '+62 21 789 4433',
    industry: 'Logistics & Supply Chain',
    status: 'active',
    contractRef: 'CTR-2026-ALP-001',
    activeProjectsCount: 1
  }
];

export const SEED_PROJECTS: Project[] = [
  {
    id: 'prj-1',
    key: 'MBN',
    name: 'Mobile Banking 3.0 Revamp',
    description: 'Transformasi arsitektur mobile banking native dengan fitur Biometric Login, QRIS Cross-Border, dan High-Concurrency Transaction Engine.',
    clientId: 'cl-1',
    clientName: 'PT Bank Mandiri Digital',
    type: 'fixed_price',
    status: 'active',
    health: 'on_track',
    pmId: 'usr-2',
    startDate: '2026-08-01',
    targetDate: '2026-11-30',
    budgetHours: 1200,
    budgetAmount: 950000000,
    spentHours: 680,
    spentAmount: 512000000,
    color: '#6366f1',
    memberIds: ['usr-1', 'usr-2', 'usr-3', 'usr-4', 'usr-5', 'usr-6', 'usr-7'],
    clientVisibilityMode: 'all', // FR-11A: Show all tasks except internalOnly
    clientShowAssignee: true,
    clientShowEstimate: false
  },
  {
    id: 'prj-2',
    key: 'ECP',
    name: 'E-Commerce Omnichannel Platform',
    description: 'Platform multi-channel POS & web storefront dengan integrasi ERP SAP, WhatsApp Commerce, dan automated fulfillment routing.',
    clientId: 'cl-2',
    clientName: 'PT Nusantara Retail Group',
    type: 'time_material',
    status: 'active',
    health: 'at_risk',
    pmId: 'usr-2',
    startDate: '2026-07-15',
    targetDate: '2026-12-15',
    budgetHours: 900,
    budgetAmount: 680000000,
    spentHours: 710,
    spentAmount: 545000000,
    color: '#ec4899',
    memberIds: ['usr-2', 'usr-3', 'usr-4', 'usr-6'],
    clientVisibilityMode: 'all',
    clientShowAssignee: true,
    clientShowEstimate: true
  },
  {
    id: 'prj-3',
    key: 'IOT',
    name: 'Smart Fleet Telematics & IoT',
    description: 'Dashboard monitoring armada truk real-time dengan sensor GPS, OBD-II telemetry, route fuel optimization, dan alert kecelakaan.',
    clientId: 'cl-3',
    clientName: 'PT Astra Logistik Pintar',
    type: 'fixed_price',
    status: 'active',
    health: 'on_track',
    pmId: 'usr-2',
    startDate: '2026-09-01',
    targetDate: '2027-01-30',
    budgetHours: 800,
    budgetAmount: 620000000,
    spentHours: 240,
    spentAmount: 185000000,
    color: '#06b6d4',
    memberIds: ['usr-1', 'usr-2', 'usr-5', 'usr-6', 'usr-7'],
    clientVisibilityMode: 'all',
    clientShowAssignee: true,
    clientShowEstimate: false
  },
  {
    id: 'prj-4',
    key: 'DSY',
    name: 'ForgeFlow Core Design System',
    description: 'Internal reusable components, tokens, dan accessibility guidelines untuk mempercepat delivery seluruh proyek agency.',
    clientId: '',
    clientName: 'Internal Initiative',
    type: 'internal',
    status: 'active',
    health: 'on_track',
    pmId: 'usr-1',
    startDate: '2026-06-01',
    targetDate: '2026-12-31',
    budgetHours: 350,
    budgetAmount: 180000000,
    spentHours: 190,
    spentAmount: 95000000,
    color: '#10b981',
    memberIds: ['usr-1', 'usr-4', 'usr-7'],
    clientVisibilityMode: 'milestone',
    clientShowAssignee: true,
    clientShowEstimate: false
  },
  {
    id: 'prj-5',
    key: 'PGW',
    name: 'Instant Settlement Payment Gateway',
    description: 'Arsitektur payment switch mikrodetik dengan integrasi BI-FAST dan QRIS MPM/CPM API.',
    clientId: 'cl-1',
    clientName: 'PT Bank Mandiri Digital',
    type: 'fixed_price',
    status: 'planning',
    health: 'on_track',
    pmId: 'usr-2',
    startDate: '2026-11-01',
    targetDate: '2027-03-31',
    budgetHours: 1000,
    budgetAmount: 850000000,
    spentHours: 40,
    spentAmount: 32000000,
    color: '#f59e0b',
    memberIds: ['usr-1', 'usr-2', 'usr-3'],
    clientVisibilityMode: 'shared',
    clientShowAssignee: false,
    clientShowEstimate: false
  }
];

export const SEED_SPRINTS: Sprint[] = [
  {
    id: 'sp-4',
    projectId: 'prj-1',
    name: 'Sprint 4: Biometric & QRIS Settlement',
    goal: 'Selesaikan integrasi otentikasi biometrik FIDO2, implementasikan parser QRIS CPM dan testing high-load 1.000 TPS.',
    startDate: '2026-09-28',
    endDate: '2026-10-12',
    status: 'active',
    capacityHours: 240,
    capacityPoints: 42,
    committedPoints: 38,
    completedPoints: 21
  },
  {
    id: 'sp-5',
    projectId: 'prj-1',
    name: 'Sprint 5: Cardless Withdrawal & Notifications',
    goal: 'Implementasi penarikan tunai tanpa kartu via ATM dan push notifications FCM dengan enkripsi payload.',
    startDate: '2026-10-13',
    endDate: '2026-10-27',
    status: 'planned',
    capacityHours: 240,
    capacityPoints: 40,
    committedPoints: 34,
    completedPoints: 0
  }
];

export const SEED_MILESTONES: Milestone[] = [
  {
    id: 'ms-1',
    projectId: 'prj-1',
    name: 'Milestone 1: Security Audit & Core API',
    description: 'Penyelesaian arsitektur secure token, vault credentials, dan integrasi core banking.',
    dueDate: '2026-09-15',
    status: 'approved',
    clientApproval: 'approved',
    clientFeedback: 'Arsitektur telah disetujui oleh tim CISO Bank Mandiri.',
    billingAmount: 300000000,
    deliverables: ['Dokumen SRS & Arsitektur', 'Laporan Pentest Vulnerability Assessment', 'Staging Core API'],
    completedDeliverablesCount: 3
  },
  {
    id: 'ms-2',
    projectId: 'prj-1',
    name: 'Milestone 2: Biometric & QRIS UAT',
    description: 'Pengujian pengguna UAT oleh perwakilan bisnis Bank Mandiri untuk modul QRIS & Biometrik.',
    dueDate: '2026-10-15',
    status: 'ready_for_review',
    clientApproval: 'pending',
    clientFeedback: 'Menunggu review dari tim Bapak Bambang Sudiro pada akhir Sprint 4.',
    billingAmount: 350000000,
    deliverables: ['Build Android APK & iOS IPA Staging', 'Test Plan & Test Execution Summary', 'UAT Signoff Checklist'],
    completedDeliverablesCount: 2
  },
  {
    id: 'ms-3',
    projectId: 'prj-1',
    name: 'Milestone 3: Production Rollout & Warranty',
    description: 'Deployment live ke Google Play Store & Apple App Store dengan migrasi bertahap 100.000 user.',
    dueDate: '2026-11-30',
    status: 'pending',
    clientApproval: 'pending',
    billingAmount: 300000000,
    deliverables: ['Production Release Runbook', 'Disaster Recovery Plan', 'Dokumen Serah Terima Source Code'],
    completedDeliverablesCount: 0
  }
];

export const SEED_ISSUES: Issue[] = [
  // --- MBN (Mobile Banking) Issues ---
  {
    id: 'iss-101',
    key: 'MBN-101',
    projectId: 'prj-1',
    type: 'story',
    title: 'Implementasi Login Biometrik (FaceID & Fingerprint) dengan Enkripsi Secure Enclave',
    description: 'Pengguna harus dapat login menggunakan sensor sidik jari atau FaceID tanpa perlu memasukkan m-PIN setiap sesi. Kunci privat disimpan di hardware Secure Enclave / Keystore.',
    statusId: 'in_progress',
    priority: 'urgent',
    assigneeId: 'usr-4',
    reporterId: 'usr-2',
    reviewerId: 'usr-1',
    labels: ['Security', 'Mobile', 'Auth'],
    sprintId: 'sp-4',
    storyPoints: 8,
    estimateHours: 32,
    actualHours: 24,
    dueDate: '2026-10-09',
    internalOnly: false,
    clientVisible: true,
    rank: 1,
    checklist: [
      { id: 'chk-1', text: 'Hardware biometric capability check', completed: true },
      { id: 'chk-2', text: 'Secure Enclave RSA keypair generation', completed: true },
      { id: 'chk-3', text: 'Backend signature verification endpoint', completed: true },
      { id: 'chk-4', text: 'Fallback to m-PIN jika biometrik gagal 3x', completed: false }
    ],
    createdAt: '2026-09-28T09:00:00Z',
    updatedAt: '2026-10-05T14:30:00Z'
  },
  {
    id: 'iss-102',
    key: 'MBN-102',
    projectId: 'prj-1',
    type: 'task',
    title: 'Integrasi Parser QRIS Standar ASPI MPM & CPM Dynamic QR',
    description: 'Sistem harus mampu mem-parsing QR string standar EMVCo/ASPI, mengekstrak Merchant PAN, NMID, dan nominal transaksi secara instan.',
    statusId: 'code_review',
    priority: 'high',
    assigneeId: 'usr-3',
    reporterId: 'usr-2',
    reviewerId: 'usr-1',
    labels: ['Backend', 'QRIS', 'Payment'],
    sprintId: 'sp-4',
    storyPoints: 5,
    estimateHours: 20,
    actualHours: 19,
    dueDate: '2026-10-08',
    internalOnly: false,
    clientVisible: true,
    rank: 2,
    checklist: [
      { id: 'chk-5', text: 'EMVCo payload parsing utility', completed: true },
      { id: 'chk-6', text: 'ASPI Merchant lookup via Switching Gateway', completed: true },
      { id: 'chk-7', text: 'Handling QR expired & dynamic amount timeout', completed: true }
    ],
    createdAt: '2026-09-29T10:15:00Z',
    updatedAt: '2026-10-04T16:20:00Z'
  },
  {
    id: 'iss-103',
    key: 'MBN-103',
    projectId: 'prj-1',
    type: 'bug',
    title: 'Gagal refresh OAuth token saat koneksi beralih dari WiFi ke Seluler',
    description: 'Terjadi HTTP 401 unhandled exception pada aplikasi iOS ketika device berpindah jaringan saat proses transfer dana berlangsung.',
    statusId: 'qa',
    priority: 'urgent',
    assigneeId: 'usr-5',
    reporterId: 'usr-6',
    reviewerId: 'usr-3',
    labels: ['Bug', 'iOS', 'Network'],
    sprintId: 'sp-4',
    storyPoints: 3,
    estimateHours: 12,
    actualHours: 11,
    dueDate: '2026-10-07',
    internalOnly: false,
    clientVisible: true,
    rank: 3,
    checklist: [
      { id: 'chk-8', text: 'Reproduce bug on iOS 18 network handover', completed: true },
      { id: 'chk-9', text: 'Axios silent retry interceptor with mutex lock', completed: true },
      { id: 'chk-10', text: 'Automated network simulation test', completed: false }
    ],
    createdAt: '2026-10-01T11:00:00Z',
    updatedAt: '2026-10-05T11:45:00Z'
  },
  {
    id: 'iss-104',
    key: 'MBN-104',
    projectId: 'prj-1',
    type: 'story',
    title: 'Desain & Implementasi Layar Ringkasan Transaksi dan Struk Digital PDF',
    description: 'Layar bukti transfer yang dapat dibagikan langsung ke WhatsApp/Email dengan stempel QR verifikasi keaslian dan nomor referensi unik.',
    statusId: 'uat',
    priority: 'medium',
    assigneeId: 'usr-7',
    reporterId: 'usr-2',
    reviewerId: 'usr-2',
    labels: ['UI/UX', 'Export', 'ClientReview'],
    sprintId: 'sp-4',
    storyPoints: 5,
    estimateHours: 18,
    actualHours: 16,
    dueDate: '2026-10-06',
    internalOnly: false,
    clientVisible: true,
    rank: 4,
    checklist: [
      { id: 'chk-11', text: 'Figma high-fidelity prototype review', completed: true },
      { id: 'chk-12', text: 'React Native vector rendering untuk receipt', completed: true },
      { id: 'chk-13', text: 'PDF Generation module & Native Share Sheet', completed: true }
    ],
    createdAt: '2026-09-30T13:00:00Z',
    updatedAt: '2026-10-05T09:10:00Z'
  },
  {
    id: 'iss-105',
    key: 'MBN-105',
    projectId: 'prj-1',
    type: 'task',
    title: 'Refactor Internal Database Migration & Redis Cluster Caching',
    description: 'Optimasi query Postgres dengan composite index dan setup Redis sentinel connection pool.',
    statusId: 'done',
    priority: 'medium',
    assigneeId: 'usr-3',
    reporterId: 'usr-1',
    labels: ['Database', 'Refactor', 'InternalOnly'],
    sprintId: 'sp-4',
    storyPoints: 5,
    estimateHours: 16,
    actualHours: 15,
    dueDate: '2026-10-03',
    internalOnly: true, // FR-11A: HIDE FROM CLIENT PORTAL
    clientVisible: false,
    rank: 5,
    checklist: [
      { id: 'chk-14', text: 'Index optimization on transactions table', completed: true },
      { id: 'chk-15', text: 'Benchmarking 2000 RPS query load', completed: true }
    ],
    createdAt: '2026-09-28T09:30:00Z',
    updatedAt: '2026-10-03T18:00:00Z'
  },
  {
    id: 'iss-106',
    key: 'MBN-106',
    projectId: 'prj-1',
    type: 'story',
    title: 'Fitur Tarik Tunai Tanpa Kartu (Cardless Cash Withdrawal) di ATM Mandiri',
    description: 'Pembuatan kode reservasi penarikan uang 6-digit dengan masa berlaku 15 menit dan geolocation verification.',
    statusId: 'ready',
    priority: 'high',
    assigneeId: 'usr-5',
    reporterId: 'usr-2',
    labels: ['ATM', 'Feature', 'Cardless'],
    sprintId: 'sp-5',
    storyPoints: 8,
    estimateHours: 28,
    actualHours: 0,
    dueDate: '2026-10-20',
    internalOnly: false,
    clientVisible: true,
    rank: 6,
    checklist: [
      { id: 'chk-16', text: 'Generate one-time OTP token', completed: false },
      { id: 'chk-17', text: 'Integrasi dengan host ATM ISO 8583', completed: false },
      { id: 'chk-18', text: 'Batas limit transaksi harian', completed: false }
    ],
    createdAt: '2026-10-02T10:00:00Z',
    updatedAt: '2026-10-02T10:00:00Z'
  },
  {
    id: 'iss-107',
    key: 'MBN-107',
    projectId: 'prj-1',
    type: 'task',
    title: 'Setup APNS & Firebase Cloud Messaging (FCM) High Priority Notification Channel',
    description: 'Konfigurasi channel notifikasi prioritas tinggi dengan icon badge dan suara custom perbankan.',
    statusId: 'backlog',
    priority: 'low',
    assigneeId: 'usr-4',
    reporterId: 'usr-2',
    labels: ['Notification', 'Push', 'FCM'],
    sprintId: 'sp-5',
    storyPoints: 3,
    estimateHours: 12,
    actualHours: 0,
    dueDate: '2026-10-24',
    internalOnly: false,
    clientVisible: true,
    rank: 7,
    checklist: [],
    createdAt: '2026-10-02T11:00:00Z',
    updatedAt: '2026-10-02T11:00:00Z'
  },
  {
    id: 'iss-108',
    key: 'MBN-108',
    projectId: 'prj-1',
    type: 'bug',
    title: 'Tampilan teks nominal terpotong pada device iPhone SE resolusi kecil',
    description: 'Label saldo utama pada dashboard terpotong menjadi "Rp 12.3..." pada layar 4.7 inci.',
    statusId: 'ready',
    priority: 'medium',
    assigneeId: 'usr-4',
    reporterId: 'usr-6',
    labels: ['UI', 'Bug', 'Mobile'],
    sprintId: 'sp-4',
    storyPoints: 2,
    estimateHours: 6,
    actualHours: 0,
    dueDate: '2026-10-10',
    internalOnly: false,
    clientVisible: true,
    rank: 8,
    checklist: [
      { id: 'chk-19', text: 'Set auto-scaling font size min 14px', completed: false }
    ],
    createdAt: '2026-10-04T15:20:00Z',
    updatedAt: '2026-10-04T15:20:00Z'
  },
  {
    id: 'iss-109',
    key: 'MBN-109',
    projectId: 'prj-1',
    type: 'spike',
    title: 'Riset Integrasi Open Banking SNAP BI (Standar Nasional Open API Pembayaran)',
    description: 'Analisis kepatuhan payload, signature HMAC-SHA256, dan sertifikat X.509 sesuai regulasi Bank Indonesia 2026.',
    statusId: 'done',
    priority: 'high',
    assigneeId: 'usr-1',
    reporterId: 'usr-1',
    labels: ['Research', 'Compliance', 'BI'],
    storyPoints: 5,
    estimateHours: 20,
    actualHours: 20,
    dueDate: '2026-09-25',
    internalOnly: true,
    clientVisible: false,
    rank: 9,
    checklist: [
      { id: 'chk-20', text: 'Download spec SNAP BI v2.1', completed: true },
      { id: 'chk-21', text: 'Proof of concept signature validation', completed: true }
    ],
    createdAt: '2026-09-18T08:00:00Z',
    updatedAt: '2026-09-25T17:00:00Z'
  },

  // --- ECP (E-Commerce Platform) Issues ---
  {
    id: 'iss-201',
    key: 'ECP-201',
    projectId: 'prj-2',
    type: 'story',
    title: 'Sinkronisasi Stok Real-time Antara Toko Fisik POS & Website via Webhook SAP',
    description: 'Saat kasir menyelesaikan penjualan di gerai fisik, stok e-commerce harus berkurang dalam waktu < 2 detik untuk menghindari overselling barang promo flash sale.',
    statusId: 'in_progress',
    priority: 'urgent',
    assigneeId: 'usr-3',
    reporterId: 'usr-2',
    labels: ['Inventory', 'SAP', 'Integration'],
    storyPoints: 8,
    estimateHours: 35,
    actualHours: 28,
    dueDate: '2026-10-14',
    internalOnly: false,
    clientVisible: true,
    rank: 10,
    checklist: [
      { id: 'chk-22', text: 'SAP IDoc webhook listener', completed: true },
      { id: 'chk-23', text: 'Distributed lock with Redis Redlock', completed: true },
      { id: 'chk-24', text: 'Dead-letter queue for failed syncs', completed: false }
    ],
    createdAt: '2026-09-20T08:00:00Z',
    updatedAt: '2026-10-04T11:00:00Z'
  },
  {
    id: 'iss-202',
    key: 'ECP-202',
    projectId: 'prj-2',
    type: 'bug',
    title: 'Diskon voucher bertingkat ganda saat checkout bersamaan (Race Condition)',
    description: 'User dapat menerapkan 2 voucher flash sale jika menekan tombol Checkout secara spam di browser ganda.',
    statusId: 'code_review',
    priority: 'urgent',
    assigneeId: 'usr-3',
    reporterId: 'usr-6',
    labels: ['Checkout', 'Security', 'Bug'],
    storyPoints: 5,
    estimateHours: 16,
    actualHours: 14,
    dueDate: '2026-10-08',
    internalOnly: false,
    clientVisible: true,
    rank: 11,
    checklist: [
      { id: 'chk-25', text: 'Isolate transaction lock per cart ID', completed: true },
      { id: 'chk-26', text: 'Database optimistic concurrency control check', completed: true }
    ],
    createdAt: '2026-10-01T14:00:00Z',
    updatedAt: '2026-10-05T08:00:00Z'
  },
  {
    id: 'iss-203',
    key: 'ECP-203',
    projectId: 'prj-2',
    type: 'task',
    title: 'Optimasi Checkout Loading Time (LCP < 1.2s) & Image CDN WebP Conversion',
    description: 'Compress gambar katalog dan lazy-load widget rekomendasi produk AI.',
    statusId: 'ready',
    priority: 'medium',
    assigneeId: 'usr-4',
    reporterId: 'usr-2',
    labels: ['Frontend', 'Performance'],
    storyPoints: 3,
    estimateHours: 14,
    actualHours: 4,
    dueDate: '2026-10-18',
    internalOnly: false,
    clientVisible: true,
    rank: 12,
    checklist: [],
    createdAt: '2026-10-02T09:00:00Z',
    updatedAt: '2026-10-02T09:00:00Z'
  },

  // --- IOT (Astra Logistik Fleet IoT) Issues ---
  {
    id: 'iss-301',
    key: 'IOT-301',
    projectId: 'prj-3',
    type: 'story',
    title: 'Dashboard Peta Live Tracking Armada dengan Geofencing Alert Area Bongkar Muat',
    description: 'Peta interaktif menampilkan posisi 450 armada truk kontainer, status mesin aktif/mati, kecepatan, dan trigger notifikasi saat truk masuk/keluar depot.',
    statusId: 'in_progress',
    priority: 'high',
    assigneeId: 'usr-5',
    reporterId: 'usr-2',
    labels: ['Maps', 'IoT', 'Telemetry'],
    storyPoints: 13,
    estimateHours: 40,
    actualHours: 25,
    dueDate: '2026-10-25',
    internalOnly: false,
    clientVisible: true,
    rank: 13,
    checklist: [
      { id: 'chk-27', text: 'WebSocket stream telemetry ingest', completed: true },
      { id: 'chk-28', text: 'Mapbox / Leaflet vehicle clustering', completed: true },
      { id: 'chk-29', text: 'Polygon geofence ray-casting engine', completed: false }
    ],
    createdAt: '2026-09-25T10:00:00Z',
    updatedAt: '2026-10-05T10:30:00Z'
  },
  {
    id: 'iss-302',
    key: 'IOT-302',
    projectId: 'prj-3',
    type: 'task',
    title: 'Sensor Kalibrasi Konsumsi Bahan Bakar (BBM) vs Estimasi Kilometer',
    description: 'Algoritma machine learning deteksi indikasi pencurian bahan bakar saat truk berhenti di pinggir jalan tol.',
    statusId: 'ready',
    priority: 'medium',
    assigneeId: 'usr-1',
    reporterId: 'usr-2',
    labels: ['AI', 'Sensors', 'Algorithm'],
    storyPoints: 8,
    estimateHours: 24,
    actualHours: 0,
    dueDate: '2026-11-05',
    internalOnly: false,
    clientVisible: true,
    rank: 14,
    checklist: [],
    createdAt: '2026-09-28T14:00:00Z',
    updatedAt: '2026-09-28T14:00:00Z'
  },

  // --- DSY (Design System) & PGW Issues ---
  {
    id: 'iss-401',
    key: 'DSY-401',
    projectId: 'prj-4',
    type: 'task',
    title: 'Standardisasi Dark Mode Color Tokens & Accessible Contrast 4.5:1',
    description: 'Audit palette warna Tailwind 4 dan sinkronisasi dengan Figma library tokens.',
    statusId: 'done',
    priority: 'medium',
    assigneeId: 'usr-7',
    reporterId: 'usr-1',
    labels: ['DesignSystem', 'Tokens', 'UI'],
    storyPoints: 5,
    estimateHours: 20,
    actualHours: 18,
    dueDate: '2026-09-30',
    internalOnly: true,
    clientVisible: false,
    rank: 15,
    checklist: [
      { id: 'chk-30', text: 'W3C Contrast ratio validation', completed: true },
      { id: 'chk-31', text: 'Figma Token studio JSON export', completed: true }
    ],
    createdAt: '2026-09-15T09:00:00Z',
    updatedAt: '2026-09-30T16:00:00Z'
  },
  {
    id: 'iss-501',
    key: 'PGW-501',
    projectId: 'prj-5',
    type: 'epic',
    title: 'Sertifikasi Keamanan PCI-DSS Level 1 & Penetration Testing Readiness',
    description: 'Semua konfigurasi firewall, TLS 1.3 mTLS, data encryption at rest (AES-256), dan HSM keystore.',
    statusId: 'ready',
    priority: 'urgent',
    assigneeId: 'usr-1',
    reporterId: 'usr-2',
    labels: ['PCI-DSS', 'Compliance', 'Security'],
    storyPoints: 13,
    estimateHours: 60,
    actualHours: 10,
    dueDate: '2026-11-20',
    internalOnly: false,
    clientVisible: true,
    rank: 16,
    checklist: [],
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-04T09:00:00Z'
  }
];

export const SEED_TIME_ENTRIES: TimeEntry[] = [
  {
    id: 'te-1',
    userId: 'usr-4',
    userName: 'Siti Rahma',
    issueId: 'iss-101',
    issueKey: 'MBN-101',
    projectId: 'prj-1',
    projectName: 'Mobile Banking 3.0 Revamp',
    date: '2026-10-05',
    hours: 5.5,
    billable: true,
    category: 'Development',
    note: 'Implementasi hook biometrik React Native dan handle error fallback UI',
    status: 'submitted'
  },
  {
    id: 'usr-3-te',
    userId: 'usr-3',
    userName: 'Budi Santoso',
    issueId: 'iss-102',
    issueKey: 'MBN-102',
    projectId: 'prj-1',
    projectName: 'Mobile Banking 3.0 Revamp',
    date: '2026-10-05',
    hours: 7.0,
    billable: true,
    category: 'Development',
    note: 'Menulis unit test EMVCo parser dan benchmark 1.000 concurrent QR validations',
    status: 'submitted'
  },
  {
    id: 'te-3',
    userId: 'usr-6',
    userName: 'Maya Anggraini',
    issueId: 'iss-103',
    issueKey: 'MBN-103',
    projectId: 'prj-1',
    projectName: 'Mobile Banking 3.0 Revamp',
    date: '2026-10-04',
    hours: 4.0,
    billable: true,
    category: 'QA & Testing',
    note: 'Verifikasi penanganan 401 token refresh pada simulasi network latency',
    status: 'approved'
  },
  {
    id: 'te-4',
    userId: 'usr-2',
    userName: 'Rian Hidayat',
    projectId: 'prj-1',
    projectName: 'Mobile Banking 3.0 Revamp',
    date: '2026-10-03',
    hours: 3.5,
    billable: true,
    category: 'Project Management',
    note: 'Sprint 4 review progress meeting dengan Pak Bambang (VP Mandiri)',
    status: 'approved'
  },
  {
    id: 'te-5',
    userId: 'usr-7',
    userName: 'Dina Putri',
    issueId: 'iss-104',
    issueKey: 'MBN-104',
    projectId: 'prj-1',
    projectName: 'Mobile Banking 3.0 Revamp',
    date: '2026-10-04',
    hours: 6.0,
    billable: true,
    category: 'UI/UX Design',
    note: 'Finalisasi desain invoice / struk transaksi mobile banking',
    status: 'approved'
  }
];

export const SEED_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    number: 'INV-2026-09-001',
    clientId: 'cl-1',
    clientName: 'PT Bank Mandiri Digital',
    projectId: 'prj-1',
    projectName: 'Mobile Banking 3.0 Revamp',
    items: [
      {
        id: 'itm-1',
        description: 'Termin 1 (30%): Arsitektur Dasar, Security Core & Design Blueprint',
        quantity: 1,
        unit: 'Milestone',
        rate: 285000000,
        amount: 285000000
      },
      {
        id: 'itm-2',
        description: 'Dedicated DevSecOps AWS Vault Provisioning & Pentest Report',
        quantity: 1,
        unit: 'Package',
        rate: 15000000,
        amount: 15000000
      }
    ],
    subtotal: 300000000,
    taxPercent: 11,
    taxAmount: 33000000,
    discountAmount: 0,
    totalAmount: 333000000,
    status: 'paid',
    issueDate: '2026-09-16',
    dueDate: '2026-09-30',
    notes: 'Pembayaran telah diterima lunas via Transfer Bank Mandiri Corporate.'
  },
  {
    id: 'inv-2',
    number: 'INV-2026-10-002',
    clientId: 'cl-1',
    clientName: 'PT Bank Mandiri Digital',
    projectId: 'prj-1',
    projectName: 'Mobile Banking 3.0 Revamp',
    items: [
      {
        id: 'itm-3',
        description: 'Termin 2 (35%): Modul Otentikasi Biometrik, QRIS Engine & UAT Staging',
        quantity: 1,
        unit: 'Milestone',
        rate: 332500000,
        amount: 332500000
      },
      {
        id: 'itm-4',
        description: 'High-Concurrency Load Testing 2000 TPS Virtual Users',
        quantity: 1,
        unit: 'Package',
        rate: 17500000,
        amount: 17500000
      }
    ],
    subtotal: 350000000,
    taxPercent: 11,
    taxAmount: 38500000,
    discountAmount: 0,
    totalAmount: 388500000,
    status: 'sent',
    issueDate: '2026-10-01',
    dueDate: '2026-10-15',
    notes: 'Jatuh tempo pada tanggal 15 Oktober 2026. Mohon konfirmasi approval via Client Portal.'
  },
  {
    id: 'inv-3',
    number: 'INV-2026-10-003',
    clientId: 'cl-2',
    clientName: 'PT Nusantara Retail Group',
    projectId: 'prj-2',
    projectName: 'E-Commerce Omnichannel Platform',
    items: [
      {
        id: 'itm-5',
        description: 'Billing Time & Material Bulan September 2026 (180 Jam Engineering)',
        quantity: 180,
        unit: 'Hours',
        rate: 750000,
        amount: 135000000
      }
    ],
    subtotal: 135000000,
    taxPercent: 11,
    taxAmount: 14850000,
    discountAmount: 5000000,
    totalAmount: 144850000,
    status: 'draft',
    issueDate: '2026-10-05',
    dueDate: '2026-10-20',
    notes: 'Diskon loyalty agency sebesar Rp 5.000.000 disertakan.'
  }
];

export const SEED_TEST_CASES: TestCase[] = [
  {
    id: 'tc-1',
    projectId: 'prj-1',
    suite: 'Security & Auth',
    title: 'Login Biometrik Sukses pada Android 14 & iOS 18',
    steps: [
      '1. Daftarkan sidik jari / FaceID pada pengaturan device',
      '2. Buka aplikasi MBN dan aktifkan toggle "Login Biometrik"',
      '3. Masukkan m-PIN untuk autorisasi kunci publik ke server',
      '4. Tutup app, buka kembali, lalu scan biometrik saat prompt muncul'
    ],
    expected: 'Aplikasi langsung masuk ke Dashboard dengan token JWT valid tanpa input m-PIN manual.',
    priority: 'high',
    status: 'pass',
    lastRunDate: '2026-10-05',
    linkedIssueKey: 'MBN-101'
  },
  {
    id: 'tc-2',
    projectId: 'prj-1',
    suite: 'Payment & QRIS',
    title: 'Validasi QRIS Expired Dynamic Transaction',
    steps: [
      '1. Buka scan QRIS',
      '2. Pindai barcode merchant yang dibuat > 5 menit yang lalu',
      '3. Tekan Lanjutkan Pembayaran'
    ],
    expected: 'Muncul dialog peringatan "Kode QR sudah kadaluwarsa, silakan minta QR baru dari kasir". Transaksi dibatalkan aman.',
    priority: 'high',
    status: 'pass',
    lastRunDate: '2026-10-04',
    linkedIssueKey: 'MBN-102'
  },
  {
    id: 'tc-3',
    projectId: 'prj-1',
    suite: 'Edge Cases',
    title: 'Simulasi Network Handover saat Proses Transfer Uang',
    steps: [
      '1. Hubungkan iPhone ke Wi-Fi kantor',
      '2. Masukkan nominal transfer Rp 1.500.000 dan input PIN',
      '3. Matikan Wi-Fi tepat saat loading spinner berputar (handover ke 4G)'
    ],
    expected: 'Aplikasi melakukan silent retry idempotency key tanpa mendebet saldo rekening 2 kali.',
    priority: 'high',
    status: 'fail',
    lastRunDate: '2026-10-05',
    linkedIssueKey: 'MBN-103'
  }
];

export const SEED_DOCS: ProjectDoc[] = [
  {
    id: 'doc-1',
    projectId: 'prj-1',
    title: 'PRD: Mobile Banking 3.0 Architecture & Security Standard',
    category: 'PRD',
    content: `# Mobile Banking 3.0 Product Requirements

## 1. Executive Summary
Transformasi platform mobile banking Bank Mandiri untuk generasi muda dengan SLA respon transaksi < 350ms, uptime 99.99%, dan keamanan standar PCI-DSS serta regulasi OJK & Bank Indonesia.

## 2. Core Pillars
- **Zero-Trust Security**: Otentikasi berbasis FIDO2 biometrik dengan Secure Enclave.
- **Universal Payment**: QRIS Cross-Border (Singapura, Malaysia, Thailand), BI-FAST real-time.
- **Micro-Frontend Architecture**: Modul investasi, pinjaman, dan transfer independen.

## 3. Key Non-Functional Requirements
- Peak Concurrency: 5.000 TPS tanpa degradasi respon.
- App startup time: < 1.2 detik pada device kelas menengah.`,
    authorId: 'usr-2',
    updatedAt: '2026-09-22',
    version: 'v1.4'
  },
  {
    id: 'doc-2',
    projectId: 'prj-1',
    title: 'API Specification: QRIS Transaction Switcher Engine',
    category: 'SRS',
    content: `# Spesifikasi Integrasi QRIS Merchant MPM/CPM

## Endpoint Ingest
\`POST /api/v3/qris/decode\`
Menerima payload string TLV (Tag-Length-Value) sesuai standar EMVCo QR Code Specification.

### Response Codes:
- 200 OK: Payload parsed successfully
- 400 Bad Request: Invalid CRC checksum
- 410 Gone: QR Code timestamp expired`,
    authorId: 'usr-1',
    updatedAt: '2026-09-29',
    version: 'v2.0'
  }
];

export const SEED_COMMENTS: Comment[] = [
  {
    id: 'cmt-1',
    issueId: 'iss-101',
    authorId: 'usr-4',
    authorName: 'Siti Rahma',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    content: 'Library FIDO2 sudah diuji di simulator iPhone 16 Pro dan Pixel 8. FaceID bekerja responsif, tinggal menambahkan visual feedback saat sensor sedang membaca wajah.',
    internalOnly: false,
    createdAt: '2026-10-04T10:15:00Z',
    reactions: [{ emoji: '🚀', count: 3, userIds: ['usr-1', 'usr-2', 'usr-3'] }]
  },
  {
    id: 'cmt-2',
    issueId: 'iss-101',
    authorId: 'usr-1',
    authorName: 'Aditya Pratama',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    content: 'Perhatian tim dev: pastikan secret key tidak pernah di-log ke console production. CISO Mandiri sangat ketat mengenai hal ini.',
    internalOnly: true, // FR-11A: Internal only, hidden from client
    createdAt: '2026-10-04T11:00:00Z',
    reactions: [{ emoji: '🔒', count: 2, userIds: ['usr-3', 'usr-4'] }]
  },
  {
    id: 'cmt-3',
    issueId: 'iss-104',
    authorId: 'usr-client',
    authorName: 'Bambang Sudiro (Client Mandiri)',
    authorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80',
    content: 'Tampilan struk transaksi sudah terlihat elegan dan sesuai warna brand Mandiri biru-kuning. Tolong pastikan font pada nomor referensi mudah dibaca lansia ya.',
    internalOnly: false,
    createdAt: '2026-10-05T08:30:00Z',
    reactions: [{ emoji: '👍', count: 4, userIds: ['usr-2', 'usr-7', 'usr-4', 'usr-1'] }]
  }
];

export const SEED_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    entityType: 'issue',
    entityId: 'iss-101',
    actorName: 'Siti Rahma',
    action: 'Status Transisi',
    details: 'Status diubah dari Ready ke In Progress',
    timestamp: '2 jam yang lalu'
  },
  {
    id: 'act-2',
    entityType: 'issue',
    entityId: 'iss-103',
    actorName: 'Maya Anggraini',
    action: 'Bug Report',
    details: 'Melaporkan bug token refresh gagal saat network handover',
    timestamp: '4 jam yang lalu'
  },
  {
    id: 'act-3',
    entityType: 'milestone',
    entityId: 'ms-1',
    actorName: 'Bambang Sudiro',
    action: 'Deliverable Approved',
    details: 'Milestone 1 Security Audit disetujui oleh Klien Mandiri',
    timestamp: 'Kemarin'
  },
  {
    id: 'act-4',
    entityType: 'invoice',
    entityId: 'inv-2',
    actorName: 'Hendra Kusuma',
    action: 'Invoice Sent',
    details: 'Invoice INV-2026-10-002 dikirim ke PT Bank Mandiri Digital',
    timestamp: '3 hari yang lalu'
  }
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'usr-2',
    title: 'Komentar Baru dari Klien',
    description: 'Bambang Sudiro memberikan feedback pada issue MBN-104 (Layar Struk Transaksi).',
    type: 'mention',
    read: false,
    createdAt: '1 jam yang lalu',
    issueKey: 'MBN-104'
  },
  {
    id: 'notif-2',
    userId: 'usr-4',
    title: 'Bug Urgent Ditugaskan',
    description: 'Maya menugaskan MBN-103 (Gagal refresh token jaringan) untuk perbaikan.',
    type: 'assigned',
    read: false,
    createdAt: '3 jam yang lalu',
    issueKey: 'MBN-103'
  },
  {
    id: 'notif-3',
    userId: 'usr-2',
    title: 'Milestone Menunggu Review UAT',
    description: 'Milestone 2: Biometric & QRIS UAT siap direview bersama klien.',
    type: 'approval',
    read: true,
    createdAt: 'Kemarin'
  }
];
