import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const metadata = { title: 'Admin' };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Middleware handles this, but double-guard for safety
  if (!user && !children) {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
