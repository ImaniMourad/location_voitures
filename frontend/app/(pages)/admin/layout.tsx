// app/(pages)/admin/layout.tsx
'use client'

import { useEffect, ReactNode } from 'react';
import useAuth from '@/hooks/useAuth';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isAdmin, loading, checkAccess } = useAuth();

  useEffect(() => {
    if (!loading) {
      checkAccess('Admin');
    }
  }, [loading, checkAccess]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <div>{children}</div>;
}