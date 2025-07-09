/// 💥 ServerError500 Page
// src/pages/errors/ServerError500.tsx
import ErrorLayout from "../../components/error-pages/ErrorLayout";
import { ServerCrash } from "lucide-react";

export default function ServerError500() {
  return (
    <ErrorLayout
      code={500}
      title="Server Error"
      message="Oops! Something went wrong on our end. We're working to fix it."
      icon={<ServerCrash className="mx-auto text-red-500 w-12 h-12 mb-3" />}
    />
  );
}