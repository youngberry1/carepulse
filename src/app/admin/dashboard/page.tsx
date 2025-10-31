// src/app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  X,
  Check,
  Clock,
  LogOut,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Edit,
  Ban
} from "lucide-react";
import { AppointmentScheduleModal } from "@/components/appointment-schedule-modal";
import { AppointmentCancellationModal } from "@/components/appointment-cancellation-modal";
import { AppointmentRescheduleModal } from "@/components/appointment-reschedule-modal";
import { PatientCreateModal } from "@/components/patient-create-modal";
import { toast } from "sonner";

interface Appointment {
  id: number;
  patient: string;
  date: string;
  status: "scheduled" | "pending" | "cancelled";
  doctor: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [expandedAppointmentId, setExpandedAppointmentId] = useState<number | null>(null);

  // In a real app, you would check for admin authentication here
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    if (!isAuthenticated) {
      router.push('/admin');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    router.push('/admin');
  };

  const handleNewAppointment = () => {
    setIsAppointmentModalOpen(true);
  };

  const handleAddPatient = () => {
    setIsPatientModalOpen(true);
  };

  const handleAppointmentSuccess = () => {
    toast.success("New appointment scheduled successfully!");
  };

  const handleCancellationSuccess = () => {
    toast.success("Appointment cancelled successfully!");
    setIsCancellationModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleRescheduleSuccess = () => {
    toast.success("Appointment rescheduled successfully!");
    setIsRescheduleModalOpen(false);
    setSelectedAppointment(null);
  };

  const handlePatientSuccess = () => {
    toast.success("Patient created successfully!");
    setIsPatientModalOpen(false);
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsCancellationModalOpen(true);
    setExpandedAppointmentId(null);
  };

  const handleRescheduleAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsRescheduleModalOpen(true);
    setExpandedAppointmentId(null);
  };

  const toggleAppointmentActions = (appointmentId: number) => {
    setExpandedAppointmentId(expandedAppointmentId === appointmentId ? null : appointmentId);
  };

  // Mock data based on your screenshot
  const appointments: Appointment[] = [
    {
      id: 1,
      patient: "Phoenix Baker",
      date: "Jun 4, 2022",
      status: "scheduled",
      doctor: "Dr. Alex Ramirez"
    },
    {
      id: 2,
      patient: "Camélia Wu",
      date: "Jun 2, 2022",
      status: "pending",
      doctor: "Dr. Michael May"
    },
    {
      id: 3,
      patient: "Lana Steiner",
      date: "Jun 4, 2022",
      status: "cancelled",
      doctor: "Dr. Jasmine Lee"
    },
    {
      id: 4,
      patient: "Drew Cano",
      date: "Jun 8, 2022",
      status: "scheduled",
      doctor: "Dr. Harold Sharma"
    },
    {
      id: 5,
      patient: "Natali Craig",
      date: "Jun 6, 2022",
      status: "pending",
      doctor: "Dr. Aiyana Cruz"
    }
  ];

