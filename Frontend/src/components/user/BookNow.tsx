import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Phone, 
  User, 
  Building, 
  Mail, 
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
  ChevronDown,
  ChevronUp,
  Info,
  Pencil,
  Trash2,
  Shield,
  ShieldCheck,
  Package,
  Scale,
  Ruler,
  FileText,
  Image,
  Upload,
  XCircle,
  Plane,
  Train,
  Truck,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const API_BASE: string = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';
const VOLUMETRIC_DIVISOR = 5000; // Standard volumetric conversion factor (cm³ to kg)

// Helper functions for input sanitization
const sanitizeInteger = (value: string) => value.replace(/\D/g, '');

const sanitizeDecimal = (value: string) => {
  const numeric = value.replace(/[^0-9.]/g, '');
  const firstDotIndex = numeric.indexOf('.');
  if (firstDotIndex === -1) {
    return numeric;
  }
  const beforeDot = numeric.slice(0, firstDotIndex);
  const afterDot = numeric.slice(firstDotIndex + 1).replace(/\./g, '');
  return `${beforeDot}.${afterDot}`;
};

// Simple Input Component with Label Above
interface SimpleInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  helperText?: string;
  isDarkMode?: boolean;
}

const SimpleInput: React.FC<SimpleInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  className = '',
  placeholder = '',
  helperText,
  isDarkMode = false
}) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className={cn(
        "text-sm font-normal block",
        isDarkMode ? "text-slate-200" : "text-slate-700"
      )}>
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type === 'date' && !value ? 'text' : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          "w-full h-11 px-3 border rounded-md text-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          isDarkMode
            ? disabled
              ? "bg-slate-800/40 border-slate-700 text-slate-500 cursor-not-allowed"
              : "bg-slate-800/60 border-slate-700 text-slate-100 focus:border-slate-600 focus:ring-slate-600/30"
            : disabled
              ? "bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-white border-slate-300 text-slate-900 focus:border-slate-500 focus:ring-slate-500/20"
        )}
      />
      {helperText && (
        <p className={cn(
          "text-xs",
          isDarkMode ? "text-slate-400" : "text-slate-500"
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
};

// Simple Select Component with Label Above
interface SimpleSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  isDarkMode?: boolean;
}

const SimpleSelect: React.FC<SimpleSelectProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  className = '',
  isDarkMode = false
}) => {
  return (
    <div className={cn("space-y-1.5 relative", className)}>
      <label className={cn(
        "text-sm font-normal block",
        isDarkMode ? "text-slate-200" : "text-slate-700"
      )}>
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "w-full h-11 px-3 pr-10 border rounded-md text-sm appearance-none transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          isDarkMode
            ? disabled
              ? "bg-slate-800/40 border-slate-700 text-slate-500 cursor-not-allowed"
              : "bg-slate-800/60 border-slate-700 text-slate-100 focus:border-slate-600 focus:ring-slate-600/30"
            : disabled
              ? "bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-white border-slate-300 text-slate-900 focus:border-slate-500 focus:ring-slate-500/20"
        )}
      >
        <option value="" disabled hidden></option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-[38px] pointer-events-none">
        <ChevronDown className={cn(
          "h-4 w-4",
          isDarkMode ? "text-slate-400" : "text-slate-500"
        )} />
      </div>
    </div>
  );
};

// Floating Label Input Component
interface FloatingInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  maxLength?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  serviceabilityStatus?: 'available' | 'unavailable' | null;
  showInlineStatus?: boolean;
  addressInfo?: string;
  errorMessage?: string;
  placeholder?: string;
  hasValidationError?: boolean;
  validationErrorMessage?: string;
  isDarkMode?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  maxLength,
  icon,
  disabled = false,
  className = '',
  serviceabilityStatus = null,
  showInlineStatus = false,
  addressInfo = '',
  errorMessage = '',
  placeholder = '',
  hasValidationError = false,
  validationErrorMessage = '',
  isDarkMode = false,
  onBlur
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const shouldFloat = isFocused || hasValue;

  const getStatusDisplay = () => {
    if (!showInlineStatus || !serviceabilityStatus) return null;
    
    if (serviceabilityStatus === 'available') {
      return {
        text: 'Available',
        bgColor: isDarkMode ? 'bg-green-500/20' : 'bg-green-100',
        textColor: isDarkMode ? 'text-green-300' : 'text-green-700',
        icon: <CheckCircle className="w-3 h-3" />
      };
    } else {
      return {
        text: 'Not Available', 
        bgColor: isDarkMode ? 'bg-red-500/20' : 'bg-red-100',
        textColor: isDarkMode ? 'text-red-300' : 'text-red-700',
        icon: <X className="w-3 h-3" />
      };
    }
  };

  const statusDisplay = getStatusDisplay();
  const hasInlineStatus = showInlineStatus && serviceabilityStatus;

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        {icon && (
          <div className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 z-10",
            isDarkMode ? "text-slate-400" : "text-gray-400"
          )}>
            {icon}
          </div>
        )}
        <input
          type={type === 'date' && !isFocused && !hasValue ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          maxLength={maxLength}
          disabled={disabled}
          className={cn(
            "w-full h-10 px-3 border rounded-xl transition-all duration-200 ease-in-out text-sm",
            icon ? "pl-10" : "pl-3",
            hasInlineStatus || hasValidationError ? "pr-10" : "pr-3",
            isDarkMode 
              ? "bg-slate-800/60 border-slate-700 text-slate-100" 
              : "bg-white/90 border-gray-300/60 text-slate-900",
            hasValidationError
              ? "border-red-500 ring-2 ring-red-200"
              : isFocused 
                ? isDarkMode
                  ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg"
                  : "border-blue-500 ring-2 ring-blue-200 shadow-md"
                : isDarkMode
                  ? "hover:border-blue-400/50"
                  : "hover:border-blue-400/50 hover:shadow-sm",
            disabled && (isDarkMode ? "bg-slate-900/40 cursor-not-allowed" : "bg-gray-50 cursor-not-allowed"),
            "focus:outline-none"
          )}
          placeholder={placeholder || ""}
        />
        
        {hasValidationError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
        )}
        
        {hasInlineStatus && statusDisplay && !hasValidationError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            <div className={cn(
              "flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium",
              statusDisplay.bgColor,
              statusDisplay.textColor
            )}>
              {statusDisplay.icon}
              <span>{statusDisplay.text}</span>
            </div>
          </div>
        )}
        
        <label
          className={cn(
            "absolute transition-all duration-200 ease-in-out pointer-events-none select-none",
            icon ? "left-12" : "left-4",
            shouldFloat
              ? "top-0 -translate-y-1/2 text-xs px-2"
              : "top-1/2 -translate-y-1/2 text-base",
            shouldFloat
              ? isDarkMode 
                ? "bg-slate-900 text-blue-400" 
                : "bg-white text-blue-600"
              : isDarkMode 
                ? "text-slate-400" 
                : "text-gray-500",
            isFocused && !hasValue && (isDarkMode ? "text-blue-400" : "text-blue-600")
          )}
        >
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      
      {showInlineStatus && serviceabilityStatus && (
        <div className="mt-1">
          {serviceabilityStatus === 'available' && addressInfo && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-1 justify-end pr-3"
            >
              <div className={cn(
                "text-xs",
                isDarkMode ? "text-slate-300" : "text-slate-700"
              )}>
                {addressInfo}
              </div>
            </motion.div>
          )}
          
          {serviceabilityStatus === 'unavailable' && errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-1 justify-end pr-3"
            >
              <div className={cn(
                "text-xs px-2 py-1 rounded border",
                isDarkMode 
                  ? "text-red-300 bg-red-500/20 border-red-500/40" 
                  : "text-red-600 bg-red-50 border-red-200"
              )}>
                {errorMessage}
              </div>
            </motion.div>
          )}
        </div>
      )}
      
      {hasValidationError && validationErrorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1"
        >
          <div className="text-xs text-red-600">
            {validationErrorMessage}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Floating Select Component
interface FloatingSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  isDarkMode?: boolean;
}

const FloatingSelect: React.FC<FloatingSelectProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
  icon,
  disabled = false,
  className = '',
  isDarkMode = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const shouldFloat = isFocused || hasValue;

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        {icon && (
          <div className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 z-10",
            isDarkMode ? "text-slate-400" : "text-gray-400"
          )}>
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={cn(
            "w-full h-10 px-3 border rounded-xl transition-all duration-200 ease-in-out text-sm appearance-none",
            icon ? "pl-10" : "pl-3",
            "pr-8",
            isDarkMode 
              ? "bg-slate-800/60 border-slate-700 text-slate-100" 
              : "bg-white/90 border-gray-300/60 text-slate-900",
            isFocused 
              ? isDarkMode
                ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg"
                : "border-blue-500 ring-2 ring-blue-200 shadow-md"
              : isDarkMode
                ? "hover:border-blue-400/50"
                : "hover:border-blue-400/50 hover:shadow-sm",
            disabled && (isDarkMode ? "bg-slate-900/40 cursor-not-allowed" : "bg-gray-50 cursor-not-allowed"),
            "focus:outline-none"
          )}
        >
          <option value="" disabled hidden></option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className={cn("w-5 h-5", isDarkMode ? "text-slate-400" : "text-gray-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <label
          className={cn(
            "absolute transition-all duration-200 ease-in-out pointer-events-none select-none",
            icon ? "left-12" : "left-4",
            shouldFloat
              ? "top-0 -translate-y-1/2 text-xs px-2"
              : "top-1/2 -translate-y-1/2 text-base",
            shouldFloat
              ? isDarkMode 
                ? "bg-slate-900 text-blue-400" 
                : "bg-white text-blue-600"
              : isDarkMode 
                ? "text-slate-400" 
                : "text-gray-500",
            isFocused && !hasValue && (isDarkMode ? "text-blue-400" : "text-blue-600")
          )}
        >
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
    </div>
  );
};

// Stepper Component
interface StepperProps {
  currentStep: number;
  steps: string[];
  completedSteps: boolean[];
  isDarkMode?: boolean;
}

const Stepper: React.FC<StepperProps> = ({ currentStep, steps, completedSteps, isDarkMode = false }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300",
                    completedSteps[index] 
                      ? "bg-green-500 text-white" 
                      : currentStep === index 
                        ? isDarkMode
                          ? "bg-blue-500 text-white ring-2 ring-blue-400/20"
                          : "bg-blue-600 text-white ring-2 ring-blue-200"
                        : isDarkMode
                          ? "bg-slate-700 text-slate-300"
                          : "bg-gray-300 text-gray-600"
                  )}
                >
                  {completedSteps[index] ? <Check className="w-3 h-3" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "mt-1 text-xs font-medium text-center max-w-16",
                    currentStep === index 
                      ? isDarkMode 
                        ? "text-blue-400 font-semibold" 
                        : "text-blue-600 font-semibold"
                      : isDarkMode 
                        ? "text-slate-400" 
                        : "text-gray-600"
                  )}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-8 h-0.5 rounded-full transition-all duration-300",
                    completedSteps[index] 
                      ? "bg-green-500" 
                      : isDarkMode 
                        ? "bg-slate-700" 
                        : "bg-gray-300"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

interface BookNowProps {
  isDarkMode?: boolean;
}

interface ReviewSectionProps {
  title: string;
  icon?: React.ReactNode;
  isDarkMode: boolean;
  children: React.ReactNode;
}

interface ReviewFieldProps {
  label: string;
  value: React.ReactNode;
  isDarkMode: boolean;
  icon?: React.ReactNode;
  emphasize?: boolean;
}

interface ShipmentDetails {
  natureOfConsignment: string;
  insurance: string;
  riskCoverage: string;
  packagesCount: string;
  materials: string;
  description: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  insuranceCompanyName: string;
  insurancePolicyNumber: string;
  insurancePolicyDate: string;
  insurancePremiumAmount: string;
  insuranceDocumentName: string;
  insuranceDocument: File | null;
}

interface InsuranceFormState {
  companyName: string;
  policyNumber: string;
  policyDate: string;
  premiumAmount: string;
  document: File | null;
  documentName: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ title, icon, isDarkMode, children }) => {
  return (
    <div
      className={cn(
        'rounded-2xl border p-5 transition-all duration-300',
        isDarkMode
          ? 'border-slate-800/70 bg-slate-900/70 shadow-[0_18px_40px_rgba(15,23,42,0.35)]'
          : 'border-slate-200/70 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]'
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        {icon && (
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-xl',
              isDarkMode ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-100 text-blue-600'
            )}
          >
            {icon}
          </div>
        )}
        <h4
          className={cn(
            'text-sm font-semibold uppercase tracking-wide',
            isDarkMode ? 'text-slate-200' : 'text-slate-800'
          )}
        >
          {title}
        </h4>
      </div>
      <div className="grid gap-4">{children}</div>
    </div>
  );
};

