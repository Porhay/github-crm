'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import '@/styles/main.scss';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await authService.login(email, password);
      router.replace('/repositories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__title">Login</h1>
        
        {error && (
          <div className="auth-page__error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-page__form">
          <div className="auth-page__form-group">
            <label htmlFor="email" className="auth-page__label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-page__input"
              required
            />
          </div>

          <div className="auth-page__form-group">
            <label htmlFor="password" className="auth-page__label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-page__input"
              required
            />
          </div>

          <button type="submit" className="auth-page__submit">
            Login
          </button>
        </form>

        <p className="auth-page__footer">
          Don't have an account?{' '}
          <Link href="/auth/register" className="auth-page__link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
} 