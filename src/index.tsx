import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import AppProvider from "./context/AppProvider";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = (ReactDOM as any).createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AppProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProvider>
    </React.StrictMode>
  );

  reportWebVitals(undefined);
}
