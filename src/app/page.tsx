'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/AuthProvider';
import { Loader2 } from 'lucide-react';
import { Building2 } from 'lucide-react';

export default function HomePage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (role === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/dashboard');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [user, role, loading, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="flex items-center gap-3 text-primary">
        <Building2 className="h-12 w-12" />
        <h1 className="text-5xl font-bold font-headline">CampusConnect</h1>
      </div>
      <div className="mt-8 flex items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg text-foreground">Loading your experience...</p>
      </div>
    </div>
  );
}
