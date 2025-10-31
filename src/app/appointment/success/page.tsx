// src/app/appointment/success/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface AppointmentData {
  doctor: {
    name: string;
    image: string;
    specialty: string;
  };
  date: string;
  reason: string;
  // Note: Contact details removed from client-side storage for security
}

export default function AppointmentSuccessPage() {
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem('lastAppointment');
        if (storedData) {
          const data = JSON.parse(storedData);

          // Only store non-sensitive data for display
          const safeData = {
            doctor: data.doctor,
            date: data.date,
            reason: data.reason
            // Note: contact details are excluded for security
          };

          setAppointmentData(safeData);

          // Clear sensitive data from localStorage after use
          localStorage.removeItem('lastAppointment');
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-[#11161c] border border-gray-700 rounded-2xl p-6 sm:p-8 lg:p-12 w-full max-w-md sm:max-w-lg lg:max-w-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Success Message & Actions */}
          <div className="space-y-6 lg:space-y-8">
            {/* Header with Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                <Image
                  src="/Logomark.svg"
                  alt="CarePulse"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-white">CarePulse</h1>
                <p className="text-gray-400 text-xs sm:text-sm">Patient Portal</p>
              </div>
            </div>

            {/* Success Content */}
            <div className="space-y-4">
              <div className="flex justify-center lg:justify-start">
                <div className="p-4 bg-green-500/10 rounded-full">
                  <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-400" />
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                  Appointment Request<br />Submitted Successfully!
                </h1>
                <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                  We&apos;ll contact you within 24 hours to confirm your appointment details.
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 sm:p-6">
              <h4 className="text-blue-400 font-semibold mb-3 text-lg">What&apos;s Next?</h4>
              <p className="text-blue-300 text-sm sm:text-base">
                Our team will review your request and contact you using the provided contact details to finalize the appointment time.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <Button asChild className="bg-green-600 hover:bg-green-700 text-white border-0 py-4 text-base sm:text-lg font-medium">
                <Link href="/appointment" className="flex items-center justify-center gap-3">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                  Book Another Appointment
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white py-4 text-base sm:text-lg font-medium">
                <Link href="/" className="flex items-center justify-center gap-3">
                  <Home className="h-5 w-5 sm:h-6 sm:w-6" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Appointment Details */}
          {appointmentData && (
            <div className="bg-gray-800/30 rounded-xl p-6 sm:p-8 border border-gray-700">
              <h3 className="font-semibold mb-6 text-gray-300 text-xl text-center">
                Appointment Details
              </h3>
              <div className="space-y-6 sm:space-y-8 text-sm sm:text-base">
                {/* Doctor */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-xl shrink-0">
                    <User className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">Doctor</p>
                    <p className="text-white font-medium text-lg sm:text-xl">{appointmentData.doctor.name}</p>
                    <p className="text-gray-400 text-sm sm:text-base">{appointmentData.doctor.specialty}</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl shrink-0">
                    <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">Preferred Date</p>
                    <p className="text-white font-medium text-lg sm:text-xl">{formatDate(appointmentData.date)}</p>
                  </div>
                </div>

                {/* Reason */}
                {appointmentData.reason && (
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl shrink-0">
                      <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Reason</p>
                      <p className="text-white font-medium text-lg sm:text-xl">{appointmentData.reason}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-8 lg:mt-12 pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-sm text-center">
            Your contact details are secure and will only be used to confirm your appointment.
          </p>
          <p className="text-gray-500 text-xs text-center mt-2">
            @carepulse.com • Secure Patient Portal
          </p>
        </div>
      </div>
    </div>
  );
}