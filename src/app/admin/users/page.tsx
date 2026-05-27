"use client";

import { useState, useEffect } from "react";
import { UserCog, Plus, Trash2, Loader2, Shield } from "lucide-react";

interface SafeUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "owner" | "editor";
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}

const roleBadge: Record<string, { bg: string; text: string; label: string }> = {
  super_admin: { bg: "bg-purple-50", text: "text-purple-700", label: "Super Admin" },
  owner: { bg: "bg-red-50", text: "text-red-700", label: "Owner" },
  admin: { bg: "bg-blue-50", text: "text-blue-700", label: "Admin" },
  editor: { bg: "bg-green-50", text: "text-green-700", label: "Editor" },
};

export default function UsersPage() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<"admin" | "editor" | "owner">("admin");

  // Decode JWT from cookie to get current user info
  useEffect(() => {
    try {
      const cookies = document.cookie.split(";").reduce((acc, c) => {
        const [k, v] = c.trim().split("=");
        acc[k] = v;
        return acc;
      }, {} as Record<string, string>);
      const token = cookies["vbr_admin"];
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.sub);
        setCurrentUserRole(payload.role);
      }
    } catch {
      // ignore decode errors
    }
  }, []);

  async function loadUsers() {
    try {
      const res = await fetch("/api/admin/users");
      if (res.status === 403) {
        setError("You do not have permission to manage users.");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, email: formEmail, role: formRole }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create user");
      }
      setShowForm(false);
      setFormName("");
      setFormEmail("");
      setFormRole("admin");
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setDeleting(null);
    }
  }

  // Permission check
  if (currentUserRole && currentUserRole !== "super_admin" && currentUserRole !== "owner") {
    return (
      <div className="text-center py-20">
        <Shield className="h-12 w-12 mx-auto mb-3 text-slate-300" />
        <p className="text-slate-500">You do not have permission to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCog className="h-6 w-6 text-red-600" />
            User Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {users.length} user{users.length !== 1 && "s"}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-2 underline hover:no-underline"
          >
            dismiss
          </button>
        </div>
      )}

      {/* Add User Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Add New User</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="user@vegasbornroofing.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as "admin" | "editor" | "owner")}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
              <p className="text-xs text-slate-400">
                Default password is &ldquo;Password&rdquo; &mdash; user must change on first login.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormName("");
                    setFormEmail("");
                    setFormRole("admin");
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {creating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-lg">
          <UserCog className="h-12 w-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500 mb-4">No users found</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 font-medium text-slate-600">Name</th>
                <th className="text-left px-5 py-3 font-medium text-slate-600">Email</th>
                <th className="text-left px-5 py-3 font-medium text-slate-600">Role</th>
                <th className="text-left px-5 py-3 font-medium text-slate-600">Status</th>
                <th className="text-right px-5 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const badge = roleBadge[u.role] || roleBadge.editor;
                const isSelf = u.id === currentUserId;
                const isSuperAdmin = u.role === "super_admin";
                const canDelete = !isSelf && !isSuperAdmin;

                return (
                  <tr key={u.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      {u.name}
                      {isSelf && (
                        <span className="ml-2 text-xs text-slate-400">(you)</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${badge.bg} ${badge.text}`}
                      >
                        <Shield className="h-3 w-3" />
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {u.mustChangePassword ? (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                          Must change password
                        </span>
                      ) : (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {canDelete ? (
                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          disabled={deleting === u.id}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleting === u.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-300">&mdash;</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
