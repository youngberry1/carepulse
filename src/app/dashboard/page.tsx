// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, FileText, Settings, LogOut, Stethoscope, Clock, Bell } from "lucide-react";
import { toast } from "sonner";

interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  hasCompletedProfile: boolean;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      try {
        setIsLoading(true);
        const userSession = localStorage.getItem('userSession');

        if (!userSession) {
          router.push('/login');
          return;
        }

        const userData = JSON.parse(userSession);

        // Use setTimeout to avoid synchronous state update in effect
        setTimeout(() => {
          setUser(userData);
          setIsLoading(false);

          // Check if profile is completed after state is set
          if (!userData.hasCompletedProfile) {
            toast.info("Please complete your profile", {
              description: "Redirecting to patient form...",
              duration: 3000,
            });
            setTimeout(() => {
              router.push('/patient-form');
            }, 2000);
          }
        }, 0);

      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsLoading(false);
        toast.error("Authentication error");
        router.push('/login');
      }
    };

    checkAuthAndProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    localStorage.removeItem('onboardingData');
    localStorage.removeItem('pendingRegistration');
    toast.success("Logged out successfully");
    router.push('/');
  };

  const handleBookAppointment = () => {
    router.push('/appointment');
  };

  const handleViewRecords = () => {
    toast.info("Medical records feature coming soon!");
  };

  const handleEditProfile = () => {
    toast.info("Profile settings feature coming soon!");
  };

  const handleAppointmentHistory = () => {
    toast.info("Appointment history feature coming soon!");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0F12] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  // Show nothing if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0D0F12] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#11161c]">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              {/* CarePulse Logo */}
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <Image
                  src="/Logomark.svg"
                  alt="CarePulse"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">CarePulse Dashboard</h1>
                <p className="text-gray-400 text-xs sm:text-sm">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-gray-400 text-xs">{user.email}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {user.name}!</h2>
          <p className="text-gray-400 text-lg">Here&apos;s your healthcare overview</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#11161c] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Upcoming Appointments</p>
                  <p className="text-2xl font-bold text-white mt-1">0</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-full">
                  <Calendar className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#11161c] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Medical Records</p>
                  <p className="text-2xl font-bold text-white mt-1">0</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#11161c] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Prescriptions</p>
                  <p className="text-2xl font-bold text-white mt-1">0</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-full">
                  <Stethoscope className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Book Appointment */}
          <Card className="bg-[#11161c] border-gray-700 hover:border-green-500/50 transition-colors cursor-pointer">
            <CardHeader className="pb-4">
              <CardTitle className="text-green-400 flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Book Appointment
              </CardTitle>
              <CardDescription className="text-gray-400">
                Schedule your next doctor&apos;s visit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleBookAppointment}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Book Now
              </Button>
            </CardContent>
          </Card>

          {/* Medical Records */}
          <Card className="bg-[#11161c] border-gray-700 hover:border-blue-500/50 transition-colors cursor-pointer">
            <CardHeader className="pb-4">
              <CardTitle className="text-blue-400 flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Medical Records
              </CardTitle>
              <CardDescription className="text-gray-400">
                Access your health information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleViewRecords}
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-gray-800"
              >
                View Records
              </Button>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card className="bg-[#11161c] border-gray-700 hover:border-purple-500/50 transition-colors cursor-pointer">
            <CardHeader className="pb-4">
              <CardTitle className="text-purple-400 flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleEditProfile}
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-gray-800"
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Appointment History */}
          <Card className="bg-[#11161c] border-gray-700 hover:border-orange-500/50 transition-colors cursor-pointer">
            <CardHeader className="pb-4">
              <CardTitle className="text-orange-400 flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                Appointment History
              </CardTitle>
              <CardDescription className="text-gray-400">
                View your past appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleAppointmentHistory}
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-gray-800"
              >
                View History
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-[#11161c] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your recent healthcare activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#0D0F12] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <span className="font-medium">Profile completed</span>
                      <p className="text-gray-400 text-sm">Your patient profile has been set up</p>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm">Just now</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0D0F12] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <span className="font-medium">Account verified</span>
                      <p className="text-gray-400 text-sm">Your phone number has been verified</p>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm">Today</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0D0F12] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <span className="font-medium">Welcome to CarePulse</span>
                      <p className="text-gray-400 text-sm">Your account has been created</p>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm">Today</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="bg-[#11161c] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your scheduled visits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No upcoming appointments</p>
                <Button
                  onClick={handleBookAppointment}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Book Your First Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}