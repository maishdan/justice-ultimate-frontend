// File: src/components/ui/dialog.tsx

import * as React from "react";
import {
  Dialog as RadixDialog,
  DialogContent as RadixDialogContent,
  DialogTitle as RadixDialogTitle,
  DialogTrigger as RadixDialogTrigger,
  DialogPortal as RadixDialogPortal,
  DialogOverlay as RadixDialogOverlay,
} from "@radix-ui/react-dialog";
import { cn } from "../../lib/utils";

interface DialogProps {
  children: React.ReactNode;
  className?: string;
}

interface ControlledDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ✅ Dialog wrapper (controlled)
export const Dialog = ({ children, open, onOpenChange }: ControlledDialogProps) => (
  <RadixDialog open={open} onOpenChange={onOpenChange}>
    {children}
  </RadixDialog>
);

// ✅ Styled Content
export const DialogContent = ({ children, className }: DialogProps) => (
  <RadixDialogContent className={cn("p-6 bg-white rounded-lg shadow-lg", className)}>
    {children}
  </RadixDialogContent>
);

// ✅ Styled Header wrapper
export const DialogHeader = ({ children, className }: DialogProps) => (
  <div className={cn("space-y-1", className)}>{children}</div>
);

// ✅ Styled Title wrapper
export const DialogTitle = ({ children, className }: DialogProps) => (
  <RadixDialogTitle className={cn("text-lg font-semibold", className)}>
    {children}
  </RadixDialogTitle>
);

// ✅ Expose Radix primitives (wrapped for reusability)
export const DialogTrigger = ({ children, className }: DialogProps) => (
  <RadixDialogTrigger className={className}>{children}</RadixDialogTrigger>
);

export const DialogPortal = ({ children }: { children: React.ReactNode }) => (
  <RadixDialogPortal>{children}</RadixDialogPortal>
);

export const DialogOverlay = ({ className }: { className?: string }) => (
  <RadixDialogOverlay className={cn("fixed inset-0 bg-black/50", className)} />
);
