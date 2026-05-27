import { Suspense } from "react";
import { HardHat } from "lucide-react";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Admin Login | Vegas Born Roofing",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="fixed inset-0 z-[60] bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-800 mb-4">
            <HardHat className="h-7 w-7 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Vegas Born Roofing</h1>
          <p className="text-slate-400 text-sm mt-1">
            Admin Dashboard
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <Suspense fallback={<div className="h-64" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
