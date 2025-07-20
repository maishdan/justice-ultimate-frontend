import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileOptimizerProps {
  children: React.ReactNode;
  className?: string;
  enableTouchOptimization?: boolean;
  enableScrollOptimization?: boolean;
}

export default function MobileOptimizer({
  children,
  className = '',
  enableTouchOptimization = true,
  enableScrollOptimization = true
}: MobileOptimizerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    if (enableTouchOptimization && isMobile) {
      // Add touch-friendly CSS
      document.body.style.touchAction = 'manipulation';
      document.body.style.webkitTouchCallout = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.userSelect = 'none';
    }

    // Remove scroll optimization for instant, native scroll
    // Remove or comment out any code that sets document.body.style.webkitOverflowScrolling

    return () => {
      // Cleanup
      document.body.style.touchAction = '';
      document.body.style.webkitTouchCallout = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.userSelect = '';
      document.body.style.webkitOverflowScrolling = '';
    };
  }, [isMobile, enableTouchOptimization, enableScrollOptimization]);

  const mobileClasses = isMobile ? 'mobile-optimized' : '';
  const tabletClasses = isTablet ? 'tablet-optimized' : '';

  return (
    <div className={`${mobileClasses} ${tabletClasses} ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={isMobile ? 'mobile' : 'desktop'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Mobile Navigation Component
export function MobileNavigation({
  isOpen,
  onClose,
  children,
  className = ''
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Navigation Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-50 shadow-2xl ${className}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Mobile Menu Toggle Component
export function MobileMenuToggle({
  isOpen,
  onToggle,
  className = ''
}: {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${className}`}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <div className="w-6 h-6 relative">
        <span
          className={`absolute inset-0 transform transition-transform duration-200 ${
            isOpen ? 'rotate-45' : 'rotate-0'
          }`}
          style={{
            background: 'currentColor',
            height: '2px',
            top: '50%',
            marginTop: '-1px'
          }}
        />
        <span
          className={`absolute inset-0 transform transition-opacity duration-200 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            background: 'currentColor',
            height: '2px',
            top: '50%',
            marginTop: '-1px'
          }}
        />
        <span
          className={`absolute inset-0 transform transition-transform duration-200 ${
            isOpen ? '-rotate-45' : 'rotate-0'
          }`}
          style={{
            background: 'currentColor',
            height: '2px',
            top: '50%',
            marginTop: '-1px'
          }}
        />
      </div>
    </button>
  );
}

// Mobile Optimized Card Component
export function MobileCard({
  children,
  className = '',
  interactive = true
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  const baseClasses = `
    bg-white dark:bg-gray-800
    rounded-xl
    shadow-lg
    border border-gray-200 dark:border-gray-700
    p-4 sm:p-6
    transition-all duration-200
  `;

  const interactiveClasses = interactive
    ? 'hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
    : '';

  return (
    <div className={`${baseClasses} ${interactiveClasses} ${className}`}>
      {children}
    </div>
  );
}

// Mobile Optimized Button Component
export function MobileButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  [key: string]: any;
}) {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white active:bg-blue-700',
    danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[44px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]'
  };

  const baseClasses = `
    font-semibold rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    active:scale-[0.98]
    touch-manipulation
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
  `;

  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
} 