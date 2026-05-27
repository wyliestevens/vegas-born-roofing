"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, GripVertical, Loader2 } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  photo: string;
  bio: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [sha, setSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  // Edit modal state
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    photo: "",
    bio: "",
    order: 0,
  });

  async function loadTeam() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/team");
      if (!res.ok) throw new Error("Failed to load team");
      const data = await res.json();
      setTeam(data.team || []);
      setSha(data.sha || "");
    } catch {
      setError("Failed to load team members");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeam();
  }, []);

  function openCreate() {
    setEditing(null);
    setFormData({ name: "", title: "", photo: "", bio: "", order: team.length });
    setShowModal(true);
  }

  function openEdit(member: TeamMember) {
    setEditing(member);
    setFormData({
      name: member.name,
      title: member.title,
      photo: member.photo,
      bio: member.bio.join("\n"),
      order: member.order,
    });
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    try {
      const memberData = {
        ...formData,
        bio: formData.bio.split("\n").filter((line) => line.trim()),
      };

      if (editing) {
        const res = await fetch("/api/admin/team", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ member: { ...memberData, id: editing.id }, sha }),
        });
        if (!res.ok) throw new Error("Failed to update");
      } else {
        const res = await fetch("/api/admin/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ member: memberData, sha }),
        });
        if (!res.ok) throw new Error("Failed to create");
      }

      setShowModal(false);
      await loadTeam();
    } catch {
      setError("Failed to save team member");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    setDeleting(id);
    setError("");

    try {
      const res = await fetch("/api/admin/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, sha }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      await loadTeam();
    } catch {
      setError("Failed to delete team member");
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
          <h2 className="text-2xl font-bold text-slate-900">Team Members</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage team members displayed on the website.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {team.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">No team members yet.</p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add First Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg border border-slate-200 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center text-slate-300 mt-1">
                  <GripVertical className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {member.photo && (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-slate-900 truncate">
                        {member.name}
                      </h3>
                      <p className="text-sm text-slate-500 truncate">
                        {member.title}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                    <span>Order: {member.order}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(member)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    disabled={deleting === member.id}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === member.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editing ? "Edit Team Member" : "Add Team Member"}
              </h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Project Manager"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="/images/team/john.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bio (one paragraph per line)
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Background and experience..."
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
                disabled={saving || !formData.name.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : editing ? (
                  "Update Member"
                ) : (
                  "Add Member"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