  const stats = {
    total: 84,
    pending: 52,
    cancelled: 12,
    completed: 30
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />;
      case "cancelled":
        return <X className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />;
      default:
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Scheduled";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "cancelled":
        return "text-red-400";
      default:
        return "text-yellow-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#11161c]">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              {/* Replaced Shield with CarePulse Logo */}
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <Image
                  src="/Logomark.svg"
                  alt="CarePulse"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">CarePulse</h1>
                <p className="text-gray-400 text-xs sm:text-sm">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-normal">
              <div className="text-right sm:text-right">
                <p className="font-semibold text-sm sm:text-base">Welcome, Admin</p>
                <p className="text-gray-400 text-xs sm:text-sm">Start day with managing new appointments</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs sm:text-sm"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Overview - Toggle for Mobile */}
        <div className="mb-6 sm:mb-8">
          {/* Toggle Button for Mobile */}
          <div className="md:hidden flex justify-center mb-4">
            <Button
              onClick={() => setIsStatsExpanded(!isStatsExpanded)}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs w-full max-w-xs justify-between"
            >
              <span>Statistics Overview</span>
              {isStatsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {/* Stats Grid */}
          <div className={`
            grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 transition-all duration-300 ease-in-out
            ${isStatsExpanded ? 'block' : 'hidden md:grid'}
          `}>
            {/* Total Appointments */}
            <div className="bg-[#11161c] rounded-xl p-4 sm:p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Total Appointments</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg">
                  <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Pending Appointments */}
            <div className="bg-[#11161c] rounded-xl p-4 sm:p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Pending Appointments</p>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-400">{stats.pending}</p>
                </div>
                <div className="p-2 sm:p-3 bg-yellow-500/10 rounded-lg">
                  <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* Cancelled Appointments */}
            <div className="bg-[#11161c] rounded-xl p-4 sm:p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Cancelled Appointments</p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-400">{stats.cancelled}</p>
                </div>
                <div className="p-2 sm:p-3 bg-red-500/10 rounded-lg">
                  <X className="h-4 w-4 sm:h-6 sm:w-6 text-red-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-[#11161c] rounded-xl border border-gray-700 overflow-hidden mb-6 sm:mb-8">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold">Appointment Management</h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Manage all scheduled appointments</p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 sm:px-6 text-gray-400 font-semibold text-xs sm:text-sm">Patient</th>
                  <th className="text-left py-3 px-4 sm:px-6 text-gray-400 font-semibold text-xs sm:text-sm">Date</th>
                  <th className="text-left py-3 px-4 sm:px-6 text-gray-400 font-semibold text-xs sm:text-sm">Status</th>
                  <th className="text-left py-3 px-4 sm:px-6 text-gray-400 font-semibold text-xs sm:text-sm">Doctor</th>
                  <th className="text-left py-3 px-4 sm:px-6 text-gray-400 font-semibold text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-4 sm:px-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                        </div>
                        <span className="font-medium text-xs sm:text-sm">{appointment.patient}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-gray-300 text-xs sm:text-sm">{appointment.date}</td>
                    <td className="py-3 px-4 sm:px-6">
                      <div className="flex items-center gap-1 sm:gap-2">
                        {getStatusIcon(appointment.status)}
                        <span className={`text-xs sm:text-sm ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-gray-300 text-xs sm:text-sm">{appointment.doctor}</td>
                    <td className="py-3 px-4 sm:px-6">
                      <div className="flex gap-1 sm:gap-2">
                        <Button
                          size="sm"
                          className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30 text-xs"
                          onClick={() => handleRescheduleAppointment(appointment)}
                          disabled={appointment.status === "cancelled"}
                        >
                          Reschedule
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                          onClick={() => handleCancelAppointment(appointment)}
                          disabled={appointment.status === "cancelled"}
                        >
                          {appointment.status === "cancelled" ? "Cancelled" : "Cancel"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="border-b border-gray-700/50 p-4">
                {/* Main Card Content */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{appointment.patient}</p>
                      <p className="text-gray-400 text-xs">{appointment.date}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleAppointmentActions(appointment.id)}
                    className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                </div>

                {/* Status and Doctor */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(appointment.status)}
                    <span className={`text-sm ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                  <span className="text-gray-300 text-xs">{appointment.doctor}</span>
                </div>

                {/* Expandable Actions */}
                {expandedAppointmentId === appointment.id && (
                  <div className="mt-3 pt-3 border-t border-gray-700/50 space-y-2 animate-in fade-in duration-200">
                    <Button
                      className="w-full justify-start bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30 text-sm"
                      onClick={() => handleRescheduleAppointment(appointment)}
                      disabled={appointment.status === "cancelled"}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Reschedule Appointment
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm"
                      onClick={() => handleCancelAppointment(appointment)}
                      disabled={appointment.status === "cancelled"}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      {appointment.status === "cancelled" ? "Already Cancelled" : "Cancel Appointment"}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Table Footer */}
          <div className="px-4 sm:px-6 py-3 bg-gray-800/20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
              <p className="text-gray-400 text-xs sm:text-sm">
                Showing {appointments.length} of {stats.total} appointments
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 text-xs">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 text-xs">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#11161c] rounded-xl p-4 sm:p-6 border border-gray-700">
            <h3 className="font-semibold text-lg sm:text-xl mb-4">Appointment Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Completed Appointments</span>
                <span className="font-semibold text-green-400 text-sm">{stats.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Scheduled for Today</span>
                <span className="font-semibold text-blue-400 text-sm">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Rescheduled</span>
                <span className="font-semibold text-yellow-400 text-sm">5</span>
              </div>
            </div>
          </div>

          <div className="bg-[#11161c] rounded-xl p-4 sm:p-6 border border-gray-700">
            <h3 className="font-semibold text-lg sm:text-xl mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={handleNewAppointment}
                className="w-full justify-start bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30 text-sm sm:text-base"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Create New Appointment
              </Button>
              <Button
                onClick={handleAddPatient}
                className="w-full justify-start bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30 text-sm sm:text-base"
              >
                <User className="h-4 w-4 mr-2" />
                Add New Patient
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Appointment Schedule Modal */}
      <AppointmentScheduleModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSuccess={handleAppointmentSuccess}
      />

      {/* Appointment Cancellation Modal */}
      <AppointmentCancellationModal
        isOpen={isCancellationModalOpen}
        onClose={() => {
          setIsCancellationModalOpen(false);
          setSelectedAppointment(null);
        }}
        onSuccess={handleCancellationSuccess}
        appointment={selectedAppointment}
      />

      {/* Appointment Reschedule Modal */}
      <AppointmentRescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setSelectedAppointment(null);
        }}
        onSuccess={handleRescheduleSuccess}
        appointment={selectedAppointment}
      />

      {/* Patient Create Modal */}
      <PatientCreateModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSuccess={handlePatientSuccess}
      />
    </div>
  );
}