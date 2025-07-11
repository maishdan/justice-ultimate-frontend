// src/components/ui/button.tsx
import React from "react";

// Utility to combine class names (replace with your own if needed)
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Type for main Button
export type ButtonProps = {
  variant?: "default" | "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button({
  children,
  className = "",
  onClick,
  size = "md",
  variant = "default",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const sizeClass = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  }[size];

  const variantClass = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-green-500 text-white hover:bg-green-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-100",
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn("rounded font-semibold transition duration-300 focus:outline-none", sizeClass, variantClass, className)}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function IconButton({
  icon: Icon,
  onClick,
  className = "",
  size = "md",
}: {
  icon: React.ComponentType<{ size?: number }>;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  }[size];

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white ${sizeClass} ${className}`}
    >
      <Icon size={size === "sm" ? 16 : size === "md" ? 20 : 24} />
    </button>
  );
}

export function LoadingButton({
  loading,
  children,
  className = "",
  onClick,
  size = "md",
}: {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Button
      onClick={onClick}
      className={`${className} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      size={size}
      disabled={loading}
    >
      {loading ? "Loading..." : children}
    </Button>
  );
}

export function SubmitButton({
  children,
  className = "",
  onClick,
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Button
      type="submit"
      onClick={onClick}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
      size={size}
      variant="secondary"
    >
      {children}
    </Button>
  );
}

export function CancelButton({
  children,
  className = "",
  onClick,
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Button
      onClick={onClick}
      className={`bg-gray-300 hover:bg-gray-400 text-black ${className}`}
      size={size}
      variant="outline"
    >
      {children}
    </Button>
  );
}

export function DangerButton({
  children,
  className = "",
  onClick,
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Button
      onClick={onClick}
      className={`bg-red-600 hover:bg-red-700 text-white ${className}`}
      size={size}
      variant="danger"
    >
      {children}
    </Button>
  );
}

export function PrimaryButton({
  children,
  className = "",
  onClick,
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Button
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white ${className}`}
      size={size}
      variant="primary"
    >
      {children}
    </Button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  onClick,
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Button
      onClick={onClick}
      className={`bg-gray-500 hover:bg-gray-600 text-white ${className}`}
      size={size}
      variant="secondary"
    >
      {children}
    </Button>
  );
}
