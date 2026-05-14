'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ExternalLink, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { type PlantWithRelations } from '@/types';
import { truncate } from '@/lib/utils';

interface PlantCardProps {
  plant: PlantWithRelations;
  index: number;
}

export default function PlantCard({ plant, index }: PlantCardProps) {
  const router = useRouter();
  const images = plant.plant_images ?? [];
  const tags = plant.plant_tags?.slice(0, 2) ?? [];
  const [activeImage, setActiveImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle images every 3 seconds
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length, isPaused]);

  const currentImageUrl = images[activeImage]?.url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      whileTap={{ scale: 0.97 }}
      layout
      onClick={() => router.push(`/plant/${plant.id}`)}
      className="relative bg-white rounded-2xl overflow-hidden shadow-card
                 hover:shadow-card-hover
                 transition-shadow duration-300 cursor-pointer border border-cream-200"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Image Section with Auto-Scroll */}
      <div className="relative aspect-[4/3] overflow-hidden bg-forest-50">
        {currentImageUrl ? (
          <>
            {/* Preload all images for smooth transitions */}
            {images.map((img, i) => (
              <Image
                key={img.id}
                src={img.url}
                alt={plant.name}
                fill
                className={`object-cover transition-opacity duration-700 ease-in-out ${
                  i === activeImage ? 'opacity-100' : 'opacity-0'
                }`}
                sizes="(max-width: 768px) 50vw, 33vw"
                priority={i === 0 && index < 4}
              />
            ))}
            <div className="absolute inset-0 plant-card-image-overlay" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center
                          bg-gradient-to-br from-forest-100 to-sage-100">
            <Leaf className="w-8 h-8 text-forest-400" />
          </div>
        )}

        {/* Category Badge (top-left) */}
        {plant.plant_categories?.name && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full
                             text-[10px] font-semibold font-body uppercase tracking-wide
                             bg-white/90 text-forest-700 backdrop-blur-sm">
              {plant.plant_categories.name}
            </span>
          </div>
        )}

        {/* Image Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <span
                key={i}
                className={`block rounded-full transition-all duration-300 ${
                  i === activeImage
                    ? 'w-3 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3">
        {/* Plant Name */}
        <h3 className="font-display font-semibold text-base text-forest-900 leading-tight mb-0.5 line-clamp-1">
          {plant.name}
        </h3>

        {/* Scientific Name */}
        {plant.scientific_name && (
          <p className="text-[11px] italic text-gray-400 font-body mb-1.5 line-clamp-1">
            {plant.scientific_name}
          </p>
        )}

        {/* Short Description */}
        {plant.short_desc && (
          <p className="text-xs text-gray-600 font-body leading-relaxed line-clamp-2 mb-2">
            {plant.short_desc}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center px-2 py-0.5 rounded-full
                           text-[10px] font-medium font-body
                           bg-sage-50 text-sage-700 border border-sage-200"
              >
                {t.tag}
              </span>
            ))}
          </div>
        )}

        {/* Medicinal Highlight */}
        {plant.medicinal_uses && (
          <div className="flex items-start gap-1.5 mb-2 bg-forest-50 rounded-lg px-2.5 py-1.5">
            <span className="text-[10px] leading-tight text-forest-700 font-body line-clamp-2">
              <span className="font-semibold">Uses: </span>
              {truncate(plant.medicinal_uses, 60)}
            </span>
          </div>
        )}

        {/* Wikipedia CTA */}
        {plant.wikipedia_url && (
          <a
            href={plant.wikipedia_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[10px] text-forest-600
                       hover:text-forest-800 font-medium font-body transition-colors"
          >
            <ExternalLink className="w-2.5 h-2.5" />
            <span>Wikipedia</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}
