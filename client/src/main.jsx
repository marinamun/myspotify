import React from "react";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <a
      href="https://www.linkedin.com/in/marinamun/"
      target="_blank"
      style={{
        color: "#9cad8a",
        fontFamily: "'Coming Soon', cursive",
        textDecoration: "none",
      }}
    >
      Made by Marina M.✨
    </a>
  </StrictMode>
);
