'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import '@/styles/main.scss';

export default function Navigation() {
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    router.push('/auth/login');
  };

  return (
    <nav className="navigation">
      <div className="navigation__container">
        <Link href="/repositories" className="navigation__brand">
          GitHub CRM
        </Link>
        <button onClick={handleLogout} className="navigation__logout">
          Logout
        </button>
      </div>
    </nav>
  );
} 