import { X } from "lucide-react";
import { useAppFeedback } from "@/shared/context/feedback-context";

export function FeedbackBanners() {
  const { notice, error, dismissNotice, dismissError } = useAppFeedback();
  return (
    <>
      {error && (
        <div className="error-banner inline">
          <span>{error}</span>
          <button onClick={dismissError}>
            <X size={15} />
          </button>
        </div>
      )}
      {notice && (
        <div className="success-banner inline">
          <span>{notice}</span>
          <button onClick={dismissNotice}>
            <X size={15} />
          </button>
        </div>
      )}
    </>
  );
}
