'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

const robotoMono = Roboto_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    if (!token && pathname && !pathname.startsWith('/auth/')) {
      router.push('/auth/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  return (
    <html lang="en">
      <body className={`${roboto.variable} ${robotoMono.variable}`}>
        {isAuthenticated && pathname && !pathname.startsWith('/auth/') && (
          <nav className="navbar">
            <div className="navbar-container">
              <Link href="/repositories" className="navbar-brand">
                GitHub CRM
              </Link>
              <button onClick={handleLogout} className="navbar-link">
                Logout
              </button>
            </div>
          </nav>
        )}
        {children}
      </body>
    </html>
  );
}
