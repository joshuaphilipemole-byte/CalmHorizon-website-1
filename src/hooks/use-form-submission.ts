import { useState } from "react";
import type { SubmissionPayload } from "@/routes/api/submissions";

interface SubmissionResponse {
  success: boolean;
  id?: string;
  error?: string;
  issues?: any[];
}

export function useFormSubmission() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async (data: SubmissionPayload): Promise<SubmissionResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage =
          result.error || `Failed to submit form (${response.status})`;
        setError(errorMessage);
        return { success: false, error: errorMessage, issues: result.issues };
      }

      return { success: true, id: result.id };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { submitForm, isLoading, error };
}
