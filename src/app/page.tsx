"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, ArrowRight } from "lucide-react";
import { OTPModal } from "@/components/otp-modal";
import { toast } from "sonner";

export default function OnboardingPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
    };

    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email address is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\+?[\d\s-()]+$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please check your information", {
        description: "Please fill in all required fields correctly.",
        duration: 4000,
      });
      return;
    }

    // Here you would typically send the form data to your backend
    // and trigger OTP sending to the phone number
    console.log("Form submitted:", form);

    // Show success toast
    toast.success("OTP Sent!", {
      description: "We've sent a verification code to your phone.",
      duration: 3000,
    });

    // Simulate OTP sending and open modal
    setIsOTPModalOpen(true);
  };

  const handleCloseOTPModal = () => {
    setIsOTPModalOpen(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      <main className="min-h-screen w-full flex flex-col md:flex-row bg-[#0D0F12]">
        {/* LEFT SIDE - Form Section */}
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
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-rrom-green-400 to-green-600 bg-clip-text text-transparent">
                  CarePulse
                </span>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  Healthcare Management
                </p>
              </div>
            </div>

            {/* Headings with Better Styling */}
            <div className="mb-8 md:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight">
                Hi there,
                <span className="block text-green-400">Welcome!</span>
              </h1>
              <p className="text-gray-300 text-lg sm:text-xl md:text-2xl font-light">
                Get Started with Appointments.
              </p>
            </div>

            {/* Enhanced Form with Icons */}
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              {/* Name Field with Person Icon */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-medium text-gray-300">
                  Full name
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-6 rounded-xl border bg-[#11161c] text-white placeholder-gray-500 outline-none focus:ring-4 transition-all duration-200 text-base ${errors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-600 focus:border-green-500 focus:ring-green-500/20"
                      }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field with Mail Icon */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-6 rounded-xl border bg-[#11161c] text-white placeholder-gray-500 outline-none focus:ring-4 transition-all duration-200 text-base ${errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-600 focus:border-green-500 focus:ring-green-500/20"
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Field with Phone Icon */}
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-300">
                  Phone number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-6 rounded-xl border bg-[#11161c] text-white placeholder-gray-500 outline-none focus:ring-4 transition-all duration-200 text-base ${errors.phone
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-600 focus:border-green-500 focus:ring-green-500/20"
                      }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.phone}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-lg font-semibold bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>

            {/* Enhanced Footer */}
            <div className="mt-16 md:mt-20 pt-6 border-t border-gray-800">
              <p className="text-gray-500 text-sm text-center">
                @carepulse.com • Healthcare made simple
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE - Image Section */}
        <section className="w-full md:w-1/2 h-80 md:h-auto relative bg-linear-to-br from-green-900/20 to-blue-900/20">
          <div className="absolute inset-0 bg-black/10 z-0"></div>
          <div className={`relative w-full h-full transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}>
            <Image
              src="/Illustration.svg"
              alt="Healthcare Professional"
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

      {/* OTP Modal */}
      <OTPModal
        isOpen={isOTPModalOpen}
        onClose={handleCloseOTPModal}
        phoneNumber={form.phone}
      />
    </>
  );
}