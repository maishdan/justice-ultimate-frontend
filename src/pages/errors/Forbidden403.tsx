/// 🚫 Forbidden403 Page
// src/pages/errors/Forbidden403.tsx
import ErrorLayout from "../../components/error-pages/ErrorLayout";

import { ShieldOff } from "lucide-react";

export default function Forbidden403() {
  return (
    <ErrorLayout
      code={403}
      title="Access Denied"
      message="You don't have permission to view this page."
      icon={<ShieldOff className="mx-auto text-orange-500 w-12 h-12 mb-3" />}
    />
  );
}
