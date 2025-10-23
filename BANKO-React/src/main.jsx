import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/styles.css";  // ✅ Ruta correcta al CSS global

// Renderiza la aplicación principal
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

