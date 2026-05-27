import { Suspense } from "react";
import Image from "next/image";
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
          <Image
            src="/images/logo.png"
            alt="Vegas Born Roofing"
            width={80}
            height={93}
            className="mx-auto mb-4"
          />
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
