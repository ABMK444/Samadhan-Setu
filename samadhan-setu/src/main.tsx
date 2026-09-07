import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { startSupabaseSync } from "./services/supabaseSync";

import App from "./App";
import "./styles.css";

// Run backups in the background without delaying the website.
const stopSupabaseSync = startSupabaseSync();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    stopSupabaseSync();
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);