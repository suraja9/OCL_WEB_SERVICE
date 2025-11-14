import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import oclLogo from "@/assets/ocl-logo.png";
import unnamedImage from "@/assets/unnamed.jpg";

const CorporateLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if corporate is already logged in
  useEffect(() => {
    const token = localStorage.getItem('corporateToken');
    const corporateInfo = localStorage.getItem('corporateInfo');
    
    if (token && corporateInfo) {
      try {
        const corporate = JSON.parse(corporateInfo);
        // Check if it's first login
        if (corporate.isFirstLogin) {
          navigate('/corporate/change-password');
        } else {
          navigate('/corporate/dashboard');
        }
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('corporateToken');
        localStorage.removeItem('corporateInfo');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/corporate/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store authentication data
        localStorage.setItem('corporateToken', data.token);
        localStorage.setItem('corporateInfo', JSON.stringify(data.corporate));
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.corporate.companyName}!`,
        });
        
        // Check if it's first login
        if (data.corporate.isFirstLogin) {
          navigate('/corporate/change-password');
        } else {
          navigate('/corporate/dashboard');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'white' }}>
      <div 
        className="bg-white rounded-[40px] overflow-hidden shadow-2xl"
        style={{ 
          width: '90%',
          borderRadius: '40px',
          display: 'grid',
          gridTemplateColumns: '40% 60%',
          minHeight: '90vh',
          background: 'linear-gradient(to bottom, rgb(249, 250, 251), rgb(254, 243, 199))',
          padding: '30px',
          maxHeight: '90vh',
        }}
      >
        {/* Left Panel - Form */}
        <div 
          className="px-10 py-10 flex flex-col justify-center"
          style={{
            background: 'linear-gradient(to bottom, #F9FAFB, #FEF3C7)',
            padding: '100px',
          }}
        >
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <div 
              className="inline-flex items-center justify-center p-4 rounded-full bg-white shadow-md w-fit"
            >
              <img src={oclLogo} alt="OCL Logo" className="h-20 w-20 object-contain rounded-full" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontWeight: 700 }}>
            Corporate Login
          </h1>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="space-y-5 mb-6">
              {/* Email / Username field */}
              <div className="relative">
                <label
                  htmlFor="email"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    emailFocused || username
                      ? '-top-2 text-xs text-gray-600 bg-white px-1'
                      : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
                  }`}
                >
                  Email ID
                </label>
                <input
                  id="email"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="w-full px-4 pt-6 pb-2 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  style={{ borderRadius: '50px' }}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password field */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    passwordFocused || password
                      ? '-top-2 text-xs text-gray-600 bg-white px-1'
                      : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
                  }`}
                >
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="w-full px-4 pt-6 pb-2 pr-12 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  style={{ borderRadius: '50px' }}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {/* Forgot Password Link */}
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => {
                    // TODO: Implement forgot password functionality
                    toast({
                      title: "Forgot Password",
                      description: "Please contact your administrator to reset your password.",
                    });
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400 focus:ring-2"
                disabled={isLoading}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-semibold text-white mb-6 transition-all hover:shadow-lg disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #FCD34D, #FBBF24)',
                borderRadius: '12px'
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </span>
              ) : (
                'Submit'
              )}
            </button>

            {/* Footer Links */}
            <div className="mt-auto pt-4 text-sm text-gray-600">
              <div className="flex flex-wrap gap-4 justify-center text-xs">
                <span 
                  className="underline cursor-pointer hover:text-gray-900"
                  onClick={() => {
                    // TODO: Navigate to Terms & Conditions page
                    toast({
                      title: "Terms & Conditions",
                      description: "Redirecting to Terms & Conditions...",
                    });
                  }}
                >
                  Terms & Conditions
                </span>
                <span className="text-gray-400">|</span>
                <span 
                  className="underline cursor-pointer hover:text-gray-900"
                  onClick={() => {
                    // TODO: Navigate to Privacy Policy page
                    toast({
                      title: "Privacy Policy",
                      description: "Redirecting to Privacy Policy...",
                    });
                  }}
                >
                  Privacy Policy
                </span>
                <span className="text-gray-400">|</span>
                <span 
                  className="underline cursor-pointer hover:text-gray-900"
                  onClick={() => {
                    // TODO: Navigate to Help Center page
                    toast({
                      title: "Help Center",
                      description: "Redirecting to Help Center...",
                    });
                  }}
                >
                  Help Center
                </span>
              </div>
            </div>
          </form>
        </div>

        {/* Right Panel - Image with Overlays */}
        <div 
          className="relative overflow-hidden"
          style={{
            borderRadius: '40px',
            background: 'linear-gradient(to bottom, #F9FAFB, #FEF3C7)'
          }}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${unnamedImage})`,
              borderRadius: '40px'
            }}
          />
          
          {/* Overlay for better contrast */}
          <div 
            className="absolute inset-0 bg-black/10"
            style={{ borderRadius: '40px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default CorporateLogin;
