import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import toast from "react-hot-toast";

type FeedbackContextValue = {
  notify: (message: string) => void;
  showError: (message: string) => void;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const notify = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const value = useMemo(() => ({ notify, showError }), [notify, showError]);

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>;
}

export function useAppFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error("useAppFeedback must be used inside FeedbackProvider");
  return context;
}
