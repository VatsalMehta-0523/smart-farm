'use client';

import { AnimatePresence } from 'framer-motion';
import PlantCard from './PlantCard';
import { type PlantWithRelations } from '@/types';
import { UI } from '@/lib/constants';

interface PlantGridProps {
  plants: PlantWithRelations[];
  loading: boolean;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-cream-200">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-4 skeleton rounded-lg w-3/4" />
        <div className="h-3 skeleton rounded-lg w-1/2" />
        <div className="h-3 skeleton rounded-lg w-full" />
        <div className="h-3 skeleton rounded-lg w-5/6" />
      </div>
    </div>
  );
}

export default function PlantGrid({ plants, loading }: PlantGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-forest-50 flex items-center justify-center mb-4">
          <span className="text-3xl">🌿</span>
        </div>
        <p className="text-base font-display font-medium text-forest-800 mb-1">
          No plants found
        </p>
        <p className="text-sm text-gray-500 font-body">
          {UI.search.noResults}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      <AnimatePresence mode="popLayout">
        {plants.map((plant, index) => (
          <PlantCard key={plant.id} plant={plant} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
}
