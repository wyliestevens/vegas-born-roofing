'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to change password');
        setLoading(false);
        return;
      }

      await signOut({ callbackUrl: '/admin/login' });
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
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
          <h1 className="text-2xl font-bold text-white">Change Your Password</h1>
          <p className="text-gray-400 mt-1">You must change your password before continuing</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1f2937] rounded-xl p-8 shadow-xl border border-gray-700">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label htmlFor="current" className="block text-sm font-semibold text-gray-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              id="current"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-gray-600 text-white focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="new" className="block text-sm font-semibold text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="new"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-gray-600 text-white focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
              placeholder="Minimum 8 characters"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirm" className="block text-sm font-semibold text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-gray-600 text-white focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#b91c1c] text-white py-3 rounded-lg font-bold hover:bg-[#991b1b] transition-colors disabled:opacity-50"
          >
            {loading ? 'Changing password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
