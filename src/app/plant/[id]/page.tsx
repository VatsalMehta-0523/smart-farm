'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft, ExternalLink, Leaf, FlaskConical,
  BookOpen, Dna, Sparkles, ChevronLeft, ChevronRight, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseClient } from '@/lib/supabase';
import { type PlantWithRelations } from '@/types';
import ChatBot from '@/components/visitor/ChatBot';

export default function PlantPage() {
  const params = useParams();
  const router = useRouter();
  const [plant, setPlant] = useState<PlantWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetchPlant() {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('plants')
        .select(`
          *,
          plant_categories ( id, name ),
          plant_images ( id, plant_id, url, order_index, created_at ),
          plant_tags ( id, plant_id, tag )
        `)
        .eq('id', params.id)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        const p = data as PlantWithRelations;
        p.plant_images = [...(p.plant_images ?? [])].sort(
          (a, b) => a.order_index - b.order_index
        );
        setPlant(p);
      }
      setLoading(false);
    }
    fetchPlant();
  }, [params.id]);

  // Smart back navigation: if no browser history, go to homepage
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Leaf className="w-8 h-8 text-forest-500 animate-pulse" />
          <p className="text-sm text-gray-500 font-body">Loading plant…</p>
        </div>
      </div>
    );
  }

  if (notFound || !plant) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center p-6">
        <p className="text-lg font-display font-semibold text-forest-800 mb-2">Plant not found</p>
        <p className="text-sm text-gray-500 font-body mb-6">
          This plant may have been removed or is not yet published.
        </p>
        <button onClick={() => router.push('/')} className="btn-primary">
          Back to Farm
        </button>
      </div>
    );
  }

  const images = plant.plant_images ?? [];
  const genomeEntries = plant.genome_data
    ? Object.entries(plant.genome_data as Record<string, string>)
    : [];

  // Animation variants for content sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: 0.1 + i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    }),
  };

  return (
    <div className="min-h-screen bg-cream-50 pb-28">
      {/* Hero Image Gallery */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] bg-forest-900 overflow-hidden">
        <AnimatePresence mode="wait">
          {images.length > 0 ? (
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={images[activeImage].url}
                alt={plant.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-forest-950/20" />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-forest-800 to-forest-950 flex items-center justify-center">
              <Leaf className="w-16 h-16 text-forest-600" />
            </div>
          )}
        </AnimatePresence>

        {/* Back Button — smart navigation */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full
                     bg-white/20 backdrop-blur-sm flex items-center justify-center
                     hover:bg-white/30 transition-all duration-200 border border-white/30
                     active:scale-90"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Home Button — always visible, top-right */}
        <button
          onClick={() => router.push('/')}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full
                     bg-white/20 backdrop-blur-sm flex items-center justify-center
                     hover:bg-white/30 transition-all duration-200 border border-white/30
                     active:scale-90"
        >
          <Home className="w-5 h-5 text-white" />
        </button>

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full
                         bg-white/20 backdrop-blur-sm flex items-center justify-center
                         hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setActiveImage((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full
                         bg-white/20 backdrop-blur-sm flex items-center justify-center
                         hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    i === activeImage ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Plant name overlay */}
        <div className="absolute bottom-6 left-5 right-5 z-10">
          {plant.plant_categories?.name && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full
                         text-[10px] font-semibold font-body uppercase tracking-wider
                         bg-sage-500/90 text-white mb-2"
            >
              {plant.plant_categories.name}
            </motion.span>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display font-bold text-2xl text-white leading-tight drop-shadow-md"
          >
            {plant.name}
          </motion.h1>
          {plant.scientific_name && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm italic text-white/70 font-body mt-0.5"
            >
              {plant.scientific_name}
            </motion.p>
          )}
        </div>
      </div>

      {/* Go Home Pill — visible below hero for easy navigation */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center -mt-4 relative z-20 mb-2"
      >
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full
                     bg-white shadow-card border border-cream-200
                     text-xs font-semibold font-body text-forest-700
                     hover:shadow-card-hover hover:border-forest-300
                     transition-all duration-200 active:scale-95"
        >
          <Home className="w-3.5 h-3.5" />
          Explore Farm
        </button>
      </motion.div>

      {/* Content */}
      <div className="px-4 pt-2 space-y-5 max-w-2xl mx-auto">
        {/* Overview */}
        {plant.short_desc && (
          <motion.section
            custom={0}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-white rounded-2xl p-5 shadow-card border border-cream-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-forest-100 flex items-center justify-center">
                <Leaf className="w-3.5 h-3.5 text-forest-700" />
              </div>
              <h2 className="font-display font-semibold text-base text-forest-900">Overview</h2>
            </div>
            <p className="text-sm text-gray-700 font-body leading-relaxed">{plant.short_desc}</p>
          </motion.section>
        )}

        {/* Medicinal Uses */}
        {plant.medicinal_uses && (
          <motion.section
            custom={1}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-white rounded-2xl p-5 shadow-card border border-cream-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-sage-100 flex items-center justify-center">
                <FlaskConical className="w-3.5 h-3.5 text-sage-700" />
              </div>
              <h2 className="font-display font-semibold text-base text-forest-900">Medicinal Uses</h2>
            </div>
            <p className="text-sm text-gray-700 font-body leading-relaxed">{plant.medicinal_uses}</p>
          </motion.section>
        )}

        {/* Folklore */}
        {plant.folklore && (
          <motion.section
            custom={2}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-white rounded-2xl p-5 shadow-card border border-cream-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <h2 className="font-display font-semibold text-base text-forest-900">
                Folklore &amp; Tradition
              </h2>
            </div>
            <p className="text-sm text-gray-700 font-body leading-relaxed italic">
              &ldquo;{plant.folklore}&rdquo;
            </p>
          </motion.section>
        )}

        {/* Genome / Scientific Data */}
        {genomeEntries.length > 0 && (
          <motion.section
            custom={3}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-white rounded-2xl p-5 shadow-card border border-cream-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <Dna className="w-3.5 h-3.5 text-blue-700" />
              </div>
              <h2 className="font-display font-semibold text-base text-forest-900">
                Scientific Data
              </h2>
            </div>
            <div className="space-y-2">
              {genomeEntries.map(([key, value]) => (
                <div key={key} className="flex items-start gap-3">
                  <span className="text-xs font-semibold text-gray-500 font-body uppercase
                                   tracking-wide min-w-[100px] pt-0.5">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm text-gray-700 font-body">{String(value)}</span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Tags */}
        {(plant.plant_tags?.length ?? 0) > 0 && (
          <motion.section
            custom={4}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <div className="flex flex-wrap gap-2">
              {plant.plant_tags!.map((t) => (
                <span
                  key={t.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                             text-xs font-medium font-body
                             bg-forest-50 text-forest-700 border border-forest-200"
                >
                  <Sparkles className="w-3 h-3" />
                  {t.tag}
                </span>
              ))}
            </div>
          </motion.section>
        )}

        {/* Wikipedia */}
        {plant.wikipedia_url && (
          <motion.a
            custom={5}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            href={plant.wikipedia_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-white rounded-2xl p-4
                       shadow-card border border-cream-200 group
                       hover:border-forest-300 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700 font-body">W</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 font-body">Wikipedia</p>
                <p className="text-xs text-gray-500 font-body">Read more on Wikipedia</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-forest-600 transition-colors" />
          </motion.a>
        )}
      </div>

      {/* AI Chatbot */}
      <ChatBot />
    </div>
  );
}
