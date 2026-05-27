"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  tagline: string;
  hours: string;
  licenses: {
    nevada: string;
    utah: string;
    arizona: string;
  };
  socialLinks: Record<string, string>;
}

const defaultSettings: SiteSettings = {
  phone: "",
  email: "",
  address: "",
  tagline: "",
  hours: "",
  licenses: { nevada: "", utah: "", arizona: "" },
  socialLinks: { facebook: "", instagram: "", yelp: "", google: "" } as Record<string, string>,
};

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [sha, setSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadSettings() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/site-settings");
      if (!res.ok) throw new Error("Failed to load settings");
      const data = await res.json();
      setSettings(data.settings || defaultSettings);
      setSha(data.sha || "");
    } catch {
      setError("Failed to load site settings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings, sha }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const data = await res.json();
      setSettings(data.settings);
      setSuccess("Settings saved successfully");
      // Reload to get fresh SHA
      await loadSettings();
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  function updateField(field: keyof SiteSettings, value: string) {
    setSettings({ ...settings, [field]: value });
  }

  function updateLicense(key: "nevada" | "utah" | "arizona", value: string) {
    setSettings({
      ...settings,
      licenses: { ...settings.licenses, [key]: value },
    });
  }

  function updateSocial(key: string, value: string) {
    setSettings({
      ...settings,
      socialLinks: { ...settings.socialLinks, [key]: value },
    });
  }

  function addSocialLink() {
    const name = prompt("Enter the platform name (e.g. TikTok, LinkedIn, Twitter):");
    if (!name?.trim()) return;
    const key = name.trim().toLowerCase().replace(/\s+/g, "_");
    if (settings.socialLinks[key] !== undefined) {
      alert("That platform already exists.");
      return;
    }
    setSettings({
      ...settings,
      socialLinks: { ...settings.socialLinks, [key]: "" },
    });
  }

  function removeSocialLink(key: string) {
    const updated = { ...settings.socialLinks };
    delete updated[key];
    setSettings({ ...settings, socialLinks: updated });
  }

  function formatLabel(key: string): string {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Site Settings</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage your business information displayed across the website.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {/* Business Info */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Business Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="(702) 876-2630"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="info@vegasbornroofing.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="4205 W Tompkins Ave, Suite 6, Las Vegas, NV 89103"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => updateField("tagline", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Vegas Born. Vegas Proud. Vegas Strong."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Business Hours
              </label>
              <input
                type="text"
                value={settings.hours}
                onChange={(e) => updateField("hours", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Mon-Fri 7:30 AM - 4:00 PM"
              />
            </div>
          </div>
        </div>

        {/* Licenses */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Contractor Licenses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nevada (NV)
              </label>
              <input
                type="text"
                value={settings.licenses.nevada}
                onChange={(e) => updateLicense("nevada", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="0084099"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Utah (UT)
              </label>
              <input
                type="text"
                value={settings.licenses.utah}
                onChange={(e) => updateLicense("utah", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="12307984-5501"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Arizona (AZ)
              </label>
              <input
                type="text"
                value={settings.licenses.arizona}
                onChange={(e) => updateLicense("arizona", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="350069"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">
              Social Media Links
            </h3>
            <button
              type="button"
              onClick={addSocialLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Platform
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(settings.socialLinks).map(([key, value]) => (
              <div key={key} className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {formatLabel(key)}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={value}
                    onChange={(e) => updateSocial(key, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder={`https://${key}.com/vegasbornroofing`}
                  />
                  <button
                    type="button"
                    onClick={() => removeSocialLink(key)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title={`Remove ${formatLabel(key)}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {Object.keys(settings.socialLinks).length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">
              No social media links added yet. Click &quot;Add Platform&quot; to get started.
            </p>
          )}
        </div>
      </div>

      {/* Bottom save button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
