/// ⚠️ GenericErrorPage Page
// src/pages/errors/GenericErrorPage.tsx
import ErrorLayout from "../../components/error-pages/ErrorLayout";
import { CircleAlert } from "lucide-react";

export default function GenericErrorPage() {
  return (
    <ErrorLayout
      code={520}
      title="Something Went Wrong"
      message="An unexpected error occurred. Please try again later."
      icon={<CircleAlert className="mx-auto text-purple-500 w-12 h-12 mb-3" />}
    />
  );
}