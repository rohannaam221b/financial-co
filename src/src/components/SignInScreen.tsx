import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Phone, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface SignInScreenProps {
  role: 'customer' | 'staff';
  onSendOTP: (phoneNumber: string) => void;
  onBack: () => void;
}

export default function SignInScreen({ role, onSendOTP, onBack }: SignInScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
    setIsValidPhone(validatePhoneNumber(value));
  };

  const handleSendOTP = () => {
    if (!isValidPhone) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSendOTP(phoneNumber);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValidPhone) {
      handleSendOTP();
    }
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign In</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Continue as {role === 'customer' ? 'Customer' : 'Staff'}
            </p>
          </div>

          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to role selection
            </button>
          </div>

          {/* Mobile Number Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 text-sm font-medium">+91</span>
                <div className="w-px h-4 bg-gray-300"></div>
              </div>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter your mobile number"
                className={`pl-20 h-12 text-base border-2 rounded-xl transition-all duration-200 ${
                  isValidPhone 
                    ? 'border-green-500 bg-green-50/30 focus:border-green-500 focus:ring-green-500/20' 
                    : phoneNumber.length > 0 
                      ? 'border-red-500 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
            </div>
            {phoneNumber.length > 0 && !isValidPhone && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                Please enter a valid 10-digit mobile number
              </p>
            )}
          </div>

          {/* Send Verification Code Button */}
          <Button
            onClick={handleSendOTP}
            disabled={!isValidPhone || isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white h-12 rounded-xl text-sm font-medium transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending Code...
              </div>
            ) : (
              'Send Verification Code'
            )}
          </Button>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              We'll send a verification code to your mobile number to confirm your identity
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}