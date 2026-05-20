'use client';

import { useState } from 'react';

export default function LeadForm() {
  const [form, setForm] = useState({
    firstName: '',
    phone: '',
    address: '',
    issue: '',
    consent: false,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) return;
    setStatus('submitting');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-[#1f2937] rounded-xl p-8 border border-gray-700 text-center">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">We Got Your Info!</h3>
        <p className="text-gray-300">
          Our AI assistant will call you at the number you provided within{' '}
          <span className="text-[#d4a843] font-bold">30 seconds</span> to schedule your free inspection.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1f2937] rounded-xl p-6 md:p-8 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-1">Get a Free Roof Inspection</h3>
      <p className="text-gray-400 text-sm mb-5">
        Our AI assistant will call you within <span className="text-[#d4a843] font-semibold">30 seconds</span> to schedule your appointment.
      </p>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            required
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
          />
        </div>
        <div>
          <input
            type="tel"
            required
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Property Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
          />
        </div>
        <div>
          <select
            value={form.issue}
            onChange={(e) => setForm({ ...form, issue: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-gray-600 text-white focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
          >
            <option value="" className="text-gray-500">What do you need help with?</option>
            <option value="leak">Roof Leak / Emergency Repair</option>
            <option value="inspection">Free Roof Inspection</option>
            <option value="re-roof">Full Re-Roof</option>
            <option value="commercial">Commercial Roofing</option>
            <option value="coating">Roof Coating</option>
            <option value="maintenance">Maintenance Program</option>
            <option value="other">Other</option>
          </select>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
            className="mt-1 w-4 h-4 rounded border-gray-600 text-[#b91c1c] focus:ring-[#b91c1c] bg-[#111827]"
          />
          <span className="text-gray-400 text-xs leading-relaxed">
            By submitting this form, I consent to receive a phone call from Vegas Born Roofing or its AI assistant at the number provided. Standard message and data rates may apply.
          </span>
        </label>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-[#b91c1c] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#991b1b] transition-colors disabled:opacity-50"
        >
          {status === 'submitting' ? 'Submitting...' : 'Get My Free Inspection'}
        </button>

        {status === 'error' && (
          <p className="text-red-400 text-sm text-center">Something went wrong. Please try again or call (702) 876-2630.</p>
        )}
      </div>
    </form>
  );
}
