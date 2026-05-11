'use client';

import { Trash2, X, Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeleteConfirmModalProps {
  plantName: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function DeleteConfirmModal({
  plantName, onConfirm, onCancel, loading
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[60] modal-overlay flex items-center justify-center p-4" onClick={onCancel}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-modal w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-base text-gray-900">Delete Plant</h3>
            <p className="text-sm text-gray-600 font-body mt-1">
              Are you sure you want to delete <strong>{plantName}</strong>? This action cannot be undone.
              All associated images and data will be permanently removed.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-ghost flex-1 justify-center" disabled={loading}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className="btn-danger flex-1">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
