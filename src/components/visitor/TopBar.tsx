'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Languages, Leaf, X, Info, ShieldCheck, Search, QrCode } from 'lucide-react';
import { APP, UI } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onQRClick: () => void;
}

export default function TopBar({ searchQuery, onSearchChange, onQRClick }: TopBarProps) {
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleTranslate = () => {
    // Trigger Google Translate via the built-in browser mechanism
    const el = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (el) {
      el.value = 'hi';
      el.dispatchEvent(new Event('change'));
    } else {
      // Fallback: open Google Translate for the page
      window.open(
        `https://translate.google.com/translate?sl=en&tl=hi&u=${encodeURIComponent(window.location.href)}`,
        '_blank'
      );
    }
    setSettingsOpen(false);
  };

  return (
    <header className="topbar-blur sticky top-0 z-40 border-b border-cream-200">
      {/* Row 1 — Brand + Actions */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        {/* Farm Logo / Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-forest-700 flex items-center justify-center shadow-sm">
            <Leaf className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-hindi text-xl text-forest-800 leading-tight tracking-wide">
              कृपा &amp; यत्न
            </span>
            <span className="font-body text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
              Smart Farm
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Translate Pill */}
          <button
            onClick={handleTranslate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       bg-cream-100 border border-cream-300 text-xs font-medium
                       text-forest-700 hover:bg-forest-100 hover:border-forest-300
                       transition-all duration-200 active:scale-95"
            aria-label="Translate"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>Translate</span>
          </button>

          {/* Settings Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setSettingsOpen((o) => !o)}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
                settingsOpen
                  ? 'bg-forest-700 text-white'
                  : 'bg-cream-100 border border-cream-300 text-gray-600 hover:bg-forest-100 hover:text-forest-700 hover:border-forest-300'
              )}
              aria-label="Settings"
            >
              {settingsOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Settings className="w-4 h-4" />
              )}
            </button>

            {settingsOpen && (
              <div className="absolute right-0 top-10 w-52 bg-white rounded-2xl shadow-modal
                              border border-cream-200 py-1.5 z-50 animate-fade-in-up">
                <button
                  onClick={() => { router.push('/admin/login'); setSettingsOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700
                             hover:bg-cream-50 transition-colors text-left"
                >
                  <ShieldCheck className="w-4 h-4 text-forest-600 flex-shrink-0" />
                  <span>Admin panel</span>
                </button>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700
                             hover:bg-cream-50 transition-colors text-left"
                >
                  <Info className="w-4 h-4 text-forest-600 flex-shrink-0" />
                  <span>About this farm</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2 — Search + QR */}
      <div className="flex items-center gap-2 px-4 pb-3">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={UI.search.placeholder}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-cream-300 bg-white
                       text-sm font-body text-gray-900 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500
                       transition-all duration-200"
          />
        </div>

        {/* QR Scan Button */}
        <button
          onClick={onQRClick}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl
                     bg-forest-700 hover:bg-forest-600 active:scale-95
                     text-white text-sm font-semibold font-body
                     transition-all duration-200 shadow-sm flex-shrink-0"
          aria-label="Scan QR code"
        >
          <QrCode className="w-4 h-4" />
          <span className="hidden sm:inline">Scan</span>
        </button>
      </div>
    </header>
  );
}
