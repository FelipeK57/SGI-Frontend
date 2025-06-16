import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
// @ts-ignore
import "@fontsource-variable/inter";
import { Parts } from "./pages/part/Parts.tsx";
import { DetailsPart } from "./pages/part/DetailsPart.tsx";
import { Login } from "./pages/auth/Login.tsx";
import { NewPart } from "./pages/part/NewPart.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <HeroUIProvider>
        <ToastProvider placement="top-center" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<App />}>
            <Route index element={<Navigate to="parts" replace />} />
            <Route index path="parts" element={<Parts />} />
            <Route path="parts/new" element={<NewPart />} />
            <Route path="parts/:partId" element={<DetailsPart />} />
            <Route
              path="client-quotes"
              element={
                <h1 className="text-center text-2xl">Client Quotes Page</h1>
              }
            />
          </Route>
          <Route
            path="*"
            element={<h1 className="text-center text-2xl">Page not found</h1>}
          />
        </Routes>
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>
);
