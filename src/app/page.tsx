'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { type PlantWithRelations, type FilterCategory } from '@/types';
import TopBar from '@/components/visitor/TopBar';
import FilterStrip from '@/components/visitor/FilterStrip';
import PlantGrid from '@/components/visitor/PlantGrid';
import QRScanner from '@/components/visitor/QRScanner';
import ChatBot from '@/components/visitor/ChatBot';

export default function HomePage() {
  const [plants, setPlants] = useState<PlantWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [qrOpen, setQrOpen] = useState(false);

  const fetchPlants = useCallback(async () => {
    setLoading(true);
    const supabase = getSupabaseClient();

    let query = supabase
      .from('plants')
      .select(`
        *,
        plant_categories ( id, name ),
        plant_images ( id, plant_id, url, order_index, created_at ),
        plant_tags ( id, plant_id, tag )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    // Search filter
    if (searchQuery.trim()) {
      query = query.or(
        `name.ilike.%${searchQuery}%,scientific_name.ilike.%${searchQuery}%,short_desc.ilike.%${searchQuery}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching plants:', error);
      setPlants([]);
    } else {
      let results = (data ?? []) as PlantWithRelations[];

      // Client-side category filter (category is in joined table)
      if (activeFilter !== 'all') {
        results = results.filter(
          (p) => p.plant_categories?.name === activeFilter
        );
      }

      // Sort images by order_index
      results = results.map((p) => ({
        ...p,
        plant_images: [...(p.plant_images ?? [])].sort(
          (a, b) => a.order_index - b.order_index
        ),
      }));

      setPlants(results);
    }

    setLoading(false);
  }, [searchQuery, activeFilter]);

  useEffect(() => {
    const debounce = setTimeout(fetchPlants, searchQuery ? 300 : 0);
    return () => clearTimeout(debounce);
  }, [fetchPlants, searchQuery]);

  return (
    <div className="min-h-screen organic-bg">
      {/* Sticky Top Bar */}
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onQRClick={() => setQrOpen(true)}
      />

      {/* Filter Strip */}
      <FilterStrip active={activeFilter} onChange={setActiveFilter} />

      {/* Plant Grid */}
      <main>
        <PlantGrid plants={plants} loading={loading} />
        {/* Bottom padding so last cards aren't behind FAB */}
        <div className="h-24" />
      </main>

      {/* QR Scanner Modal */}
      <QRScanner isOpen={qrOpen} onClose={() => setQrOpen(false)} />

      {/* AI Chatbot */}
      <ChatBot />
    </div>
  );
}
