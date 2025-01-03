// app/(pages)/client/layout.tsx
'use client'

import { useEffect, ReactNode } from 'react';
import useAuth from '@/hooks/useAuth';
import Spinner from '@/components/ui/spinner';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { isAuthenticated, isClient, loading, checkAccess } = useAuth();

  useEffect(() => {
    if (!loading) {
      checkAccess('Client');
    }
  }, [loading, checkAccess]);

  if (loading) {
    return(
      <div >
       <Spinner />
      </div>
    )
  }

  if (!isAuthenticated || !isClient) {
    return null;
  }

  return <div>{children}</div>;
}