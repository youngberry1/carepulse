// components/otp-modal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, ArrowLeft, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
}

const OTP_TIMER_SECONDS = 120; // 2 minutes

export function OTPModal({ isOpen, onClose, phoneNumber }: OTPModalProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(OTP_TIMER_SECONDS);
  const [isResending, setIsResending] = useState(false);
  const [activeInput, setActiveInput] = useState<number | null>(null);

  // Handle timer countdown
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timerId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          // Show toast when timer runs out
          if (prev === 1) {
            toast.error("OTP Expired", {
              description: "Your OTP has expired. Please request a new one.",
              duration: 4000,
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isOpen]);

  // Reset timer and form when modal opens
  useEffect(() => {
    if (isOpen) {
      resetTimer();
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  // Reset timer (called on resend)
  const resetTimer = () => {
    setTimer(OTP_TIMER_SECONDS);
    setOtp(["", "", "", "", "", ""]);
  };

  const handleFocus = (index: number) => {
    setActiveInput(index);
  };

  const handleBlur = () => {
    setActiveInput(null);
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // If user pastes multiple characters
      const pastedOtp = value.split("").slice(0, 6);
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (index + i < 6) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);

      // Focus the last input
      const lastIndex = Math.min(index + pastedOtp.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
      return;
    }

    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (value && index === 5) {
      const otpString = newOtp.join("");
      if (otpString.length === 6) {
        handleOTPVerification(otpString);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input on backspace
        inputRefs.current[index - 1]?.focus();
      }
      // Clear current input on backspace
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleOTPVerification = async (otpString: string) => {
    // Show loading state
    const toastId = toast.loading("Verifying OTP...", {
      duration: Infinity,
    });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Here you would typically verify the OTP with your backend
      console.log("OTP Submitted:", otpString);

      toast.success("OTP Verified!", {
        description: "Your phone number has been successfully verified.",
        duration: 3000,
        id: toastId,
      });

      // Close modal after successful verification
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch {
      // Remove the unused 'error' parameter
      toast.error("Verification Failed", {
        description: "Invalid OTP. Please try again.",
        duration: 4000,
        id: toastId,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      toast.error("Incomplete OTP", {
        description: "Please enter all 6 digits of the OTP.",
        duration: 3000,
      });
      return;
    }

    handleOTPVerification(otpString);
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;

    setIsResending(true);

    // Show loading toast
    const toastId = toast.loading("Sending new OTP...", {
      duration: Infinity,
    });

    try {
      // Simulate API call to resend OTP
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset timer and form
      resetTimer();

      toast.success("New OTP Sent!", {
        description: "A new verification code has been sent to your phone.",
        duration: 3000,
        id: toastId,
      });

      // Focus first input
      inputRefs.current[0]?.focus();

    } catch {
      // Remove the unused 'error' parameter
      toast.error("Failed to Resend", {
        description: "Unable to send OTP. Please try again.",
        duration: 4000,
        id: toastId,
      });
    } finally {
      setIsResending(false);
    }
  };

  // Format timer as MM:SS
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-[#0D0F12] border border-gray-700 rounded-2xl w-full max-w-md p-6 relative transform transition-all duration-300 scale-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Back Button */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
          <p className="text-gray-400 text-sm">
            Please enter the OTP sent to your registered mobile number
          </p>
          <p className="text-green-400 font-medium mt-2 text-base">{phoneNumber}</p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Inputs */}
          <div className="space-y-4">
            <Label htmlFor="otp" className="text-sm font-medium text-gray-300">
              Enter OTP
            </Label>
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    if (el) {
                      inputRefs.current[index] = el;
                    }
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => handleFocus(index)}
                  onBlur={handleBlur}
                  className={`
                    w-12 h-12 text-center text-lg font-semibold 
                    bg-[#11161c] border text-white rounded-xl 
                    transition-all duration-300 transform
                    ${activeInput === index
                      ? "border-green-500 scale-110 shadow-lg shadow-green-500/25 z-10 relative"
                      : "border-gray-600 scale-100"
                    }
                    focus:border-green-500 focus:scale-110 focus:shadow-lg focus:shadow-green-500/25 focus:z-10 focus:relative
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  disabled={timer === 0}
                />
              ))}
            </div>

            {/* Timer Countdown */}
            <div className="text-center mt-4">
              {timer > 0 ? (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <span>OTP expires in</span>
                  <span className="font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                    {formatTimer(timer)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-sm text-red-400 font-medium">
                  <span>OTP expired</span>
                </div>
              )}
            </div>
          </div>

          {/* Verify Button */}
          <Button
            type="submit"
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={timer === 0 || otp.join("").length !== 6}
          >
            {timer === 0 ? "OTP Expired" : "Verify OTP"}
          </Button>

          {/* Resend OTP */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              className={`flex items-center justify-center gap-2 text-sm font-medium transition-all duration-300 ${timer > 0 || isResending
                ? "text-gray-500 cursor-not-allowed"
                : "text-green-400 hover:text-green-300 hover:scale-105"
                }`}
              disabled={timer > 0 || isResending}
            >
              <RotateCcw className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
              {isResending ? "Sending..." : "Didn't receive code? Resend OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}