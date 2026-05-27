import Link from "next/link";
import { loadContentRemote } from "@/lib/admin-content";
import { FileText, Users, Star, Hammer, Plus, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

interface StatCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  href: string;
}

function StatCard({ label, count, icon, href }: StatCardProps) {
  return (
    <Link
      href={href}
      className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{count}</p>
        </div>
        <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
          {icon}
        </div>
      </div>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  let blogCount = 0;
  let teamCount = 0;
  let testimonialCount = 0;
  let projectsCount = 0;

  try {
    const [blog, team, testimonials, projects] = await Promise.all([
      loadContentRemote<unknown[]>("blog-posts").catch(() => ({ data: [] })),
      loadContentRemote<unknown[]>("team").catch(() => ({ data: [] })),
      loadContentRemote<unknown[]>("testimonials").catch(() => ({ data: [] })),
      loadContentRemote<unknown[]>("projects").catch(() => ({ data: [] })),
    ]);

    blogCount = blog.data.length;
    teamCount = team.data.length;
    testimonialCount = testimonials.data.length;
    projectsCount = projects.data.length;
  } catch {
    // Counts stay at 0 if GitHub API is unavailable
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">
        Welcome back
      </h2>
      <p className="text-slate-500 mb-8">
        Here is an overview of your website content.
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          label="Blog Posts"
          count={blogCount}
          icon={<FileText className="h-6 w-6" />}
          href="/admin/blog"
        />
        <StatCard
          label="Team Members"
          count={teamCount}
          icon={<Users className="h-6 w-6" />}
          href="/admin/team"
        />
        <StatCard
          label="Testimonials"
          count={testimonialCount}
          icon={<Star className="h-6 w-6" />}
          href="/admin/testimonials"
        />
        <StatCard
          label="Projects"
          count={projectsCount}
          icon={<Hammer className="h-6 w-6" />}
          href="/admin/projects"
        />
      </div>

      {/* Quick Actions */}
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Quick Actions
      </h3>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Blog Post
        </Link>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Testimonial
        </Link>
        <Link
          href="/admin/chat"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-lg font-medium text-sm hover:bg-slate-700 transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          AI Chat
        </Link>
      </div>
    </div>
  );
}
