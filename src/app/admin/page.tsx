"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ArrowRight, Users, Settings } from "lucide-react";
import { AdminAccessModal } from "@/components/admin-access-modal";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();

  const handleAdminAccess = () => {
    // This will be called after successful verification
    console.log("Admin access granted - redirecting to dashboard");

    // Set admin authentication flag (if using localStorage)
    localStorage.setItem('admin_authenticated', 'true');

    // Use router.push for client-side navigation
    router.push('/admin/dashboard');
  };


  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      <main className="min-h-screen w-full flex flex-col md:flex-row bg-[#0D0F12]">
        {/* LEFT SIDE - Admin Content Section */}
        <section className="flex flex-col justify-center text-white w-full md:w-1/2 px-6 sm:px-8 md:px-16 lg:px-24 py-12 md:py-0">
          <div className="max-w-md mx-auto w-full">
            {/* Enhanced Logo Section */}
            <div className="mb-12 md:mb-16 flex items-center gap-3">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
                <Image
                  src="/Logomark.svg"
                  alt="CarePulse Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <span className="text-2xl text-white sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text">
                  CarePulse
                </span>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  Admin Portal
                </p>
              </div>
            </div>

            {/* Headings with Better Styling */}
            <div className="mb-8 md:mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                  Admin
                  <span className="block text-blue-400">Access</span>
                </h1>
              </div>
              <p className="text-gray-300 text-lg sm:text-xl md:text-2xl font-light">
                Secure administrative portal
              </p>
            </div>

            {/* Admin Features List */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4 p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                <Users className="h-6 w-6 text-blue-400" />
                <div>
                  <h3 className="font-semibold text-white">User Management</h3>
                  <p className="text-gray-400 text-sm">Manage patients and staff accounts</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                <Settings className="h-6 w-6 text-blue-400" />
                <div>
                  <h3 className="font-semibold text-white">System Settings</h3>
                  <p className="text-gray-400 text-sm">Configure application settings</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                <Lock className="h-6 w-6 text-blue-400" />
                <div>
                  <h3 className="font-semibold text-white">Security Controls</h3>
                  <p className="text-gray-400 text-sm">Access logs and security settings</p>
                </div>
              </div>
            </div>

            {/* Access Button */}
            <Button
              onClick={() => setIsAdminModalOpen(true)}
              className="w-full py-6 text-lg font-semibold bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Enter Admin Portal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p className="text-yellow-400 text-sm text-center">
                <Lock className="h-4 w-4 inline mr-1" />
                Restricted access. Authorized personnel only.
              </p>
            </div>

            {/* Enhanced Footer */}
            <div className="mt-16 md:mt-20 pt-6 border-t border-gray-800">
              <p className="text-gray-500 text-sm text-center">
                @carepulse.com • Secure Admin Portal
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE - Admin Image Section */}
        <section className="w-full md:w-1/2 h-80 md:h-auto relative bg-linear-to-br from-blue-900/20 to-purple-900/20">
          <div className="absolute inset-0 bg-black/10 z-0"></div>
          <div className={`relative w-full h-full transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}>
            <Image
              src="/admin-security.png"
              alt="Admin Security Illustration"
              fill
              className="object-cover"
              priority
              onLoad={handleImageLoad}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse z-10"></div>
          )}
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-r from-[#0D0F12] via-transparent to-transparent md:bg-linear-to-l md:from-[#0D0F12] md:via-transparent md:to-transparent z-0"></div>
        </section>
      </main>

      {/* Admin Access Modal */}
      <AdminAccessModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleAdminAccess}
      />
    </>
  );
}