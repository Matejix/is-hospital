import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import Router from "@/router";

import "./index.pcss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Router />
  </StrictMode>
);
