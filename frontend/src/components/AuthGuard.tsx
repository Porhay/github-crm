'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || '';

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = authService.isAuthenticated();
      const isAuthPage = pathname.startsWith('/auth/');
      const isRootPage = pathname === '/';

      console.log('AuthGuard check:', {
        pathname,
        isAuthenticated,
        isAuthPage,
        isRootPage,
        accessToken: authService.getAccessToken()
      });

      if (isAuthenticated) {
        if (isAuthPage || isRootPage) {
          console.log('Redirecting authenticated user to /repositories');
          router.replace('/repositories');
        }
      } else {
        if (!isAuthPage && !isRootPage) {
          console.log('Redirecting unauthenticated user to /auth/login');
          router.replace('/auth/login');
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  return <>{children}</>;
} 