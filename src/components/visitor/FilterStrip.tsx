'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FILTER_CHIPS } from '@/lib/constants';
import { type FilterCategory } from '@/types';
import { cn } from '@/lib/utils';

interface FilterStripProps {
  active: FilterCategory;
  onChange: (cat: FilterCategory) => void;
}

export default function FilterStrip({ active, onChange }: FilterStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto hide-scrollbar
                 border-b border-cream-200 bg-cream-50"
    >
      {FILTER_CHIPS.map((chip) => {
        const isActive = active === chip.value;
        return (
          <motion.button
            key={chip.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => onChange(chip.value as FilterCategory)}
            className={cn(
              'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium font-body',
              'transition-all duration-200 whitespace-nowrap',
              isActive
                ? 'bg-forest-700 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-cream-300 hover:border-forest-400 hover:text-forest-700'
            )}
          >
            {chip.label}
          </motion.button>
        );
      })}
    </div>
  );
}
