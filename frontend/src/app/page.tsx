'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/repositories');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <main className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8 mt-20">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Welcome to GitHub CRM
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Features</h2>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                GitHub Repository Management
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Real-time Repository Stats
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Easy Repository Updates
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Get Started</h2>
            <p className="text-gray-600 mb-4">
              Sign in to start managing your GitHub repositories.
            </p>
            <div className="space-y-4">
              <Link
                href="/auth/login"
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="block w-full bg-white hover:bg-gray-50 text-blue-500 font-medium py-2 px-4 rounded-lg transition-colors text-center border border-blue-500"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
