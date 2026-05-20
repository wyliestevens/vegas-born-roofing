'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

const adminTools = [
  {
    title: 'AI Content Builder',
    description: 'Generate and edit page content using Claude AI',
    href: '/admin/ai-builder',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    title: 'Reviews Manager',
    description: 'Add, edit, or remove customer reviews',
    href: '/admin/ai-builder',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    title: 'SEO Dashboard',
    description: 'View and manage SEO settings and meta tags',
    href: '/admin/ai-builder',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
  },
  {
    title: 'Site Analytics',
    description: 'View traffic, leads, and conversion data',
    href: '/admin/ai-builder',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#111827]">
      {/* Admin header */}
      <div className="bg-[#1f2937] border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/images/logo.png" alt="Vegas Born Roofing" width={50} height={58} />
            <div>
              <h1 className="text-white font-bold text-lg">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">
                Welcome, {session?.user?.name || session?.user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
              View Site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="bg-[#b91c1c] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#991b1b] transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8">Admin Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminTools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="bg-[#1f2937] rounded-xl p-6 border border-gray-700 hover:border-[#b91c1c] transition-colors group"
            >
              <div className="text-[#d4a843] mb-4 group-hover:text-[#b91c1c] transition-colors">
                {tool.icon}
              </div>
              <h3 className="text-white font-bold mb-2">{tool.title}</h3>
              <p className="text-gray-400 text-sm">{tool.description}</p>
            </Link>
          ))}
        </div>

        {/* Quick stats */}
        <div className="mt-12 grid sm:grid-cols-3 gap-6">
          <div className="bg-[#1f2937] rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">Total Pages</p>
            <p className="text-3xl font-bold text-white mt-1">6</p>
          </div>
          <div className="bg-[#1f2937] rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">Team Members</p>
            <p className="text-3xl font-bold text-white mt-1">11</p>
          </div>
          <div className="bg-[#1f2937] rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">Gallery Images</p>
            <p className="text-3xl font-bold text-white mt-1">10</p>
          </div>
        </div>
      </div>
    </div>
  );
}
