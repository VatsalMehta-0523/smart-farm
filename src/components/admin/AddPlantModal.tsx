'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  X, ChevronRight, ChevronLeft, Upload, Trash2,
  GripVertical, Loader2, Check, QrCode, Globe, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseClient } from '@/lib/supabase';
import {
  type PlantWithRelations, type PlantFormData, type PlantStatus,
  type PlantCategory, type ImageUpload
} from '@/types';
import { ADD_PLANT_STEPS, STORAGE, UI, STATUS_LABELS } from '@/lib/constants';
import { generateSlug, parseGenomeData, cn } from '@/lib/utils';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: PlantCategory[];
  editPlant?: PlantWithRelations | null;
}

const EMPTY_FORM: PlantFormData = {
  name: '', scientific_name: '', category_id: '', short_desc: '',
  medicinal_uses: '', folklore: '', genome_data: '', wikipedia_url: '',
  status: 'draft',
};

export default function AddPlantModal({
  isOpen, onClose, onSuccess, categories, editPlant
}: AddPlantModalProps) {
  const isEdit = !!editPlant;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<PlantFormData>(() =>
    editPlant ? {
      name: editPlant.name,
      scientific_name: editPlant.scientific_name ?? '',
      category_id: editPlant.category_id ?? '',
      short_desc: editPlant.short_desc ?? '',
      medicinal_uses: editPlant.medicinal_uses ?? '',
      folklore: editPlant.folklore ?? '',
      genome_data: editPlant.genome_data ? JSON.stringify(editPlant.genome_data, null, 2) : '',
      wikipedia_url: editPlant.wikipedia_url ?? '',
      status: editPlant.status,
    } : EMPTY_FORM
  );
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [existingImages, setExistingImages] = useState(editPlant?.plant_images ?? []);
  const [qrUrl, setQrUrl] = useState<string | null>(editPlant?.qr_url ?? null);
  const [generatedId, setGeneratedId] = useState<string | null>(editPlant?.id ?? null);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof PlantFormData, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof PlantFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof PlantFormData, string>> = {};
    if (step === 1) {
      if (!form.name.trim()) errs.name = 'Plant name is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;

    // On step 1 in add mode: create the plant record to get an ID for QR
    if (step === 1 && !isEdit && !generatedId) {
      setSaving(true);
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('plants')
        .insert({
          name: form.name.trim(),
          slug: generateSlug(form.name),
          status: 'draft',
        })
        .select('id, qr_url')
        .single();

      if (!error && data) {
        setGeneratedId(data.id);
        // Trigger QR generation via edge function
        try {
          const { data: qrData } = await supabase.functions.invoke('generate-qr', {
            body: { plantId: data.id },
          });
          if (qrData?.qrUrl) setQrUrl(qrData.qrUrl);
        } catch {
          // QR generation optional, don't block
        }
      }
      setSaving(false);
    }

    setStep((s) => Math.min(s + 1, 5));
  };

  const handleImageFiles = (files: FileList | null) => {
    if (!files) return;
    const newImgs: ImageUpload[] = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, 10 - images.length)
      .map((file, i) => ({
        file,
        preview: URL.createObjectURL(file),
        order_index: images.length + i,
      }));
    setImages((prev) => [...prev, ...newImgs]);
  };

  const removeNewImage = (idx: number) => {
    URL.revokeObjectURL(images[idx].preview);
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = async (id: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
    if (editPlant?.id) {
      const supabase = getSupabaseClient();
      await supabase.from('plant_images').delete().eq('id', id);
    }
  };

  const uploadImages = async (plantId: string) => {
    if (images.length === 0) return;
    const supabase = getSupabaseClient();
    const uploads = images.map(async (img, i) => {
      const ext = img.file.name.split('.').pop();
      const path = `${plantId}/${Date.now()}-${i}.${ext}`;
      const { error } = await supabase.storage
        .from(STORAGE.plantImages)
        .upload(path, img.file, { upsert: false });

      if (!error) {
        const { data: urlData } = supabase.storage
          .from(STORAGE.plantImages)
          .getPublicUrl(path);
        await supabase.from('plant_images').insert({
          plant_id: plantId,
          url: urlData.publicUrl,
          order_index: (existingImages.length ?? 0) + i,
        });
      }
    });
    await Promise.all(uploads);
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = getSupabaseClient();
    const plantId = generatedId ?? editPlant?.id;
    if (!plantId) { setSaving(false); return; }

    const payload = {
      name: form.name.trim(),
      slug: generateSlug(form.name),
      scientific_name: form.scientific_name.trim() || null,
      category_id: form.category_id || null,
      short_desc: form.short_desc.trim() || null,
      medicinal_uses: form.medicinal_uses.trim() || null,
      folklore: form.folklore.trim() || null,
      genome_data: parseGenomeData(form.genome_data),
      wikipedia_url: form.wikipedia_url.trim() || null,
      status: form.status,
      qr_url: qrUrl,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('plants')
      .update(payload)
      .eq('id', plantId);

    if (!error) {
      await uploadImages(plantId);
      onSuccess();
    }
    setSaving(false);
  };

  const handleClose = () => {
    setStep(1);
    setForm(EMPTY_FORM);
    setImages([]);
    setErrors({});
    setGeneratedId(null);
    setQrUrl(null);
    onClose();
  };

  if (!isOpen) return null;

  const publicUrl = generatedId
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/plant/${generatedId}`
    : null;

  return (
    <div className="fixed inset-0 z-50 modal-overlay flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl
                   shadow-modal max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-shrink-0">
          <div>
            <h2 className="font-display font-bold text-lg text-forest-900">
              {isEdit ? 'Edit Plant' : 'Add New Plant'}
            </h2>
            <p className="text-xs text-gray-500 font-body">
              Step {step} of 5 — {ADD_PLANT_STEPS[step - 1].label}
            </p>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Step Dots */}
        <div className="flex items-center gap-1.5 px-6 pb-4 flex-shrink-0">
          {ADD_PLANT_STEPS.map((s) => (
            <div
              key={s.id}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                step === s.id ? 'w-8 bg-forest-700' :
                  step > s.id ? 'w-4 bg-forest-400' : 'w-4 bg-gray-200'
              )}
            />
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* ── Step 1: Basic Info ── */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 font-body mb-1.5 uppercase tracking-wide">
                      Plant Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={update('name')}
                      placeholder="e.g. Tulsi, Neem, Aloe Vera"
                      className={cn('input-field', errors.name && 'border-red-400 focus:ring-red-300')}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 font-body mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 font-body mb-1.5 uppercase tracking-wide">
                      Scientific Name
                    </label>
                    <input
                      type="text"
                      value={form.scientific_name}
                      onChange={update('scientific_name')}
                      placeholder="e.g. Ocimum tenuiflorum"
                      className="input-field italic"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 font-body mb-1.5 uppercase tracking-wide">
                      Category
                    </label>
                    <select value={form.category_id} onChange={update('category_id')} className="input-field">
                      <option value="">Select a category…</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 font-body mb-1.5 uppercase tracking-wide">
                      Short Description
                    </label>
                    <textarea
                      value={form.short_desc}
                      onChange={update('short_desc')}
                      rows={3}
                      placeholder="A brief, visitor-friendly description of this plant…"
                      className="textarea-field"
                    />
                  </div>
                </div>
              )}

              {/* ── Step 2: Details ── */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 font-body mb-1.5 uppercase tracking-wide">
                      Medicinal Uses
                    </label>
                    <textarea
                      value={form.medicinal_uses}
                      onChange={update('medicinal_uses')}
                      rows={4}
                      placeholder="Describe therapeutic and medicinal properties…"
                      className="textarea-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 font-body mb-1.5 uppercase tracking-wide">
                      Folklore & Tradition
                    </label>
                    <textarea
                      value={form.folklore}
                      onChange={update('folklore')}
                      rows={3}
                      placeholder="Traditional uses, cultural significance, stories…"
                      className="textarea-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 font-body mb-1.5 uppercase tracking-wide">
                      Scientific / Genome Data
                      <span className="normal-case font-normal text-gray-400 ml-1">(JSON)</span>
                    </label>
                    <textarea
                      value={form.genome_data}
                      onChange={update('genome_data')}
                      rows={5}
                      placeholder={'{\n  "kingdom": "Plantae",\n  "family": "Lamiaceae"\n}'}
                      className="textarea-field font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 font-body mb-1.5 uppercase tracking-wide">
                      Wikipedia URL
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={form.wikipedia_url}
                        onChange={update('wikipedia_url')}
                        placeholder="https://en.wikipedia.org/wiki/…"
                        className="input-field pl-9"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 3: Media ── */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* Dropzone */}
                  <div
                    className={cn(
                      'border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer',
                      dragOver ? 'border-forest-500 bg-forest-50' : 'border-cream-300 hover:border-forest-400 hover:bg-cream-50'
                    )}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      handleImageFiles(e.dataTransfer.files);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700 font-body">
                      Drop images here or <span className="text-forest-600">browse</span>
                    </p>
                    <p className="text-xs text-gray-400 font-body mt-1">
                      JPG, PNG, WebP — up to 10 images
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageFiles(e.target.files)}
                    />
                  </div>

                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 font-body mb-2 uppercase tracking-wide">
                        Current Images
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {existingImages.map((img) => (
                          <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-cream-200">
                            <Image src={img.url} alt="" fill className="object-cover" />
                            <button
                              onClick={() => removeExistingImage(img.id)}
                              className="absolute inset-0 bg-red-900/50 opacity-0 group-hover:opacity-100
                                         flex items-center justify-center transition-all duration-200"
                            >
                              <Trash2 className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images Preview */}
                  {images.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 font-body mb-2 uppercase tracking-wide">
                        New Images ({images.length})
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {images.map((img, i) => (
                          <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-cream-200">
                            <Image src={img.preview} alt="" fill className="object-cover" />
                            <button
                              onClick={() => removeNewImage(i)}
                              className="absolute inset-0 bg-red-900/50 opacity-0 group-hover:opacity-100
                                         flex items-center justify-center transition-all duration-200"
                            >
                              <Trash2 className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 4: QR Preview ── */}
              {step === 4 && (
                <div className="flex flex-col items-center gap-5 py-4">
                  <div className="w-16 h-16 rounded-2xl bg-forest-100 flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-forest-600" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-forest-900 text-center">
                    Plant QR Code
                  </h3>

                  {qrUrl ? (
                    <div className="space-y-4 w-full">
                      <div className="flex justify-center">
                        <Image
                          src={qrUrl}
                          alt="Plant QR Code"
                          width={200}
                          height={200}
                          className="rounded-xl border-4 border-white shadow-md"
                        />
                      </div>
                      {publicUrl && (
                        <div className="bg-cream-50 rounded-xl p-3 border border-cream-200">
                          <p className="text-xs font-semibold text-gray-500 font-body mb-1 uppercase tracking-wide">
                            Public URL
                          </p>
                          <p className="text-xs text-forest-700 font-body font-mono break-all">
                            {publicUrl}
                          </p>
                        </div>
                      )}
                      <a
                        href={qrUrl}
                        download={`qr-${form.name.replace(/\s+/g, '-').toLowerCase()}.png`}
                        className="btn-secondary w-full justify-center"
                      >
                        <FileText className="w-4 h-4" />
                        Download QR Image
                      </a>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-40 h-40 bg-gray-100 rounded-2xl mx-auto mb-3 skeleton" />
                      <p className="text-sm text-gray-500 font-body">
                        QR code is being generated…
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 5: Publish ── */}
              {step === 5 && (
                <div className="space-y-4 py-2">
                  <div className="flex items-center gap-3 p-4 bg-forest-50 rounded-2xl border border-forest-100">
                    <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-forest-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-forest-900 font-body">
                        Ready to publish
                      </p>
                      <p className="text-xs text-forest-600 font-body mt-0.5">
                        Choose the visibility status for <strong>{form.name}</strong>
                      </p>
                    </div>
                  </div>

                  {(['published', 'draft', 'hidden'] as PlantStatus[]).map((status) => (
                    <label
                      key={status}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200',
                        form.status === status
                          ? 'border-forest-600 bg-forest-50'
                          : 'border-cream-200 hover:border-forest-300'
                      )}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={form.status === status}
                        onChange={() => setForm((f) => ({ ...f, status }))}
                        className="hidden"
                      />
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                        form.status === status ? 'border-forest-600 bg-forest-600' : 'border-gray-300'
                      )}>
                        {form.status === status && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 font-body capitalize">
                          {STATUS_LABELS[status]}
                        </p>
                        <p className="text-xs text-gray-500 font-body">
                          {status === 'published' && 'Visible to all visitors immediately'}
                          {status === 'draft' && 'Hidden from public — save for later'}
                          {status === 'hidden' && 'Hidden from public — manually controlled'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-cream-200 flex-shrink-0">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="btn-ghost flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <div className="flex-1" />

          {step < 5 ? (
            <button
              onClick={handleNext}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? 'Saving…' : 'Continue'}
              {!saving && <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish Plant'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
