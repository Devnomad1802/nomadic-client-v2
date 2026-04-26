import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import theme from "./Theme.js";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { store } from "./utils";
let persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </PersistGate>
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>
);
