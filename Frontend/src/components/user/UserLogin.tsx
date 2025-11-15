import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Phone, Loader2, ArrowRight, User, Mail, Lock } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';

const API_BASE: string = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';

interface UserLoginProps {
  isDarkMode: boolean;
  onLoginSuccess: () => void;
  onCancel?: () => void;
}

const UserLogin: React.FC<UserLoginProps> = ({ isDarkMode, onLoginSuccess, onCancel }) => {
  const { login, updateCustomer } = useUserAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<'phone' | 'otp' | 'details'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneDigits, setPhoneDigits] = useState<string[]>(Array(10).fill(''));
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Refs for inputs
  const phoneInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input when step changes
  useEffect(() => {
    if (step === 'phone') {
      setTimeout(() => {
        phoneInputRefs.current[0]?.focus();
      }, 100);
    } else if (step === 'otp') {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Handle phone number input
  const handlePhoneInput = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    if (!digit && value !== '') return;

    const newDigits = [...phoneDigits];
    newDigits[index] = digit;
    setPhoneDigits(newDigits);

    // Auto-focus next input if digit entered
    if (digit && index < 9) {
      setTimeout(() => {
        phoneInputRefs.current[index + 1]?.focus();
      }, 0);
    }
  };

  const handlePhoneKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!phoneDigits[index] && index > 0) {
        // Move to previous input and clear it
        const newDigits = [...phoneDigits];
        newDigits[index - 1] = '';
        setPhoneDigits(newDigits);
        setTimeout(() => {
          phoneInputRefs.current[index - 1]?.focus();
        }, 0);
      } else if (phoneDigits[index]) {
        // Clear current input
        const newDigits = [...phoneDigits];
        newDigits[index] = '';
        setPhoneDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      phoneInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 9) {
      phoneInputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Delete') {
      const newDigits = [...phoneDigits];
      newDigits[index] = '';
      setPhoneDigits(newDigits);
    }
  };

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 10);
    if (pastedData.length === 0) return;

    const newDigits = Array(10).fill('');
    for (let i = 0; i < pastedData.length && i < 10; i++) {
      newDigits[i] = pastedData[i];
    }
    setPhoneDigits(newDigits);
    
    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, 9);
    setTimeout(() => {
      phoneInputRefs.current[nextIndex]?.focus();
    }, 0);
  };

  // Handle OTP input
  const handleOtpInput = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    if (!digit && value !== '') return;

    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setOtpError(null);

    // Auto-focus next input if digit entered
    if (digit && index < 5) {
      setTimeout(() => {
        otpInputRefs.current[index + 1]?.focus();
      }, 0);
    } else if (digit && index === 5) {
      // Last digit entered, auto-verify
      const fullOtp = [...newDigits.slice(0, index), digit].join('');
      if (fullOtp.length === 6) {
        setTimeout(() => verifyOTP(fullOtp), 100);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        // Move to previous input and clear it
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        setTimeout(() => {
          otpInputRefs.current[index - 1]?.focus();
        }, 0);
      } else if (otpDigits[index]) {
        // Clear current input
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Delete') {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 0) return;

    const newDigits = Array(6).fill('');
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newDigits[i] = pastedData[i];
    }
    setOtpDigits(newDigits);
    setOtpError(null);
    
    // Auto-verify if 6 digits pasted
    if (pastedData.length === 6) {
      setTimeout(() => verifyOTP(pastedData), 100);
    } else {
      // Focus the next empty input or last input
      const nextIndex = Math.min(pastedData.length, 5);
      setTimeout(() => {
        otpInputRefs.current[nextIndex]?.focus();
      }, 0);
    }
  };

  const sendOTP = async () => {
    const phone = phoneDigits.join('');
    if (phone.length !== 10) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid 10-digit phone number',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/online-customer/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone })
      });

      const data = await response.json();
      if (data.success) {
        setPhoneNumber(phone);
        setStep('otp');
        toast({
          title: 'OTP Sent',
          description: 'Please check your phone for the OTP'
        });
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to send OTP',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: 'Error',
        description: 'Failed to send OTP. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otpValue?: string) => {
    const otpToVerify = otpValue || otpDigits.join('');
    if (otpToVerify.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setOtpError(null);

    try {
      const response = await fetch(`${API_BASE}/api/online-customer/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          otp: otpToVerify
        })
      });

      const data = await response.json();
      if (data.success) {
        if (data.isNewUser) {
          setIsNewUser(true);
          setStep('details');
        } else {
          // Existing user - login directly
          login(data.customer);
          toast({
            title: 'Login Successful',
            description: `Welcome back, ${data.customer.name || 'User'}!`
          });
          onLoginSuccess();
        }
      } else {
        setOtpError(data.error || 'Invalid OTP. Please try again.');
        setOtpDigits(Array(6).fill(''));
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError('Error verifying OTP. Please try again.');
      setOtpDigits(Array(6).fill(''));
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async () => {
    if (!name.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter your name',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/online-customer/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          name: name.trim(),
          email: email.trim() || ''
        })
      });

      const data = await response.json();
      if (data.success) {
        login(data.customer);
        toast({
          title: 'Registration Successful',
          description: `Welcome, ${data.customer.name}!`
        });
        onLoginSuccess();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to register. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error registering user:', error);
      toast({
        title: 'Error',
        description: 'Failed to register. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    setOtpDigits(Array(6).fill(''));
    setOtpError(null);
    sendOTP();
  };

  return (
    <div className={cn(
      "relative overflow-hidden w-full max-w-md mx-auto rounded-2xl border p-6 shadow-[0_25px_80px_rgba(15,23,42,0.15)] transition sm:rounded-3xl sm:p-8",
      isDarkMode
        ? "border-slate-800/60 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90"
        : "border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-blue-50/20"
    )}>
      {/* Background gradient effects */}
      <div
        className={cn(
          "pointer-events-none absolute -right-24 top-10 h-48 w-48 rounded-full blur-3xl",
          isDarkMode
            ? "bg-blue-500/20"
            : "bg-blue-400/20"
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute -bottom-20 left-0 h-48 w-48 rounded-full blur-3xl",
          isDarkMode
            ? "bg-purple-500/10"
            : "bg-purple-400/15"
        )}
      />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className={cn(
            "inline-flex h-14 w-14 items-center justify-center rounded-full transition",
            isDarkMode
              ? "bg-blue-500/20 text-blue-400 shadow-[0_8px_30px_rgba(59,130,246,0.2)]"
              : "bg-blue-100 text-blue-600 shadow-[0_8px_30px_rgba(59,130,246,0.15)]"
          )}>
            <Lock size={28} />
          </div>
          <div className="space-y-1">
            <h2 className={cn(
              "text-2xl font-semibold leading-tight",
              isDarkMode ? "text-white" : "text-slate-900"
            )}>
              {step === 'phone' && 'Login with Phone'}
              {step === 'otp' && 'Enter OTP'}
              {step === 'details' && 'Complete Your Profile'}
            </h2>
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-slate-400" : "text-slate-600"
            )}>
              {step === 'phone' && 'We\'ll send you a verification code'}
              {step === 'otp' && `OTP sent to ${phoneNumber}`}
              {step === 'details' && 'Please provide your details to continue'}
            </p>
          </div>
        </div>

        {/* Phone Number Step */}
        {step === 'phone' && (
          <div className="space-y-5">
            <div className="space-y-3">
              <label className={cn(
                "text-sm font-medium block",
                isDarkMode ? "text-slate-300" : "text-slate-700"
              )}>
                Phone Number
              </label>
              <div className="flex gap-2">
                {phoneDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      phoneInputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePhoneInput(index, e.target.value)}
                    onKeyDown={(e) => handlePhoneKeyDown(index, e)}
                    onPaste={index === 0 ? handlePhonePaste : undefined}
                    autoComplete="off"
                    className={cn(
                      "w-full h-14 text-center text-xl font-semibold border rounded-xl transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-offset-0",
                      isDarkMode
                        ? "bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/30 shadow-lg"
                        : "bg-white/90 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 shadow-md hover:shadow-lg",
                      digit && isDarkMode && "border-blue-500/40 bg-blue-500/10",
                      digit && !isDarkMode && "border-blue-400/40 bg-blue-50"
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Button
                onClick={sendOTP}
                disabled={phoneDigits.join('').length !== 10 || isLoading}
                className={cn(
                  "w-full rounded-full h-11 text-sm font-semibold transition-all duration-200",
                  "shadow-lg hover:shadow-xl",
                  isDarkMode
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className={cn(
                    "w-full rounded-full h-11 text-sm font-medium transition",
                    isDarkMode
                      ? "border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800/70"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div className="space-y-5">
            <div className="space-y-3">
              <label className={cn(
                "text-sm font-medium block",
                isDarkMode ? "text-slate-300" : "text-slate-700"
              )}>
                Enter OTP
              </label>
              <div className="flex gap-2">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpInputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    autoComplete="off"
                    className={cn(
                      "w-full h-14 text-center text-xl font-semibold border rounded-xl transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-offset-0",
                      isDarkMode
                        ? "bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/30 shadow-lg"
                        : "bg-white/90 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 shadow-md hover:shadow-lg",
                      digit && isDarkMode && "border-blue-500/40 bg-blue-500/10",
                      digit && !isDarkMode && "border-blue-400/40 bg-blue-50",
                      otpError && "border-red-500 ring-2 ring-red-500/20"
                    )}
                  />
                ))}
              </div>
              {otpError && (
                <p className={cn(
                  "text-sm font-medium px-2",
                  isDarkMode ? "text-red-400" : "text-red-600"
                )}>
                  {otpError}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => verifyOTP()}
                disabled={otpDigits.join('').length !== 6 || isLoading}
                className={cn(
                  "w-full rounded-full h-11 text-sm font-semibold transition-all duration-200",
                  "shadow-lg hover:shadow-xl",
                  isDarkMode
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleResendOTP}
                disabled={isLoading}
                className={cn(
                  "w-full rounded-full h-11 text-sm font-medium transition",
                  isDarkMode
                    ? "border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800/70"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                Resend OTP
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setStep('phone');
                  setOtpDigits(Array(6).fill(''));
                  setOtpError(null);
                }}
                className={cn(
                  "w-full rounded-full h-11 text-sm font-medium transition",
                  isDarkMode
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                )}
              >
                Change Phone Number
              </Button>
            </div>
          </div>
        )}

        {/* Details Step */}
        {step === 'details' && (
          <div className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                )}>
                  <User size={16} />
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className={cn(
                    "w-full h-12 px-4 border rounded-xl transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-offset-0",
                    isDarkMode
                      ? "bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/30 shadow-md"
                      : "bg-white/90 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm hover:shadow-md"
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                )}>
                  <Mail size={16} />
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={cn(
                    "w-full h-12 px-4 border rounded-xl transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-offset-0",
                    isDarkMode
                      ? "bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/30 shadow-md"
                      : "bg-white/90 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm hover:shadow-md"
                  )}
                />
              </div>
            </div>
            <Button
              onClick={registerUser}
              disabled={!name.trim() || isLoading}
              className={cn(
                "w-full rounded-full h-11 text-sm font-semibold transition-all duration-200",
                "shadow-lg hover:shadow-xl",
                isDarkMode
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLogin;

