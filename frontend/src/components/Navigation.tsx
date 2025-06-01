'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/styles/main.scss';

export default function Navigation() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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