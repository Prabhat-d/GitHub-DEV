import React from 'react';
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./authContext.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
