// src/components/error-pages/ErrorLayout.tsx
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";

interface ErrorLayoutProps {
  code: number;
  title: string;
  message: string;
  icon?: React.ReactNode;
}

export default function ErrorLayout({ code, title, message, icon }: ErrorLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="text-center p-10 rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl max-w-md w-full"
      >
        <div className="text-6xl font-bold text-destructive mb-4">{code}</div>
        {icon}
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground mt-2">{message}</p>

        <div className="mt-6 flex flex-col gap-3">
          <Button variant="default" onClick={() => location.href = "/"}>
            Go to Home
          </Button>
          <Button variant="outline" onClick={() => location.href = "/vehicle-catalogue"}>
            Browse Vehicles
          </Button>
          <Button variant="outline" onClick={() => location.href = "/contact"}>
            Contact Support
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
