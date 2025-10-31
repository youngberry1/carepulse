//app/appointment/page.tsx
'use client';

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronDown, CalendarIcon, Check, FileText, Clock, MessageCircle, Mail, Phone } from "lucide-react";

// Import the phone input component and styles
import PhoneInput from 'react-phone-number-input';
import { E164Number } from 'libphonenumber-js/core';
import 'react-phone-number-input/style.css';

type Doctor = {
  name: string;
  image: string;
  specialty: string;
};

export default function AppointmentPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<Date>();
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<E164Number | undefined>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
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

  const handleSubmit = async () => {
    if (!selectedDoctor || !appointmentDate || !reason.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!email.trim() && !phone) {
      toast.error("Please provide at least one contact method (email or phone)");
      return;
    }

    if (email.trim() && !isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const appointmentData = {
      doctor: selectedDoctor,
      date: appointmentDate,
      reason: reason.trim(),
      notes: notes.trim(),
      contact: {
        email: email.trim(),
        phone: phone
      },
      patientId: "patient-id-here",
      status: "pending",
      createdAt: new Date().toISOString()
    };

    // Store appointment data in localStorage for the success page
    localStorage.setItem('lastAppointment', JSON.stringify(appointmentData));

    console.log("Appointment data ready for backend:", appointmentData);

    // TODO: Backend integration - Replace this with your actual API call
    /*
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-auth-token'
        },
        body: JSON.stringify(appointmentData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit appointment');
      }
  
      const result = await response.json();
      console.log('Appointment created:', result);
      
      localStorage.setItem('lastAppointment', JSON.stringify(result));
      
      toast.success("Appointment requested successfully!");
      router.push('/appointment/success');
      
    } catch (error) {
      console.error('Error submitting appointment:', error);
      toast.error("Failed to submit appointment. Please try again.");
    }
    */

    // For now, we'll simulate success and redirect
    toast.success("Appointment requested successfully!");

    setTimeout(() => {
      router.push('/appointment/success');
    }, 1500);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const formatDate = (date: Date) => dateFormatter.format(date);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      <main className="min-h-screen w-full flex flex-col md:flex-row bg-[#0D0F12]">
        {/* LEFT SIDE - Appointment Form Section */}
        <section className="flex flex-col justify-center text-white w-full md:w-1/2 px-6 sm:px-8 md:px-16 lg:px-24 py-12 md:py-0">
          <div className="max-w-md mx-auto w-full">
            {/* Enhanced Logo Section */}
            <div className="mb-12 md:mb-16 flex items-center gap-3 mt-6 sm:mt-8 md:mt-12">
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
                <span className="text-2xl text-white sm:text-3xl md:text-4xl font-bold">
                  CarePulse
                </span>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  Patient Portal
                </p>
              </div>
            </div>

            {/* Headings with Better Styling */}
            <div className="mb-8 md:mb-12">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                  Hey
                  <span className="block text-green-400">there</span>
                </h1>
              </div>
              <p className="text-gray-300 text-lg sm:text-xl md:text-2xl font-light">
                Request a new appointment in 10 seconds
              </p>
            </div>

            {/* Form Sections */}
            <div className="space-y-6 mb-8">
              {/* Doctor Selection */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">Doctor</h2>

                {/* Selected Doctor Card */}
                {selectedDoctor && (
                  <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gray-600 flex items-center justify-center">
                        <Image
                          src={selectedDoctor.image}
                          alt={selectedDoctor.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-white font-medium text-base">{selectedDoctor.name}</p>
                        <p className="text-gray-400 text-sm">{selectedDoctor.specialty}</p>
                      </div>
                    </div>
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                )}

                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-[#0D0F12] border border-gray-600 text-white rounded-xl px-4 py-4 text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 flex items-center justify-between hover:border-gray-500 transition-colors"
                  >
                    <span className="text-gray-500">
                      {selectedDoctor ? "Change doctor" : "Select a doctor"}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-[#1a1d21] border border-gray-600 rounded-xl shadow-lg max-h-60 overflow-auto">
                      {doctors.map((doctor) => (
                        <button
                          key={doctor.name}
                          type="button"
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full px-4 py-4 text-left text-base text-white hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center space-x-3 border-b border-gray-700 last:border-b-0 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <div className="shrink-0">
                            <Image
                              src={doctor.image}
                              alt={doctor.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col text-left flex-1">
                            <span className="font-medium">{doctor.name}</span>
                            <span className="text-gray-400 text-sm">{doctor.specialty}</span>
                          </div>
                          {selectedDoctor?.name === doctor.name && (
                            <Check className="h-5 w-5 text-green-500 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Reason for Appointment */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-green-400" />
                  <h2 className="text-xl font-semibold text-white">Reason for appointment</h2>
                </div>
                <Input
                  placeholder="ex: Annual monthly check-up"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="bg-[#0D0F12] border-gray-600 text-white placeholder-gray-500 py-4 text-base rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Expected Appointment Date */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-green-400" />
                  <h2 className="text-xl font-semibold text-white">Expected appointment date</h2>
                </div>
                <div className="relative" ref={calendarRef}>
                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full bg-[#0D0F12] border border-gray-600 text-white rounded-xl px-4 py-4 text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 flex items-center justify-between hover:border-gray-500 transition-colors"
                  >
                    <span className={appointmentDate ? "text-white" : "text-gray-500"}>
                      {appointmentDate ? formatDate(appointmentDate) : "Select your appointment date"}
                    </span>
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </button>

                  {/* Calendar Popup */}
                  {showCalendar && (
                    <div className="absolute z-10 w-full sm:w-96 mt-2 bg-[#1a1d21] border border-gray-600 rounded-xl shadow-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-500">
                      <Calendar
                        mode="single"
                        selected={appointmentDate}
                        onSelect={(date) => {
                          setAppointmentDate(date);
                          setShowCalendar(false);
                        }}
                        className="rounded-md border-none"
                        classNames={{
                          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                          month: "space-y-4",
                          caption: "flex justify-center pt-1 relative items-center",
                          caption_label: "text-sm font-medium text-white",
                          nav: "space-x-1 flex items-center",
                          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white hover:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500",
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex",
                          head_cell: "text-gray-400 rounded-md w-8 sm:w-9 font-normal text-[0.8rem]",
                          row: "flex w-full mt-2",
                          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-green-500 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-8 w-8 sm:h-9 sm:w-9 p-0 font-normal text-white aria-selected:opacity-100 hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",
                          day_selected: "bg-green-500 text-white hover:bg-green-600 focus:bg-green-500 focus:ring-2 focus:ring-green-300",
                          day_today: "bg-gray-700 text-white",
                          day_outside: "text-gray-600",
                          day_disabled: "text-gray-600",
                          day_range_middle: "aria-selected:bg-gray-700 aria-selected:text-white",
                          day_hidden: "invisible",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Details Section */}
              <div className="space-y-4">
                <div className="border-t border-gray-700 pt-4">
                  <h2 className="text-xl font-semibold text-white mb-4">Contact Details</h2>
                  <p className="text-gray-400 text-sm mb-4">
                    Provide at least one contact method so we can reach you
                  </p>
                </div>

                {/* Email Input */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Email Address</h3>
                  </div>
                  <Input
                    type="email"
                    placeholder="ex: your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#0D0F12] border-gray-600 text-white placeholder-gray-500 py-4 text-base rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Phone Input */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Phone Number</h3>
                  </div>
                  <div className="custom-phone-input">
                    <PhoneInput
                      international
                      defaultCountry="US"
                      value={phone}
                      onChange={setPhone}
                      placeholder="Enter phone number"
                      className="custom-phone-input-wrapper"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-green-400" />
                  <h2 className="text-xl font-semibold text-white">Additional comments/notes</h2>
                </div>
                <Textarea
                  placeholder="ex: Prefer afternoon appointments, if possible"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-[#0D0F12] border-gray-600 text-white placeholder-gray-500 min-h-32 resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base rounded-xl"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="w-full py-6 text-lg font-semibold bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Submit and continue
              <Check className="ml-2 h-5 w-5" />
            </Button>

            {/* Enhanced Footer */}
            <div className="mt-16 md:mt-20 pt-6 border-t border-gray-800">
              <p className="text-gray-500 text-sm text-center">
                @carepulse.com • Secure Patient Portal
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE - Appointment Image Section */}
        <section className="w-full md:w-1/2 h-80 md:h-auto relative bg-linear-to-br from-green-900/20 to-blue-900/20">
          <div className="absolute inset-0 bg-black/10 z-0"></div>
          <div className={`relative w-full h-full transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}>
            <Image
              src="/patient-form.png"
              alt="Appointment Illustration"
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
    </>
  );
}