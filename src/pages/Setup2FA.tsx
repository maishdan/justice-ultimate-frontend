import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, ArrowRight, SkipForward, Settings, AlertTriangle } from 'lucide-react';

export default function Setup2FA() {
  const [isEnabled, setIsEnabled] = useState(false);
  const navigate = useNavigate();

  const handleEnable2FA = () => {
    // For now, just mark 2FA as enabled and redirect to admin dashboard
    localStorage.setItem('2fa_passed', 'true');
    setIsEnabled(true);
    setTimeout(() => {
      navigate('/secure-admin-dashboard', { replace: true });
    }, 1000);
  };

  const handleSkip2FA = () => {
    // Skip 2FA setup and go to admin dashboard
    localStorage.setItem('2fa_passed', 'true');
    navigate('/secure-admin-dashboard', { replace: true });
  };

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/images/bg-landing.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Enhanced Background Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50 pointer-events-none"></div>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-yellow-300/50 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-green-400/30 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 left-1/2 w-1.5 h-1.5 bg-purple-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-orange-400/20 rounded-full animate-ping"></div>
      </div>

      {/* Main Content Container with Enhanced Glass Morphism */}
      <div className="relative z-10 w-full flex justify-center items-center">
        <motion.div 
          className="glass-panel rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md border border-white/20 backdrop-blur-xl"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header Section with Enhanced Icon */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-500 p-4 rounded-full shadow-2xl border-4 border-yellow-300/30">
                  <Lock className="w-12 h-12 text-white" />
                </div>
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-yellow-400 mb-3 flex items-center justify-center gap-2">
              <Shield className="w-8 h-8" />
              Two-Factor Authentication Setup
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Enhance your account security with 2FA. This is recommended for admin users.
            </p>
          </motion.div>

          {/* Security Benefits Section */}
          <motion.div
            className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Benefits
            </h3>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Protect against unauthorized access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Secure admin privileges</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Comply with security standards</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.button
              onClick={handleEnable2FA}
              disabled={isEnabled}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                isEnabled 
                  ? 'bg-green-500/20 text-green-400 border border-green-400/30 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white transform hover:scale-105 shadow-xl border border-green-400/30'
              }`}
              whileHover={isEnabled ? {} : { scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {isEnabled ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  2FA Enabled!
                </>
              ) : (
                <>
                  <Shield className="w-6 h-6" />
                  Enable 2FA
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
            
            <motion.button
              onClick={handleSkip2FA}
              className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 border border-white/20 backdrop-blur-sm flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <SkipForward className="w-5 h-5" />
              Skip for Now
            </motion.button>
          </motion.div>

          {/* Warning Note */}
          <motion.div
            className="mt-6 p-4 bg-orange-500/10 rounded-xl border border-orange-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-orange-400 font-medium text-sm mb-1">Security Recommendation</p>
                <p className="text-white/80 text-sm leading-relaxed">
                  Two-factor authentication significantly enhances your account security. We strongly recommend enabling it for admin accounts.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.div 
            className="mt-6 pt-4 border-t border-white/10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <p className="text-white/60 text-sm flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              You can always enable 2FA later in your profile settings
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 