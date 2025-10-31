// app/login/page.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    let isValid = true;

    if (!form.email.trim()) {
      newErrors.email = "Email address is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
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
      // TODO: Backend integration - Login user
      /*
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      console.log('Login successful:', result);
      */

      console.log("Login attempt:", { email: form.email, password: "***" });

      // Simulate successful login
      const mockUser = {
        id: "1",
        name: "John Doe",
        email: form.email,
        phone: "+1234567890",
        isVerified: true,
        hasCompletedProfile: false // Check if they need to complete patient form
      };

      // Store user session
      localStorage.setItem('userSession', JSON.stringify(mockUser));

      toast.success("Login Successful!", {
        description: "Welcome back to CarePulse!",
        duration: 2000,
      });

      // Check if user needs to complete patient form
      if (!mockUser.hasCompletedProfile) {
        setTimeout(() => {
          router.push('/patient-form');
        }, 1500);
      } else {
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }

    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#0D0F12]">
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
              Welcome Back
              <span className="block text-green-400">Sign in to Continue</span>
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl md:text-2xl font-light">
              Access your healthcare dashboard.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            {/* Email Field */}
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
                  placeholder="Enter your password"
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

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
                Forgot your password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 text-lg font-semibold bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/" className="text-green-400 hover:text-green-300 font-medium transition-colors">
                Create account here
              </Link>
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
    </div>
  );
}