const ReviewField: React.FC<ReviewFieldProps> = ({ label, value, icon, isDarkMode, emphasize = false }) => {
  return (
    <div className="flex items-start gap-3">
      {icon && (
        <div
          className={cn(
            'mt-1 flex h-8 w-8 items-center justify-center rounded-lg',
            isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
          )}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <span
          className={cn(
            'text-xs font-medium tracking-wide uppercase',
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          )}
        >
          {label}
        </span>
        <div
          className={cn(
            'mt-1 text-sm leading-relaxed break-words',
            emphasize
              ? isDarkMode
                ? 'text-green-300 font-semibold'
                : 'text-green-600 font-semibold'
              : isDarkMode
                ? 'text-slate-200'
                : 'text-slate-800'
          )}
        >
          {value}
        </div>
      </div>
    </div>
  );
};

const BookNow: React.FC<BookNowProps> = ({ isDarkMode = false }) => {
  // Step management
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false, false, false]);
  const steps = ['Serviceability', 'Address Details', 'Shipment Details', 'Package & Images', 'Shipping Mode & Pricing', 'Preview'];

  // Serviceability states
  const [originPincode, setOriginPincode] = useState('');
  const [destinationPincode, setDestinationPincode] = useState('');
  const [originServiceable, setOriginServiceable] = useState<boolean | null>(null);
  const [destinationServiceable, setDestinationServiceable] = useState<boolean | null>(null);
  const [checkingOrigin, setCheckingOrigin] = useState(false);
  const [checkingDestination, setCheckingDestination] = useState(false);
  const [originAddressInfo, setOriginAddressInfo] = useState('');
  const [destinationAddressInfo, setDestinationAddressInfo] = useState('');
  const [originAreas, setOriginAreas] = useState<string[]>([]);
  const [destinationAreas, setDestinationAreas] = useState<string[]>([]);

  // Origin form states
  const [originMobileDigits, setOriginMobileDigits] = useState<string[]>(Array(10).fill(''));
  const [originData, setOriginData] = useState({
    mobileNumber: '',
    name: '',
    companyName: '',
    email: '',
    locality: '',
    flatBuilding: '',
    landmark: '',
    pincode: '',
    area: '',
    city: '',
    district: '',
    state: '',
    gstNumber: '',
    alternateNumbers: [''],
    addressType: 'Home',
    birthday: '',
    anniversary: '',
    website: '',
    otherAlternateNumber: '',
  });

  // Destination form states
  const [destinationMobileDigits, setDestinationMobileDigits] = useState<string[]>(Array(10).fill(''));
  const [destinationData, setDestinationData] = useState({
    mobileNumber: '',
    name: '',
    companyName: '',
    email: '',
    locality: '',
    flatBuilding: '',
    landmark: '',
    pincode: '',
    area: '',
    city: '',
    district: '',
    state: '',
    gstNumber: '',
    alternateNumbers: [''],
    addressType: 'Home',
    birthday: '',
    anniversary: '',
    website: '',
    otherAlternateNumber: '',
  });

  // Modal states
  const [phoneModalOpen, setPhoneModalOpen] = useState<{ type: 'origin' | 'destination' | null }>({ type: null });
  const [formModalOpen, setFormModalOpen] = useState<{ type: 'origin' | 'destination' | null }>({ type: null });
  const [showPreviewInModal, setShowPreviewInModal] = useState(false);
  const [shipmentDetails, setShipmentDetails] = useState<ShipmentDetails>({
    natureOfConsignment: '',
    insurance: '',
    riskCoverage: 'Owner',
    packagesCount: '',
    materials: '',
    description: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    insuranceCompanyName: '',
    insurancePolicyNumber: '',
    insurancePolicyDate: '',
    insurancePremiumAmount: '',
    insuranceDocumentName: '',
    insuranceDocument: null
  });
  const [insuranceModalOpen, setInsuranceModalOpen] = useState(false);
  const [insuranceForm, setInsuranceForm] = useState<InsuranceFormState>({
    companyName: '',
    policyNumber: '',
    policyDate: '',
    premiumAmount: '',
    document: null,
    documentName: ''
  });
  const [insuranceFormError, setInsuranceFormError] = useState<string>('');

  const openInsuranceModal = () => {
    setInsuranceForm({
      companyName: shipmentDetails.insuranceCompanyName,
      policyNumber: shipmentDetails.insurancePolicyNumber,
      policyDate: shipmentDetails.insurancePolicyDate,
      premiumAmount: shipmentDetails.insurancePremiumAmount,
      document: shipmentDetails.insuranceDocument,
      documentName: shipmentDetails.insuranceDocumentName
    });
    setInsuranceFormError('');
    setInsuranceModalOpen(true);
  };

  const handleInsuranceSelection = (value: string) => {
    if (value === 'With insurance') {
      setShipmentDetails((prev) => ({
        ...prev,
        insurance: value,
        riskCoverage: 'Owner',
        packagesCount: '',
        materials: '',
        description: '',
        weight: '',
        length: '',
        width: '',
        height: ''
      }));
      openInsuranceModal();
      return;
    }

    setInsuranceModalOpen(false);
    setInsuranceFormError('');
    setInsuranceForm({
      companyName: '',
      policyNumber: '',
      policyDate: '',
      premiumAmount: '',
      document: null,
      documentName: ''
    });
    setShipmentDetails((prev) => ({
      ...prev,
      insurance: value,
      riskCoverage: 'Owner',
      packagesCount: '',
      materials: '',
      description: '',
      weight: '',
      length: '',
      width: '',
      height: '',
      insuranceCompanyName: '',
      insurancePolicyNumber: '',
      insurancePolicyDate: '',
      insurancePremiumAmount: '',
      insuranceDocumentName: '',
      insuranceDocument: null
    }));
  };

  const handleInsuranceFormSave = () => {
    if (
      !insuranceForm.companyName.trim() ||
      !insuranceForm.policyNumber.trim() ||
      !insuranceForm.policyDate.trim() ||
      !insuranceForm.document
    ) {
      setInsuranceFormError('Please complete all required fields before saving.');
      return;
    }

    setShipmentDetails((prev) => ({
      ...prev,
      insurance: 'With insurance',
      insuranceCompanyName: insuranceForm.companyName.trim(),
      insurancePolicyNumber: insuranceForm.policyNumber.trim(),
      insurancePolicyDate: insuranceForm.policyDate,
      insurancePremiumAmount: insuranceForm.premiumAmount.trim(),
      insuranceDocument: insuranceForm.document,
      insuranceDocumentName: insuranceForm.documentName
    }));
    setInsuranceModalOpen(false);
    setInsuranceFormError('');
  };

  const handleInsuranceFormCancel = () => {
    const hasSavedInsurance =
      Boolean(shipmentDetails.insuranceCompanyName) ||
      Boolean(shipmentDetails.insurancePolicyNumber) ||
      Boolean(shipmentDetails.insurancePolicyDate) ||
      Boolean(shipmentDetails.insuranceDocument);

    if (!hasSavedInsurance) {
      setInsuranceForm({
        companyName: '',
        policyNumber: '',
        policyDate: '',
        premiumAmount: '',
        document: null,
        documentName: ''
      });
      setShipmentDetails((prev) => ({
        ...prev,
        insurance: 'Without insurance',
        riskCoverage: 'Owner',
        packagesCount: '',
        materials: '',
        description: '',
        weight: '',
        length: '',
        width: '',
        height: '',
        insuranceCompanyName: '',
        insurancePolicyNumber: '',
        insurancePolicyDate: '',
        insurancePremiumAmount: '',
        insuranceDocumentName: '',
        insuranceDocument: null
      }));
    }

    setInsuranceModalOpen(false);
    setInsuranceFormError('');
  };
  
  const lengthValue = useMemo(() => parseFloat(shipmentDetails.length) || 0, [shipmentDetails.length]);
  const widthValue = useMemo(() => parseFloat(shipmentDetails.width) || 0, [shipmentDetails.width]);
  const heightValue = useMemo(() => parseFloat(shipmentDetails.height) || 0, [shipmentDetails.height]);
  const actualWeight = useMemo(() => parseFloat(shipmentDetails.weight) || 0, [shipmentDetails.weight]);
  const volumetricWeight = useMemo(() => {
    if (!lengthValue || !widthValue || !heightValue) {
      return 0;
    }
    const volume = lengthValue * widthValue * heightValue;
    if (!Number.isFinite(volume) || volume <= 0) {
      return 0;
    }
    const calculated = volume / VOLUMETRIC_DIVISOR;
    if (!Number.isFinite(calculated) || calculated <= 0) {
      return 0;
    }
    return parseFloat(calculated.toFixed(2));
  }, [heightValue, lengthValue, widthValue]);
  const chargeableWeight = useMemo(() => {
    const weight = Math.max(actualWeight, volumetricWeight);
    if (!Number.isFinite(weight) || weight <= 0) {
      return 0;
    }
    return parseFloat(weight.toFixed(2));
  }, [actualWeight, volumetricWeight]);
  const formattedVolumetricWeight = volumetricWeight > 0 ? volumetricWeight.toFixed(2) : null;
  const formattedActualWeight = actualWeight > 0 ? actualWeight.toFixed(2) : null;
  const formattedChargeableWeight = chargeableWeight > 0 ? chargeableWeight.toFixed(2) : null;
  const displayVolumetricWeight = formattedVolumetricWeight ? `${formattedVolumetricWeight} Kg.` : '0 Kg.';
  const displayActualWeight = formattedActualWeight ? `${formattedActualWeight} Kg.` : '0 Kg.';
  const displayChargeableWeight = formattedChargeableWeight ? `${formattedChargeableWeight} Kg.` : '0 Kg.';

  // Image upload states
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // Track current section being worked on (origin or destination)
  const [currentSection, setCurrentSection] = useState<'origin' | 'destination'>('origin');

  // Shipping mode & pricing states
  const [selectedMode, setSelectedMode] = useState<'byAir' | 'byTrain' | 'byRoad' | ''>('');
  const [selectedServiceType, setSelectedServiceType] = useState<'standard' | 'priority' | ''>('');
  const [availableModes, setAvailableModes] = useState<{ byAir: boolean; byTrain: boolean; byRoad: boolean } | null>(null);
  const [availableServiceTypes, setAvailableServiceTypes] = useState<{ standard: boolean; priority: boolean } | null>(null);
  const [customerPricing, setCustomerPricing] = useState<any>(null);
  const [standardPrice, setStandardPrice] = useState<number | null>(null);
  const [priorityPrice, setPriorityPrice] = useState<number | null>(null);
  const [loadingPricing, setLoadingPricing] = useState(false);

  // Inline editing states for Preview step
  const [editingSection, setEditingSection] = useState<'origin' | 'destination' | 'shipment' | 'package' | 'shipping' | null>(null);

  useEffect(() => {
    if (originAreas.length > 0 && !originData.area) {
      setOriginData((prev) => ({ ...prev, area: originAreas[0] }));
    }
  }, [originAreas, originData.area]);

  useEffect(() => {
    if (destinationAreas.length > 0 && !destinationData.area) {
      setDestinationData((prev) => ({ ...prev, area: destinationAreas[0] }));
    }
  }, [destinationAreas, destinationData.area]);

  // Helper to parse backend pincode response
  const parsePincodeResponse = (data: any) => {
    try {
      if (!data || typeof data !== 'object') {
        return { state: '', city: '', district: '', areas: [] };
      }
      
      const state: string = data?.state || '';
      const citiesObj = data?.cities || {};
      const firstCityKey = citiesObj && Object.keys(citiesObj).length > 0 ? Object.keys(citiesObj)[0] : '';
      const city: string = firstCityKey || '';
      const districtsObj = firstCityKey ? citiesObj[firstCityKey]?.districts || {} : {};
      const firstDistrictKey = districtsObj && Object.keys(districtsObj).length > 0 ? Object.keys(districtsObj)[0] : '';
      const district: string = firstDistrictKey || '';
      const areasArr = firstDistrictKey ? districtsObj[firstDistrictKey]?.areas || [] : [];
      const areas: string[] = Array.isArray(areasArr) ? areasArr.map((a: any) => a?.name || '').filter(Boolean) : [];
      
      return { state, city, district, areas };
    } catch (error) {
      console.error('Error parsing pincode response:', error);
      return { state: '', city: '', district: '', areas: [] };
    }
  };

  // Check pincode serviceability
  const checkPincodeServiceability = async (pincode: string, type: 'origin' | 'destination') => {
    if (pincode.length !== 6) {
      if (type === 'origin') {
        setOriginServiceable(null);
        setOriginAddressInfo('');
      } else {
        setDestinationServiceable(null);
        setDestinationAddressInfo('');
      }
      return;
    }

    if (type === 'origin') {
      setCheckingOrigin(true);
    } else {
      setCheckingDestination(true);
    }

    try {
      const { data } = await axios.get(`${API_BASE}/api/pincode/${pincode}`);
      const isServiceable = !!data;
      const parsed = isServiceable ? parsePincodeResponse(data) : { state: '', city: '', district: '', areas: [] };

      if (type === 'origin') {
        setOriginServiceable(isServiceable);
        if (isServiceable) {
          setOriginData(prev => ({
            ...prev,
            pincode: pincode,
            city: parsed.city,
            district: parsed.district,
            state: parsed.state
          }));
          setOriginAreas(parsed.areas);
          setOriginAddressInfo(`${parsed.city}, ${parsed.state}`);
        } else {
          setOriginAreas([]);
          setOriginAddressInfo('');
        }
      } else {
        setDestinationServiceable(isServiceable);
        if (isServiceable) {
          setDestinationData(prev => ({
            ...prev,
            pincode: pincode,
            city: parsed.city,
            district: parsed.district,
            state: parsed.state
          }));
          setDestinationAreas(parsed.areas);
          setDestinationAddressInfo(`${parsed.city}, ${parsed.state}`);
        } else {
          setDestinationAreas([]);
          setDestinationAddressInfo('');
        }
      }
    } catch (e) {
      if (type === 'origin') {
        setOriginServiceable(false);
        setOriginAddressInfo('');
      } else {
        setDestinationServiceable(false);
        setDestinationAddressInfo('');
      }
    } finally {
      if (type === 'origin') {
        setCheckingOrigin(false);
      } else {
        setCheckingDestination(false);
      }
    }
  };

  // Handle origin pincode change
  const handleOriginPincodeChange = (value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 6) return;
    setOriginPincode(value);
    if (value.length === 6) {
      checkPincodeServiceability(value, 'origin');
    } else {
      setOriginServiceable(null);
      setOriginAddressInfo('');
      setOriginAreas([]);
    }
  };

  // Handle destination pincode change
  const handleDestinationPincodeChange = (value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 6) return;
    setDestinationPincode(value);
    if (value.length === 6) {
      checkPincodeServiceability(value, 'destination');
    } else {
      setDestinationServiceable(null);
      setDestinationAddressInfo('');
      setDestinationAreas([]);
    }
  };

  const getDigitInputId = (type: 'origin' | 'destination', index: number) => `${type}-modal-digit-${index}`;

  // Handle origin mobile digit change
  const handleOriginDigitChange = (index: number, value: string) => {
    // Handle paste - if value is longer than 1, it might be a paste
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      const newDigits = Array(10).fill('');
      digits.split('').forEach((digit, i) => {
        if (i < 10) newDigits[i] = digit;
      });
      setOriginMobileDigits(newDigits);
      
      const mobileNumber = newDigits.filter(digit => digit !== '').join('');
      setOriginData(prev => ({ ...prev, mobileNumber }));
      
      // Focus the next empty input or the last one
      const nextEmptyIndex = newDigits.findIndex((d, i) => i >= index && d === '');
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(index + digits.length, 9);
      setTimeout(() => {
        const nextInput = document.getElementById(getDigitInputId('origin', focusIndex));
        nextInput?.focus();
      }, 0);
      return;
    }
    
    if (!/^[0-9]*$/.test(value)) return;
    
    const newDigits = [...originMobileDigits];
    newDigits[index] = value;
    setOriginMobileDigits(newDigits);
    
    if (value && index < 9) {
      setTimeout(() => {
        const nextInput = document.getElementById(getDigitInputId('origin', index + 1));
        nextInput?.focus();
      }, 0);
    }
    
    const mobileNumber = newDigits.filter(digit => digit !== '').join('');
    setOriginData(prev => ({ ...prev, mobileNumber }));
  };

  const handleOriginDigitKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!originMobileDigits[index] && index > 0) {
        e.preventDefault();
        const prevInput = document.getElementById(getDigitInputId('origin', index - 1));
        prevInput?.focus();
        // Clear previous digit
        const newDigits = [...originMobileDigits];
        newDigits[index - 1] = '';
        setOriginMobileDigits(newDigits);
        const mobileNumber = newDigits.filter(digit => digit !== '').join('');
        setOriginData(prev => ({ ...prev, mobileNumber }));
      } else if (originMobileDigits[index]) {
        // Clear current digit
        const newDigits = [...originMobileDigits];
        newDigits[index] = '';
        setOriginMobileDigits(newDigits);
        const mobileNumber = newDigits.filter(digit => digit !== '').join('');
        setOriginData(prev => ({ ...prev, mobileNumber }));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prevInput = document.getElementById(getDigitInputId('origin', index - 1));
      prevInput?.focus();
    } else if (e.key === 'ArrowRight' && index < 9) {
      e.preventDefault();
      const nextInput = document.getElementById(getDigitInputId('origin', index + 1));
      nextInput?.focus();
    }
  };

  const handleOriginDigitPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 10);
    const newDigits = Array(10).fill('');
    digits.split('').forEach((digit, i) => {
      if (i < 10) newDigits[i] = digit;
    });
    setOriginMobileDigits(newDigits);
    const mobileNumber = newDigits.filter(digit => digit !== '').join('');
    setOriginData(prev => ({ ...prev, mobileNumber }));
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newDigits.findIndex(d => d === '');
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 9;
    setTimeout(() => {
      const nextInput = document.getElementById(getDigitInputId('origin', focusIndex));
      nextInput?.focus();
    }, 0);
  };

  // Handle destination mobile digit change
  const handleDestinationDigitChange = (index: number, value: string) => {
    // Handle paste - if value is longer than 1, it might be a paste
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      const newDigits = Array(10).fill('');
      digits.split('').forEach((digit, i) => {
        if (i < 10) newDigits[i] = digit;
      });
      setDestinationMobileDigits(newDigits);
      
      const mobileNumber = newDigits.filter(digit => digit !== '').join('');
      setDestinationData(prev => ({ ...prev, mobileNumber }));
      
      // Focus the next empty input or the last one
      const nextEmptyIndex = newDigits.findIndex((d, i) => i >= index && d === '');
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(index + digits.length, 9);
      setTimeout(() => {
        const nextInput = document.getElementById(getDigitInputId('destination', focusIndex));
        nextInput?.focus();
      }, 0);
      return;
    }
    
    if (!/^[0-9]*$/.test(value)) return;
    
    const newDigits = [...destinationMobileDigits];
    newDigits[index] = value;
    setDestinationMobileDigits(newDigits);
    
    if (value && index < 9) {
      setTimeout(() => {
        const nextInput = document.getElementById(getDigitInputId('destination', index + 1));
        nextInput?.focus();
      }, 0);
    }
    
    const mobileNumber = newDigits.filter(digit => digit !== '').join('');
    setDestinationData(prev => ({ ...prev, mobileNumber }));
  };

  const handleDestinationDigitKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!destinationMobileDigits[index] && index > 0) {
        e.preventDefault();
        const prevInput = document.getElementById(getDigitInputId('destination', index - 1));
        prevInput?.focus();
        // Clear previous digit
        const newDigits = [...destinationMobileDigits];
        newDigits[index - 1] = '';
        setDestinationMobileDigits(newDigits);
        const mobileNumber = newDigits.filter(digit => digit !== '').join('');
        setDestinationData(prev => ({ ...prev, mobileNumber }));
      } else if (destinationMobileDigits[index]) {
        // Clear current digit
        const newDigits = [...destinationMobileDigits];
        newDigits[index] = '';
        setDestinationMobileDigits(newDigits);
        const mobileNumber = newDigits.filter(digit => digit !== '').join('');
        setDestinationData(prev => ({ ...prev, mobileNumber }));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prevInput = document.getElementById(getDigitInputId('destination', index - 1));
      prevInput?.focus();
    } else if (e.key === 'ArrowRight' && index < 9) {
      e.preventDefault();
      const nextInput = document.getElementById(getDigitInputId('destination', index + 1));
      nextInput?.focus();
    }
  };

  const handleDestinationDigitPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 10);
    const newDigits = Array(10).fill('');
    digits.split('').forEach((digit, i) => {
      if (i < 10) newDigits[i] = digit;
    });
    setDestinationMobileDigits(newDigits);
    const mobileNumber = newDigits.filter(digit => digit !== '').join('');
    setDestinationData(prev => ({ ...prev, mobileNumber }));
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newDigits.findIndex(d => d === '');
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 9;
    setTimeout(() => {
      const nextInput = document.getElementById(getDigitInputId('destination', focusIndex));
      nextInput?.focus();
    }, 0);
  };

  const handleAlternateNumberChange = (
    type: 'origin' | 'destination',
    index: number,
    value: string
  ) => {
    if (type === 'origin') {
      setOriginData((prev) => {
        const updated = [...(prev.alternateNumbers || [])];
        updated[index] = value;
        return { ...prev, alternateNumbers: updated };
      });
    } else {
      setDestinationData((prev) => {
        const updated = [...(prev.alternateNumbers || [])];
        updated[index] = value;
        return { ...prev, alternateNumbers: updated };
      });
    }
  };

  const addAlternateNumber = (type: 'origin' | 'destination') => {
    if (type === 'origin') {
      setOriginData((prev) => ({
        ...prev,
        alternateNumbers: [...(prev.alternateNumbers || []), ''],
      }));
    } else {
      setDestinationData((prev) => ({
        ...prev,
        alternateNumbers: [...(prev.alternateNumbers || []), ''],
      }));
    }
  };

  const removeAlternateNumber = (type: 'origin' | 'destination', index: number) => {
    if (type === 'origin') {
      setOriginData((prev) => {
        const updated = [...(prev.alternateNumbers || [])];
        updated.splice(index, 1);
        return { ...prev, alternateNumbers: updated.length ? updated : [''] };
      });
    } else {
      setDestinationData((prev) => {
        const updated = [...(prev.alternateNumbers || [])];
        updated.splice(index, 1);
        return { ...prev, alternateNumbers: updated.length ? updated : [''] };
      });
    }
  };

  const isOriginPhoneComplete = originData.mobileNumber.length === 10;
  const isDestinationPhoneComplete = destinationData.mobileNumber.length === 10;

  const isOriginFormComplete = isOriginPhoneComplete && [
    originData.name,
    originData.flatBuilding,
    originData.locality,
    originData.area,
    originData.city,
    originData.state,
  ].every((field) => field && String(field).trim().length > 0);

  const isDestinationFormComplete = isDestinationPhoneComplete && [
    destinationData.name,
    destinationData.flatBuilding,
    destinationData.locality,
    destinationData.area,
    destinationData.city,
    destinationData.state,
  ].every((field) => field && String(field).trim().length > 0);

  const canProceedAddresses = isOriginFormComplete && isDestinationFormComplete;

  const hasPackageBasics =
    shipmentDetails.packagesCount && String(shipmentDetails.packagesCount).trim().length > 0 &&
    shipmentDetails.materials && String(shipmentDetails.materials).trim().length > 0;
  const hasDimensions =
    shipmentDetails.length && String(shipmentDetails.length).trim().length > 0 &&
    shipmentDetails.width && String(shipmentDetails.width).trim().length > 0 &&
    shipmentDetails.height && String(shipmentDetails.height).trim().length > 0;
  const hasActualWeight = shipmentDetails.weight && String(shipmentDetails.weight).trim().length > 0;

  const isPackageInfoComplete = Boolean(hasPackageBasics && (hasDimensions || hasActualWeight));

  const canSaveInsuranceForm = Boolean(
    insuranceForm.companyName.trim() &&
    insuranceForm.policyNumber.trim() &&
    insuranceForm.policyDate.trim() &&
    insuranceForm.document
  );

  const requiresInsuranceDetails = shipmentDetails.insurance === 'With insurance';
  const hasInsuranceDetails = !requiresInsuranceDetails || (
    shipmentDetails.insuranceCompanyName.trim().length > 0 &&
    shipmentDetails.insurancePolicyNumber.trim().length > 0 &&
    shipmentDetails.insurancePolicyDate.trim().length > 0 &&
    shipmentDetails.insuranceDocument !== null
  );

  const isShipmentStepComplete = Boolean(
    shipmentDetails.natureOfConsignment &&
    shipmentDetails.insurance &&
    shipmentDetails.riskCoverage &&
    hasInsuranceDetails
  );

  const isPackageStepComplete = isPackageInfoComplete;

  const addressTypeOptions = ['Home', 'Office', 'Other'];
  const natureOptions = [
    {
      value: 'DOX',
      title: 'Documents (DOX)',
      description: 'Important papers, legal documents and lightweight document shipments.',
      icon: FileText
    },
    {
      value: 'NON-DOX',
      title: 'Non-Documents (NON-DOX)',
      description: 'Merchandise, parcels, samples and any non-document consignments.',
      icon: Package
    }
  ];

  const insuranceOptions = [
    {
      value: 'Without insurance',
      title: 'Without insurance',
      description: 'We can arrange coverage through our carrier partners.',
      icon: Shield
    },
    {
      value: 'With insurance',
      title: 'With insurance',
      description: 'Shipment is already covered by the consignor.',
      icon: ShieldCheck
    }
  ];

  const riskCoverageOptions = [
    {
      value: 'Owner',
      title: 'Owner Risk',
      description: 'Consignor assumes any transit risk for the shipment.',
      icon: Shield
    },
    {
      value: 'Carrier',
      title: 'Carrier Risk',
      description: 'Carrier takes responsibility for transit risk as per policy.',
      icon: ShieldCheck
    }
  ];

  const renderAddressCard = (type: 'origin' | 'destination') => {
    const isOrigin = type === 'origin';
    const data = isOrigin ? originData : destinationData;
    const isFormComplete = isOrigin ? isOriginFormComplete : isDestinationFormComplete;
    const cardTitle = isOrigin ? 'SELECT PICKUP ADDRESS' : 'SELECT DELIVERY ADDRESS';
    
    // In step 5 (Review & Submit), show both origin and destination cards
    if (currentStep === 5) {
      // Show both cards in review step
      if (!isFormComplete) {
        return null;
      }
    } else {
      // In step 1, only show destination card when both are complete (for final preview)
      if (type === 'origin') {
        return null; // Don't show origin card at the end of step 1
      }
      
      // Only show destination preview card when both forms are complete
      if (!isDestinationFormComplete) {
        return null;
      }
    }
    
    // Show the minimized design for destination
    if (isFormComplete) {
    return (
      <div
        className={cn(
            'rounded-3xl border overflow-hidden transition-all duration-300 shadow-[0_25px_80px_rgba(15,23,42,0.15)]',
          isDarkMode
              ? 'border-slate-800/60 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90'
              : 'border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-blue-50/20'
          )}
        >
          {/* Header */}
          <div
              className={cn(
              'px-6 py-4 border-b',
              isDarkMode 
                ? 'bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-transparent border-slate-800/60' 
                : 'bg-gradient-to-r from-blue-50 via-blue-50/50 to-transparent border-slate-200/60'
            )}
          >
            <h3 className={cn(
              'text-base font-semibold uppercase tracking-wide',
              isDarkMode ? 'text-slate-200' : 'text-slate-800'
            )}>
                {cardTitle}
            </h3>
          </div>
          
          {/* Address Content */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Radio button and Name Section */}
              <div className="flex items-start gap-4">
                {/* Radio button placeholder */}
                <div className="mt-1 flex-shrink-0">
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    isDarkMode ? 'border-blue-500/50' : 'border-blue-400'
                  )}>
                    <div className={cn(
                      'w-2.5 h-2.5 rounded-full',
                      isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
                    )} />
                  </div>
                </div>
                
                {/* Name and Address Type */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h4 className={cn(
                      'text-lg font-bold',
                      isDarkMode ? 'text-slate-100' : 'text-slate-900'
                    )}>
                    {data.name}
                    </h4>
                    {data.addressType && (
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-semibold uppercase',
                        isDarkMode
                          ? 'bg-blue-500/20 text-blue-200 border border-blue-400/30'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      )}>
                        {data.addressType}
                      </span>
                    )}
                  </div>
                  
                  {/* Company Name */}
                  {data.companyName && (
                    <p className={cn(
                      'text-sm font-medium mb-2',
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    )}>
                      <Building className="h-3.5 w-3.5 inline mr-1.5" />
                      {data.companyName}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Address Details */}
              <div className={cn(
                'p-4 rounded-xl border',
                isDarkMode 
                  ? 'bg-slate-800/40 border-slate-700/50' 
                  : 'bg-slate-50/80 border-slate-200/60'
              )}>
                <div className="space-y-3">
                  {/* Full Address */}
                  <div className="flex items-start gap-2">
                    <MapPin className={cn(
                      'h-4 w-4 mt-0.5 flex-shrink-0',
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    )} />
                    <div className="flex-1">
                      <p className={cn(
                        'text-sm leading-relaxed font-medium',
                        isDarkMode ? 'text-slate-200' : 'text-slate-800'
                      )}>
                        {data.flatBuilding}
                      </p>
                      <p className={cn(
                        'text-sm leading-relaxed',
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      )}>
                        {data.locality}, {data.area}
                      </p>
                      <p className={cn(
                        'text-sm leading-relaxed',
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      )}>
                        {data.city}, {data.district}, {data.state} - {data.pincode}
                      </p>
                      {data.landmark && (
                        <p className={cn(
                          'text-xs mt-1 italic',
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        )}>
                          Landmark: {data.landmark}
                </p>
              )}
            </div>
          </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className={cn(
                'p-4 rounded-xl border',
                  isDarkMode
                  ? 'bg-slate-800/40 border-slate-700/50' 
                  : 'bg-slate-50/80 border-slate-200/60'
              )}>
                <div className="space-y-2.5">
                  {/* Primary Phone */}
                  <div className="flex items-center gap-2">
                    <Phone className={cn(
                      'h-4 w-4 flex-shrink-0',
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    )} />
                    <span className={cn(
                      'text-sm font-medium',
                      isDarkMode ? 'text-slate-200' : 'text-slate-800'
                    )}>
                      +91 {data.mobileNumber}
                    </span>
                  </div>
                  
                  {/* Email */}
                  {data.email && (
                    <div className="flex items-center gap-2">
                      <Mail className={cn(
                        'h-4 w-4 flex-shrink-0',
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      )} />
                      <span className={cn(
                        'text-sm',
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      )}>
                        {data.email}
                      </span>
                    </div>
                  )}
                  
                  {/* Alternate Numbers */}
                  {data.alternateNumbers && data.alternateNumbers.filter(num => num.trim()).length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className={cn(
                        'text-xs font-medium mb-1',
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      )}>
                        Alternate Numbers:
                      </p>
                      {data.alternateNumbers.filter(num => num.trim()).map((number, idx) => (
                        <div key={idx} className="flex items-center gap-2 pl-6">
                          <Phone className={cn(
                            'h-3.5 w-3.5 flex-shrink-0',
                            isDarkMode ? 'text-slate-500' : 'text-slate-400'
                          )} />
                          <span className={cn(
                            'text-sm',
                            isDarkMode ? 'text-slate-400' : 'text-slate-600'
                          )}>
                            {number}
              </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Additional Details */}
              {(data.gstNumber || data.website || data.birthday || data.anniversary) && (
                <div className={cn(
                  'p-4 rounded-xl border',
                  isDarkMode 
                    ? 'bg-slate-800/40 border-slate-700/50' 
                    : 'bg-slate-50/80 border-slate-200/60'
                )}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* GST Number */}
                    {data.gstNumber && (
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-xs font-medium',
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        )}>
                          GST:
                        </span>
                        <span className={cn(
                          'text-sm',
                          isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        )}>
                          {data.gstNumber}
                        </span>
                      </div>
                    )}
                    
                    {/* Website */}
                    {data.website && (
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-xs font-medium',
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        )}>
                          Website:
                        </span>
                        <a 
                          href={data.website.startsWith('http') ? data.website : `https://${data.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                className={cn(
                            'text-sm underline hover:opacity-80',
                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                          )}
                        >
                          {data.website}
                        </a>
                      </div>
                    )}
                    
                    {/* Birthday */}
                    {data.birthday && (
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-xs font-medium',
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        )}>
                          Birthday:
              </span>
                        <span className={cn(
                          'text-sm',
                          isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        )}>
                          {new Date(data.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                    
                    {/* Anniversary */}
                    {data.anniversary && (
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-xs font-medium',
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        )}>
                          Anniversary:
                        </span>
                        <span className={cn(
                          'text-sm',
                          isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        )}>
                          {new Date(data.anniversary).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    );
    }
    
    return null;
  };

  // Handle card click - open phone modal if phone not complete, else open form modal
  const handleCardClick = (type: 'origin' | 'destination') => {
    // Only allow clicking on the current section
    if (type === 'destination' && !isOriginFormComplete) {
      return; // Don't allow clicking destination until origin is complete
    }
    
    const isPhoneComplete = type === 'origin' ? isOriginPhoneComplete : isDestinationPhoneComplete;
    if (!isPhoneComplete) {
      setPhoneModalOpen({ type });
      setCurrentSection(type);
    } else {
      setFormModalOpen({ type });
      setCurrentSection(type);
    }
  };

  // Handle phone complete - close phone modal and open form modal
  useEffect(() => {
    if (phoneModalOpen.type) {
      const isPhoneComplete = phoneModalOpen.type === 'origin' ? isOriginPhoneComplete : isDestinationPhoneComplete;
      if (isPhoneComplete) {
        const currentType = phoneModalOpen.type;
        setPhoneModalOpen({ type: null });
        setTimeout(() => {
          setFormModalOpen({ type: currentType });
        }, 300);
      }
    }
  }, [isOriginPhoneComplete, isDestinationPhoneComplete, phoneModalOpen.type]);

  // Auto-advance from origin to destination when origin form is complete (only for section tracking)
  useEffect(() => {
    if (isOriginFormComplete && currentSection === 'origin') {
      setCurrentSection('destination');
    }
  }, [isOriginFormComplete, currentSection]);

  // Auto-open origin phone modal when entering step 1 if origin phone is not complete
  useEffect(() => {
    if (currentStep === 1 && !isOriginPhoneComplete && !phoneModalOpen.type && !formModalOpen.type && !showPreviewInModal) {
      setTimeout(() => {
        setPhoneModalOpen({ type: 'origin' });
      }, 300);
    }
  }, [currentStep, isOriginPhoneComplete, phoneModalOpen.type, formModalOpen.type, showPreviewInModal]);

  // Auto-advance from step 1 to step 2 when destination form is completed
  useEffect(() => {
    if (currentStep === 1 && canProceedAddresses && !formModalOpen.type && !showPreviewInModal) {
      const newCompleted = [...completedSteps];
      newCompleted[1] = true;
      setCompletedSteps(newCompleted);
      setTimeout(() => {
        setCurrentStep(2);
      }, 500);
    }
  }, [currentStep, canProceedAddresses, formModalOpen.type, showPreviewInModal, completedSteps]);

  // Fetch pincode data with modes and customer pricing when entering step 4
  useEffect(() => {
    if (currentStep === 4 && destinationPincode.length === 6) {
      const fetchPincodeData = async () => {
        try {
          setLoadingPricing(true);
          const { data } = await axios.get(`${API_BASE}/api/pincode/${destinationPincode}`);
          if (data && data.modes) {
            setAvailableModes(data.modes);
            setAvailableServiceTypes({
              standard: data.standardAvailable || false,
              priority: data.priorityAvailable || false
            });
          }
        } catch (error) {
          console.error('Error fetching pincode data:', error);
        }
      };

      const fetchCustomerPricing = async () => {
        try {
          const { data } = await axios.get(`${API_BASE}/api/admin/customer-pricing/public`);
          if (data && data.success) {
            setCustomerPricing(data.data);
          }
        } catch (error) {
          console.error('Error fetching customer pricing:', error);
        } finally {
          setLoadingPricing(false);
        }
      };

      fetchPincodeData();
      fetchCustomerPricing();
    }
  }, [currentStep, destinationPincode]);

  // Calculate prices for both standard and priority when mode or weight changes
  useEffect(() => {
    if (selectedMode && customerPricing && chargeableWeight > 0) {
      calculatePrices();
    } else {
      setStandardPrice(null);
      setPriorityPrice(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMode, customerPricing, chargeableWeight, shipmentDetails.natureOfConsignment, destinationPincode]);

  // Helper function to classify location
  const classifyLocation = (pincode: string, isAirRoute: boolean = false): string => {
    const pin = parseInt(pincode);
    
    // Assam pincodes
    if ((pin >= 781000 && pin <= 781999) || 
        (pin >= 782000 && pin <= 782999) || 
        (pin >= 783000 && pin <= 783999) || 
        (pin >= 784000 && pin <= 784999) || 
        (pin >= 785000 && pin <= 785999) || 
        (pin >= 786000 && pin <= 786999) || 
        (pin >= 787000 && pin <= 787999) || 
        (pin >= 788000 && pin <= 788999)) {
      return 'assam';
    }
    
    // Kolkata pincodes (700xxx)
    if (pin >= 700000 && pin <= 700999) {
      return 'kol';
    }
    
    // Tripura (799xxx) and Manipur (795xxx) - AGT IMP only for air routes
    if (isAirRoute && ((pin >= 799000 && pin <= 799999) || (pin >= 795000 && pin <= 795999))) {
      return 'neByAirAgtImp';
    }
    
    // Tripura (799xxx) and Manipur (795xxx) - Surface route
    if (!isAirRoute && ((pin >= 799000 && pin <= 799999) || (pin >= 795000 && pin <= 795999))) {
      return 'neBySurface';
    }
    
    // Other NE states
    if ((pin >= 790000 && pin <= 791999) || 
        (pin >= 793000 && pin <= 793999) || 
        (pin >= 796000 && pin <= 796999) || 
        (pin >= 797000 && pin <= 797999) || 
        (pin >= 737000 && pin <= 737999)) {
      return 'neBySurface';
    }
    
    // Rest of India
    return 'restOfIndia';
  };

  // Calculate prices for both standard and priority
  const calculatePrices = () => {
    if (!selectedMode || !customerPricing || chargeableWeight <= 0) {
      return;
    }

    const weight = chargeableWeight;
    if (isNaN(weight) || weight <= 0) {
      return;
    }

    const isAirRoute = selectedMode === 'byAir';
    const location = classifyLocation(destinationPincode, isAirRoute);
    const isDox = shipmentDetails.natureOfConsignment === 'DOX';
    let standardPriceCalc = 0;
    let priorityPriceCalc = 0;

    if (isDox) {
      // DOX pricing logic
      // Standard Service pricing
      if (weight <= 250) {
        standardPriceCalc = parseFloat(customerPricing.doxPricing?.['01gm-250gm']?.[location] || 0);
      } else if (weight <= 500) {
        standardPriceCalc = parseFloat(customerPricing.doxPricing?.['251gm-500gm']?.[location] || 0);
      } else {
        const basePrice = parseFloat(customerPricing.doxPricing?.['251gm-500gm']?.[location] || 0);
        const additionalWeight = Math.ceil((weight - 500) / 500);
        const additionalPrice = parseFloat(customerPricing.doxPricing?.add500gm?.[location] || 0);
        standardPriceCalc = basePrice + (additionalWeight * additionalPrice);
      }
      
      // Priority Service pricing
      if (weight <= 500) {
        priorityPriceCalc = parseFloat(customerPricing.priorityPricing?.['01gm-500gm']?.[location] || 0);
      } else {
        const basePrice = parseFloat(customerPricing.priorityPricing?.['01gm-500gm']?.[location] || 0);
        const additionalWeight = Math.ceil((weight - 500) / 500);
        const additionalPrice = parseFloat(customerPricing.priorityPricing?.add500gm?.[location] || 0);
        priorityPriceCalc = basePrice + (additionalWeight * additionalPrice);
      }
    } else {
      // NON-DOX pricing logic (per kg)
      const pricePerKg = isAirRoute 
        ? parseFloat(customerPricing.nonDoxAirPricing?.[location] || 0)
        : parseFloat(customerPricing.nonDoxSurfacePricing?.[location] || 0);
      standardPriceCalc = pricePerKg * weight;
      priorityPriceCalc = pricePerKg * weight; // For NON-DOX, priority uses same pricing
    }

    setStandardPrice(standardPriceCalc);
    setPriorityPrice(priorityPriceCalc);
  };



  // Auto-focus first input when phone modal opens
  useEffect(() => {
    if (phoneModalOpen.type) {
      setTimeout(() => {
        const firstInput = document.getElementById(`${phoneModalOpen.type}-modal-digit-0`);
        firstInput?.focus();
      }, 100);
    }
  }, [phoneModalOpen.type]);

  // Navigate to next step
  const handleNextStep = () => {
    if (currentStep === 0) {
      // Check if both pincodes are serviceable
      if (originServiceable === true && destinationServiceable === true) {
        const newCompleted = [...completedSteps];
        newCompleted[0] = true;
        setCompletedSteps(newCompleted);
        setCurrentStep(1);
        // Reset to origin section when moving to address details step
        setCurrentSection('origin');
      }
    } else if (currentStep === 1) {
      if (canProceedAddresses) {
        const newCompleted = [...completedSteps];
        newCompleted[1] = true;
        setCompletedSteps(newCompleted);
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (isShipmentStepComplete) {
        const newCompleted = [...completedSteps];
        newCompleted[2] = true;
        setCompletedSteps(newCompleted);
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      if (isPackageStepComplete) {
        const newCompleted = [...completedSteps];
        newCompleted[3] = true;
        setCompletedSteps(newCompleted);
        setCurrentStep(4);
      }
    } else if (currentStep === 4) {
      if (selectedMode && selectedServiceType) {
        const newCompleted = [...completedSteps];
        newCompleted[4] = true;
        setCompletedSteps(newCompleted);
        setCurrentStep(5);
      }
    } else if (currentStep === 5) {
      // Submit the booking
      const newCompleted = [...completedSteps];
      newCompleted[5] = true;
      setCompletedSteps(newCompleted);
      console.log('User dashboard booking draft:', {
        originData,
        destinationData,
        shipmentDetails,
        uploadedImages: uploadedImages.length,
        selectedMode,
        selectedServiceType,
        price: selectedServiceType === 'priority' ? priorityPrice : standardPrice,
      });
      // Here you can add API call to submit the booking
    }
  };

  // Navigate to previous step
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full">
      <Stepper 
        currentStep={currentStep} 
        steps={steps} 
        completedSteps={completedSteps}
        isDarkMode={isDarkMode}
      />

      {/* Step 0: Serviceability Check */}
      {currentStep === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h3 className={cn(
              "text-xl font-semibold mb-2",
              isDarkMode ? "text-slate-100" : "text-slate-900"
            )}>
              Check Serviceability
            </h3>
            <p className={cn(
              "text-sm mb-6",
              isDarkMode ? "text-slate-400" : "text-slate-600"
            )}>
              Enter origin and destination pincodes to check if we service these areas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Origin Pincode */}
            <div className="space-y-2">
              <FloatingInput
                label="Origin Pincode"
                value={originPincode}
                onChange={handleOriginPincodeChange}
                type="text"
                required
                maxLength={6}
                icon={<MapPin className="w-4 h-4" />}
                serviceabilityStatus={originServiceable === true ? 'available' : originServiceable === false ? 'unavailable' : null}
                showInlineStatus={originPincode.length === 6}
                addressInfo={originAddressInfo}
                errorMessage="This area is not serviceable"
                isDarkMode={isDarkMode}
              />
              {checkingOrigin && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking serviceability...</span>
                </div>
              )}
            </div>

            {/* Destination Pincode */}
            <div className="space-y-2">
              <FloatingInput
                label="Destination Pincode"
                value={destinationPincode}
                onChange={handleDestinationPincodeChange}
                type="text"
                required
                maxLength={6}
                icon={<MapPin className="w-4 h-4" />}
                serviceabilityStatus={destinationServiceable === true ? 'available' : destinationServiceable === false ? 'unavailable' : null}
                showInlineStatus={destinationPincode.length === 6}
                addressInfo={destinationAddressInfo}
                errorMessage="This area is not serviceable"
                isDarkMode={isDarkMode}
              />
              {checkingDestination && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking serviceability...</span>
                </div>
              )}
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleNextStep}
              disabled={originServiceable !== true || destinationServiceable !== true}
              className={cn(
                "px-6",
                isDarkMode
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              )}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 1: Address Details - Show only destination preview at the end */}
      {currentStep === 1 && isDestinationFormComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Only show destination preview card */}
          {renderAddressCard('destination')}
          
          {/* Auto-advancing message */}
          <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Preparing shipment details...</span>
          </div>
          
          <div className="flex justify-start pt-2">
            <Button
              onClick={handlePreviousStep}
              variant="outline"
              className={cn(
                'sm:w-auto',
                isDarkMode
                  ? 'border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:border-slate-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              )}
            >
              Back
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Shipment Details */}
      {currentStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-2">
            <h3
              className={cn(
                'text-xl font-semibold',
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              )}
            >
            </h3>
            <p
              className={cn(
                'text-sm',
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              )}
            >
            </p>
          </div>

          <div className="space-y-6">
            {/* Nature of Consignment */}
            <div
              className={cn(
                'rounded-3xl border p-6 transition-all duration-300',
                isDarkMode
                  ? 'border-slate-800/60 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80'
                  : 'border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-blue-50/30'
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className={cn('text-base font-semibold', isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                    Nature of Consignment
                  </h4>
                  <span className={cn('text-xs font-medium', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                    Select one option to continue
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {natureOptions.map((option) => {
                    const isSelected = shipmentDetails.natureOfConsignment === option.value;
                    const IconComponent = option.icon;
                    return (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() =>
                          setShipmentDetails({
                            natureOfConsignment: option.value,
                            insurance: '',
                            riskCoverage: 'Owner',
                            packagesCount: '',
                            materials: '',
                            description: '',
                            weight: '',
                            length: '',
                            width: '',
                            height: '',
                            insuranceCompanyName: '',
                            insurancePolicyNumber: '',
                            insurancePolicyDate: '',
                            insurancePremiumAmount: '',
                            insuranceDocumentName: '',
                            insuranceDocument: null
                          })
                        }
                        className={cn(
                          'w-full text-left rounded-2xl border px-4 py-4 transition-all duration-200 focus:outline-none',
                          isSelected
                            ? isDarkMode
                              ? 'border-blue-500 bg-blue-500/20 shadow-[0_10px_30px_rgba(59,130,246,0.3)]'
                              : 'border-blue-500 bg-blue-50/80 shadow-[0_10px_30px_rgba(59,130,246,0.18)]'
                            : isDarkMode
                              ? 'border-slate-700/60 bg-slate-800/50 hover:border-blue-500/50 hover:bg-blue-500/10'
                              : 'border-slate-200 hover:border-blue-400/60 hover:bg-blue-50/60'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'mt-1 flex h-5 w-5 items-center justify-center rounded-full border text-xs transition-colors',
                              isSelected
                                ? 'border-blue-500 bg-blue-500 text-white'
                                : isDarkMode
                                  ? 'border-slate-600 bg-slate-700/50 text-transparent'
                                  : 'border-slate-300 text-transparent'
                            )}
                          >
                            <Check className="h-3 w-3" />
                          </div>
                          <div className="space-y-1">
                            <p className={cn('text-sm font-semibold', isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                              <span className="inline-flex items-center gap-2">
                                {IconComponent && <IconComponent className={cn('h-4 w-4', isDarkMode ? 'text-blue-400' : 'text-blue-500')} />}
                                {option.title}
                              </span>
                            </p>
                            <p className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-600')}>
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Insurance */}
            {shipmentDetails.natureOfConsignment && (
              <div
                className={cn(
                  'rounded-3xl border p-6 transition-all duration-300',
                  isDarkMode
                    ? 'border-slate-800/60 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80'
                    : 'border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-blue-50/30'
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className={cn('text-base font-semibold', isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                      Insurance
                    </h4>
                    <span className={cn('text-xs font-medium', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                      Choose how the shipment is insured
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {insuranceOptions.map((option) => {
                      const isSelected = shipmentDetails.insurance === option.value;
                      const IconComponent = option.icon;
                      return (
                        <button
                          type="button"
                          key={option.value}
                          onClick={() => handleInsuranceSelection(option.value)}
                          className={cn(
                            'w-full text-left rounded-2xl border px-4 py-4 transition-all duration-200 focus:outline-none',
                            isSelected
                              ? isDarkMode
                                ? 'border-blue-500 bg-blue-500/20 shadow-[0_10px_30px_rgba(59,130,246,0.3)]'
                                : 'border-blue-500 bg-blue-50/80 shadow-[0_10px_30px_rgba(59,130,246,0.18)]'
                              : isDarkMode
                                ? 'border-slate-700/60 bg-slate-800/50 hover:border-blue-500/50 hover:bg-blue-500/10'
                                : 'border-slate-200 hover:border-blue-400/60 hover:bg-blue-50/60'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                'mt-1 flex h-5 w-5 items-center justify-center rounded-full border text-xs transition-colors',
                                isSelected
                                  ? 'border-blue-500 bg-blue-500 text-white'
                                  : isDarkMode
                                    ? 'border-slate-600 bg-slate-700/50 text-transparent'
                                    : 'border-slate-300 text-transparent'
                              )}
                            >
                              <Check className="h-3 w-3" />
                            </div>
                            <div className="space-y-1">
                              <p className={cn('text-sm font-semibold', isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                                <span className="inline-flex items-center gap-2">
                                  {IconComponent && <IconComponent className={cn('h-4 w-4', isDarkMode ? 'text-blue-400' : 'text-blue-500')} />}
                                  {option.title}
                                </span>
                              </p>
                              <p className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-600')}>
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              {shipmentDetails.insurance === 'With insurance' && (
                <div
                  className={cn(
                    'mt-4 rounded-2xl border p-5 transition-all duration-300',
                    isDarkMode
                      ? 'border-slate-800/60 bg-slate-900/60'
                      : 'border-slate-200/70 bg-white/80'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h5 className={cn('text-sm font-semibold', isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                        Insurance Details
                      </h5>
                      <p className={cn('text-xs mt-1', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                        {hasInsuranceDetails
                          ? 'Review your provided insurance information.'
                          : 'Complete the insurance details to proceed.'}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={openInsuranceModal}
                      className={cn(
                        isDarkMode
                          ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                      )}
                    >
                      {hasInsuranceDetails ? 'Edit Details' : 'Add Details'}
                    </Button>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div>
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Company Name</span>
                      <p className={cn('text-sm font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>
                        {shipmentDetails.insuranceCompanyName || 'Pending'}
                      </p>
                    </div>
                    <div>
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Policy Number</span>
                      <p className={cn('text-sm font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>
                        {shipmentDetails.insurancePolicyNumber || 'Pending'}
                      </p>
                    </div>
                    <div>
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Policy Date</span>
                      <p className={cn('text-sm font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>
                        {shipmentDetails.insurancePolicyDate || 'Pending'}
                      </p>
                    </div>
                    <div>
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Premium Amount</span>
                      <p className={cn('text-sm font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>
                        {shipmentDetails.insurancePremiumAmount
                          ? `${shipmentDetails.insurancePremiumAmount}`
                          : 'Not provided'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Document</span>
                      <p className={cn('text-sm font-medium break-words', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>
                        {shipmentDetails.insuranceDocumentName || 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              </div>
            )}

            {/* Risk Coverage */}
            {shipmentDetails.natureOfConsignment && shipmentDetails.insurance && (
              <div
                className={cn(
                  'rounded-3xl border p-6 transition-all duration-300',
                  isDarkMode
                    ? 'border-slate-800/60 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80'
                    : 'border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-blue-50/30'
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className={cn('text-base font-semibold', isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                      Risk Coverage
                    </h4>
                    <span className={cn('text-xs font-medium', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                      Decide who covers transit risks
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {riskCoverageOptions.map((option) => {
                      const isSelected = shipmentDetails.riskCoverage === option.value;
                      const IconComponent = option.icon;
                      return (
                        <button
                          type="button"
                          key={option.value}
                          onClick={() =>
                            setShipmentDetails((prev) => ({
                              ...prev,
                              riskCoverage: option.value,
                              packagesCount: '',
                              materials: '',
                              description: '',
                              weight: '',
                              length: '',
                              width: '',
                              height: ''
                            }))
                          }
                          className={cn(
                            'w-full text-left rounded-2xl border px-4 py-4 transition-all duration-200 focus:outline-none',
                            isSelected
                              ? isDarkMode
                                ? 'border-blue-500 bg-blue-500/20 shadow-[0_10px_30px_rgba(59,130,246,0.3)]'
                                : 'border-blue-500 bg-blue-50/80 shadow-[0_10px_30px_rgba(59,130,246,0.18)]'
                              : isDarkMode
                                ? 'border-slate-700/60 bg-slate-800/50 hover:border-blue-500/50 hover:bg-blue-500/10'
                                : 'border-slate-200 hover:border-blue-400/60 hover:bg-blue-50/60'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                'mt-1 flex h-5 w-5 items-center justify-center rounded-full border text-xs transition-colors',
                                isSelected
                                  ? 'border-blue-500 bg-blue-500 text-white'
                                  : isDarkMode
                                    ? 'border-slate-600 bg-slate-700/50 text-transparent'
                                    : 'border-slate-300 text-transparent'
                              )}
                            >
                              <Check className="h-3 w-3" />
                            </div>
                            <div className="space-y-1">
                              <p className={cn('text-sm font-semibold', isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                                <span className="inline-flex items-center gap-2">
                                  {IconComponent && <IconComponent className={cn('h-4 w-4', isDarkMode ? 'text-blue-400' : 'text-blue-500')} />}
                                  {option.title}
                                </span>
                              </p>
                              <p className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-600')}>
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:justify-between">
            <Button
              onClick={handlePreviousStep}
              variant="outline"
              className={cn(
                'sm:w-auto',
                isDarkMode
                  ? 'border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:border-slate-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              )}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleNextStep}
              disabled={!isShipmentStepComplete}
              className={cn(
                'sm:w-auto px-6',
                isDarkMode
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white',
                !isShipmentStepComplete && 'opacity-60 cursor-not-allowed'
              )}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Package & Images */}
      {currentStep === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-2">
            <h3
              className={cn(
                'text-xl font-semibold',
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              )}
            >
              Package Information & Images
            </h3>
            <p
              className={cn(
                'text-sm',
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              )}
            >
              Provide package details and upload images of your shipment.
            </p>
          </div>

          <div className="space-y-6">
            {/* Package Information */}
            <div
              className={cn(
                'rounded-3xl border p-6 transition-all duration-300',
                isDarkMode
                  ? 'border-slate-800/60 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80'
                  : 'border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-blue-50/30'
              )}
            >
              <div className="space-y-4">
                <div>
                  <h4 className={cn('text-base font-semibold', isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                    Package Information
                  </h4>
                  <p className={cn('text-xs mt-1', isDarkMode ? 'text-slate-400' : 'text-slate-600')}>
                    Provide the package count, contents and approximate dimensions.
                  </p>
                </div>
                <div className="space-y-4">
                  {/* No. of Packages and Materials - 2 column layout */}
                  <div className="grid gap-3 md:grid-cols-2">
                    <FloatingInput
                      label="No. of Packages"
                      value={shipmentDetails.packagesCount}
                      onChange={(value) =>
                        setShipmentDetails((prev) => ({ ...prev, packagesCount: sanitizeInteger(value) }))
                      }
                      type="text"
                      required
                      icon={<Package className="h-4 w-4" />}
                      isDarkMode={isDarkMode}
                    />
                    <FloatingInput
                      label="Materials"
                      value={shipmentDetails.materials}
                      onChange={(value) =>
                        setShipmentDetails((prev) => ({ ...prev, materials: value }))
                      }
                      type="text"
                      required
                      icon={<Info className="h-4 w-4" />}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                  
                  {/* Description - Single column layout */}
                  <FloatingInput
                    label="Description"
                    value={shipmentDetails.description}
                    onChange={(value) =>
                      setShipmentDetails((prev) => ({ ...prev, description: value }))
                    }
                    type="text"
                    className="w-full"
                    isDarkMode={isDarkMode}
                  />
                  
                  {/* Length, Width, Height - 3 column layout */}
                  <div className="grid gap-3 md:grid-cols-3">
                    <FloatingInput
                      label="Length (cm)"
                      value={shipmentDetails.length}
                      onChange={(value) =>
                        setShipmentDetails((prev) => ({ ...prev, length: sanitizeDecimal(value) }))
                      }
                      type="text"
                    required={!hasActualWeight}
                      icon={<Ruler className="h-4 w-4" />}
                      isDarkMode={isDarkMode}
                    />
                    <FloatingInput
                      label="Width (cm)"
                      value={shipmentDetails.width}
                      onChange={(value) =>
                        setShipmentDetails((prev) => ({ ...prev, width: sanitizeDecimal(value) }))
                      }
                      type="text"
                    required={!hasActualWeight}
                      icon={<Ruler className="h-4 w-4" />}
                      isDarkMode={isDarkMode}
                    />
                    <FloatingInput
                      label="Height (cm)"
                      value={shipmentDetails.height}
                      onChange={(value) =>
                        setShipmentDetails((prev) => ({ ...prev, height: sanitizeDecimal(value) }))
                      }
                      type="text"
                    required={!hasActualWeight}
                      icon={<Ruler className="h-4 w-4" />}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                  
                  {/* Actual Weight - Single column layout */}
                  <FloatingInput
                    label="Actual Weight (kg)"
                    value={shipmentDetails.weight}
                    onChange={(value) =>
                      setShipmentDetails((prev) => ({ ...prev, weight: sanitizeDecimal(value) }))
                    }
                    type="text"
                  required={!hasDimensions}
                    icon={<Scale className="h-4 w-4" />}
                    className="w-full"
                    isDarkMode={isDarkMode}
                  />
                  <div className="grid gap-3 pt-2 md:grid-cols-3">
                    {[
                      {
                        label: 'Volumetric',
                        value: displayVolumetricWeight,
                        description: 'Based on dimensions'
                      },
                      {
                        label: 'Actual',
                        value: displayActualWeight,
                        description: 'Weight entered above'
                      },
                      {
                        label: 'Chargeable',
                        value: displayChargeableWeight,
                        description: 'Higher of volumetric or actual'
                      }
                    ].map((card) => (
                      <div
                        key={card.label}
                        className={cn(
                          'rounded-2xl border px-4 py-3 transition-colors',
                          isDarkMode
                            ? 'border-slate-700/70 bg-slate-800/60'
                            : 'border-slate-200 bg-white/80 shadow-sm'
                        )}
                      >
                        <p className={cn('text-xs font-medium uppercase tracking-wide', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                          {card.label}
                        </p>
                        <p className={cn('mt-1 text-lg font-semibold', card.label === 'Chargeable' ? 'text-blue-500' : (isDarkMode ? 'text-slate-100' : 'text-slate-800'))}>
                          {card.value}
                        </p>
                        <p className={cn('mt-1 text-xs', isDarkMode ? 'text-slate-500' : 'text-slate-500')}>
                          {card.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload Section - Only show when package info is complete */}
            {isPackageInfoComplete && (
            <div
              className={cn(
                'rounded-3xl border p-6 transition-all duration-300',
                isDarkMode
                  ? 'border-slate-800/60 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80'
                  : 'border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-blue-50/30'
              )}
            >
              <div className="space-y-4">
                <div>
                  <h4 className={cn('text-base font-semibold', isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                    Package Images
                  </h4>
                  <p className={cn('text-xs mt-1', isDarkMode ? 'text-slate-400' : 'text-slate-600')}>
                    Upload images of your package (optional). Maximum 5 images.
                  </p>
                </div>

                {/* Image Upload Area */}
                <div className="space-y-4">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length + uploadedImages.length > 5) {
                        alert('Maximum 5 images allowed');
                        return;
                      }
                      const newFiles = [...uploadedImages, ...files];
                      setUploadedImages(newFiles);
                      
                      // Create previews for new files only
                      const newPreviews: string[] = [...imagePreviews];
                      files.forEach((file) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          newPreviews.push(reader.result as string);
                          if (newPreviews.length === newFiles.length) {
                            setImagePreviews(newPreviews);
                          }
                        };
                        reader.readAsDataURL(file);
                      });
                    }}
                    className="hidden"
                  />
                  
                  <label
                    htmlFor="image-upload"
                    className={cn(
                      'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all',
                      isDarkMode
                        ? 'border-slate-700 bg-slate-800/40 hover:border-blue-500/50 hover:bg-slate-800/60'
                        : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/30'
                    )}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className={cn('w-8 h-8 mb-2', isDarkMode ? 'text-slate-400' : 'text-slate-500')} />
                      <p className={cn('text-sm font-medium', isDarkMode ? 'text-slate-300' : 'text-slate-700')}>
                        Click to upload images
                      </p>
                      <p className={cn('text-xs mt-1', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                        PNG, JPG, JPEG up to 5MB each
                      </p>
                    </div>
                  </label>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          className={cn(
                            'relative group rounded-lg overflow-hidden border',
                            isDarkMode ? 'border-slate-700' : 'border-slate-200'
                          )}
                        >
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newFiles = uploadedImages.filter((_, i) => i !== index);
                              const newPreviews = imagePreviews.filter((_, i) => i !== index);
                              setUploadedImages(newFiles);
                              setImagePreviews(newPreviews);
                            }}
                            className={cn(
                              'absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity',
                              isDarkMode
                                ? 'bg-red-500/80 text-white hover:bg-red-600'
                                : 'bg-red-500 text-white hover:bg-red-600'
                            )}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {uploadedImages.length > 0 && (
                    <div className={cn(
                      'text-xs text-center',
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    )}>
                      {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} selected
                    </div>
                  )}
                </div>
              </div>
            </div>
            )}
          </div>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:justify-between">
            <Button
              onClick={handlePreviousStep}
              variant="outline"
              className={cn(
                'sm:w-auto',
                isDarkMode
                  ? 'border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:border-slate-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              )}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleNextStep}
              disabled={!isPackageStepComplete}
              className={cn(
                'sm:w-auto px-6',
                isDarkMode
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white',
                !isPackageStepComplete && 'opacity-60 cursor-not-allowed'
              )}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 4: Shipping Mode & Pricing */}
      {currentStep === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-2">
            <h3
              className={cn(
                'text-xl font-semibold',
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              )}
            >
            </h3>
            <p
              className={cn(
                'text-sm',
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              )}
            >
            </p>
          </div>

          {loadingPricing ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Mode Selection */}
              {availableModes && (
                <div
                  className={cn(
                    'rounded-3xl border p-6 transition-all duration-300',
                    isDarkMode
                      ? 'border-slate-800/60 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80'
                      : 'border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-blue-50/30'
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className={cn('text-base font-semibold', isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                        Select Shipping Mode
                      </h4>
                      <span className={cn('text-xs font-medium', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                        Choose your preferred mode
                      </span>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      {availableModes.byAir && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMode('byAir');
                            setSelectedServiceType(''); // Reset service type when mode changes
                          }}
                          className={cn(
                            'w-full text-left rounded-2xl border px-4 py-4 transition-all duration-200 focus:outline-none',
                            selectedMode === 'byAir'
                              ? isDarkMode
                                ? 'border-blue-500 bg-blue-500/20 shadow-[0_10px_30px_rgba(59,130,246,0.3)]'
                                : 'border-blue-500 bg-blue-50/80 shadow-[0_10px_30px_rgba(59,130,246,0.18)]'
                              : isDarkMode
                                ? 'border-slate-700/60 bg-slate-800/50 hover:border-blue-500/50 hover:bg-blue-500/10'
                                : 'border-slate-200 hover:border-blue-400/60 hover:bg-blue-50/60'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                'mt-1 flex h-5 w-5 items-center justify-center rounded-full border text-xs transition-colors',
                                selectedMode === 'byAir'
                                  ? 'border-blue-500 bg-blue-500 text-white'
                                  : isDarkMode
                                    ? 'border-slate-600 bg-slate-700/50 text-transparent'
                                    : 'border-slate-300 text-transparent'
                              )}
                            >
                              <Check className="h-3 w-3" />
                            </div>
                            <div className="space-y-1">
                              <p className={cn('text-sm font-semibold', isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                                <span className="inline-flex items-center gap-2">
                                  <Plane className={cn('h-4 w-4', isDarkMode ? 'text-blue-400' : 'text-blue-500')} />
                                  Air
                                </span>
                              </p>
                              <p className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-600')}>
                                Fast delivery via air transport
                              </p>
                            </div>
                          </div>
                        </button>
                      )}
                      {availableModes.byTrain && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMode('byTrain');
                            setSelectedServiceType(''); // Reset service type when mode changes
                          }}
                          className={cn(
                            'w-full text-left rounded-2xl border px-4 py-4 transition-all duration-200 focus:outline-none',
                            selectedMode === 'byTrain'
                              ? isDarkMode
                                ? 'border-blue-500 bg-blue-500/20 shadow-[0_10px_30px_rgba(59,130,246,0.3)]'
                                : 'border-blue-500 bg-blue-50/80 shadow-[0_10px_30px_rgba(59,130,246,0.18)]'
                              : isDarkMode
                                ? 'border-slate-700/60 bg-slate-800/50 hover:border-blue-500/50 hover:bg-blue-500/10'
                                : 'border-slate-200 hover:border-blue-400/60 hover:bg-blue-50/60'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                'mt-1 flex h-5 w-5 items-center justify-center rounded-full border text-xs transition-colors',
                                selectedMode === 'byTrain'
                                  ? 'border-blue-500 bg-blue-500 text-white'
                                  : isDarkMode
                                    ? 'border-slate-600 bg-slate-700/50 text-transparent'
                                    : 'border-slate-300 text-transparent'
                              )}
                            >
                              <Check className="h-3 w-3" />
                            </div>
                            <div className="space-y-1">
                              <p className={cn('text-sm font-semibold', isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                                <span className="inline-flex items-center gap-2">
                                  <Train className={cn('h-4 w-4', isDarkMode ? 'text-blue-400' : 'text-blue-500')} />
                                  Train
                                </span>
                              </p>
                              <p className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-600')}>
                                Reliable delivery via train
                              </p>
                            </div>
                          </div>
                        </button>
                      )}
                      {availableModes.byRoad && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMode('byRoad');
                            setSelectedServiceType(''); // Reset service type when mode changes
                          }}
                          className={cn(
                            'w-full text-left rounded-2xl border px-4 py-4 transition-all duration-200 focus:outline-none',
                            selectedMode === 'byRoad'
                              ? isDarkMode
                                ? 'border-blue-500 bg-blue-500/20 shadow-[0_10px_30px_rgba(59,130,246,0.3)]'
                                : 'border-blue-500 bg-blue-50/80 shadow-[0_10px_30px_rgba(59,130,246,0.18)]'
                              : isDarkMode
                                ? 'border-slate-700/60 bg-slate-800/50 hover:border-blue-500/50 hover:bg-blue-500/10'
                                : 'border-slate-200 hover:border-blue-400/60 hover:bg-blue-50/60'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                'mt-1 flex h-5 w-5 items-center justify-center rounded-full border text-xs transition-colors',
                                selectedMode === 'byRoad'
                                  ? 'border-blue-500 bg-blue-500 text-white'
                                  : isDarkMode
                                    ? 'border-slate-600 bg-slate-700/50 text-transparent'
                                    : 'border-slate-300 text-transparent'
                              )}
                            >
                              <Check className="h-3 w-3" />
                            </div>
                            <div className="space-y-1">
                              <p className={cn('text-sm font-semibold', isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                                <span className="inline-flex items-center gap-2">
                                  <Truck className={cn('h-4 w-4', isDarkMode ? 'text-blue-400' : 'text-blue-500')} />
                                  Road
                                </span>
                              </p>
                              <p className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-600')}>
                                Cost-effective delivery via road
                              </p>
                            </div>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Service Type Selection - Only show after mode is selected */}
              {selectedMode && availableServiceTypes && (
                <div
                  className={cn(
                    'rounded-3xl border p-6 transition-all duration-300',
                    isDarkMode
                      ? 'border-slate-800/60 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80'
                      : 'border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-blue-50/30'
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className={cn('text-base font-semibold', isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                        Select Service Type
                      </h4>
                      <span className={cn('text-xs font-medium', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                        Choose your service preference
                      </span>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {availableServiceTypes.standard && (
                        <button
                          type="button"
                          onClick={() => setSelectedServiceType('standard')}
                          className={cn(
                            'w-full text-left rounded-2xl border px-4 py-4 transition-all duration-200 focus:outline-none',
                            selectedServiceType === 'standard'
                              ? isDarkMode
                                ? 'border-blue-500 bg-blue-500/20 shadow-[0_10px_30px_rgba(59,130,246,0.3)]'
                                : 'border-blue-500 bg-blue-50/80 shadow-[0_10px_30px_rgba(59,130,246,0.18)]'
                              : isDarkMode
                                ? 'border-slate-700/60 bg-slate-800/50 hover:border-blue-500/50 hover:bg-blue-500/10'
                                : 'border-slate-200 hover:border-blue-400/60 hover:bg-blue-50/60'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                'mt-1 flex h-5 w-5 items-center justify-center rounded-full border text-xs transition-colors',
                                selectedServiceType === 'standard'
                                  ? 'border-blue-500 bg-blue-500 text-white'
                                  : isDarkMode
                                    ? 'border-slate-600 bg-slate-700/50 text-transparent'
                                    : 'border-slate-300 text-transparent'
                              )}
                            >
                              <Check className="h-3 w-3" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <p className={cn('text-sm font-semibold', isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                                  <span className="inline-flex items-center gap-2">
                                    <Package className={cn('h-4 w-4', isDarkMode ? 'text-blue-400' : 'text-blue-500')} />
                                    Standard
                                  </span>
                                </p>
                                {standardPrice !== null && (
                                  <span className={cn('text-lg font-bold', isDarkMode ? 'text-green-400' : 'text-green-600')}>
                                    ₹{standardPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <p className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-600')}>
                                Regular delivery service
                              </p>
                            </div>
                          </div>
                        </button>
                      )}
                      {availableServiceTypes.priority && (
                        <button
                          type="button"
                          onClick={() => setSelectedServiceType('priority')}
                          className={cn(
                            'w-full text-left rounded-2xl border px-4 py-4 transition-all duration-200 focus:outline-none',
                            selectedServiceType === 'priority'
                              ? isDarkMode
                                ? 'border-blue-500 bg-blue-500/20 shadow-[0_10px_30px_rgba(59,130,246,0.3)]'
                                : 'border-blue-500 bg-blue-50/80 shadow-[0_10px_30px_rgba(59,130,246,0.18)]'
                              : isDarkMode
                                ? 'border-slate-700/60 bg-slate-800/50 hover:border-blue-500/50 hover:bg-blue-500/10'
                                : 'border-slate-200 hover:border-blue-400/60 hover:bg-blue-50/60'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                'mt-1 flex h-5 w-5 items-center justify-center rounded-full border text-xs transition-colors',
                                selectedServiceType === 'priority'
                                  ? 'border-blue-500 bg-blue-500 text-white'
                                  : isDarkMode
                                    ? 'border-slate-600 bg-slate-700/50 text-transparent'
                                    : 'border-slate-300 text-transparent'
                              )}
                            >
                              <Check className="h-3 w-3" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <p className={cn('text-sm font-semibold', isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                                  <span className="inline-flex items-center gap-2">
                                    <ShieldCheck className={cn('h-4 w-4', isDarkMode ? 'text-blue-400' : 'text-blue-500')} />
                                    Priority
                                  </span>
                                </p>
                                {priorityPrice !== null && (
                                  <span className={cn('text-lg font-bold', isDarkMode ? 'text-green-400' : 'text-green-600')}>
                                    ₹{priorityPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <p className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-600')}>
                                Express delivery service
                              </p>
                            </div>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:justify-between">
            <Button
              onClick={handlePreviousStep}
              variant="outline"
              className={cn(
                'sm:w-auto',
                isDarkMode
                  ? 'border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:border-slate-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              )}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleNextStep}
              disabled={!selectedMode || !selectedServiceType}
              className={cn(
                'sm:w-auto px-6',
                isDarkMode
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white',
                (!selectedMode || !selectedServiceType) && 'opacity-60 cursor-not-allowed'
              )}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 5: Preview */}
      {currentStep === 5 && (() => {
        const finalPrice = (selectedServiceType === 'priority' ? priorityPrice : standardPrice) ?? 0;
        const formattedPrice = finalPrice ? `₹${finalPrice.toFixed(2)}` : '—';
        const originAlternates = originData.alternateNumbers?.filter((num) => num.trim());
        const destinationAlternates = destinationData.alternateNumbers?.filter((num) => num.trim());
        const formatDate = (value: string) => {
          if (!value) return null;
          const parsed = new Date(value);
          if (Number.isNaN(parsed.getTime())) return null;
          return parsed.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
        };
        const renderAddress = (data: typeof originData) => {
          const lines = [
            [data.flatBuilding, data.landmark].filter(Boolean).join(', '),
            [data.locality, data.area].filter(Boolean).join(', '),
            [data.city, data.state, data.pincode].filter(Boolean).join(', ')
          ].filter((line) => line);
          return lines.join(', ');
        };
        const modeLabelMap: Record<typeof selectedMode, string> = {
          byAir: 'Air',
          byTrain: 'Train',
          byRoad: 'Road',
          '': ''
        };
        const serviceLabel = selectedServiceType === 'priority' ? 'Priority' : 'Standard';

        // Edit handlers - toggle inline editing
        const handleEditOrigin = () => {
          setEditingSection(editingSection === 'origin' ? null : 'origin');
        };

        const handleEditDestination = () => {
          setEditingSection(editingSection === 'destination' ? null : 'destination');
        };

        const handleEditShipment = () => {
          setEditingSection(editingSection === 'shipment' ? null : 'shipment');
        };

        const handleEditPackage = () => {
          setEditingSection(editingSection === 'package' ? null : 'package');
        };

        const handleEditShipping = () => {
          setEditingSection(editingSection === 'shipping' ? null : 'shipping');
        };

        // Save handlers for inline editing
        const handleSaveOrigin = () => {
          setEditingSection(null);
        };

        const handleSaveDestination = () => {
          setEditingSection(null);
        };

        const handleSaveShipment = () => {
          setEditingSection(null);
        };

        const handleSavePackage = () => {
          setEditingSection(null);
        };

        const handleSaveShipping = () => {
          setEditingSection(null);
        };

        const handleCancelEdit = () => {
          setEditingSection(null);
        };

        return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
        >
            <div>
            <h3
              className={cn(
                'text-xl font-semibold',
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              )}
            >
                Preview
            </h3>
            <p
              className={cn(
                  'text-xs mt-0.5',
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              )}
            >
                Please review all details before submitting
            </p>
          </div>

            <div className="space-y-2.5">
              {/* Origin Address */}
              <div className={cn(
                'rounded-lg border p-2.5 transition-all duration-200',
                isDarkMode
                  ? 'border-slate-800/50 bg-gradient-to-br from-slate-900/40 via-slate-900/30 to-slate-900/40 hover:border-blue-500/30'
                  : 'border-slate-200/60 bg-gradient-to-br from-slate-50/60 via-blue-50/30 to-slate-50/60 hover:border-blue-400/50'
              )}>
                <div className={cn(
                  'flex items-center justify-between mb-2',
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                )}>
                  <h4 className={cn(
                    'text-sm font-semibold flex items-center gap-1.5',
                    isDarkMode ? 'text-slate-200' : 'text-slate-800'
                  )}>
                    <MapPin className="h-3.5 w-3.5" />
                    Sender's (Consigner)
                  </h4>
                  <button
                    onClick={handleEditOrigin}
              className={cn(
                      'flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-colors',
                isDarkMode
                        ? 'text-blue-300 hover:bg-blue-500/20'
                        : 'text-blue-600 hover:bg-blue-50'
                    )}
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
            </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Concern Person:</span>
                    <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{originData.name}</p>
                  </div>
                  {originData.addressType && (
                    <div>
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Type:</span>
                      <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{originData.addressType}</p>
                    </div>
                  )}
                  {originData.companyName && (
                <div>
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Company:</span>
                      <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{originData.companyName}</p>
                </div>
                  )}
                <div>
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Phone:</span>
                    <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>+91 {originData.mobileNumber}</p>
                </div>
                  <div className="md:col-span-2">
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Address:</span>
                    <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{renderAddress(originData)}</p>
                  </div>
                  {originData.email && (
                <div>
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Email:</span>
                      <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{originData.email}</p>
                </div>
                  )}
                  {originAlternates && originAlternates.length > 0 && (
                    <div>
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Alternate:</span>
                      <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{originAlternates.join(', ')}</p>
                    </div>
                  )}
                  {originData.gstNumber && (
                    <div className="md:col-span-2">
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>GST:</span>
                      <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{originData.gstNumber}</p>
                    </div>
                  )}
              </div>
            </div>

              {/* Origin Address Edit Dialog */}
              <Dialog open={editingSection === 'origin'} onOpenChange={(open) => !open && setEditingSection(null)}>
                <DialogContent className={cn(
                  'max-w-3xl max-h-[90vh] overflow-y-auto',
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                )}>
                  <DialogHeader>
                    <DialogTitle className={cn(isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                      Edit Sender's (Consigner)
                    </DialogTitle>
                    <DialogDescription className={cn(isDarkMode ? 'text-slate-400' : 'text-slate-600')}>
                      Update the sender's (consigner) address details
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SimpleInput
                        label="Concern Person"
                        value={originData.name}
                        onChange={(value) => setOriginData((prev) => ({ ...prev, name: value }))}
                        required
                        isDarkMode={isDarkMode}
                      />
                      <SimpleSelect
                        label="Address Type"
                        value={originData.addressType}
                        onChange={(value) => setOriginData((prev) => ({ ...prev, addressType: value }))}
                        options={addressTypeOptions}
                        isDarkMode={isDarkMode}
                      />
                      <SimpleInput
                        label="Company Name"
                        value={originData.companyName}
                        onChange={(value) => setOriginData((prev) => ({ ...prev, companyName: value }))}
                        isDarkMode={isDarkMode}
                      />
                      <SimpleInput
                        label="Phone"
                        value={`+91 ${originData.mobileNumber}`}
                        onChange={() => {}}
                        disabled
                        isDarkMode={isDarkMode}
                      />
                      <SimpleInput
                        label="Email"
                        value={originData.email}
                        onChange={(value) => setOriginData((prev) => ({ ...prev, email: value }))}
                        type="email"
                        isDarkMode={isDarkMode}
                      />
                      <SimpleInput
                        label="GST Number"
                        value={originData.gstNumber}
                        onChange={(value) => setOriginData((prev) => ({ ...prev, gstNumber: value }))}
                        isDarkMode={isDarkMode}
                      />
                      <SimpleInput
                        label="Flat, Building"
                        value={originData.flatBuilding}
                        onChange={(value) => setOriginData((prev) => ({ ...prev, flatBuilding: value }))}
                        required
                        isDarkMode={isDarkMode}
                      />
                      <SimpleInput
                        label="Locality"
                        value={originData.locality}
                        onChange={(value) => setOriginData((prev) => ({ ...prev, locality: value }))}
                        required
                        isDarkMode={isDarkMode}
                      />
                      <SimpleInput
                        label="Landmark"
                        value={originData.landmark}
                        onChange={(value) => setOriginData((prev) => ({ ...prev, landmark: value }))}
                        isDarkMode={isDarkMode}
                      />
                      {originAreas.length > 0 ? (
                        <SimpleSelect
                          label="Area"
                          value={originData.area}
                          onChange={(value) => setOriginData((prev) => ({ ...prev, area: value }))}
                          options={originAreas}
                          required
                          isDarkMode={isDarkMode}
                        />
                      ) : (
                        <SimpleInput
                          label="Area"
                          value={originData.area}
                          onChange={(value) => setOriginData((prev) => ({ ...prev, area: value }))}
                          required
                          isDarkMode={isDarkMode}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setEditingSection(null)}
              className={cn(
                isDarkMode
                          ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveOrigin}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Save Changes
                    </Button>
            </div>
                </DialogContent>
              </Dialog>

              {/* Destination Address */}
              <div className={cn(
                'rounded-lg border p-2.5 transition-all duration-200',
                isDarkMode
                  ? 'border-slate-800/50 bg-gradient-to-br from-slate-900/40 via-slate-900/30 to-slate-900/40 hover:border-blue-500/30'
                  : 'border-slate-200/60 bg-gradient-to-br from-slate-50/60 via-blue-50/30 to-slate-50/60 hover:border-blue-400/50'
              )}>
                <div className={cn(
                  'flex items-center justify-between mb-2',
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                )}>
                  <h4 className={cn(
                    'text-sm font-semibold flex items-center gap-1.5',
                    isDarkMode ? 'text-slate-200' : 'text-slate-800'
                  )}>
                    <MapPin className="h-3.5 w-3.5" />
                    Destination Address
                  </h4>
                  <button
                    onClick={handleEditDestination}
              className={cn(
                      'flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-colors',
                isDarkMode
                        ? 'text-blue-300 hover:bg-blue-500/20'
                        : 'text-blue-600 hover:bg-blue-50'
                    )}
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Concern Person:</span>
                    <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{destinationData.name}</p>
                </div>
                  {destinationData.addressType && (
                <div>
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Type:</span>
                      <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{destinationData.addressType}</p>
                </div>
                  )}
                  {destinationData.companyName && (
                <div>
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Company:</span>
                      <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{destinationData.companyName}</p>
                </div>
                  )}
                  <div>
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Phone:</span>
                    <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>+91 {destinationData.mobileNumber}</p>
              </div>
                  <div className="md:col-span-2">
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Address:</span>
                    <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{renderAddress(destinationData)}</p>
            </div>
                  {destinationData.email && (
                  <div>
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Email:</span>
                      <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{destinationData.email}</p>
                  </div>
                  )}
                  {destinationAlternates && destinationAlternates.length > 0 && (
                  <div>
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Alternate:</span>
                      <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{destinationAlternates.join(', ')}</p>
                  </div>
                  )}
                  {destinationData.gstNumber && (
                  <div className="md:col-span-2">
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>GST:</span>
                      <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{destinationData.gstNumber}</p>
                  </div>
                  )}
                </div>
              </div>

              {/* Destination Address Edit Dialog */}
              <Dialog open={editingSection === 'destination'} onOpenChange={(open) => !open && setEditingSection(null)}>
                <DialogContent className={cn(
                  'max-w-3xl max-h-[90vh] overflow-y-auto',
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                )}>
                  <DialogHeader>
                    <DialogTitle className={cn(isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                      Edit Destination Address
                    </DialogTitle>
                    <DialogDescription className={cn(isDarkMode ? 'text-slate-400' : 'text-slate-600')}>
                      Update the destination address details
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SimpleInput
                        label="Concern Person"
                        value={destinationData.name}
                        onChange={(value) => setDestinationData((prev) => ({ ...prev, name: value }))}
                        required
                        isDarkMode={isDarkMode}
                      />
                      <SimpleSelect
                        label="Address Type"
                        value={destinationData.addressType}
                        onChange={(value) => setDestinationData((prev) => ({ ...prev, addressType: value }))}
                        options={addressTypeOptions}
                        isDarkMode={isDarkMode}
                      />
                      <SimpleInput
                        label="Company Name"
                        value={destinationData.companyName}
                        onChange={(value) => setDestinationData((prev) => ({ ...prev, companyName: value }))}
                        isDarkMode={isDarkMode}
                      />
                      <SimpleInput
                        label="Phone"
                        value={`+91 ${destinationData.mobileNumber}`}
                        onChange={() => {}}
                        disabled
                        isDarkMode={isDarkMode}
                      />
                      <SimpleInput
                        label="Email"
                        value={destinationData.email}
                        onChange={(value) => setDestinationData((prev) => ({ ...prev, email: value }))}
                        type="email"
                        isDarkMode={isDarkMode}
                      />
                      <SimpleInput
                        label="GST Number"
                        value={destinationData.gstNumber}
                        onChange={(value) => setDestinationData((prev) => ({ ...prev, gstNumber: value }))}
                        isDarkMode={isDarkMode}
                      />
                      <SimpleInput
                        label="Flat, Building"
                        value={destinationData.flatBuilding}
                        onChange={(value) => setDestinationData((prev) => ({ ...prev, flatBuilding: value }))}
                        required
                        isDarkMode={isDarkMode}
                      />
                      <SimpleInput
                        label="Locality"
                        value={destinationData.locality}
                        onChange={(value) => setDestinationData((prev) => ({ ...prev, locality: value }))}
                        required
                        isDarkMode={isDarkMode}
                      />
                      <SimpleInput
                        label="Landmark"
                        value={destinationData.landmark}
                        onChange={(value) => setDestinationData((prev) => ({ ...prev, landmark: value }))}
                        isDarkMode={isDarkMode}
                      />
                      {destinationAreas.length > 0 ? (
                        <SimpleSelect
                          label="Area"
                          value={destinationData.area}
                          onChange={(value) => setDestinationData((prev) => ({ ...prev, area: value }))}
                          options={destinationAreas}
                          required
                          isDarkMode={isDarkMode}
                        />
                      ) : (
                        <SimpleInput
                          label="Area"
                          value={destinationData.area}
                          onChange={(value) => setDestinationData((prev) => ({ ...prev, area: value }))}
                          required
                          isDarkMode={isDarkMode}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setEditingSection(null)}
              className={cn(
                isDarkMode
                          ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveDestination}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Shipment Details */}
              <div className={cn(
                'rounded-lg border p-2.5 transition-all duration-200',
                isDarkMode
                  ? 'border-slate-800/50 bg-gradient-to-br from-slate-900/40 via-slate-900/30 to-slate-900/40 hover:border-blue-500/30'
                  : 'border-slate-200/60 bg-gradient-to-br from-slate-50/60 via-blue-50/30 to-slate-50/60 hover:border-blue-400/50'
              )}>
                <div className={cn(
                  'flex items-center justify-between mb-2',
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                )}>
                  <h4 className={cn(
                    'text-sm font-semibold flex items-center gap-1.5',
                    isDarkMode ? 'text-slate-200' : 'text-slate-800'
                  )}>
                    <Package className="h-3.5 w-3.5" />
                    Shipment Details
              </h4>
                  <button
                    onClick={handleEditShipment}
                    className={cn(
                      'flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-colors',
                      isDarkMode
                        ? 'text-blue-300 hover:bg-blue-500/20'
                        : 'text-blue-600 hover:bg-blue-50'
                    )}
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Nature:</span>
                    <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{shipmentDetails.natureOfConsignment}</p>
                </div>
                <div>
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Insurance:</span>
                    <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{shipmentDetails.insurance}</p>
                </div>
                <div>
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Risk Coverage:</span>
                    <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{shipmentDetails.riskCoverage}</p>
                </div>
                {shipmentDetails.insurance === 'With insurance' && (
                  <>
                    <div>
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Insurance Company:</span>
                      <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>
                        {shipmentDetails.insuranceCompanyName || 'Pending'}
                      </p>
                    </div>
                    <div>
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Policy Number:</span>
                      <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>
                        {shipmentDetails.insurancePolicyNumber || 'Pending'}
                      </p>
                    </div>
                    <div>
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Policy Date:</span>
                      <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>
                        {shipmentDetails.insurancePolicyDate || 'Pending'}
                      </p>
                    </div>
                    <div>
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Premium Amount:</span>
                      <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>
                        {shipmentDetails.insurancePremiumAmount || 'Not provided'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Document:</span>
                      <p className={cn('font-medium break-words', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>
                        {shipmentDetails.insuranceDocumentName || 'Pending'}
                      </p>
                    </div>
                  </>
                )}
                <div>
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Packages:</span>
                    <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{shipmentDetails.packagesCount}</p>
                  </div>
                  <div>
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Materials:</span>
                    <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{shipmentDetails.materials}</p>
                  </div>
                <div>
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Actual Weight:</span>
                    <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{displayActualWeight}</p>
                  </div>
                  <div>
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Volumetric Weight:</span>
                    <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{displayVolumetricWeight}</p>
                  </div>
                  <div>
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Chargeable Weight:</span>
                    <p className={cn('font-medium', isDarkMode ? 'text-blue-300' : 'text-blue-600')}>{displayChargeableWeight}</p>
                  </div>
                  {shipmentDetails.length && shipmentDetails.width && shipmentDetails.height && (
                    <div>
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Dimensions:</span>
                      <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>
                    {shipmentDetails.length} × {shipmentDetails.width} × {shipmentDetails.height} cm
                  </p>
                </div>
                  )}
                  {shipmentDetails.description && (
                    <div className="md:col-span-2">
                      <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Description:</span>
                      <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{shipmentDetails.description}</p>
                    </div>
                  )}
              </div>
            </div>

              {/* Shipment Details Edit Dialog */}
              <Dialog open={editingSection === 'shipment'} onOpenChange={(open) => !open && setEditingSection(null)}>
                <DialogContent className={cn(
                  'max-w-2xl max-h-[90vh] overflow-y-auto',
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                )}>
                  <DialogHeader>
                    <DialogTitle className={cn(isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                      Edit Shipment Details
                    </DialogTitle>
                    <DialogDescription className={cn(isDarkMode ? 'text-slate-400' : 'text-slate-600')}>
                      Update the shipment details
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SimpleSelect
                        label="Nature of Consignment"
                        value={shipmentDetails.natureOfConsignment}
                        onChange={(value) => setShipmentDetails((prev) => ({ ...prev, natureOfConsignment: value }))}
                        options={natureOptions.map(opt => opt.value)}
                        required
                        isDarkMode={isDarkMode}
                      />
                      <SimpleSelect
                        label="Insurance"
                        value={shipmentDetails.insurance}
                        onChange={(value) => handleInsuranceSelection(value)}
                        options={insuranceOptions.map(opt => opt.value)}
                        required
                        isDarkMode={isDarkMode}
                      />
                      <SimpleSelect
                        label="Risk Coverage"
                        value={shipmentDetails.riskCoverage}
                        onChange={(value) => setShipmentDetails((prev) => ({ ...prev, riskCoverage: value }))}
                        options={riskCoverageOptions.map(opt => opt.value)}
                        required
                        isDarkMode={isDarkMode}
                      />
                      <SimpleInput
                        label="Materials"
                        value={shipmentDetails.materials}
                        onChange={(value) => setShipmentDetails((prev) => ({ ...prev, materials: value }))}
                        required
                        isDarkMode={isDarkMode}
                      />
                      <SimpleInput
                        label="Actual Weight (kg)"
                        value={shipmentDetails.weight}
                        onChange={(value) => setShipmentDetails((prev) => ({ ...prev, weight: sanitizeDecimal(value) }))}
                        required
                        isDarkMode={isDarkMode}
                      />
                      <SimpleInput
                        label="Description"
                        value={shipmentDetails.description}
                        onChange={(value) => setShipmentDetails((prev) => ({ ...prev, description: value }))}
                        isDarkMode={isDarkMode}
                        className="md:col-span-2"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setEditingSection(null)}
                className={cn(
                  isDarkMode
                          ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveShipment}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

            {imagePreviews.length > 0 && (
                <div className={cn(
                  'rounded-lg border p-2.5 transition-all duration-200',
                  isDarkMode
                    ? 'border-slate-800/50 bg-gradient-to-br from-slate-900/40 via-slate-900/30 to-slate-900/40 hover:border-blue-500/30'
                    : 'border-slate-200/60 bg-gradient-to-br from-slate-50/60 via-blue-50/30 to-slate-50/60 hover:border-blue-400/50'
                )}>
                  <div className={cn(
                    'flex items-center justify-between mb-2',
                    isDarkMode ? 'text-slate-200' : 'text-slate-800'
                  )}>
                    <h4 className={cn(
                      'text-sm font-semibold flex items-center gap-1.5',
                      isDarkMode ? 'text-slate-200' : 'text-slate-800'
                    )}>
                      <Image className="h-3.5 w-3.5" />
                  Package Images
                </h4>
                    <button
                      onClick={handleEditPackage}
                      className={cn(
                        'flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-colors',
                        isDarkMode
                          ? 'text-blue-300 hover:bg-blue-500/20'
                          : 'text-blue-600 hover:bg-blue-50'
                      )}
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className={cn(
                          'overflow-hidden rounded border',
                        isDarkMode ? 'border-slate-700' : 'border-slate-200'
                      )}
                    >
                      <img
                        src={preview}
                          alt={`Package ${index + 1}`}
                          className="h-16 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Package Images Edit Dialog */}
            <Dialog open={editingSection === 'package'} onOpenChange={(open) => !open && setEditingSection(null)}>
              <DialogContent className={cn(
                'max-w-2xl max-h-[90vh] overflow-y-auto',
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              )}>
                <DialogHeader>
                  <DialogTitle className={cn(isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                    Edit Package Images
                  </DialogTitle>
                  <DialogDescription className={cn(isDarkMode ? 'text-slate-400' : 'text-slate-600')}>
                    Add or remove package images (Maximum 5 images)
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <input
                    type="file"
                    id="image-upload-edit"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length + uploadedImages.length > 5) {
                        alert('Maximum 5 images allowed');
                        return;
                      }
                      const newFiles = [...uploadedImages, ...files];
                      setUploadedImages(newFiles);
                      
                      const newPreviews: string[] = [...imagePreviews];
                      files.forEach((file) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          newPreviews.push(reader.result as string);
                          if (newPreviews.length === newFiles.length) {
                            setImagePreviews(newPreviews);
                          }
                        };
                        reader.readAsDataURL(file);
                      });
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload-edit"
                    className={cn(
                      'flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-all',
                      isDarkMode
                        ? 'border-slate-700 bg-slate-800/40 hover:border-blue-500/50'
                        : 'border-slate-300 bg-slate-50 hover:border-blue-400'
                    )}
                  >
                    <Upload className={cn('w-5 h-5 mb-1', isDarkMode ? 'text-slate-400' : 'text-slate-500')} />
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-300' : 'text-slate-600')}>Add more images</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className={cn(
                          'relative group overflow-hidden rounded border',
                          isDarkMode ? 'border-slate-700' : 'border-slate-200'
                        )}
                      >
                        <img
                          src={preview}
                          alt={`Package ${index + 1}`}
                          className="h-24 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newFiles = uploadedImages.filter((_, i) => i !== index);
                            const newPreviews = imagePreviews.filter((_, i) => i !== index);
                            setUploadedImages(newFiles);
                            setImagePreviews(newPreviews);
                          }}
                          className={cn(
                            'absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity',
                            isDarkMode
                              ? 'bg-red-500/80 text-white hover:bg-red-600'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          )}
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
          </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setEditingSection(null)}
                    className={cn(
                      isDarkMode
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSavePackage}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

              {/* Shipping & Pricing */}
              <div className={cn(
                'rounded-lg border p-2.5 transition-all duration-200',
                isDarkMode
                  ? 'border-slate-800/50 bg-gradient-to-br from-slate-900/40 via-slate-900/30 to-slate-900/40 hover:border-blue-500/30'
                  : 'border-slate-200/60 bg-gradient-to-br from-slate-50/60 via-blue-50/30 to-slate-50/60 hover:border-blue-400/50'
              )}>
                <div className={cn(
                  'flex items-center justify-between mb-2',
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                )}>
                  <h4 className={cn(
                    'text-sm font-semibold flex items-center gap-1.5',
                    isDarkMode ? 'text-slate-200' : 'text-slate-800'
                  )}>
                    <Truck className="h-3.5 w-3.5" />
                    Shipping & Pricing
                  </h4>
                  <button
                    onClick={handleEditShipping}
                    className={cn(
                      'flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-colors',
                      isDarkMode
                        ? 'text-blue-300 hover:bg-blue-500/20'
                        : 'text-blue-600 hover:bg-blue-50'
                    )}
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Mode:</span>
                    <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{modeLabelMap[selectedMode]}</p>
                  </div>
                  <div>
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Service:</span>
                    <p className={cn('font-medium', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{serviceLabel}</p>
                  </div>
                  <div>
                    <span className={cn('text-xs', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Price:</span>
                    <p className={cn('text-lg font-bold', isDarkMode ? 'text-green-400' : 'text-green-600')}>{formattedPrice}</p>
                  </div>
                </div>
              </div>

              {/* Shipping & Pricing Edit Dialog */}
              <Dialog open={editingSection === 'shipping'} onOpenChange={(open) => !open && setEditingSection(null)}>
                <DialogContent className={cn(
                  'max-w-xl max-h-[90vh] overflow-y-auto',
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                )}>
                  <DialogHeader>
                    <DialogTitle className={cn(isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
                      Edit Shipping & Pricing
                    </DialogTitle>
                    <DialogDescription className={cn(isDarkMode ? 'text-slate-400' : 'text-slate-600')}>
                      Update the shipping service type
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <SimpleSelect
                        label="Shipping Mode"
                        value={selectedMode}
                        onChange={(value) => {
                          setSelectedMode(value as 'byAir' | 'byTrain' | 'byRoad');
                          setSelectedServiceType(''); // Reset service type when mode changes
                        }}
                        options={[
                          ...(availableModes?.byAir ? ['byAir'] : []),
                          ...(availableModes?.byTrain ? ['byTrain'] : []),
                          ...(availableModes?.byRoad ? ['byRoad'] : [])
                        ]}
                        required
                        isDarkMode={isDarkMode}
                      />
                      <SimpleSelect
                        label="Service Type"
                        value={selectedServiceType}
                        onChange={(value) => setSelectedServiceType(value as 'standard' | 'priority')}
                        options={[
                          ...(availableServiceTypes?.standard ? ['standard'] : []),
                          ...(availableServiceTypes?.priority ? ['priority'] : [])
                        ]}
                        required
                        isDarkMode={isDarkMode}
                      />
                      <div className={cn(
                        'p-4 rounded-lg border',
                        isDarkMode
                          ? 'border-slate-700 bg-slate-800/50'
                          : 'border-slate-200 bg-slate-50'
                      )}>
                        <span className={cn('text-xs block mb-1', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>Price:</span>
                        <p className={cn('text-2xl font-bold', isDarkMode ? 'text-green-400' : 'text-green-600')}>{formattedPrice}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setEditingSection(null)}
                      className={cn(
                        isDarkMode
                          ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveShipping}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
          </div>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-between">
            <Button
              onClick={handlePreviousStep}
              variant="outline"
              className={cn(
                'sm:w-auto',
                isDarkMode
                  ? 'border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:border-slate-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              )}
            >
              Back
            </Button>
            <Button
              onClick={handleNextStep}
              className={cn(
                'sm:w-auto px-6',
                isDarkMode
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              )}
            >
              Submit Booking
              <Check className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
        );
      })()}

      {/* Insurance Modal */}
      <Dialog
        open={insuranceModalOpen}
        onOpenChange={(open) => {
          if (open) {
            setInsuranceModalOpen(true);
          } else {
            handleInsuranceFormCancel();
          }
        }}
      >
        <DialogContent
          className={cn(
            'max-w-xl',
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          )}
        >
          <DialogHeader>
            <DialogTitle className={cn(isDarkMode ? 'text-slate-100' : 'text-slate-900')}>
              Insurance Details
            </DialogTitle>
            <DialogDescription className={cn(isDarkMode ? 'text-slate-400' : 'text-slate-600')}>
              Provide the insurance policy information for this shipment.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <SimpleInput
              label="Company Name"
              value={insuranceForm.companyName}
              onChange={(value) => {
                setInsuranceForm((prev) => ({ ...prev, companyName: value }));
                if (insuranceFormError) setInsuranceFormError('');
              }}
              required
              isDarkMode={isDarkMode}
            />
            <SimpleInput
              label="Policy Number"
              value={insuranceForm.policyNumber}
              onChange={(value) => {
                setInsuranceForm((prev) => ({ ...prev, policyNumber: value }));
                if (insuranceFormError) setInsuranceFormError('');
              }}
              required
              isDarkMode={isDarkMode}
            />
            <SimpleInput
              label="Policy Date"
              type="date"
              value={insuranceForm.policyDate}
              onChange={(value) => {
                setInsuranceForm((prev) => ({ ...prev, policyDate: value }));
                if (insuranceFormError) setInsuranceFormError('');
              }}
              required
              isDarkMode={isDarkMode}
            />
            <SimpleInput
              label="Premium Amount (Optional)"
              value={insuranceForm.premiumAmount}
              onChange={(value) => {
                setInsuranceForm((prev) => ({ ...prev, premiumAmount: sanitizeDecimal(value) }));
              }}
              placeholder="Enter amount if applicable"
              isDarkMode={isDarkMode}
            />
            <div className="space-y-2">
              <label
                className={cn(
                  'text-sm font-normal block',
                  isDarkMode ? 'text-slate-200' : 'text-slate-700'
                )}
              >
                Upload Document<span className="text-red-500 ml-1">*</span>
              </label>
              <div
                className={cn(
                  'flex flex-wrap items-center gap-3 rounded-md border p-3',
                  isDarkMode
                    ? 'border-slate-700 bg-slate-800/50'
                    : 'border-slate-300 bg-slate-50'
                )}
              >
                <input
                  id="insurance-document-upload"
                  type="file"
                  accept="application/pdf,image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setInsuranceForm((prev) => ({
                      ...prev,
                      document: file,
                      documentName: file ? file.name : ''
                    }));
                    if (insuranceFormError) setInsuranceFormError('');
                  }}
                />
                <label
                  htmlFor="insurance-document-upload"
                  className={cn(
                    'cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors',
                    isDarkMode
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  )}
                >
                  Select File
                </label>
                <div className="min-w-0 flex-1 text-sm">
                  <p className={cn('truncate', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>
                    {insuranceForm.documentName || 'No file selected'}
                  </p>
                  <p className={cn('text-xs', isDarkMode ? 'text-slate-500' : 'text-slate-500')}>
                    Accepted formats: PDF, JPG, PNG
                  </p>
                </div>
                {insuranceForm.document && (
                  <button
                    type="button"
                    onClick={() => {
                      setInsuranceForm((prev) => ({
                        ...prev,
                        document: null,
                        documentName: ''
                      }));
                    }}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isDarkMode
                        ? 'bg-red-500/90 text-white hover:bg-red-600'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    )}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            {insuranceFormError && (
              <p className={cn('text-sm', isDarkMode ? 'text-red-400' : 'text-red-600')}>
                {insuranceFormError}
              </p>
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={handleInsuranceFormCancel}
              className={cn(
                isDarkMode
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              )}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInsuranceFormSave}
              disabled={!canSaveInsuranceForm}
              className={cn(
                'text-white',
                canSaveInsuranceForm
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-blue-300 cursor-not-allowed'
              )}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Phone Modal */}
      <Dialog open={phoneModalOpen.type !== null} onOpenChange={() => {}}>
        <DialogContent 
          className={cn(
            "max-w-2xl [&>button]:hidden",
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          )}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className={cn(
              isDarkMode ? "text-slate-100" : "text-slate-900"
            )}>
              {phoneModalOpen.type === 'origin' ? 'Origin' : 'Destination'} - Phone Number
            </DialogTitle>
            <DialogDescription className={cn(
              isDarkMode ? "text-slate-400" : "text-slate-600"
            )}>
              Enter Phone No. to proceed with Your Consignment details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <label className={cn(
                  "text-base font-semibold block mb-1",
                  isDarkMode ? "text-slate-200" : "text-slate-800"
                )}>
                </label>
                <p className={cn(
                  "text-xs mt-1",
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                )}>
                  Enter Your 10-digit Mobile No.
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2 px-4 py-4">
                {/* Country Code */}
                <div className={cn(
                  "flex items-center justify-center h-12 w-14 rounded-lg border-2 transition-all duration-200 flex-shrink-0",
                  isDarkMode
                    ? "border-slate-700 bg-slate-800/60 text-slate-300"
                    : "border-slate-200 bg-slate-50 text-slate-700 shadow-sm"
                )}>
                  <span className="text-sm font-bold">+91</span>
                </div>
                
                {/* Divider */}
                <div className={cn(
                  "h-8 w-px flex-shrink-0",
                  isDarkMode ? "bg-slate-700" : "bg-slate-200"
                )} />
                
                {/* Phone Number Inputs */}
                <div className="flex items-center gap-1.5 flex-nowrap">
                  {(phoneModalOpen.type === 'origin' ? originMobileDigits : destinationMobileDigits).map((digit, index) => (
                    <input
                      key={index}
                      id={`${phoneModalOpen.type}-modal-digit-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        if (phoneModalOpen.type === 'origin') {
                          handleOriginDigitChange(index, e.target.value);
                        } else {
                          handleDestinationDigitChange(index, e.target.value);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (phoneModalOpen.type === 'origin') {
                          handleOriginDigitKeyDown(index, e);
                        } else {
                          handleDestinationDigitKeyDown(index, e);
                        }
                      }}
                      onPaste={(e) => {
                        if (phoneModalOpen.type === 'origin') {
                          handleOriginDigitPaste(e);
                        } else {
                          handleDestinationDigitPaste(e);
                        }
                      }}
                      onFocus={(e) => e.target.select()}
                      className={cn(
                        "h-12 w-10 rounded-lg border-2 text-center text-lg font-bold transition-all duration-200 flex-shrink-0",
                        "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                        isDarkMode
                          ? digit
                            ? "border-blue-500 bg-blue-500/20 text-blue-200"
                            : "border-slate-600 bg-slate-800/80 text-slate-300 focus:ring-blue-500/30"
                          : digit
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-300 bg-white text-slate-700"
                      )}
                    />
                  ))}
                </div>
              </div>
              
              {/* Helper Text */}
              <div className={cn(
                "text-center px-4 py-3 rounded-lg",
                isDarkMode ? "bg-slate-800/40" : "bg-slate-50"
              )}>
                <p className={cn(
                  "text-xs font-medium",
                  isDarkMode ? "text-slate-300" : "text-slate-600"
                )}>
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Form Modal */}
      <Dialog open={formModalOpen.type !== null} onOpenChange={() => {}}>
        <DialogContent 
          className={cn(
            "max-w-3xl max-h-[90vh] overflow-y-auto p-0 [&>button]:hidden",
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          )}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          {!showPreviewInModal ? (
            <>
          {/* Simple Header */}
          <div className={cn(
            "px-6 pt-6 pb-4 border-b",
            isDarkMode ? "border-slate-800" : "border-slate-200"
          )}>
            <DialogTitle className={cn(
              "text-xl font-bold",
              isDarkMode ? "text-slate-100" : "text-slate-900"
            )}>
              {formModalOpen.type === 'origin' ? "Sender's (Consigner)" : "Recipent's ( Consignee )" } Address : 
            </DialogTitle>
          </div>

          <div className="px-5 py-5 space-y-3">
            {formModalOpen.type && (() => {
              const isOrigin = formModalOpen.type === 'origin';
              const data = isOrigin ? originData : destinationData;
              const areas = isOrigin ? originAreas : destinationAreas;
              const pincodeValue = isOrigin ? originPincode : destinationPincode;
              
              return (
                <>
                  <div className="grid gap-3 md:grid-cols-2">
                    <FloatingInput
                      label="Concern Person"
                      value={data.name}
                      onChange={(value) =>
                        isOrigin
                          ? setOriginData((prev) => ({ ...prev, name: value }))
                          : setDestinationData((prev) => ({ ...prev, name: value }))
                      }
                      required
                      isDarkMode={isDarkMode}
                    />
                    <FloatingInput
                      label="Mobile Number"
                      value={`+91 ${isOrigin ? originMobileDigits.join('') : destinationMobileDigits.join('')}`}
                      onChange={() => {}}
                      disabled
                      placeholder="We'll call this number to coordinate delivery."
                      isDarkMode={isDarkMode}
                    />
                    <FloatingInput
                      label="Email Address"
                      value={data.email}
                      onChange={(value) =>
                        isOrigin
                          ? setOriginData((prev) => ({ ...prev, email: value }))
                          : setDestinationData((prev) => ({ ...prev, email: value }))
                      }
                      type="email"
                      className="md:col-span-2"
                      isDarkMode={isDarkMode}
                    />
                    <FloatingInput
                      label="Company Name"
                      value={data.companyName}
                      onChange={(value) =>
                        isOrigin
                          ? setOriginData((prev) => ({ ...prev, companyName: value }))
                          : setDestinationData((prev) => ({ ...prev, companyName: value }))
                      }
                      isDarkMode={isDarkMode}
                    />
                    <FloatingInput
                      label="GST Number"
                      value={data.gstNumber}
                      onChange={(value) =>
                        isOrigin
                          ? setOriginData((prev) => ({ ...prev, gstNumber: value }))
                          : setDestinationData((prev) => ({ ...prev, gstNumber: value }))
                      }
                      isDarkMode={isDarkMode}
                    />
                    <FloatingInput
                      label="Flat, Housing no., Building, Apartment"
                      value={data.flatBuilding}
                      onChange={(value) =>
                        isOrigin
                          ? setOriginData((prev) => ({ ...prev, flatBuilding: value }))
                          : setDestinationData((prev) => ({ ...prev, flatBuilding: value }))
                      }
                      required
                      isDarkMode={isDarkMode}
                    />
                    <FloatingInput
                      label="Area, street, sector"
                      value={data.locality}
                      onChange={(value) =>
                        isOrigin
                          ? setOriginData((prev) => ({ ...prev, locality: value }))
                          : setDestinationData((prev) => ({ ...prev, locality: value }))
                      }
                      required
                      isDarkMode={isDarkMode}
                    />
                    <FloatingInput
                      label="Landmark"
                      value={data.landmark}
                      onChange={(value) =>
                        isOrigin
                          ? setOriginData((prev) => ({ ...prev, landmark: value }))
                          : setDestinationData((prev) => ({ ...prev, landmark: value }))
                      }
                      className="md:col-span-2"
                      isDarkMode={isDarkMode}
                    />
                    {pincodeValue.length === 6 && areas.length > 0 ? (
                      <FloatingSelect
                        label="Area"
                        value={data.area}
                        onChange={(value) =>
                          isOrigin
                            ? setOriginData((prev) => ({ ...prev, area: value }))
                            : setDestinationData((prev) => ({ ...prev, area: value }))
                        }
                        options={areas}
                        required
                        isDarkMode={isDarkMode}
                      />
                    ) : (
                      <FloatingInput
                        label="Area"
                        value={data.area}
                        onChange={(value) =>
                          isOrigin
                            ? setOriginData((prev) => ({ ...prev, area: value }))
                            : setDestinationData((prev) => ({ ...prev, area: value }))
                        }
                        required
                        disabled
                        isDarkMode={isDarkMode}
                      />
                    )}
                    <FloatingInput
                      label="Pincode"
                      value={data.pincode}
                      onChange={(_value) => {}}
                      disabled
                      isDarkMode={isDarkMode}
                    />
                    <FloatingInput
                      label="City"
                      value={data.city}
                      onChange={(_value) => {}}
                      disabled
                      isDarkMode={isDarkMode}
                    />
                    <FloatingInput
                      label="State"
                      value={data.state}
                      onChange={(_value) => {}}
                      disabled
                      isDarkMode={isDarkMode}
                    />
                    <FloatingInput
                      label="District"
                      value={data.district}
                      onChange={(_value) => {}}
                      disabled
                      isDarkMode={isDarkMode}
                    />
                    <FloatingInput
                      label="Website"
                      value={data.website}
                      onChange={(value) =>
                        isOrigin
                          ? setOriginData((prev) => ({ ...prev, website: value }))
                          : setDestinationData((prev) => ({ ...prev, website: value }))
                      }
                      isDarkMode={isDarkMode}
                    />
                    <FloatingInput
                      label="Birthday"
                      value={data.birthday}
                      onChange={(value) =>
                        isOrigin
                          ? setOriginData((prev) => ({ ...prev, birthday: value }))
                          : setDestinationData((prev) => ({ ...prev, birthday: value }))
                      }
                      type="date"
                      isDarkMode={isDarkMode}
                    />
                    <FloatingInput
                      label="Anniversary"
                      value={data.anniversary}
                      onChange={(value) =>
                        isOrigin
                          ? setOriginData((prev) => ({ ...prev, anniversary: value }))
                          : setDestinationData((prev) => ({ ...prev, anniversary: value }))
                      }
                      type="date"
                      isDarkMode={isDarkMode}
                    />
                  </div>

                  {/* Save As Section */}
                  <div className="pt-1">
                    <div className="flex flex-wrap gap-2">
                      {addressTypeOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            isOrigin
                              ? setOriginData((prev) => ({ ...prev, addressType: option }))
                              : setDestinationData((prev) => ({ ...prev, addressType: option }))
                          }
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            data.addressType === option
                              ? isDarkMode
                                ? "bg-slate-700 text-slate-100 border-2 border-slate-600"
                                : "bg-slate-200 text-slate-800 border-2 border-slate-300"
                              : isDarkMode
                                ? "bg-transparent text-slate-300 border-2 border-slate-700 hover:border-slate-600"
                                : "bg-white text-slate-700 border-2 border-slate-300 hover:border-slate-400"
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Alternate Numbers Section */}
            {formModalOpen.type && (() => {
              const isOrigin = formModalOpen.type === 'origin';
              const data = isOrigin ? originData : destinationData;
              
              return (
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      type="button"
                      onClick={() => addAlternateNumber(formModalOpen.type!)}
                      className={cn(
                        'h-7 rounded-md border-dashed px-3 text-xs font-medium transition-colors',
                        isDarkMode
                          ? 'border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
                          : 'border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400'
                      )}
                    >
                      + Add Alternate Number
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {(data.alternateNumbers || ['']).map((number, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FloatingInput
                          label={`Alternate Number ${index + 1}`}
                          value={number}
                          onChange={(value) => handleAlternateNumberChange(formModalOpen.type!, index, value)}
                          type="tel"
                          className="flex-1"
                          isDarkMode={isDarkMode}
                        />
                        {(data.alternateNumbers || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAlternateNumber(formModalOpen.type!, index)}
                            className={cn(
                              'h-10 w-10 rounded-md flex items-center justify-center flex-shrink-0 transition-colors',
                              isDarkMode
                                ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                            )}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Footer with Full-Width Button */}
          <div className={cn(
            "px-6 py-5 border-t",
            isDarkMode ? "border-slate-800" : "border-slate-200"
          )}>
            <Button
              type="button"
              disabled={formModalOpen.type === 'origin' ? !isOriginFormComplete : !isDestinationFormComplete}
              onClick={() => {
                const currentType = formModalOpen.type;
                const isFormComplete = currentType === 'origin' ? isOriginFormComplete : isDestinationFormComplete;
                
                if (isFormComplete) {
                  // Show preview card in modal
                  setShowPreviewInModal(true);
                }
              }}
              className={cn(
                "w-full h-12 rounded-md font-semibold text-base transition-all",
                formModalOpen.type === 'origin' ? !isOriginFormComplete : !isDestinationFormComplete
                  ? isDarkMode
                    ? "bg-slate-700/50 text-slate-400 cursor-not-allowed opacity-60"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                  : isDarkMode
                    ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                    : "bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
              )}
            >
              {formModalOpen.type === 'origin' ? "Save Sender's (Consigner)" : 'Save Destination Address'}
            </Button>
          </div>
            </>
          ) : (
            // Preview Card View
            <div className="p-6">
              {formModalOpen.type && (() => {
                const isOrigin = formModalOpen.type === 'origin';
                const data = isOrigin ? originData : destinationData;
                const cardTitle = isOrigin ? 'SELECT PICKUP ADDRESS' : 'SELECT DELIVERY ADDRESS';
                
                return (
                  <div className="space-y-4">
                    {/* Preview Card - Compact Design */}
                    <div
                      className={cn(
                        'rounded-xl border overflow-hidden transition-all duration-300',
                        isDarkMode
                          ? 'border-slate-800/60 bg-slate-900/80'
                          : 'border-slate-200 bg-white'
                      )}
                    >
                      {/* Header */}
                      <div
                        className={cn(
                          'px-4 py-2.5 border-b flex items-center justify-between',
                          isDarkMode 
                            ? 'bg-slate-800/60 border-slate-800/60' 
                            : 'bg-slate-50/80 border-slate-200/60'
                        )}
                      >
                        <h3 className={cn(
                          'text-sm font-semibold uppercase tracking-wide',
                          isDarkMode ? 'text-slate-200' : 'text-slate-800'
                        )}>
                          {cardTitle}
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setShowPreviewInModal(false);
                          }}
                          className={cn(
                            'p-1.5 rounded-md transition-colors',
                            isDarkMode
                              ? 'text-slate-300 hover:bg-slate-700 hover:text-slate-100'
                              : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                          )}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Address Content - Compact */}
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          {/* Radio button */}
                          <div className="mt-0.5 flex-shrink-0">
                            <div className={cn(
                              'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                              isDarkMode ? 'border-blue-500/50' : 'border-blue-400'
                            )}>
                              <div className={cn(
                                'w-2 h-2 rounded-full',
                                isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
                              )} />
                            </div>
                          </div>
                          
                          {/* Details */}
                          <div className="flex-1 space-y-2 min-w-0">
                            {/* Name and Type */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className={cn(
                                'text-sm font-semibold',
                                isDarkMode ? 'text-slate-100' : 'text-slate-900'
                              )}>
                                {data.name}
                              </h4>
                              {data.addressType && (
                                <span className={cn(
                                  'px-2 py-0.5 rounded-full text-xs font-medium uppercase',
                                  isDarkMode
                                    ? 'bg-blue-500/20 text-blue-200'
                                    : 'bg-blue-100 text-blue-700'
                                )}>
                                  {data.addressType}
                                </span>
                              )}
                            </div>
                            
                            {/* Company */}
                            {data.companyName && (
                              <p className={cn(
                                'text-xs',
                                isDarkMode ? 'text-slate-400' : 'text-slate-600'
                              )}>
                                <Building className="h-3 w-3 inline mr-1" />
                                {data.companyName}
                              </p>
                            )}
                            
                            {/* Address */}
                            <div className="flex items-start gap-1.5">
                              <MapPin className={cn(
                                'h-3.5 w-3.5 mt-0.5 flex-shrink-0',
                                isDarkMode ? 'text-blue-400' : 'text-blue-600'
                              )} />
                              <p className={cn(
                                'text-xs leading-relaxed',
                                isDarkMode ? 'text-slate-300' : 'text-slate-700'
                              )}>
                                {data.flatBuilding}, {data.locality}, {data.area}, {data.city}, {data.state} - {data.pincode}
                                {data.landmark && ` (${data.landmark})`}
                              </p>
                            </div>
                            
                            {/* Contact */}
                            <div className="flex items-center gap-3 flex-wrap text-xs">
                              <div className="flex items-center gap-1.5">
                                <Phone className={cn(
                                  'h-3 w-3',
                                  isDarkMode ? 'text-green-400' : 'text-green-600'
                                )} />
                                <span className={cn(
                                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                                )}>
                                  +91 {data.mobileNumber}
                                </span>
                              </div>
                              {data.email && (
                                <>
                                  <span className={cn(
                                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                                  )}>
                                    •
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <Mail className={cn(
                                      'h-3 w-3',
                                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                    )} />
                                    <span className={cn(
                                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                                    )}>
                                      {data.email}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            {/* Additional Info - Inline */}
                            {(data.gstNumber || data.website || data.alternateNumbers?.filter(n => n.trim()).length > 0) && (
                              <div className="flex items-center gap-3 flex-wrap text-xs pt-1 border-t">
                                {data.gstNumber && (
                                  <span className={cn(
                                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                  )}>
                                    GST: <span className={cn(isDarkMode ? 'text-slate-300' : 'text-slate-700')}>{data.gstNumber}</span>
                                  </span>
                                )}
                                {data.website && (
                                  <>
                                    {data.gstNumber && <span className={cn(isDarkMode ? 'text-slate-500' : 'text-slate-400')}>•</span>}
                                    <a 
                                      href={data.website.startsWith('http') ? data.website : `https://${data.website}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={cn(
                                        'underline hover:opacity-80',
                                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                      )}
                                    >
                                      {data.website}
                                    </a>
                                  </>
                                )}
                                {data.alternateNumbers && data.alternateNumbers.filter(n => n.trim()).length > 0 && (
                                  <>
                                    {(data.gstNumber || data.website) && <span className={cn(isDarkMode ? 'text-slate-500' : 'text-slate-400')}>•</span>}
                                    <span className={cn(
                                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                    )}>
                                      Alt: {data.alternateNumbers.filter(n => n.trim()).join(', ')}
                                    </span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Compact */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => {
                          const currentType = formModalOpen.type;
                          setFormModalOpen({ type: null });
                          setShowPreviewInModal(false);
                          
                          // If origin form is saved and complete, automatically move to destination
                          if (currentType === 'origin' && isOriginFormComplete) {
                            setCurrentSection('destination');
                            // Auto-open destination phone modal if phone is not complete
                            if (!isDestinationPhoneComplete && currentStep === 1) {
                              setTimeout(() => {
                                setPhoneModalOpen({ type: 'destination' });
                              }, 500);
                            }
                          }
                        }}
                        className={cn(
                          "flex-1 h-9 rounded-md text-sm font-medium",
                          isDarkMode
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        )}
                      >
                        {formModalOpen.type === 'origin' ? 'Continue' : 'Done'}
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookNow;