import { AdminSidebar, AdminTopBar } from "./layout-client";

export const metadata = {
  title: "Admin | Vegas Born Roofing",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-50">
      <AdminSidebar />
      <div className="ml-64 flex flex-col h-full overflow-y-auto">
        <AdminTopBar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
