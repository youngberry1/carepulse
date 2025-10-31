// app/page.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, ArrowRight, Shield, Eye, EyeOff, Lock } from "lucide-react";
import { OTPModal } from "@/components/otp-modal";
import { toast } from "sonner";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

// Import the phone input component and styles
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function OnboardingPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "" as string | undefined,
    password: "",
    confirmPassword: ""
  });
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setForm((prev) => ({ ...prev, phone: value || "" }));

    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: ""
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

    if (!form.phone || form.phone.trim() === '') {
      newErrors.phone = "Phone number is required";
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and numbers";
      isValid = false;
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please check your information", {
        description: "Please fill in all required fields correctly.",
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Backend integration - Send form data to backend
      /*
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      const result = await response.json();
      console.log('Account created successfully:', result);
      */

      console.log("Form submitted:", { ...form, password: "***" });

      // Store user data temporarily for OTP verification
      localStorage.setItem('pendingRegistration', JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        registeredAt: new Date().toISOString()
      }));

      // Show success toast
      toast.success("Account Created!", {
        description: "Please verify your phone number to continue.",
        duration: 3000,
      });

      // Open OTP modal for phone verification
      setIsOTPModalOpen(true);

    } catch (error) {
      console.error('Error creating account:', error);
      toast.error('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseOTPModal = () => {
    setIsOTPModalOpen(false);
  };

  const handleOTPVerified = () => {
    // Get the stored registration data
    const pendingRegistration = localStorage.getItem('pendingRegistration');
    if (!pendingRegistration) {
      toast.error("Registration data not found. Please try again.");
      return;
    }

    const userData = JSON.parse(pendingRegistration);

    // TODO: Backend integration - Complete registration after OTP verification
    /*
    try {
      const response = await fetch('/api/auth/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: form.phone,
          otp: enteredOTP
        })
      });

      if (!response.ok) {
        throw new Error('OTP verification failed');
      }

      const result = await response.json();
      console.log('Phone verified successfully:', result);
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Invalid OTP. Please try again.');
      return;
    }
    */

    // Store user data in localStorage for the patient form
    localStorage.setItem('onboardingData', JSON.stringify({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      verifiedAt: new Date().toISOString()
    }));

    // Clear pending registration data
    localStorage.removeItem('pendingRegistration');

    toast.success("Phone Verified!", {
      description: "Redirecting to complete your profile...",
      duration: 2000,
    });

    // Close OTP modal
    setIsOTPModalOpen(false);

    // Redirect to patient form after a brief delay
    setTimeout(() => {
      router.push('/patient-form');
    }, 1500);
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
                <span className="text-2xl text-white sm:text-3xl md:text-4xl font-bold">
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
                Create Account
                <span className="block text-green-400">Welcome to CarePulse!</span>
              </h1>
              <p className="text-gray-300 text-lg sm:text-xl md:text-2xl font-light">
                Start your healthcare journey with us.
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

              {/* Phone Field with Country Codes */}
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-300">
                  Phone number
                </Label>
                <div className="custom-phone-input">
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter your phone number"
                    className="custom-phone-input-wrapper"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-6 rounded-xl border bg-[#11161c] text-white placeholder-gray-500 outline-none focus:ring-4 transition-all duration-200 text-base ${errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-600 focus:border-green-500 focus:ring-green-500/20"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-6 rounded-xl border bg-[#11161c] text-white placeholder-gray-500 outline-none focus:ring-4 transition-all duration-200 text-base ${errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-600 focus:border-green-500 focus:ring-green-500/20"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 text-lg font-semibold bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-green-400 hover:text-green-300 font-medium transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Enhanced Footer with Admin Access */}
            <div className="mt-12 pt-6 border-t border-gray-800">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-sm text-center sm:text-left">
                  @carepulse.com • Healthcare made simple
                </p>

                <div className="flex items-center gap-4">
                  {/* Appointment Booking Link */}
                  <Link
                    href="/appointment"
                    className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm group"
                  >
                    <Calendar className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    Book Appointment
                  </Link>

                  {/* Admin Access Link */}
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm group"
                  >
                    <Shield className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    Admin Access
                  </Link>
                </div>
              </div>
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
        phoneNumber={form.phone || ""}
        onVerified={handleOTPVerified}
      />
    </>
  );
}