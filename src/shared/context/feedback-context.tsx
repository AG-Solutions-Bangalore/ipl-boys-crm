import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type FeedbackContextValue = {
  notice: string;
  error: string;
  notify: (message: string) => void;
  showError: (message: string) => void;
  dismissNotice: () => void;
  dismissError: () => void;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const notify = useCallback((message: string) => setNotice(message), []);
  const showError = useCallback((message: string) => setError(message), []);
  const dismissNotice = useCallback(() => setNotice(""), []);
  const dismissError = useCallback(() => setError(""), []);

  const value = useMemo(
    () => ({ notice, error, notify, showError, dismissNotice, dismissError }),
    [notice, error, notify, showError, dismissNotice, dismissError],
  );

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>;
}

export function useAppFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error("useAppFeedback must be used inside FeedbackProvider");
  return context;
}
