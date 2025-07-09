/// 🔐 Unauthorized401 Page
// src/pages/errors/Unauthorized401.tsx
import ErrorLayout from "../../components/error-pages/ErrorLayout";
import { Lock } from "lucide-react";

export default function Unauthorized401() {
  return (
    <ErrorLayout
      code={401}
      title="Unauthorized"
      message="You need to log in or authenticate to access this resource."
      icon={<Lock className="mx-auto text-blue-500 w-12 h-12 mb-3" />}
    />
  );
}