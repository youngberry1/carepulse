// components/admin-access-modal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, ArrowLeft, Shield } from "lucide-react";
import { toast } from "sonner";

interface AdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback when access is granted
}

const ADMIN_PASSKEY = "348000"; // Hardcoded passkey from your screenshot

export function AdminAccessModal({ isOpen, onClose, onSuccess }: AdminAccessModalProps) {
  const [passkey, setPasskey] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [activeInput, setActiveInput] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

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

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      setPasskey(["", "", "", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleFocus = (index: number) => {
    setActiveInput(index);
  };

  const handleBlur = () => {
    setActiveInput(null);
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedValues = value.split("").slice(0, 6);
      const newPasskey = [...passkey];
      pastedValues.forEach((char, i) => {
        if (index + i < 6) {
          newPasskey[index + i] = char;
        }
      });
      setPasskey(newPasskey);

      // Focus the last input
      const lastIndex = Math.min(index + pastedValues.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();

      // Auto-verify if all fields are filled
      if (newPasskey.every(digit => digit !== "")) {
        handleVerification(newPasskey.join(""));
      }
      return;
    }

    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newPasskey = [...passkey];
    newPasskey[index] = value;
    setPasskey(newPasskey);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all fields are filled
    if (value && index === 5) {
      const passkeyString = newPasskey.join("");
      if (passkeyString.length === 6) {
        handleVerification(passkeyString);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!passkey[index] && index > 0) {
        // Move to previous input on backspace
        inputRefs.current[index - 1]?.focus();
      }
      // Clear current input on backspace
      const newPasskey = [...passkey];
      newPasskey[index] = "";
      setPasskey(newPasskey);
    } else if (e.key === "Enter") {
      // Submit on Enter key
      const passkeyString = passkey.join("");
      if (passkeyString.length === 6) {
        handleVerification(passkeyString);
      }
    }
  };

  const handleVerification = async (passkeyString: string) => {
    setIsVerifying(true);

    const toastId = toast.loading("Verifying access...", {
      duration: Infinity,
    });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      if (passkeyString === ADMIN_PASSKEY) {
        toast.success("Access Granted!", {
          description: "Welcome to the admin panel.",
          duration: 3000,
          id: toastId,
        });

        // Call success callback
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
      } else {
        toast.error("Access Denied", {
          description: "Invalid passkey. Please try again.",
          duration: 4000,
          id: toastId,
        });

        // Clear inputs on failure
        setPasskey(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      toast.error("Verification Failed", {
        description: "Something went wrong. Please try again.",
        duration: 4000,
        id: toastId,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const passkeyString = passkey.join("");

    if (passkeyString.length !== 6) {
      toast.error("Incomplete Passkey", {
        description: "Please enter all 6 digits.",
        duration: 3000,
      });
      return;
    }

    handleVerification(passkeyString);
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
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
          <p className="text-gray-400 text-sm">
            Enter the admin passkey to continue
          </p>
        </div>

        {/* Passkey Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Passkey Inputs */}
          <div className="space-y-4">
            <Label htmlFor="passkey" className="text-sm font-medium text-gray-300">
              Admin Passkey
            </Label>
            <div className="flex gap-3 justify-center">
              {passkey.map((digit, index) => (
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
                      ? "border-blue-500 scale-110 shadow-lg shadow-blue-500/25 z-10 relative"
                      : "border-gray-600 scale-100"
                    }
                    focus:border-blue-500 focus:scale-110 focus:shadow-lg focus:shadow-blue-500/25 focus:z-10 focus:relative
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  disabled={isVerifying}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-6 text-lg font-semibold bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isVerifying || passkey.join("").length !== 6}
          >
            {isVerifying ? "Verifying..." : "Enter Admin Panel"}
          </Button>
        </form>
      </div>
    </div>
  );
}