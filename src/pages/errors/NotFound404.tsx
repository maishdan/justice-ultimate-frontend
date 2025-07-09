/// 🔥 NotFound404 Page
// src/pages/errors/NotFound404.tsx
import ErrorLayout from "../../components/error-pages/ErrorLayout";
import { AlertTriangle } from "lucide-react";

export default function NotFound404() {
  return (
    <ErrorLayout
      code={404}
      title="Page Not Found"
      message="The page you're looking for doesn't exist or was moved."
      icon={<AlertTriangle className="mx-auto text-yellow-500 w-12 h-12 mb-3" />}
    />
  );
}