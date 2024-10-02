import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ProductProvider>
        <App />
      </ProductProvider>
    </UserProvider>
  </StrictMode>
);
