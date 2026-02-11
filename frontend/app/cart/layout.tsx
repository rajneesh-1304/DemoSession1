'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/redux/hooks';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const currentUser = useAppSelector(
    (state) => state.users.currentUser
  );

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
      return;
    }

    if (currentUser && currentUser?.role === 'ADMIN') {
      router.replace('/admin');
    }
  }, [currentUser, router]);


  return <>{children}</>;
}
