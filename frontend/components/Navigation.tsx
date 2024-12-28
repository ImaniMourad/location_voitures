// components/Navigation.tsx
'use client'

import Link from 'next/link';
import useAuth from '@/hooks/useAuth';

export default function Navigation() {
  const { isAuthenticated, isAdmin, isClient, loading } = useAuth();

  if (loading || !isAuthenticated) return null;

  return (
    <nav>
      {isAdmin && (
        <div className="flex gap-4">
          <Link href="/admin/clients">Clients</Link>
          <Link href="/admin/vehicles">Véhicules</Link>
          <Link href="/admin/reservations">Réservations</Link>
          <Link href="/admin/statistics">Statistiques</Link>
          <Link href="/admin/archives">Archives</Link>
        </div>
      )}

      {isClient && (
        <div className="flex gap-4">
          <Link href="/client/profile">Mon Profil</Link>
          <Link href="/client/vehicles">Véhicules</Link>
          <Link href="/client/reservations">Mes Réservations</Link>
        </div>
      )}
    </nav>
  );
}