"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Users,
  Star,
  Hammer,
  Wrench,
  Settings,
  Image,
  History,
  Rocket,
  UserCircle,
  LogOut,
  HardHat,
  UserCog,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "AI Chat", href: "/admin/chat", icon: MessageSquare },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Team", href: "/admin/team", icon: Users },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "Projects", href: "/admin/projects", icon: Hammer },
  { label: "Services", href: "/admin/services", icon: Wrench },
  { label: "Site Settings", href: "/admin/site-settings", icon: Settings },
  { label: "Media Library", href: "/admin/images", icon: Image },
  { label: "Users", href: "/admin/users", icon: UserCog },
  { label: "History", href: "/admin/history", icon: History },
  { label: "Deployments", href: "/admin/deployments", icon: Rocket },
];

const bottomItems = [
  { label: "Account", href: "/admin/account", icon: UserCircle },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 flex flex-col">
      {/* Branding */}
      <div className="px-5 py-5 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-2.5">
          <HardHat className="h-6 w-6 text-red-500" />
          <span className="text-lg font-semibold text-white tracking-tight">
            Vegas Born Roofing
          </span>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium
                transition-colors duration-150
                ${
                  active
                    ? "bg-slate-800 text-white border-l-[3px] border-red-500 pl-[9px]"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-800 py-4 px-3 space-y-1">
        {bottomItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium
                transition-colors duration-150
                ${
                  active
                    ? "bg-slate-800 text-white border-l-[3px] border-red-500 pl-[9px]"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium
            text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-150 w-full"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export function AdminTopBar() {
  const pathname = usePathname();

  function getPageTitle(): string {
    const match = navItems.find((item) => isActive(pathname, item.href));
    if (match) return match.label;
    const bottomMatch = bottomItems.find((item) =>
      isActive(pathname, item.href)
    );
    if (bottomMatch) return bottomMatch.label;
    if (pathname.includes("change-password")) return "Change Password";
    return "Dashboard";
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8">
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
          Admin Dashboard
        </p>
        <h1 className="text-lg font-semibold text-slate-900 -mt-0.5">
          {getPageTitle()}
        </h1>
      </div>
    </header>
  );
}
