import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RefreshCw, Check, X, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface OTPScreenProps {
  phoneNumber: string;
  role: 'customer' | 'staff';
  onVerifyOTP: (otp: string) => void;
  onBack: () => void;
}

export default function OTPScreen({ phoneNumber, role, onVerifyOTP, onBack }: OTPScreenProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedValue = value.slice(0, 6);
      const newOtp = [...otp];
      
      for (let i = 0; i < pastedValue.length && i + index < 6; i++) {
        if (/^\d$/.test(pastedValue[i])) {
          newOtp[index + i] = pastedValue[i];
        }
      }
      
      setOtp(newOtp);
      setError('');
      
      // Focus on the next empty input or the last input
      const nextIndex = Math.min(index + pastedValue.length, 5);
      inputRefs.current[nextIndex]?.focus();
      
      // Auto-verify if all 6 digits are filled
      if (newOtp.every(digit => digit !== '')) {
        verifyOTP(newOtp.join(''));
      }
      
      return;
    }

    if (value === '' || /^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError('');

      if (value !== '' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-verify if all 6 digits are filled
      if (newOtp.every(digit => digit !== '')) {
        verifyOTP(newOtp.join(''));
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = (otpValue: string) => {
    setIsVerifying(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      
      // Mock validation - accept "123456" as correct OTP
      if (otpValue === '123456') {
        setSuccess(true);
        setTimeout(() => {
          onVerifyOTP(otpValue);
        }, 1500);
      } else {
        setError('Invalid verification code. Please check and try again.');
        // Shake animation trigger
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }, 2000);
  };

  const handleResendOTP = () => {
    setTimer(30);
    setCanResend(false);
    setError('');
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const formatPhoneNumber = (phone: string) => {
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 10)}${seconds % 10}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-white shadow-lg border-0 rounded-2xl">
          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {success ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
              ) : (
                <FileText className="w-8 h-8 text-white" />
              )}
            </div>
            
            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Verification Successful!</h1>
                <p className="text-sm text-gray-600 leading-relaxed">Welcome to Financial Concierge</p>
              </motion.div>
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Verify Code</h1>
                <p className="text-sm text-gray-600 leading-relaxed mb-2">
                  Enter the 6-digit code sent to
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {formatPhoneNumber(phoneNumber)}
                </p>
              </>
            )}
          </div>

          {!success && (
            <>
              {/* Back Button */}
              <div className="mb-6">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change phone number
                </button>
              </div>

              {/* OTP Input */}
              <motion.div 
                className="mb-8"
                animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <div className="flex gap-3 justify-center mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => inputRefs.current[index] = el}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={e => handleInputChange(index, e.target.value)}
                      onKeyDown={e => handleKeyDown(index, e)}
                      className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 ${
                        error 
                          ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
                          : digit 
                            ? 'border-blue-500 bg-blue-50 focus:border-blue-500 focus:ring-blue-500/20' 
                            : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                      maxLength={6}
                    />
                  ))}
                </div>
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl">
                      <X className="w-4 h-4" />
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Verification Status */}
              {isVerifying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-3 mb-8 text-blue-600 bg-blue-50 py-3 rounded-xl"
                >
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium">Verifying code...</span>
                </motion.div>
              )}

              {/* Resend Timer */}
              <div className="text-center mb-8">
                {canResend ? (
                  <button
                    onClick={handleResendOTP}
                    className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors p-2 rounded-lg hover:bg-blue-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Resend verification code
                  </button>
                ) : (
                  <p className="text-sm text-gray-500">
                    Didn't receive the code? Resend in <span className="font-medium">{formatTime(timer)}s</span>
                  </p>
                )}
              </div>

              {/* Verify Button */}
              <Button
                onClick={() => verifyOTP(otp.join(''))}
                disabled={otp.some(digit => digit === '') || isVerifying}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white h-12 rounded-xl text-sm font-medium transition-all duration-200"
              >
                {isVerifying ? 'Verifying...' : 'Verify & Continue'}
              </Button>

              {/* Help Text */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 leading-relaxed mb-2">
                  For demonstration purposes, use <span className="font-mono bg-gray-100 px-2 py-1 rounded border">123456</span> as the verification code
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Having trouble? Contact our support team for assistance
                </p>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}