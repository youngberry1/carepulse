"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface AppointmentCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  appointment?: {
    id: number;
    patient: string;
    date: string;
    doctor: string;
  } | null;
}

export function AppointmentCancellationModal({
  isOpen,
  onClose,
  onSuccess,
  appointment
}: AppointmentCancellationModalProps) {
  const [reason, setReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Wrap handleClose in useCallback to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    setReason("");
    onClose();
  }, [onClose]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
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
  }, [isOpen, handleClose]); // Added handleClose to dependencies

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    setIsCancelling(true);

    // Show loading state
    const toastId = toast.loading("Cancelling appointment...", {
      duration: Infinity,
    });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const cancellationData = {
        appointmentId: appointment?.id,
        patient: appointment?.patient,
        doctor: appointment?.doctor,
        date: appointment?.date,
        reason: reason.trim(),
        cancelledAt: new Date().toISOString()
      };

      console.log("Appointment cancelled:", cancellationData);

      toast.success("Appointment Cancelled!", {
        description: "The appointment has been successfully cancelled.",
        duration: 3000,
        id: toastId,
      });

      // Reset form and close modal
      setReason("");
      onSuccess();
      onClose();

    } catch {
      toast.error("Cancellation Failed", {
        description: "Unable to cancel appointment. Please try again.",
        duration: 4000,
        id: toastId,
      });
    } finally {
      setIsCancelling(false);
    }
  };

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/50 z-40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-[95vw] max-w-md max-h-[90vh] overflow-y-auto border border-gray-700 bg-[#0D0F12] rounded-2xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 text-gray-400 hover:text-white transition-colors z-10 p-1 rounded-lg hover:bg-gray-800/50"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-red-500/10 rounded-full">
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-400" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Cancel Appointment</h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Are you sure you want to cancel this appointment?
            </p>
          </div>

          {/* Appointment Details */}
          {appointment && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-gray-400 min-w-[60px]">Patient:</span>
                  <span className="text-white font-medium text-right flex-1">{appointment.patient}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-400 min-w-[60px]">Doctor:</span>
                  <span className="text-white font-medium text-right flex-1">{appointment.doctor}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-400 min-w-[60px]">Date:</span>
                  <span className="text-white font-medium text-right flex-1">{appointment.date}</span>
                </div>
              </div>
            </div>
          )}

          {/* Reason for Cancellation */}
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            <label className="text-sm font-medium text-gray-300 block">
              Reason for cancellation
            </label>
            <Input
              placeholder="ex: Urgent meeting came up"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-[#11161c] border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-sm sm:text-base py-2.5 sm:py-2"
              disabled={isCancelling}
            >
              Keep Appointment
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-red-500/30 text-sm sm:text-base py-2.5 sm:py-2"
              disabled={isCancelling || !reason.trim()}
            >
              {isCancelling ? "Cancelling..." : "Cancel Appointment"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}