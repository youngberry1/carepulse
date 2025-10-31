// src/components/appointment-reschedule-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Stethoscope, X, Mail } from "lucide-react";

// Import the phone input component and styles
import PhoneInput from 'react-phone-number-input';
import { E164Number } from 'libphonenumber-js/core';
import 'react-phone-number-input/style.css';

interface Appointment {
  id: number;
  patient: string;
  date: string;
  status: "scheduled" | "pending" | "cancelled";
  doctor: string;
  patientEmail?: string;
  patientPhone?: E164Number | undefined;
}

interface AppointmentRescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  appointment: Appointment | null;
}

export function AppointmentRescheduleModal({
  isOpen,
  onClose,
  onSuccess,
  appointment,
}: AppointmentRescheduleModalProps) {
  // Initialize state with appointment data directly
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");

  // Initialize phone and email directly from appointment props
  const [patientPhone, setPatientPhone] = useState<E164Number | undefined>(
    () => appointment?.patientPhone
  );
  const [patientEmail, setPatientEmail] = useState(
    () => appointment?.patientEmail || ""
  );

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset form when modal opens with new appointment
  useEffect(() => {
    if (isOpen && appointment) {
      // Use setTimeout to avoid synchronous state updates
      const timer = setTimeout(() => {
        setPatientPhone(appointment.patientPhone);
        setPatientEmail(appointment.patientEmail || "");
        setSelectedDate("");
        setSelectedTime("");
        setReason("");
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [isOpen, appointment]);

  const handleSubmit = () => {
    // In a real app, you would make an API call here
    console.log("Rescheduling appointment:", {
      appointmentId: appointment?.id,
      newDate: selectedDate,
      newTime: selectedTime,
      reason,
      patientPhone,
      patientEmail
    });

    onSuccess();
    onClose();
  };

  // Don't render anything if modal is closed or no appointment
  if (!isOpen || !appointment) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-[95vw] max-w-[500px] sm:max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700 bg-[#11161c] rounded-xl sm:rounded-2xl shadow-2xl">
        {/* Custom Header */}
        <div className="relative p-4 sm:p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold text-white text-center sm:text-left">
              Reschedule Appointment
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800/50"
              aria-label="Close modal"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Current Appointment Info */}
          <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4 space-y-3">
            <h4 className="font-medium text-sm text-gray-300">Current Appointment Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-blue-400 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Patient</p>
                  <p className="text-white font-medium">{appointment.patient}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-green-400 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Date</p>
                  <p className="text-white font-medium">{appointment.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Stethoscope className="h-4 w-4 text-purple-400 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Doctor</p>
                  <p className="text-white font-medium">{appointment.doctor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`h-2 w-2 rounded-full ${appointment.status === 'scheduled' ? 'bg-green-500' : appointment.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <div>
                  <p className="text-gray-400 text-xs">Status</p>
                  <p className="text-white font-medium capitalize">{appointment.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Contact Information */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 sm:p-4 space-y-3">
            <h4 className="font-medium text-sm text-blue-400">Patient Contact Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-300">Phone Number</label>
                <div className="custom-phone-input-admin">
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={patientPhone}
                    onChange={setPatientPhone}
                    placeholder="Enter phone number"
                    className="custom-phone-input-wrapper"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* New Appointment Details */}
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 sm:p-4 space-y-4">
            <h4 className="font-medium text-sm text-green-400">New Appointment Details</h4>

            {/* New Date Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-300">
                  Select New Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Time Slot Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-300">
                  Select Time Slot
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time} className="bg-gray-800 text-white">
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Alternative Time Slot Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-300">
                Or choose from available slots:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 text-xs border rounded-lg transition-all duration-200 flex flex-col items-center justify-center min-h-[50px] ${selectedTime === time
                      ? "bg-green-500/30 border-green-400 text-green-300 shadow-lg shadow-green-500/20"
                      : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:text-white"
                      }`}
                  >
                    <Clock className="h-3 w-3 mb-1 shrink-0" />
                    <span className="text-xs font-medium">{time}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reason for Rescheduling */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Reason for Rescheduling
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for rescheduling this appointment..."
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-white placeholder-gray-400"
              rows={3}
            />
            <p className="text-xs text-gray-400">
              This information will help us better serve the patient and improve our scheduling process.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500 transition-all duration-200 py-2.5 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedTime}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white border-0 transition-all duration-200 py-2.5 text-sm font-medium shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Confirm Reschedule
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}