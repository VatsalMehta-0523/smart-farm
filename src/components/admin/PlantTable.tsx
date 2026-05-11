'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Edit2, Trash2, Download, QrCode, Eye, Leaf, Search, Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { type PlantWithRelations, type PlantCategory } from '@/types';
import { STATUS_COLORS, STATUS_LABELS, UI } from '@/lib/constants';
import { formatDate, cn } from '@/lib/utils';
import { getSupabaseClient } from '@/lib/supabase';
import AddPlantModal from './AddPlantModal';
import PlantPreviewModal from './PlantPreviewModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface PlantTableProps {
  plants: PlantWithRelations[];
  categories: PlantCategory[];
  onRefresh: () => void;
}

export default function PlantTable({ plants, categories, onRefresh }: PlantTableProps) {
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editPlant, setEditPlant] = useState<PlantWithRelations | null>(null);
  const [previewPlant, setPreviewPlant] = useState<PlantWithRelations | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PlantWithRelations | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = plants.filter((p) =>
    !search.trim() ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.scientific_name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const supabase = getSupabaseClient();
    await supabase.from('plants').delete().eq('id', deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    onRefresh();
  };

  const handleDownloadPDF = async (plant: PlantWithRelations) => {
    // Dynamically import PDF renderer to avoid SSR issues
    const { generatePlantPDF } = await import('@/lib/pdf');
    await generatePlantPDF(plant);
  };

  const handleEditFromPreview = () => {
    setEditPlant(previewPlant);
    setPreviewPlant(null);
  };

  return (
    <>
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plants…"
            className="input-field pl-9 py-2.5"
          />
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="btn-primary flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          {UI.admin.addPlant}
        </button>
      </div>

      {/* Count */}
      <p className="text-xs text-gray-500 font-body mb-3">
        {filtered.length} plant{filtered.length !== 1 ? 's' : ''}
        {search && ` matching "${search}"`}
      </p>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Leaf className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-600 font-body">
            {search ? 'No plants match your search' : 'No plants yet'}
          </p>
          {!search && (
            <button onClick={() => setAddOpen(true)} className="btn-primary mt-4">
              <Plus className="w-4 h-4" />
              Add your first plant
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 font-body uppercase tracking-wide">
                    Plant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 font-body uppercase tracking-wide hidden md:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 font-body uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 font-body uppercase tracking-wide hidden lg:table-cell">
                    Added
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 font-body uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((plant) => {
                  const thumb = plant.plant_images?.[0]?.url;
                  return (
                    <tr
                      key={plant.id}
                      onClick={() => setPreviewPlant(plant)}
                      className="hover:bg-cream-50 transition-colors cursor-pointer group"
                    >
                      {/* Plant */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-forest-50 border border-cream-200">
                            {thumb ? (
                              <Image src={thumb} alt={plant.name} width={40} height={40} className="object-cover w-full h-full" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Leaf className="w-4 h-4 text-forest-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 font-body truncate">
                              {plant.name}
                            </p>
                            {plant.scientific_name && (
                              <p className="text-xs italic text-gray-400 font-body truncate">
                                {plant.scientific_name}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        {plant.plant_categories?.name ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                                           font-body bg-forest-50 text-forest-700 border border-forest-200">
                            {plant.plant_categories.name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 font-body">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium font-body', STATUS_COLORS[plant.status])}>
                          {STATUS_LABELS[plant.status]}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-500 font-body">
                          {formatDate(plant.created_at)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setPreviewPlant(plant)}
                            title="Preview"
                            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center
                                       text-gray-400 hover:text-forest-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {plant.qr_url && (
                            <a
                              href={plant.qr_url}
                              download
                              title="Download QR"
                              onClick={(e) => e.stopPropagation()}
                              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center
                                         text-gray-400 hover:text-forest-600 transition-colors"
                            >
                              <QrCode className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDownloadPDF(plant)}
                            title="Download PDF"
                            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center
                                       text-gray-400 hover:text-forest-600 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditPlant(plant)}
                            title="Edit"
                            className="w-8 h-8 rounded-lg hover:bg-forest-50 flex items-center justify-center
                                       text-gray-400 hover:text-forest-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(plant)}
                            title="Delete"
                            className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center
                                       text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {addOpen && (
          <AddPlantModal
            isOpen
            onClose={() => setAddOpen(false)}
            onSuccess={() => { setAddOpen(false); onRefresh(); }}
            categories={categories}
          />
        )}
        {editPlant && (
          <AddPlantModal
            isOpen
            onClose={() => setEditPlant(null)}
            onSuccess={() => { setEditPlant(null); onRefresh(); }}
            categories={categories}
            editPlant={editPlant}
          />
        )}
        {previewPlant && (
          <PlantPreviewModal
            plant={previewPlant}
            onClose={() => setPreviewPlant(null)}
            onEdit={handleEditFromPreview}
          />
        )}
        {deleteTarget && (
          <DeleteConfirmModal
            plantName={deleteTarget.name}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleting}
          />
        )}
      </AnimatePresence>
    </>
  );
}
