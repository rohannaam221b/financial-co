import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Users, ArrowRight, FileText, BarChart3, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface AuthScreenProps {
  onRoleSelection: (role: 'customer' | 'staff') => void;
}

export default function AuthScreen({ onRoleSelection }: AuthScreenProps) {
  const [selectedRole, setSelectedRole] = useState<'customer' | 'staff'>('staff');

  const handleContinue = () => {
    onRoleSelection(selectedRole);
  };

  const features = [
    {
      icon: User,
      title: 'Client Management',
      description: 'Comprehensive client profiles',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: BarChart3,
      title: 'Portfolio Tools',
      description: 'Advanced analytics dashboard',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Shield,
      title: 'Compliance',
      description: 'Regulatory compliance tools',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

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
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Financial Concierge</h1>
            <p className="text-sm text-gray-600 leading-relaxed">Choose your experience to get started</p>
          </div>

          {/* Role Toggle */}
          <div className="mb-8">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setSelectedRole('customer')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all text-sm font-medium ${
                  selectedRole === 'customer'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <User className="w-4 h-4" />
                Customer
              </button>
              <button
                onClick={() => setSelectedRole('staff')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all text-sm font-medium ${
                  selectedRole === 'staff'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Users className="w-4 h-4" />
                Staff
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className={`p-2 ${feature.bgColor} rounded-xl`}>
                    <IconComponent className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 mb-1 leading-tight">{feature.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200"
          >
            Continue as {selectedRole === 'customer' ? 'Customer' : 'Staff'}
            <ArrowRight className="w-4 h-4" />
          </Button>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              Secured by enterprise-grade encryption
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}