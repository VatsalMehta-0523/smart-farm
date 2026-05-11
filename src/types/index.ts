// ─── Core Domain Types ────────────────────────────────────────────────────────

export type PlantStatus = 'published' | 'draft' | 'hidden';

export interface PlantCategory {
  id: string;
  name: string;
}

export interface PlantImage {
  id: string;
  plant_id: string;
  url: string;
  order_index: number;
  created_at: string;
}

export interface PlantTag {
  id: string;
  plant_id: string;
  tag: string;
}

export interface Plant {
  id: string;
  farm_id?: string | null;
  slug: string;
  name: string;
  scientific_name?: string | null;
  category_id?: string | null;
  short_desc?: string | null;
  medicinal_uses?: string | null;
  folklore?: string | null;
  genome_data?: Record<string, unknown> | null;
  wikipedia_url?: string | null;
  status: PlantStatus;
  qr_url?: string | null;
  created_at: string;
  updated_at: string;
  // Joined relations
  plant_categories?: PlantCategory | null;
  plant_images?: PlantImage[];
  plant_tags?: PlantTag[];
}

export interface PlantWithRelations extends Plant {
  plant_categories: PlantCategory | null;
  plant_images: PlantImage[];
  plant_tags: PlantTag[];
}

// ─── Admin Types ──────────────────────────────────────────────────────────────

export interface Admin {
  id: string;
  farm_id?: string | null;
  created_at: string;
}

// ─── Form / Modal Types ───────────────────────────────────────────────────────

export interface PlantFormData {
  // Step 1
  name: string;
  scientific_name: string;
  category_id: string;
  short_desc: string;
  // Step 2
  medicinal_uses: string;
  folklore: string;
  genome_data: string; // JSON string in form, parsed on submit
  wikipedia_url: string;
  // Step 3 — images handled separately
  // Step 5
  status: PlantStatus;
}

export interface ImageUpload {
  file: File;
  preview: string;
  order_index: number;
}

// ─── Chat Types ───────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ─── Filter / Search Types ────────────────────────────────────────────────────

export type FilterCategory =
  | 'all'
  | 'Medicinal'
  | 'Herbs'
  | 'Flowers'
  | 'Aromatic'
  | 'Seasonal'
  | 'Rare Plants';

export interface SearchFilters {
  category: FilterCategory;
  query: string;
}

// ─── Supabase Response Wrappers ───────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
}
