'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Leaf, LogOut, LayoutDashboard, CheckCircle,
  Clock, EyeOff, TrendingUp
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';
import { type PlantWithRelations, type PlantCategory } from '@/types';
import { APP } from '@/lib/constants';
import PlantTable from '@/components/admin/PlantTable';

interface Stats {
  total: number;
  published: number;
  draft: number;
  hidden: number;
}

function StatCard({
  icon: Icon, label, value, color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 font-body">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [plants, setPlants] = useState<PlantWithRelations[]>([]);
  const [categories, setCategories] = useState<PlantCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = getSupabaseClient();

    const [{ data: session }, { data: plantsData }, { data: catsData }] = await Promise.all([
      supabase.auth.getSession(),
      supabase
        .from('plants')
        .select(`
          *,
          plant_categories ( id, name ),
          plant_images ( id, plant_id, url, order_index, created_at ),
          plant_tags ( id, plant_id, tag )
        `)
        .order('created_at', { ascending: false }),
      supabase.from('plant_categories').select('*').order('name'),
    ]);

    setUserEmail(session?.session?.user?.email ?? '');
    setPlants(
      ((plantsData ?? []) as PlantWithRelations[]).map((p) => ({
        ...p,
        plant_images: [...(p.plant_images ?? [])].sort((a, b) => a.order_index - b.order_index),
      }))
    );
    setCategories(catsData ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auth guard — redirect if not logged in
  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/admin/login');
    });
  }, [router]);

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const stats: Stats = {
    total: plants.length,
    published: plants.filter((p) => p.status === 'published').length,
    draft: plants.filter((p) => p.status === 'draft').length,
    hidden: plants.filter((p) => p.status === 'hidden').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-700 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-display font-semibold text-forest-900 text-sm">{APP.name}</span>
              <span className="text-gray-400 text-xs font-body ml-2">Admin</span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs hidden sm:flex"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Visitor View
            </a>
            {userEmail && (
              <span className="text-xs text-gray-400 font-body hidden md:block truncate max-w-[160px]">
                {userEmail}
              </span>
            )}
            <button onClick={handleLogout} className="btn-ghost text-xs text-red-500 hover:text-red-700 hover:bg-red-50">
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-gray-900">Plant Management</h1>
          <p className="text-sm text-gray-500 font-body mt-1">
            Manage your farm's plant catalogue, QR codes, and content.
          </p>
        </div>

        {/* Stats Grid */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
            <StatCard icon={TrendingUp} label="Total Plants" value={stats.total} color="bg-forest-100 text-forest-700" />
            <StatCard icon={CheckCircle} label="Published" value={stats.published} color="bg-green-50 text-green-600" />
            <StatCard icon={Clock} label="Drafts" value={stats.draft} color="bg-amber-50 text-amber-600" />
            <StatCard icon={EyeOff} label="Hidden" value={stats.hidden} color="bg-gray-100 text-gray-500" />
          </div>
        )}

        {/* Plant Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl skeleton flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 skeleton rounded-lg w-1/3" />
                    <div className="h-2.5 skeleton rounded-lg w-1/4" />
                  </div>
                  <div className="h-6 w-20 skeleton rounded-full" />
                  <div className="flex gap-1">
                    {[1, 2, 3].map((j) => <div key={j} className="w-8 h-8 skeleton rounded-lg" />)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <PlantTable
              plants={plants}
              categories={categories}
              onRefresh={fetchData}
            />
          )}
        </div>
      </main>
    </div>
  );
}
