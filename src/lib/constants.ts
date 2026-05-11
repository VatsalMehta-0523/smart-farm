// ─── App Identity ─────────────────────────────────────────────────────────────
export const APP = {
  name: process.env.NEXT_PUBLIC_FARM_NAME ?? 'Smart Farm',
  tagline: 'Explore the living world around you',
  description: 'Discover the plants, herbs, and medicinal wonders of our farm.',
} as const;

// ─── Filter Categories ────────────────────────────────────────────────────────
export const FILTER_CHIPS = [
  { label: 'All', value: 'all' },
  { label: 'Medicinal', value: 'Medicinal' },
  { label: 'Herbs', value: 'Herbs' },
  { label: 'Flowers', value: 'Flowers' },
  { label: 'Aromatic', value: 'Aromatic' },
  { label: 'Seasonal', value: 'Seasonal' },
  { label: 'Rare Plants', value: 'Rare Plants' },
] as const;

// ─── Plant Statuses ───────────────────────────────────────────────────────────
export const STATUS_LABELS = {
  published: 'Published',
  draft: 'Draft',
  hidden: 'Hidden',
} as const;

export const STATUS_COLORS = {
  published: 'bg-forest-100 text-forest-700 border border-forest-200',
  draft: 'bg-amber-50 text-amber-700 border border-amber-200',
  hidden: 'bg-gray-100 text-gray-500 border border-gray-200',
} as const;

// ─── Add Plant Modal Steps ────────────────────────────────────────────────────
export const ADD_PLANT_STEPS = [
  { id: 1, label: 'Basic Info', icon: '🌿' },
  { id: 2, label: 'Details', icon: '📖' },
  { id: 3, label: 'Media', icon: '📷' },
  { id: 4, label: 'QR Code', icon: '📱' },
  { id: 5, label: 'Publish', icon: '🚀' },
] as const;

// ─── Default Categories (seeded in DB; shown as fallback) ────────────────────
export const DEFAULT_CATEGORIES = [
  'Medicinal',
  'Herbs',
  'Flowers',
  'Aromatic',
  'Seasonal',
  'Rare Plants',
] as const;

// ─── PDF Footer ───────────────────────────────────────────────────────────────
export const PDF_FOOTER_CTA =
  'Scan the QR code or search the plant name to explore more digitally.';

// ─── UI Strings ───────────────────────────────────────────────────────────────
export const UI = {
  search: {
    placeholder: 'Search plants, herbs, botanicals…',
    noResults: 'No plants found. Try a different search or filter.',
  },
  admin: {
    loginTitle: 'Farm Admin',
    loginSubtitle: 'Sign in to manage your farm',
    dashboardTitle: 'Plant Management',
    addPlant: 'Add Plant',
    confirmDelete: 'Are you sure you want to delete this plant? This action cannot be undone.',
  },
  chatbot: {
    title: 'Ask the Farm',
    placeholder: 'Ask anything about plants, remedies, cultivation…',
    welcome: 'Hello! I\'m your farm guide. Ask me anything about the plants here — their uses, history, cultivation, or medicinal properties.',
  },
} as const;

// ─── Supabase Storage ─────────────────────────────────────────────────────────
export const STORAGE = {
  plantImages: 'plant-images',
  qrCodes: 'qr-codes',
} as const;
