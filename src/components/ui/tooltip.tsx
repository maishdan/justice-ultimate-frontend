// src/components/ui/tooltip.tsx

import React, { ReactNode } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils"; // Optional: for merging Tailwind classes

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
  className?: string;
}

export const Tooltip = ({
  children,
  content,
  side = "top",
  delayDuration = 200,
  className = "",
}: TooltipProps) => {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            className={cn(
              "z-50 max-w-sm rounded-xl border border-gray-700 bg-black px-4 py-2 text-sm text-white shadow-xl transition-all animate-in fade-in-90",
              "dark:bg-gray-900 dark:text-white",
              className
            )}
            sideOffset={6}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-current text-black dark:text-gray-900" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};
