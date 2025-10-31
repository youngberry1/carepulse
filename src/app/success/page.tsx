// src/app/success/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Calendar, User, Clock, ArrowLeft, Mail, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface AppointmentData {
  doctor: {
    name: string;
    image: string;
    specialty: string;
  };
  date: string;
  time: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  reason: string;
}

export default function SuccessPage() {
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem('lastAppointment');
        if (storedData) {
          const data = JSON.parse(storedData);
          setAppointmentData(data);

          // Clear the data after use
          localStorage.removeItem('lastAppointment');
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

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
                <p className="text-gray-400 text-xs sm:text-sm">Admin Portal</p>
              </div>
            </div>

            {/* Success Content */}
            <div className="space-y-4">
              <div className="flex justify-center lg:justify-start">
                <div className="p-4 bg-blue-500/10 rounded-full">
                  <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-blue-400" />
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                  Appointment<br />Scheduled Successfully!
                </h1>
                <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                  The appointment has been scheduled and confirmed in the system.
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 sm:p-6">
              <h4 className="text-blue-400 font-semibold mb-3 text-lg">Appointment Status</h4>
              <p className="text-blue-300 text-sm sm:text-base">
                ✅ <strong>Scheduled</strong> - Patient has been notified<br />
                📅 <strong>Confirmed</strong> - Added to doctor&apos;s calendar<br />
                🔔 <strong>Reminder set</strong> - Automated notifications active
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white border-0 py-4 text-base sm:text-lg font-medium">
                <Link href="/admin/dashboard" className="flex items-center justify-center gap-3">
                  <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                  Back to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white py-4 text-base sm:text-lg font-medium">
                <Link href="/admin/appointments" className="flex items-center justify-center gap-3">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                  View All Appointments
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
                {/* Patient Information */}
                <div className="space-y-4">
                  <h4 className="text-blue-400 font-semibold text-sm mb-3">Patient Information</h4>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl shrink-0">
                      <User className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Patient Name</p>
                      <p className="text-white font-medium text-lg sm:text-xl">{appointmentData.patientName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-xl shrink-0">
                      <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Email</p>
                      <p className="text-white font-medium text-sm sm:text-base">{appointmentData.patientEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl shrink-0">
                      <Phone className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Phone</p>
                      <p className="text-white font-medium text-sm sm:text-base">{appointmentData.patientPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Appointment Information */}
                <div className="space-y-4 pt-4 border-t border-gray-600">
                  <h4 className="text-blue-400 font-semibold text-sm mb-3">Appointment Information</h4>

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

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl shrink-0">
                      <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Appointment Time</p>
                      <p className="text-white font-medium text-lg sm:text-xl">{appointmentData.date}</p>
                      <p className="text-blue-300 text-sm sm:text-base">{appointmentData.time}</p>
                    </div>
                  </div>

                  {appointmentData.reason && (
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-500/10 rounded-xl shrink-0">
                        <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-gray-400 text-xs sm:text-sm mb-1">Reason</p>
                        <p className="text-white font-medium text-sm sm:text-base">{appointmentData.reason}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 lg:mt-12 pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-sm text-center">
            {/* TODO: Replace with actual appointment ID from backend */}
            Appointment ID: [To be assigned by backend] • Status: Confirmed
          </p>
          <p className="text-gray-500 text-xs text-center mt-2">
            @carepulse.com • Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
}