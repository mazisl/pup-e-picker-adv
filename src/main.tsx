import React from "react";
import ReactDOM from "react-dom/client";
import { DogsProvider } from "./contexts/dogs.context";

import "./index.css";
import "./App.css";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster />
    <DogsProvider>
      <App />
    </DogsProvider>
  </React.StrictMode>
);
