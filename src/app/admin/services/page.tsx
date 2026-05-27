"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, GripVertical } from "lucide-react";

interface Service {
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [sha, setSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    icon: "",
    order: 0,
  });

  async function loadServices() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services");
      if (!res.ok) throw new Error("Failed to load services");
      const data = await res.json();
      setServices(data.services || []);
      setSha(data.sha || "");
    } catch {
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  function openCreate() {
    setEditing(null);
    setFormData({ title: "", slug: "", description: "", icon: "", order: services.length });
    setShowModal(true);
  }

  function openEdit(service: Service) {
    setEditing(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      description: service.description,
      icon: service.icon,
      order: service.order,
    });
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    try {
      if (editing) {
        const res = await fetch("/api/admin/services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ service: { ...formData, slug: editing.slug }, sha }),
        });
        if (!res.ok) throw new Error("Failed to update");
      } else {
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ service: formData, sha }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create");
        }
      }

      setShowModal(false);
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save service");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Are you sure you want to delete this service?")) return;

    setDeleting(slug);
    setError("");

    try {
      const res = await fetch("/api/admin/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, sha }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      await loadServices();
    } catch {
      setError("Failed to delete service");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Services</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage the services displayed on the website.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {services.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">No services yet.</p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add First Service
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider w-8"></th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Description</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((service) => (
                <tr key={service.slug} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-300">
                    <GripVertical className="h-4 w-4" />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">{service.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {service.slug}
                    </code>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm text-slate-500 truncate max-w-xs">
                      {service.description}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => openEdit(service)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.slug)}
                        disabled={deleting === service.slug}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === service.slug ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {editing ? "Edit Service" : "Add Service"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Residential Roofing"
                />
              </div>
              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="residential-roofing (auto-generated if left blank)"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Brief description of the service..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Icon (Lucide icon name)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="home, building, wrench, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.title.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : editing ? (
                  "Update Service"
                ) : (
                  "Add Service"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
