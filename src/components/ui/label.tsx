// src/components/ui/label.tsx
import { cn } from "../../lib/utils";

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className, ...props }) => {
  return (
    <label
      className={cn("block text-sm font-medium text-slate-700 dark:text-slate-200", className)}
      {...props}
    />
  );
};
