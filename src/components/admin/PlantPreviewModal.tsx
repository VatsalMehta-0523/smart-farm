'use client';

import Image from 'next/image';
import { X, ExternalLink, Leaf, FlaskConical, BookOpen, Dna, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { type PlantWithRelations } from '@/types';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

interface PlantPreviewModalProps {
  plant: PlantWithRelations;
  onClose: () => void;
  onEdit: () => void;
}

export default function PlantPreviewModal({ plant, onClose, onEdit }: PlantPreviewModalProps) {
  const images = [...(plant.plant_images ?? [])].sort((a, b) => a.order_index - b.order_index);
  const primaryImage = images[0]?.url;
  const genomeEntries = plant.genome_data
    ? Object.entries(plant.genome_data as Record<string, string>)
    : [];

  return (
    <div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-lg rounded-3xl shadow-modal max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative aspect-video flex-shrink-0 bg-forest-100 overflow-hidden">
          {primaryImage ? (
            <Image src={primaryImage} alt={plant.name} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-forest-200 to-sage-200 flex items-center justify-center">
              <Leaf className="w-12 h-12 text-forest-500" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent" />

          {/* Controls */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm
                         rounded-lg text-white text-xs font-medium font-body border border-white/30
                         hover:bg-white/30 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg
                         flex items-center justify-center border border-white/30
                         hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Plant Info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-1.5">
              {plant.plant_categories?.name && (
                <span className="text-[10px] font-bold uppercase tracking-wider
                                 bg-sage-500/90 text-white px-2 py-0.5 rounded-full">
                  {plant.plant_categories.name}
                </span>
              )}
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_COLORS[plant.status]}`}>
                {STATUS_LABELS[plant.status]}
              </span>
            </div>
            <h2 className="font-display font-bold text-xl text-white">{plant.name}</h2>
            {plant.scientific_name && (
              <p className="text-sm italic text-white/70 font-body">{plant.scientific_name}</p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center gap-3 text-xs text-gray-400 font-body">
            <span>Added {formatDate(plant.created_at)}</span>
            {plant.qr_url && (
              <>
                <span>·</span>
                <a href={plant.qr_url} target="_blank" rel="noopener noreferrer"
                   className="text-forest-600 hover:underline">View QR</a>
              </>
            )}
          </div>

          {plant.short_desc && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-forest-600" />
                <h3 className="text-sm font-semibold text-forest-900 font-body">Overview</h3>
              </div>
              <p className="text-sm text-gray-700 font-body leading-relaxed">{plant.short_desc}</p>
            </section>
          )}

          {plant.medicinal_uses && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical className="w-4 h-4 text-sage-600" />
                <h3 className="text-sm font-semibold text-forest-900 font-body">Medicinal Uses</h3>
              </div>
              <p className="text-sm text-gray-700 font-body leading-relaxed">{plant.medicinal_uses}</p>
            </section>
          )}

          {plant.folklore && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-forest-900 font-body">Folklore</h3>
              </div>
              <p className="text-sm text-gray-600 font-body leading-relaxed italic">
                &ldquo;{plant.folklore}&rdquo;
              </p>
            </section>
          )}

          {genomeEntries.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <Dna className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-forest-900 font-body">Scientific Data</h3>
              </div>
              <div className="bg-cream-50 rounded-xl p-3 space-y-1.5 border border-cream-200">
                {genomeEntries.map(([k, v]) => (
                  <div key={k} className="flex items-start gap-3">
                    <span className="text-xs font-semibold text-gray-500 font-body min-w-[80px] capitalize">
                      {k.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-gray-700 font-body">{String(v)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {plant.wikipedia_url && (
            <a
              href={plant.wikipedia_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-forest-600 hover:text-forest-800
                         font-medium font-body transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View on Wikipedia
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}
