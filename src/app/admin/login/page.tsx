'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';
import { UI, APP } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = getSupabaseClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-forest-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full
                        bg-forest-700/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full
                        bg-sage-900/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-modal">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-forest-600 flex items-center justify-center mb-4 shadow-lg">
              <Leaf className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="font-display font-bold text-2xl text-white">
              {UI.admin.loginTitle}
            </h1>
            <p className="text-sm text-forest-300 font-body mt-1">
              {APP.name} — {UI.admin.loginSubtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 p-3.5 bg-red-900/30 border border-red-700/50
                              rounded-xl text-sm text-red-300 font-body">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-forest-300 font-body mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@farm.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15
                           text-white placeholder-white/30 text-sm font-body
                           focus:outline-none focus:ring-2 focus:ring-sage-400/50
                           focus:border-sage-400/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-forest-300 font-body mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/10 border border-white/15
                             text-white placeholder-white/30 text-sm font-body
                             focus:outline-none focus:ring-2 focus:ring-sage-400/50
                             focus:border-sage-400/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40
                             hover:text-white/70 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-sage-500 hover:bg-sage-400
                         text-white font-semibold font-body text-sm
                         transition-all duration-200 mt-2 disabled:opacity-50
                         disabled:cursor-not-allowed flex items-center justify-center gap-2
                         active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <a
              href="/"
              className="text-xs text-forest-400 hover:text-forest-300 font-body transition-colors"
            >
              ← Back to visitor view
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
