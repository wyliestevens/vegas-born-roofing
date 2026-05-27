"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserCircle, Key, Loader2, Shield, Mail, BadgeCheck } from "lucide-react";

interface UserInfo {
  name: string;
  email: string;
  role: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const cookies = document.cookie.split(";").reduce(
        (acc, c) => {
          const [key, val] = c.trim().split("=");
          acc[key] = val;
          return acc;
        },
        {} as Record<string, string>
      );

      const token = cookies["vbr_admin"];
      if (token) {
        const payloadB64 = token.split(".")[1];
        const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
        setUser({
          name: payload.name || "Unknown",
          email: payload.email || "Unknown",
          role: payload.role || "editor",
        });
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  function roleLabel(role: string): string {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "owner":
        return "Owner";
      case "admin":
        return "Administrator";
      case "editor":
        return "Editor";
      default:
        return role;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 text-slate-400">
        <UserCircle className="h-12 w-12 mx-auto mb-3" />
        <p>Unable to load account info.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Account</h2>

      <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
            <UserCircle className="h-5 w-5 text-slate-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Name</p>
            <p className="text-sm font-medium text-slate-800">{user.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 px-5 py-4">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
            <Mail className="h-5 w-5 text-slate-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Email</p>
            <p className="text-sm font-medium text-slate-800">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 px-5 py-4">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
            {user.role === "super_admin" || user.role === "owner" ? (
              <Shield className="h-5 w-5 text-red-500" />
            ) : (
              <BadgeCheck className="h-5 w-5 text-slate-500" />
            )}
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Role</p>
            <p className="text-sm font-medium text-slate-800">{roleLabel(user.role)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/admin/change-password"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg
            hover:bg-slate-800 transition-colors"
        >
          <Key className="h-4 w-4" />
          Change Password
        </Link>
      </div>
    </div>
  );
}
