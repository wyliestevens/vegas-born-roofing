'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/images/logo.png"
            alt="Vegas Born Roofing"
            width={80}
            height={93}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-400 mt-1">Vegas Born Roofing Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1f2937] rounded-xl p-8 shadow-xl border border-gray-700">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-gray-600 text-white focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
              placeholder="your@email.com"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-gray-600 text-white focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#b91c1c] text-white py-3 rounded-lg font-bold hover:bg-[#991b1b] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
