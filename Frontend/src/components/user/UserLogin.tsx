import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
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
      "relative overflow-hidden w-full max-w-md mx-auto rounded-3xl border p-8 shadow-xl transition",
      isDarkMode
        ? "border-slate-700/50 bg-slate-900/95 backdrop-blur-sm"
        : "border-slate-200/40 bg-white"
    )}>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h2 className={cn(
            "text-2xl font-bold leading-tight",
            isDarkMode ? "text-white" : "text-slate-900"
          )}>
            {step === 'phone' && 'Welcome Back!'}
            {step === 'otp' && 'Enter OTP'}
            {step === 'details' && 'Complete Your Profile'}
          </h2>
          <p className={cn(
            "text-sm leading-relaxed",
            isDarkMode ? "text-slate-400" : "text-slate-600"
          )}>
            {step === 'phone' && 'We missed you! Please enter your details.'}
            {step === 'otp' && `OTP sent to ${phoneNumber}`}
            {step === 'details' && 'Please provide your details to continue'}
          </p>
        </div>

        {/* Phone Number Step */}
        {step === 'phone' && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className={cn(
                "text-sm font-medium block",
                isDarkMode ? "text-slate-300" : "text-slate-700"
              )}>
                Enter Email / Phone No
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
                      "w-full h-12 text-center text-lg font-semibold border rounded-lg transition-all duration-200",
                      "focus:outline-none focus:ring-1 focus:ring-offset-0",
                      isDarkMode
                        ? "bg-slate-800/50 border-slate-600/50 text-white focus:border-blue-500 focus:ring-blue-500/30"
                        : "bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-blue-500/30",
                      digit && isDarkMode && "border-blue-500/50 bg-blue-500/10",
                      digit && !isDarkMode && "border-blue-500/50 bg-blue-50/50"
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Button
                onClick={sendOTP}
                disabled={phoneDigits.join('').length !== 10 || isLoading}
                className={cn(
                  "w-full h-12 text-base font-semibold rounded-lg transition-all duration-200",
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
                  'Sign in'
                )}
              </Button>
              {onCancel && (
                <Button
                  variant="ghost"
                  onClick={onCancel}
                  className={cn(
                    "w-full h-11 text-sm font-medium transition",
                    isDarkMode
                      ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
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
            <div className="space-y-2">
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
                      "w-full h-12 text-center text-lg font-semibold border rounded-lg transition-all duration-200",
                      "focus:outline-none focus:ring-1 focus:ring-offset-0",
                      isDarkMode
                        ? "bg-slate-800/50 border-slate-600/50 text-white focus:border-blue-500 focus:ring-blue-500/30"
                        : "bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-blue-500/30",
                      digit && isDarkMode && "border-blue-500/50 bg-blue-500/10",
                      digit && !isDarkMode && "border-blue-500/50 bg-blue-50/50",
                      otpError && "border-red-500 ring-1 ring-red-500/30"
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
            <div className="space-y-4">
              <Button
                onClick={() => verifyOTP()}
                disabled={otpDigits.join('').length !== 6 || isLoading}
                className={cn(
                  "w-full h-12 text-base font-semibold rounded-lg transition-all duration-200",
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
                variant="ghost"
                onClick={handleResendOTP}
                disabled={isLoading}
                className={cn(
                  "w-full h-11 text-sm font-medium transition",
                  isDarkMode
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
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
                  "w-full h-11 text-sm font-medium transition",
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
                  "text-sm font-medium block",
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                )}>
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className={cn(
                    "w-full h-12 px-4 border rounded-lg transition-all duration-200",
                    "focus:outline-none focus:ring-1 focus:ring-offset-0",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/30"
                      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/30"
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium block",
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                )}>
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={cn(
                    "w-full h-12 px-4 border rounded-lg transition-all duration-200",
                    "focus:outline-none focus:ring-1 focus:ring-offset-0",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/30"
                      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/30"
                  )}
                />
              </div>
            </div>
            <Button
              onClick={registerUser}
              disabled={!name.trim() || isLoading}
              className={cn(
                "w-full h-12 text-base font-semibold rounded-lg transition-all duration-200",
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
                'Continue'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLogin;

