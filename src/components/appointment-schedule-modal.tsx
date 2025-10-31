"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { X, ChevronDown, CalendarIcon, Check, User, Mail } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Import the phone input component and styles
import PhoneInput from 'react-phone-number-input';
import { E164Number } from 'libphonenumber-js/core';
import 'react-phone-number-input/style.css';

interface AppointmentScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Doctor = {
  name: string;
  image: string;
  specialty: string;
};

type Patient = {
  name: string;
  email: string;
  phone: E164Number | undefined;
};

export function AppointmentScheduleModal({ isOpen, onClose, onSuccess }: AppointmentScheduleModalProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<Date>();
  const [reason, setReason] = useState("");
  const [patient, setPatient] = useState<Patient>({
    name: "",
    email: "",
    phone: undefined
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const doctors: Doctor[] = [
    {
      name: "Dr. Sarah Safari",
      image: "/doctors/dr-sarah-safari.jpg",
      specialty: "Cardiologist"
    },
    {
      name: "Dr. Ava Williams",
      image: "/doctors/dr-ava-williams.jpg",
      specialty: "Pediatrician"
    },
    {
      name: "Dr. Adam Smith",
      image: "/doctors/dr-adam-smith.jpg",
      specialty: "General Practitioner"
    },
    {
      name: "Dr. Michael May",
      image: "/doctors/dr-michael-may.jpg",
      specialty: "Neurologist"
    },
    {
      name: "Dr. Jasmine Lee",
      image: "/doctors/dr-jasmine-lee.jpg",
      specialty: "Dermatologist"
    },
    {
      name: "Dr. Harold Sharma",
      image: "/doctors/dr-harold-sharma.jpg",
      specialty: "Orthopedic"
    },
    {
      name: "Dr. Alyana Cruz",
      image: "/doctors/dr-alyana-cruz.jpg",
      specialty: "Pediatrician"
    }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSubmit = () => {
    if (!selectedDoctor || !appointmentDate || !reason.trim() || !patient.name.trim() || !patient.email.trim() || !patient.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isValidEmail(patient.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Show loading state
    const toastId = toast.loading("Scheduling appointment...", {
      duration: Infinity,
    });

    // Simulate API call
    setTimeout(() => {
      const appointmentData = {
        doctor: selectedDoctor,
        date: appointmentDate,
        reason: reason.trim(),
        patient: patient,
        status: "scheduled",
        createdAt: new Date().toISOString()
      };

      console.log("Appointment scheduled:", appointmentData);

      // Create formatters
      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Store ALL appointment data for success page - FIXED HERE
      localStorage.setItem('lastAppointment', JSON.stringify({
        doctor: selectedDoctor,
        date: dateFormatter.format(new Date(appointmentDate)),
        time: timeFormatter.format(new Date(appointmentDate)),
        patientName: patient.name,
        patientEmail: patient.email, // Added this
        patientPhone: patient.phone, // Added this
        reason: reason.trim() // Added this
      }));

      toast.success("Appointment Scheduled!", {
        description: "Appointment has been successfully scheduled.",
        duration: 3000,
        id: toastId,
      });

      // Reset form first
      resetForm();

      // Call success callback
      onSuccess();

      // Close modal
      onClose();

      // Navigate to success page after a brief delay to allow modal to close
      setTimeout(() => {
        router.push('/success');
      }, 100);

    }, 1500);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const resetForm = () => {
    setSelectedDoctor(null);
    setAppointmentDate(undefined);
    setReason("");
    setPatient({ name: "", email: "", phone: undefined });
  };

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const formatDate = (date: Date) => dateFormatter.format(date);

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto border border-gray-700 bg-[#0D0F12] rounded-2xl shadow-2xl mx-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 text-gray-400 hover:text-white transition-colors z-10 bg-[#0D0F12] rounded-full p-1"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Schedule Appointment</h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Please fill in the following details to schedule an appointment
            </p>
          </div>

          {/* Patient Information */}
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-white">Patient Information</h3>

            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Enter patient's full name"
                    value={patient.name}
                    onChange={(e) => setPatient(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10 bg-[#11161c] border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="email"
                    placeholder="Enter patient's email"
                    value={patient.email}
                    onChange={(e) => setPatient(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 bg-[#11161c] border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Phone Number</label>
                <div className="custom-phone-input-admin">
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={patient.phone}
                    onChange={(value) => setPatient(prev => ({ ...prev, phone: value }))}
                    placeholder="Enter patient's phone number"
                    className="custom-phone-input-wrapper"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4 sm:space-y-6">
            {/* Doctor Selection */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-white">Doctor</h3>

              {/* Selected Doctor Preview */}
              {selectedDoctor && (
                <div className="mb-2 sm:mb-3 p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                      <Image
                        src={selectedDoctor.image}
                        alt={selectedDoctor.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-white font-medium text-xs sm:text-sm">{selectedDoctor.name}</p>
                      <p className="text-blue-300 text-xs">{selectedDoctor.specialty}</p>
                    </div>
                  </div>
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                </div>
              )}

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-[#11161c] border border-gray-600 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between hover:border-gray-500 transition-colors text-sm sm:text-base"
                >
                  <span className="text-gray-500">
                    {selectedDoctor ? "Change doctor" : "Select a doctor"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-[#11161c] border border-gray-600 rounded-lg shadow-lg max-h-48 sm:max-h-60 overflow-auto">
                    {doctors.map((doctor) => (
                      <button
                        key={doctor.name}
                        type="button"
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-sm text-white hover:bg-gray-800 transition-colors first:rounded-t-lg last:rounded-b-lg flex items-center justify-between border-b border-gray-700 last:border-b-0"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="relative w-6 h-6 sm:w-8 sm:h-8 shrink-0">
                            <Image
                              src={doctor.image}
                              alt={doctor.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="font-medium text-xs sm:text-sm">{doctor.name}</span>
                            <span className="text-gray-400 text-xs">{doctor.specialty}</span>
                          </div>
                        </div>
                        {selectedDoctor?.name === doctor.name && (
                          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reason for Appointment */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-white">Reason for appointment</h3>
              <Input
                placeholder="ex: Annual monthly check-up"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="bg-[#11161c] border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Expected Appointment Date */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-white">Expected appointment date</h3>
              <div className="relative" ref={calendarRef}>
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full bg-[#11161c] border border-gray-600 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between hover:border-gray-500 transition-colors text-sm sm:text-base"
                >
                  <span className={appointmentDate ? "text-white" : "text-gray-500"}>
                    {appointmentDate ? formatDate(appointmentDate) : "Select your appointment date"}
                  </span>
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                </button>

                {/* Calendar Popup */}
                {showCalendar && (
                  <div className="absolute z-10 w-full mt-1 bg-[#11161c] border border-gray-600 rounded-lg shadow-lg p-3 sm:p-4 max-w-[280px] sm:max-w-xs mx-auto left-0 right-0">
                    <Calendar
                      mode="single"
                      selected={appointmentDate}
                      onSelect={(date) => {
                        setAppointmentDate(date);
                        setShowCalendar(false);
                      }}
                      className="rounded-md border-none w-full"
                      classNames={{
                        months: "flex flex-col space-y-3 sm:space-y-4 w-full",
                        month: "space-y-3 sm:space-y-4 w-full",
                        caption: "flex justify-center pt-1 relative items-center w-full px-8",
                        caption_label: "text-sm font-medium text-white text-center",
                        nav: "space-x-1 flex items-center w-full",
                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 text-white hover:bg-gray-700 rounded flex items-center justify-center transition-all duration-200 border border-gray-600 hover:border-gray-500",
                        nav_button_previous: "absolute left-2 top-1/2 transform -translate-y-1/2",
                        nav_button_next: "absolute right-2 top-1/2 transform -translate-y-1/2",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex w-full justify-between",
                        head_cell: "text-gray-400 rounded-md w-7 h-7 font-normal text-xs flex items-center justify-center",
                        row: "flex w-full justify-between mt-1",
                        cell: "text-center p-0 relative [&:has([aria-selected])]:bg-blue-500 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 w-7 h-7 flex items-center justify-center",
                        day: "h-7 w-7 p-0 font-normal text-white aria-selected:opacity-100 hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center text-xs transition-colors duration-150",
                        day_selected: "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-500",
                        day_today: "bg-gray-700 text-white border border-gray-500",
                        day_outside: "text-gray-600 opacity-40",
                        day_disabled: "text-gray-600 opacity-20 cursor-not-allowed",
                        day_range_middle: "aria-selected:bg-gray-700 aria-selected:text-white",
                        day_hidden: "invisible",
                      }}
                      components={{
                        Chevron: ({ className, ...props }) => (
                          <div className={className} {...props}>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              {props.orientation === "left" ? (
                                <path d="M11 4L7 8L11 12" strokeLinecap="round" strokeLinejoin="round" />
                              ) : (
                                <path d="M5 4L9 8L5 12" strokeLinecap="round" strokeLinejoin="round" />
                              )}
                            </svg>
                          </div>
                        )
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full mt-4 sm:mt-6 py-2 sm:py-3 text-base sm:text-lg font-semibold bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
          >
            Schedule appointment
          </Button>
        </div>
      </div>
    </>
  );
}