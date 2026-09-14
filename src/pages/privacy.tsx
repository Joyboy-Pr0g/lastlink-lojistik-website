import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../i18n";
import "../styles/global.css";
import LegalPage from "@/components/legal/LegalPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LegalPage doc="privacy" />
  </StrictMode>
);
