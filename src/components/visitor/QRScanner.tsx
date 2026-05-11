'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Camera, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QRScanner({ isOpen, onClose }: QRScannerProps) {
  const router = useRouter();
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const containerId = 'qr-reader-container';

  useEffect(() => {
    if (!isOpen) return;
    setError(null);

    let stopped = false;

    const startScanner = async () => {
      // Dynamically import to avoid SSR issues
      const { Html5Qrcode } = await import('html5-qrcode');

      // Wait for DOM
      await new Promise((r) => setTimeout(r, 200));
      if (stopped) return;

      const html5Qrcode = new Html5Qrcode(containerId);
      scannerRef.current = html5Qrcode as unknown as { stop: () => Promise<void> };

      try {
        setScanning(true);
        await html5Qrcode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            // Extract UUID from decoded URL
            const uuidMatch = decodedText.match(/\/plant\/([a-f0-9-]{36})/i);
            if (uuidMatch) {
              html5Qrcode.stop().catch(() => {});
              onClose();
              router.push(`/plant/${uuidMatch[1]}`);
            } else {
              setError('QR code not recognized. Please scan a farm plant QR code.');
            }
          },
          () => {} // ignore per-frame errors
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes('permission') || message.includes('NotAllowed')) {
          setError('Camera permission denied. Please allow camera access and try again.');
        } else {
          setError('Unable to start camera. Please try again.');
        }
        setScanning(false);
      }
    };

    startScanner();

    return () => {
      stopped = true;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [isOpen, router, onClose]);

  const handleClose = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-forest-900 rounded-3xl overflow-hidden shadow-modal w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-forest-700">
              <div>
                <h2 className="font-display font-semibold text-lg text-white">Scan Plant QR</h2>
                <p className="text-xs text-forest-300 font-body mt-0.5">
                  Point your camera at a plant's QR code
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-forest-700 flex items-center justify-center
                           hover:bg-forest-600 transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scanner Area */}
            <div className="relative bg-black aspect-square">
              <div id={containerId} className="w-full h-full" />

              {/* Viewfinder overlay */}
              {scanning && !error && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-56 h-56">
                    {/* Corners */}
                    {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
                      <div
                        key={i}
                        className={`absolute ${pos} w-8 h-8 border-2 border-sage-400 ${
                          i < 2 ? 'border-b-0' : 'border-t-0'
                        } ${i % 2 === 0 ? 'border-r-0' : 'border-l-0'}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center
                                bg-forest-950/80 p-6 text-center">
                  <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                  <p className="text-sm text-white font-body leading-relaxed">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-4 px-4 py-2 bg-sage-500 rounded-xl text-white text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Loading State */}
              {!scanning && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Camera className="w-10 h-10 text-forest-400 mb-2 animate-pulse" />
                  <p className="text-sm text-forest-400 font-body">Starting camera…</p>
                </div>
              )}
            </div>

            <div className="p-4 text-center">
              <p className="text-xs text-forest-400 font-body">
                Works with Google Lens and all standard QR scanners
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
