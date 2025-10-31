// app/patient-form/page.tsx
"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, User, Stethoscope, FileText, ShieldCheck, Check, Upload, ChevronDown, Calendar, Mail, MapPin, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Import the phone input component and styles
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

type FormData = {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyPhone: string;
  guardiansName: string;

  // Medical Information
  primaryCarePhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string;
  currentMedications: string;
  familyMedicalHistory: string;
  pastMedicalHistory: string;

  // Identification
  identificationType: string;
  identificationNumber: string;
  identificationDocument: File | null;

  // Consent
  consentTreatment: boolean;
  consentHealthInfo: boolean;
  consentPrivacyPolicy: boolean;
};

type Step = "personal" | "medical" | "identification" | "consent";

type Doctor = {
  name: string;
  image: string;
  specialty: string;
};

export default function PatientFormPage() {
  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    occupation: "",
    emergencyContactName: "",
    emergencyPhone: "",
    guardiansName: "",

    // Medical Information
    primaryCarePhysician: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    allergies: "",
    currentMedications: "",
    familyMedicalHistory: "",
    pastMedicalHistory: "",

    // Identification
    identificationType: "",
    identificationNumber: "",
    identificationDocument: null,

    // Consent
    consentTreatment: false,
    consentHealthInfo: false,
    consentPrivacyPolicy: false,
  });

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

  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: "personal", label: "Personal Info", icon: <User className="h-4 w-4" /> },
    { id: "medical", label: "Medical Info", icon: <Stethoscope className="h-4 w-4" /> },
    { id: "identification", label: "Identification", icon: <FileText className="h-4 w-4" /> },
    { id: "consent", label: "Consent", icon: <ShieldCheck className="h-4 w-4" /> },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field: keyof FormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData(prev => ({ ...prev, phone: value || "" }));
  };

  const handleEmergencyPhoneChange = (value: string | undefined) => {
    setFormData(prev => ({ ...prev, emergencyPhone: value || "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange("identificationDocument", file);
  };

  const validatePersonalInfo = () => {
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!formData.dateOfBirth) {
      toast.error("Please enter your date of birth");
      return false;
    }
    if (!formData.gender) {
      toast.error("Please select your gender");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("Please enter your address");
      return false;
    }
    if (!formData.emergencyContactName.trim()) {
      toast.error("Please enter emergency contact name");
      return false;
    }
    if (!formData.emergencyPhone.trim()) {
      toast.error("Please enter emergency phone number");
      return false;
    }
    return true;
  };

  const validateMedicalInfo = () => {
    // Medical information is optional, so no validation needed
    return true;
  };

  const validateIdentification = () => {
    if (!formData.identificationType) {
      toast.error("Please select identification type");
      return false;
    }
    if (!formData.identificationNumber.trim()) {
      toast.error("Please enter identification number");
      return false;
    }
    if (!formData.identificationDocument) {
      toast.error("Please upload identification document");
      return false;
    }
    return true;
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case "personal":
        return validatePersonalInfo();
      case "medical":
        return validateMedicalInfo(); // Always returns true since medical info is optional
      case "identification":
        return validateIdentification();
      case "consent":
        if (!formData.consentTreatment || !formData.consentHealthInfo || !formData.consentPrivacyPolicy) {
          toast.error("Please agree to all consent terms");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    const stepOrder: Step[] = ["personal", "medical", "identification", "consent"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const stepOrder: Step[] = ["personal", "medical", "identification", "consent"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentStep()) return;

    // TODO: Backend integration - Submit patient form data
    /*
    try {
      const response = await fetch('/api/patient-form/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit patient form');
      }
  
      const result = await response.json();
      console.log('Patient form submitted successfully:', result);
      
    } catch (error) {
      console.error('Error submitting patient form:', error);
      toast.error('Failed to submit form. Please try again.');
      return;
    }
    */

    console.log("Form submitted:", formData);

    // Update user session to mark profile as completed
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      const user = JSON.parse(userSession);
      user.hasCompletedProfile = true;
      localStorage.setItem('userSession', JSON.stringify(user));
    }

    toast.success("Profile Completed!", {
      description: "Redirecting to your dashboard...",
      duration: 2000,
    });

    // Redirect to dashboard after form completion
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const getStepNumber = (step: Step) => {
    const stepOrder: Step[] = ["personal", "medical", "identification", "consent"];
    return stepOrder.indexOf(step) + 1;
  };

  // Skip medical information step
  const handleSkipMedical = () => {
    const stepOrder: Step[] = ["personal", "medical", "identification", "consent"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#11161c]">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              {/* CarePulse Logo */}
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
                <p className="text-gray-400 text-xs sm:text-sm">Patient Registration</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-normal">
              <div className="text-right sm:text-right">
                <p className="font-semibold text-sm sm:text-base">Welcome to CarePulse</p>
                <p className="text-gray-400 text-xs sm:text-sm">Complete your registration in 4 simple steps</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Progress Steps */}
        <div className="bg-[#11161c] rounded-xl p-4 sm:p-6 border border-gray-700 mb-6 sm:mb-8">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  {/* Step Circle */}
                  <div
                    className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 transition-all duration-300 ${currentStep === step.id
                      ? "bg-green-500 border-green-500 text-white"
                      : getStepNumber(currentStep) > getStepNumber(step.id)
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-600 text-gray-400"
                      }`}
                  >
                    {getStepNumber(currentStep) > getStepNumber(step.id) ? (
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    ) : (
                      <div className="h-3 w-3 sm:h-4 sm:w-4">
                        {step.icon}
                      </div>
                    )}
                  </div>

                  {/* Step Label - Hidden on mobile, visible on tablet and up */}
                  <span
                    className={`ml-2 font-medium hidden sm:block text-sm ${currentStep === step.id || getStepNumber(currentStep) > getStepNumber(step.id)
                      ? "text-white"
                      : "text-gray-400"
                      }`}
                  >
                    {step.label}
                  </span>

                  {/* Connector Line (except for last step) - Hidden on mobile */}
                  {index < steps.length - 1 && (
                    <div
                      className={`w-4 sm:w-6 lg:w-8 h-0.5 mx-1 sm:mx-2 hidden sm:block ${getStepNumber(currentStep) > getStepNumber(step.id)
                        ? "bg-green-500"
                        : "bg-gray-600"
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Step Indicator */}
          <div className="sm:hidden text-center mt-4">
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg py-2 px-4 inline-block">
              <span className="text-green-400 font-medium text-sm">
                Step {getStepNumber(currentStep)} of {steps.length}: {steps.find(s => s.id === currentStep)?.label}
              </span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <div className="bg-[#11161c] rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-800">
              {/* Personal Information Step */}
              {currentStep === "personal" && (
                <div className="space-y-6">
                  <h2 className="text-lg sm:text-xl font-bold text-green-400">Personal Information</h2>

                  <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium text-gray-300">
                        Full name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="fullName"
                          placeholder="ex: Adam Smith"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          className="pl-10 bg-[#0D0F12] border-gray-600 text-white placeholder-gray-500 text-sm focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                        Email address *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="ex: patient@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="pl-10 bg-[#0D0F12] border-gray-600 text-white placeholder-gray-500 text-sm focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>

                    {/* Phone Field with Country Codes */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-300">
                        Phone number *
                      </Label>
                      <div className="custom-phone-input">
                        <PhoneInput
                          international
                          defaultCountry="US"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          placeholder="Enter your phone number"
                          className="custom-phone-input-wrapper"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-300">
                        Date of birth *
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                          className="pl-10 bg-[#0D0F12] border-gray-600 text-white placeholder-gray-500 text-sm focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>

                    {/* Gender - Full width on mobile */}
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-sm font-medium text-gray-300">Gender *</Label>
                      <div className="flex flex-wrap gap-3 sm:gap-4">
                        {["Male", "Female", "Other"].map((gender) => (
                          <label key={gender} className="flex items-center space-x-2 cursor-pointer group">
                            <div className={`relative flex items-center justify-center w-5 h-5 border-2 rounded-full transition-all ${formData.gender === gender
                              ? "bg-green-500 border-green-500"
                              : "border-gray-500 group-hover:border-gray-400"
                              }`}>
                              {formData.gender === gender && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <input
                              type="radio"
                              name="gender"
                              value={gender}
                              checked={formData.gender === gender}
                              onChange={(e) => handleInputChange("gender", e.target.value)}
                              className="sr-only"
                            />
                            <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                              {gender}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address" className="text-sm font-medium text-gray-300">
                        Address *
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="address"
                          placeholder="ex: 14 street, New York, NY - 5101"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className="pl-10 bg-[#0D0F12] border-gray-600 text-white placeholder-gray-500 text-sm focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="occupation" className="text-sm font-medium text-gray-300">
                        Occupation
                      </Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="occupation"
                          placeholder="ex: Software Engineer"
                          value={formData.occupation}
                          onChange={(e) => handleInputChange("occupation", e.target.value)}
                          className="pl-10 bg-[#0D0F12] border-gray-600 text-white placeholder-gray-500 text-sm focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactName" className="text-sm font-medium text-gray-300">
                        Emergency contact name *
                      </Label>
                      <Input
                        id="emergencyContactName"
                        placeholder="Guardian's name"
                        value={formData.emergencyContactName}
                        onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                        className="bg-[#0D0F12] border-gray-600 text-white placeholder-gray-500 text-sm focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    {/* Emergency Phone Field with Country Codes */}
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone" className="text-sm font-medium text-gray-300">
                        Emergency Phone number *
                      </Label>
                      <div className="custom-phone-input">
                        <PhoneInput
                          international
                          defaultCountry="US"
                          value={formData.emergencyPhone}
                          onChange={handleEmergencyPhoneChange}
                          placeholder="Enter emergency phone number"
                          className="custom-phone-input-wrapper"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Medical Information Step */}
              {currentStep === "medical" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-xl font-bold text-green-400">Medical Information</h2>
                    <span className="text-gray-400 text-sm bg-gray-800 px-3 py-1 rounded-full">Optional</span>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                    <p className="text-blue-400 text-sm">
                      This section is optional. You can provide your medical information now or update it later in your profile.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
                    {/* Primary Care Physician Dropdown */}
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-sm font-medium text-gray-300">
                        Primary care physician
                      </Label>

                      {/* Selected Doctor Card */}
                      {formData.primaryCarePhysician && (
                        <div className="mb-3 p-3 bg-[#0D0F12] border border-gray-600 rounded-lg flex items-center space-x-3">
                          <Image
                            src={doctors.find(d => d.name === formData.primaryCarePhysician)?.image || "/doctors/default.jpg"}
                            alt={formData.primaryCarePhysician}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">{formData.primaryCarePhysician}</p>
                            <p className="text-gray-400 text-xs">
                              {doctors.find(d => d.name === formData.primaryCarePhysician)?.specialty}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleInputChange("primaryCarePhysician", "")}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}

                      <div className="relative" ref={dropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full bg-[#0D0F12] border border-gray-600 text-white rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500 flex items-center justify-between hover:border-gray-500 transition-colors"
                        >
                          <span className="text-gray-500">
                            {formData.primaryCarePhysician ? "Change physician" : "Select a physician"}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-[#0D0F12] border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                            {doctors.map((doctor) => (
                              <button
                                key={doctor.name}
                                type="button"
                                onClick={() => {
                                  handleInputChange("primaryCarePhysician", doctor.name);
                                  setIsDropdownOpen(false);
                                }}
                                className="w-full px-3 py-3 text-left text-sm text-white hover:bg-gray-800 transition-colors first:rounded-t-md last:rounded-b-md flex items-center space-x-3 border-b border-gray-700 last:border-b-0"
                              >
                                <div className="shrink-0">
                                  <Image
                                    src={doctor.image}
                                    alt={doctor.name}
                                    width={40}
                                    height={40}
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                </div>
                                <div className="flex flex-col text-left">
                                  <span className="font-medium">{doctor.name}</span>
                                  <span className="text-gray-400 text-xs">{doctor.specialty}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="insuranceProvider" className="text-sm font-medium text-gray-300">
                        Insurance provider
                      </Label>
                      <Input
                        id="insuranceProvider"
                        placeholder="ex: BlueCross"
                        value={formData.insuranceProvider}
                        onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
                        className="bg-[#0D0F12] border-gray-600 text-white placeholder-gray-500 text-sm focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="insurancePolicyNumber" className="text-sm font-medium text-gray-300">
                        Insurance policy number
                      </Label>
                      <Input
                        id="insurancePolicyNumber"
                        placeholder="ex: ABC1234567"
                        value={formData.insurancePolicyNumber}
                        onChange={(e) => handleInputChange("insurancePolicyNumber", e.target.value)}
                        className="bg-[#0D0F12] border-gray-600 text-white placeholder-gray-500 text-sm focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    {/* Textareas - Full width on mobile */}
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="allergies" className="text-sm font-medium text-gray-300">
                        Allergies (if any)
                      </Label>
                      <Textarea
                        id="allergies"
                        placeholder="ex: Peanuts, Penicillin, Pollen"
                        value={formData.allergies}
                        onChange={(e) => handleInputChange("allergies", e.target.value)}
                        className="bg-[#0D0F12] border-gray-600 text-white placeholder-gray-500 min-h-20 text-sm focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="currentMedications" className="text-sm font-medium text-gray-300">
                        Current medications
                      </Label>
                      <Textarea
                        id="currentMedications"
                        placeholder="ex: Ibuprofen 200mg, Levothyroxine 50mcg"
                        value={formData.currentMedications}
                        onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                        className="bg-[#0D0F12] border-gray-600 text-white placeholder-gray-500 min-h-20 text-sm focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="familyMedicalHistory" className="text-sm font-medium text-gray-300">
                        Family medical history (if relevant)
                      </Label>
                      <Textarea
                        id="familyMedicalHistory"
                        placeholder="ex: Mother had breast cancer"
                        value={formData.familyMedicalHistory}
                        onChange={(e) => handleInputChange("familyMedicalHistory", e.target.value)}
                        className="bg-[#0D0F12] border-gray-600 text-white placeholder-gray-500 min-h-20 text-sm focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="pastMedicalHistory" className="text-sm font-medium text-gray-300">
                        Past medical history
                      </Label>
                      <Textarea
                        id="pastMedicalHistory"
                        placeholder="ex: Asthma diagnosis in childhood"
                        value={formData.pastMedicalHistory}
                        onChange={(e) => handleInputChange("pastMedicalHistory", e.target.value)}
                        className="bg-[#0D0F12] border-gray-600 text-white placeholder-gray-500 min-h-20 text-sm focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Identification Step */}
              {currentStep === "identification" && (
                <div className="space-y-6">
                  <h2 className="text-lg sm:text-xl font-bold text-green-400">Identification</h2>

                  <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="identificationType" className="text-sm font-medium text-gray-300">
                        Identification Type *
                      </Label>
                      <select
                        id="identificationType"
                        value={formData.identificationType}
                        onChange={(e) => handleInputChange("identificationType", e.target.value)}
                        className="w-full bg-[#0D0F12] border border-gray-600 text-white rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select type</option>
                        <option value="passport">Passport</option>
                        <option value="drivers_license">Driver&apos;s License</option>
                        <option value="national_id">National ID</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="identificationNumber" className="text-sm font-medium text-gray-300">
                        Identification Number *
                      </Label>
                      <Input
                        id="identificationNumber"
                        placeholder="ex: AB1234567"
                        value={formData.identificationNumber}
                        onChange={(e) => handleInputChange("identificationNumber", e.target.value)}
                        className="bg-[#0D0F12] border-gray-600 text-white placeholder-gray-500 text-sm focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="identificationDocument" className="text-sm font-medium text-gray-300">
                        Upload Identification Document *
                      </Label>
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 sm:p-6 text-center hover:border-green-500 transition-colors">
                        <input
                          type="file"
                          id="identificationDocument"
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <label htmlFor="identificationDocument" className="cursor-pointer">
                          <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">
                            {formData.identificationDocument
                              ? `Selected: ${formData.identificationDocument.name}`
                              : "Click to upload or drag and drop"}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">PDF, JPG, PNG up to 10MB</p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Consent Step */}
              {currentStep === "consent" && (
                <div className="space-y-6">
                  <h2 className="text-lg sm:text-xl font-bold text-green-400">Consent & Privacy</h2>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center h-5">
                        <Checkbox
                          id="consentTreatment"
                          checked={formData.consentTreatment}
                          onCheckedChange={(checked) => handleInputChange("consentTreatment", checked)}
                          className="h-5 w-5 text-green-500 border-2 border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="consentTreatment" className="text-sm font-medium text-gray-300 cursor-pointer">
                          I consent to receive treatment for my health condition. *
                        </Label>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex items-center h-5">
                        <Checkbox
                          id="consentHealthInfo"
                          checked={formData.consentHealthInfo}
                          onCheckedChange={(checked) => handleInputChange("consentHealthInfo", checked)}
                          className="h-5 w-5 text-green-500 border-2 border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="consentHealthInfo" className="text-sm font-medium text-gray-300 cursor-pointer">
                          I consent to the use and disclosure of my health information for treatment purposes. *
                        </Label>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex items-center h-5">
                        <Checkbox
                          id="consentPrivacyPolicy"
                          checked={formData.consentPrivacyPolicy}
                          onCheckedChange={(checked) => handleInputChange("consentPrivacyPolicy", checked)}
                          className="h-5 w-5 text-green-500 border-2 border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="consentPrivacyPolicy" className="text-sm font-medium text-gray-300 cursor-pointer">
                          I acknowledge that I have reviewed and agree to the privacy policy. *
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8 pt-6 border-t border-gray-800">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800 w-full sm:w-auto order-2 sm:order-1"
                  disabled={currentStep === "personal"}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                <div className="flex gap-3 order-1 sm:order-2">
                  {/* Skip button for medical step */}
                  {currentStep === "medical" && (
                    <Button
                      onClick={handleSkipMedical}
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-800"
                    >
                      Skip Medical Info
                    </Button>
                  )}

                  {currentStep === "consent" ? (
                    <Button
                      onClick={handleSubmit}
                      className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto px-6 sm:px-8 text-sm sm:text-base"
                    >
                      Submit and Continue
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto px-6 sm:px-8 text-sm sm:text-base"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Hidden on mobile, visible on desktop */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Card */}
            <div className="bg-[#11161c] rounded-xl p-4 sm:p-6 border border-gray-700">
              <h3 className="font-semibold text-lg mb-4 text-green-400">Registration Progress</h3>
              <div className="space-y-3">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center justify-between">
                    <span className={`text-sm ${currentStep === step.id || getStepNumber(currentStep) > getStepNumber(step.id)
                      ? "text-white"
                      : "text-gray-400"
                      }`}>
                      {step.label}
                      {step.id === "medical" && <span className="text-gray-500 ml-1">(Optional)</span>}
                    </span>
                    {getStepNumber(currentStep) > getStepNumber(step.id) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-600 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-[#11161c] rounded-xl p-4 sm:p-6 border border-gray-700">
              <h3 className="font-semibold text-lg mb-4 text-green-400">Need Help?</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Fields marked with * are required</p>
                <p>• Medical information is optional</p>
                <p>• Have your identification documents ready</p>
                <p>• Contact support if you need assistance</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}