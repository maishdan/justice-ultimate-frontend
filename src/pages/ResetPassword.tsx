import { useState } from "react";
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, CheckCircle, Shield } from 'lucide-react';

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/login",
      });
      if (error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setSuccess(true);
        toast.success("Password reset email sent! Please check your inbox.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
      toast.error(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
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
      </div>

      {/* Main Content Container with Enhanced Glass Morphism */}
      <div className="relative z-10 w-full flex justify-center items-center">
        <motion.div 
          className="glass-panel rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md border border-white/20 backdrop-blur-xl"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <ToastContainer />
          
          {/* Header Section */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-yellow-400 mb-2 flex items-center justify-center gap-2">
              <Lock className="w-8 h-8" /> Reset Your Password
            </h2>
            <p className="text-white/80 text-sm">Enter your email to receive a password reset link</p>
          </motion.div>

          {success ? (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Success Icon with Enhanced Animation */}
              <motion.div 
                className="flex justify-center mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-green-400 to-green-500 p-4 rounded-full shadow-2xl border-4 border-green-300/30">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Success Title with Typography Enhancement */}
              <motion.h3 
                className="text-2xl font-bold text-green-400 mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Email Sent Successfully! ✨
              </motion.h3>

              {/* Enhanced Description */}
              <motion.div
                className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <p className="text-white/90 mb-3 leading-relaxed">
                  We've sent a secure password reset link to:
                </p>
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3 mb-3">
                  <span className="font-mono font-bold text-yellow-400 text-lg">{email}</span>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  Please check your inbox and follow the instructions to reset your password. The link will expire in 24 hours for security.
                </p>
              </motion.div>

              {/* Security Note */}
              <motion.div
                className="flex items-center justify-center gap-2 mb-6 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">Secure & Encrypted Email Sent</span>
              </motion.div>

              {/* Enhanced Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 font-bold text-lg shadow-xl border border-yellow-300/30 flex items-center justify-center gap-2"
                  onClick={() => navigate("/login")}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Go to Login
                </motion.button>
                <motion.button
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg border border-white/20 backdrop-blur-sm flex items-center justify-center gap-2"
                  onClick={() => window.location.reload()}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="w-5 h-5" />
                  Send Again
                </motion.button>
              </motion.div>

              {/* Additional Help */}
              <motion.div
                className="mt-6 pt-4 border-t border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <p className="text-white/60 text-sm">
                  Didn't receive the email? Check your spam folder or contact support.
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.form 
              onSubmit={handleReset} 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <label className="block text-white/90 font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                  placeholder="you@email.com"
                />
              </motion.div>

              {error && (
                <motion.div 
                  className="text-red-400 text-sm p-3 bg-red-500/10 rounded-xl border border-red-500/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}

              {/* Security Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex items-center justify-center space-x-2 p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                  <Shield className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white/80">Your security is our priority</span>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg flex justify-center items-center ${
                  loading 
                    ? 'bg-white/20 text-white/60 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 transform hover:scale-105'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "Sending..." : "Send Reset Email"}
              </motion.button>

              {/* Back to Login Link */}
              <motion.div 
                className="text-center text-sm mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <span className="text-white/80">Remembered your password?{' '}</span>
                <span
                  className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 cursor-pointer flex items-center justify-center gap-1 mt-2"
                  onClick={() => navigate("/login")}
                >
                  <ArrowLeft className="w-4 h-4" /> Login
                </span>
              </motion.div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </div>
  );
} 