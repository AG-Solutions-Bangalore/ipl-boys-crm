import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./components/theme-provider";
import { queryClient } from "./lib/query-client";
import { SessionProvider } from "./modules/auth/hooks/use-session";
import "./styles.css";
import "./overrides.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
    >
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
