import React from 'react';
import { motion } from 'framer-motion';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
  animation?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function ResponsiveWrapper({
  children,
  className = '',
  animation = true,
  maxWidth = 'full',
  padding = 'md'
}: ResponsiveWrapperProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-2 sm:p-4',
    md: 'p-4 sm:p-6 lg:p-8',
    lg: 'p-6 sm:p-8 lg:p-12',
    xl: 'p-8 sm:p-12 lg:p-16'
  };

  const baseClasses = `
    w-full mx-auto
    ${maxWidthClasses[maxWidth]}
    ${paddingClasses[padding]}
    ${className}
  `;

  if (animation) {
    return (
      <motion.div
        className={baseClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
}

// Responsive Grid Component
export function ResponsiveGrid({
  children,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md',
  className = ''
}: {
  children: React.ReactNode;
  cols?: { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const gapClasses = {
    sm: 'gap-2 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
    xl: 'gap-8 sm:gap-12'
  };

  const gridCols = `
    grid
    grid-cols-${cols.sm || 1}
    sm:grid-cols-${cols.md || cols.sm || 1}
    md:grid-cols-${cols.lg || cols.md || cols.sm || 1}
    lg:grid-cols-${cols.xl || cols.lg || cols.md || cols.sm || 1}
  `;

  return (
    <div className={`${gridCols} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

// Responsive Text Component
export function ResponsiveText({
  children,
  size = 'base',
  weight = 'normal',
  className = ''
}: {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  className?: string;
}) {
  const sizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl',
    '4xl': 'text-4xl sm:text-5xl'
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  };

  return (
    <div className={`${sizeClasses[size]} ${weightClasses[weight]} ${className}`}>
      {children}
    </div>
  );
}

// Responsive Container Component
export function ResponsiveContainer({
  children,
  fluid = false,
  className = ''
}: {
  children: React.ReactNode;
  fluid?: boolean;
  className?: string;
}) {
  const containerClasses = fluid
    ? 'w-full px-4 sm:px-6 lg:px-8'
    : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

  return (
    <div className={`${containerClasses} ${className}`}>
      {children}
    </div>
  );
}

// Responsive Card Component
export function ResponsiveCard({
  children,
  hover = true,
  className = ''
}: {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
}) {
  const baseClasses = `
    bg-white dark:bg-gray-800
    rounded-lg sm:rounded-xl
    shadow-sm sm:shadow-md
    border border-gray-200 dark:border-gray-700
    p-4 sm:p-6
    transition-all duration-200
  `;

  const hoverClasses = hover
    ? 'hover:shadow-lg hover:scale-[1.02] hover:border-gray-300 dark:hover:border-gray-600'
    : '';

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}

// Responsive Button Component
export function ResponsiveButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  className?: string;
  [key: string]: any;
}) {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const baseClasses = `
    font-semibold rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
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