import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useAppFeedback } from "@/shared/context/feedback-context";

export function FeedbackBanners() {
  const { notice, error, dismissNotice, dismissError } = useAppFeedback();
  return (
    <>
      {error && (
        <div className="error-banner inline" role="alert">
          <span className="banner-content">
            <AlertCircle size={16} strokeWidth={1.75} aria-hidden="true" />
            <span>{error}</span>
          </span>
          <button type="button" aria-label="Dismiss error" onClick={dismissError}>
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>
      )}
      {notice && (
        <div className="success-banner inline" role="status">
          <span className="banner-content">
            <CheckCircle2 size={16} strokeWidth={1.75} aria-hidden="true" />
            <span>{notice}</span>
          </span>
          <button type="button" aria-label="Dismiss notice" onClick={dismissNotice}>
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>
      )}
    </>
  );
}
