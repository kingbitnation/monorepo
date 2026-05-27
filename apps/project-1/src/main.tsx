import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import { AppRouter } from "./routes/AppRouter";
import "./styles/app.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppContextProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AppContextProvider>
  </React.StrictMode>
);
